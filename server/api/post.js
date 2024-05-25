const express = require("express");
const { v4: uuid } = require("uuid");

const { authenticate } = require("./auth");
const { _fetch_friends, _fetch_requests } = require("./fetch");
const { _send_request, _accept_request } = require("./update/request");

const app = express.Router();
app.use(authenticate);

app.post("/message", async (req, res) => {
	const messageId = uuid();
	const { message, to } = req.body;
	const from = req.user.userid;

	const friends = await _fetch_friends(from);
	if (!friends.includes(to)) {
		return res
			.status(404)
			.send(
				"Unauthorized: User you are trying to send message to is not in your friend list"
			);
	}

	const messageData = { message: message, messageid: messageId };
	try {
		await req.ws.emit_message_update(from, to, messageData);
	} catch (err) {
		if (err.name == "UserOffline") {
			return res.status(200).json({
				success: false,
				message: "FriendIsOffline",
			});
		} else throw err;
	}

	return res.status(200).json({
		success: true,
		message: "Sent",
	});
});

app.post("/request", async (req, res) => {
	const { userid } = req.user;
	const { to } = req.body;

	const user_friends = await _fetch_friends(userid);
	const user_requests = await _fetch_requests(userid);
	const to_requests = await _fetch_requests(to);

	if (to_requests.includes(userid))
		return res.status(403).send("Forbidden: Request already pending.");

	if (user_friends.includes(to))
		return res
			.status(400)
			.send(
				"Bad Request: User you are trying to send friend request is already in your friend list"
			);

	if (user_requests.includes(to)) {
		// accept request
		const updatedData = await _accept_request(userid, to);
		await req.ws.emit_social_update(userid, {
			friends: updatedData.from.friends,
		});
		await req.ws.emit_social_update(to, {
			requests: updatedData.to.requests,
			friends: updatedData.to.friends,
		});

		return res.status(200).send("Success");
	}

	const updatedData = await _send_request(userid, to);
	await req.ws.emit_social_update(to, {
		requests: updatedData.requests,
	});

	return res.status(200).send("Success: Sent friend request.");
});

module.exports = { app };
