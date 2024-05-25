const socketIO = require("socket.io");
const { parse } = require("cookie");

const auth = require("../api/auth");
const logger = require("../logger");
const { _fetch_friends } = require("../api/fetch");

class UserOffline extends Error {
	constructor(userid) {
		super(
			"The user: ",
			userid,
			" does not have websocket connection established."
		);
		this.name = this.constructor.name;
	}
}

class WebSocket {
	constructor(httpServer) {
		logger.info("initializing websocket.");

		this.socketInfo = {};
		this.connectedClients = {};
		this.httpServer = httpServer;
		const io = socketIO(httpServer);

		// middle wares
		io.use(this.authenticate);

		// events
		io.on("connection", this.on_connection);

		this.io = io;
		logger.info("websocket established.");
	}

	authenticate = async (socket, next) => {
		const headers = socket.request.headers;
		const cookies = parse(headers.cookie || "");

		let token;
		if (Object.keys(cookies).length) {
			token = cookies?.token;
		} else {
			token = headers?.token;
			if (!token) token = socket.handshake.auth.token;
		}

		if (!token)
			return socket.emit("authentication_error", {
				type: "MissingAccessToken",
				message: "Forbidden: missing access token",
			});

		const verifiedData = await auth._verify(token);
		if (!verifiedData.authorized)
			return socket.emit("authentication_error", {
				type: "InvalidAccessToken",
				message: "Unauthorized: Invalid or Expired token",
			});

		this.socketInfo[socket.id] = { userid: verifiedData.user.userid };
		logger.info(
			`authenticated an ws connection: \n\tsocket id: ${socket.id}`
		);
		next();
	};

	_broadcast_to_friends = async (eventName, userid, data) => {
		const friends = await _fetch_friends(userid);

		friends.forEach((friendId) => {
			const clients = this.connectedClients?.[friendId];
			const friendData = { id: userid, data: data };

			if (clients) {
				clients.forEach((socketId) => {
					const client = this.io.to(socketId);
					client.emit(eventName, friendData);
				});
			}
			logger.info(
				`emitted ${eventName} on\n\tuserid: ${friendId}\n\tclients: ${clients}`
			);
		});
	};

	emit_status_update = async (userid, data) => {
		await this._broadcast_to_friends("update-friendstatus", userid, data);
	};

	emit_message_update = async (from, to, messageData) => {
		const toClients = this.connectedClients?.[to];
		const fromClients = this.connectedClients?.[from];

		if (!toClients || toClients?.length === 0) throw new UserOffline(to);
		if (!fromClients || fromClients?.length === 0)
			throw new UserOffline(to);

		fromClients.forEach((socketId) => {
			const client = this.io.to(socketId);

			client.emit("update-message", {
				to: to,
				received: false,
				...messageData,
			});
		});

		toClients.forEach((socketId) => {
			const client = this.io.to(socketId);

			client.emit("update-message", {
				from: from,
				received: true,
				...messageData,
			});
		});
	};

	emit_public_update = async (userid, data = null) => {
		const clients = this.connectedClients?.[userid];

		if (clients) {
			clients.forEach((socketId) => {
				const client = this.io.to(socketId);
				client.emit("update-userdata", data);
			});
		}
		logger.info(
			`emitted update-userdata on\n\tuserid: ${userid}\n\tclients: ${clients}`
		);

		await this._broadcast_to_friends("update-friendsdata", userid, data);
	};

	emit_social_update = async (userid, data = null) => {
		if (data === null) return;

		const clients = this.connectedClients?.[userid];
		const updateRL = Boolean(Object.keys(data).includes("requests"));
		const updateFL = Boolean(Object.keys(data).includes("friends"));

		if (clients) {
			clients.forEach((socketId) => {
				const client = this.io.to(socketId);

				if (data !== null) {
					if (updateRL)
						client.emit("update-requestlist", data.requests);
					if (updateFL)
						client.emit("update-friendlist", data.friends);
				}
			});
		}

		logger.info(
			`emitted update-requestlist: ${updateRL} and update-friendlist: ${updateFL} on\n\tuserid: ${userid}\n\tclients: ${clients}`
		);
	};

	on_connection = async (socket) => {
		const userid = this.socketInfo[socket.id].userid;
		await this.emit_status_update(userid, { isOnline: true });

		if (userid in this.connectedClients)
			this.connectedClients[userid].push(socket.id);
		else this.connectedClients[userid] = [socket.id];

		logger.info(`new ws connection: \n\tsocket id: ${socket.id}`);
		socket.on("disconnect", () => this.on_disconnect(socket));
	};

	on_disconnect = async (socket) => {
		const userid = this.socketInfo[socket.id].userid;

		if (userid in this.connectedClients) {
			this.connectedClients[userid] = this.connectedClients[
				userid
			].filter((socketId) => socketId !== socket.id);
			delete this.socketInfo[socket.id];

			if (this.connectedClients[userid].length === 0)
				await this.emit_status_update(userid, { isOnline: false });
		}

		logger.info(
			`a ws connection disconnected: \n\tsocket id: ${socket.id}`
		);
	};
}

module.exports = WebSocket;
