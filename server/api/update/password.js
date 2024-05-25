const express = require("express");
const bcrypt = require("bcrypt");

const { credsCollection } = require("../../utils/_db");
const { authenticate } = require("../auth");

require("dotenv").config();

const app = express.Router();
app.use(authenticate);

app.post("/", async (req, res) => {
	const { userid } = req.user;
	const reqData = req.body;

	const userData = await credsCollection.findOne({
		userid: userid,
	});

	if (!(reqData["current"] && reqData["new"] && reqData["confirm"])) {
		return res.status(400).send("Bad Request: Missing crucial arguments!");
	}

	if (!userData)
		return res
			.status(404)
			.send("Not found: No user found with userid: ", userid);

	const {
		current: currentPass,
		new: newPass,
		confirm: confirmPass,
	} = reqData;

	if (newPass !== confirmPass)
		return res
			.status(400)
			.send("Bad Request: Confirmed password mismtach.");

	bcrypt.compare(currentPass, userData.password, async (error, result) => {
		if (error)
			return res
				.status(500)
				.send("Internal Server Error: Unable to compare password");
		if (!result) {
			return res
				.status(401)
				.send("Unauthorized: Invalid user ID or password");
		}

		// updating password
		bcrypt.hash(newPass, 10, async (error, hashedPass) => {
			if (error)
				return res
					.status(500)
					.send(
						"Internal Server Error: Unable to hash and store password."
					);

			try {
				userData.password = hashedPass;
				const updatedData = await userData.save();
			} catch (error) {
				console.error(
					"Error occured while updating data in db: ",
					error
				);
				return res
					.status(500)
					.send(
						"Internal Server Error: Unable to hash and store password."
					);
			}

			return res
				.status(200)
				.send("Success: Password updated successfully");
		});
	});
});

module.exports = { app };
