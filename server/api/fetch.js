const express = require("express");

const { publicCollection, socialCollection } = require("../utils/_db");
const { authenticate } = require("./auth");

const app = express.Router();

const _fetch_friends = async (userid) => {
	const userData = await socialCollection.findOne({ userid: userid });
	return userData.friends;
};

const _fetch_profile = async (userid) => {
	const userData = await publicCollection.findOne({ userid: userid });
	return userData;
};

const _fetch_requests = async (userid) => {
	const userData = await socialCollection.findOne({ userid: userid });
	return userData.requests;
};

app.get("/friends", authenticate, async (req, res) => {
	const { userid } = req.user;

	const friendsData = await _fetch_friends(userid);
	const friendList = [];

	friendsData.forEach((friend) => {
		const connectedClients = req.ws.connectedClients;
		const data = { userid: friend };

		data.isOnline = false;
		if (
			connectedClients?.[friend] !== undefined &&
			connectedClients[friend].length
		)
			data.isOnline = true;

		friendList.push(data);
	});

	if (!friendsData)
		return res
			.status(500)
			.send("Internal Server Error: Cannot retrieve user data.");

	res.contentType = "application/json";
	res.status(200).send({ data: friendList });
});

app.get("/requests", authenticate, async (req, res) => {
	const { userid } = req.user;
	const requestList = await _fetch_requests(userid);

	if (!requestList)
		return res
			.status(500)
			.send("Internal Server Error: Cannot retrieve user data.");

	res.contentType = "application/json";
	res.status(200).send({ data: requestList });
});

app.post("/profile", async (req, res) => {
	const userid = req.body?.userid;
	if (!userid) return res.status(400).send("Bad Request: Missing user ID");

	const userData = await _fetch_profile(userid);
	if (!userData) return res.status(404).send("Not Found: User not found");

	res.contentType = "application/json";
	res.status(200).send({ data: userData });
});

app.get("/profile/me", authenticate, async (req, res) => {
	const { userid } = req.user;
	const userData = await _fetch_profile(userid);

	return res.status(200).send({ data: userData });
});

module.exports = { app, _fetch_friends, _fetch_profile, _fetch_requests };
