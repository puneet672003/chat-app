const express = require("express");

const { socialCollection } = require("../../utils/_db");
const { _fetch_requests } = require("../fetch");
const { authenticate } = require("../auth");

const app = express.Router();
app.use(authenticate);

const _send_request = async (from, to) => {
	const userData = await socialCollection.findOne({ userid: to });
	userData.requests.push(from);
	const updatedData = await userData.save();

	return updatedData;
};

const _accept_request = async (from, to) => {
	const toData = await socialCollection.findOne({ userid: to });
	const fromData = await socialCollection.findOne({ userid: from });

	toData.requests = toData.requests.filter((id) => id !== from);
	toData.friends.push(from);
	fromData.friends.push(to);

	const updatedToData = await toData.save();
	const updatedFromData = await fromData.save();
	return { to: updatedToData, from: updatedFromData };
};

const _reject_request = async (from, to) => {
	const userData = await socialCollection.findOne({ userid: to });
	userData.requests = userData.requests.filter((id) => id !== from);
	const updatedData = await userData.save();

	return updatedData;
};

app.post("/", async (req, res) => {
	const { userid } = req.user;
	const { action, from } = req.body;

	if (!(action && from))
		return res.status(400).send("Bad Request: Missing arguments");

	const requests = await _fetch_requests(userid);

	if (!requests.includes(from))
		return res
			.status(400)
			.send(
				"Bad Request: Cannot find any friend request from userid: ",
				from
			);

	if (action === "accept") {
		try {
			const updatedData = await _accept_request(from, userid);
			await req.ws.emit_social_update(from, {
				friends: updatedData.from.friends,
			});
			await req.ws.emit_social_update(userid, {
				requests: updatedData.to.requests,
				friends: updatedData.to.friends,
			});

			return res.status(200).send("Success: Accepted friend request.");
		} catch (error) {
			return res
				.status(500)
				.send("Internal Server Error: Cannot accept request!");
		}
	} else if (action === "reject") {
		try {
			const updatedData = await _reject_request(from, userid);
			await req.ws.emit_social_update(userid, {
				requests: updatedData.requests,
			});

			return res.status(200).send("Success: Rejected friend request.");
		} catch (error) {
			return res
				.status(500)
				.send("Internal Server Error: Cannot reject request!");
		}
	} else {
		return res.status(400).send("Bad Request: Invalid action.");
	}
});

module.exports = {
	app,
	_send_request,
	_accept_request,
	_reject_request,
};
