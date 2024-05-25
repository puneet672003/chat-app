const express = require("express");

const { publicCollection } = require("../../utils/_db");
const { authenticate } = require("../auth");

const app = express.Router();
app.use(authenticate);

app.post("/displayname", async (req, res) => {
	const { userid } = req.user;
	const data = req.body;

	if (!data["displayname"])
		return res.status(400).send("Bad Request: Missing displayname!");

	let updatedData;
	try {
		const newDn = data.displayname;
		const userData = await publicCollection.findOne({ userid: userid });

		if (!userData)
			return res
				.status(400)
				.send(
					`Bad Request: Cannot find any user with userid: ${userid}`
				);

		userData.displayname = newDn;
		updatedData = await userData.save();
	} catch (error) {
		return res
			.status(500)
			.send("Internal Server Error: Cannot update data.");
	}

	await req.ws.emit_public_update(userid, updatedData);
	return res.status(200).send("Success: successfully changed display name.");
});

module.exports = { app };
