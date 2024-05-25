const bcrypt = require("bcrypt");
const express = require("express");

const authUtils = require("../../utils/_auth");
const {
	credsCollection,
	publicCollection,
	socialCollection,
} = require("../../utils/_db");

require("dotenv").config();

// constants
const USE_HTTPS = Boolean(Number(process.env.USE_HTTPS));
const app = express.Router();

app.post("/register", async (req, res) => {
	const userData = req.body;
	if (!(userData["userid"] && userData["password"]))
		return res.status(400).send("Bad Request: Missing user ID or password");

	const userid = userData.userid;
	const plainPass = userData.password;

	if (await credsCollection.findOne({ userid: userid }))
		return res.status(409).send("Conflict: User ID already exists");

	bcrypt.hash(plainPass, 10, async (error, hashedPass) => {
		if (error) return res.sendStatus(500);

		try {
			await credsCollection.create({
				userid: userid,
				password: hashedPass,
				date: new Date(),
			});

			await publicCollection.create({
				userid: userid,
				displayname: null,
				bio: null,
				profileicon: null,
			});

			await socialCollection.create({
				userid: userid,
				friends: [],
			});
		} catch (error) {
			console.error("Error occured while inserting data in db: ", error);
			return res
				.status(500)
				.send(
					"Internal Server Error: Unable to hash and store password"
				);
		}
		return res.status(200).send("Success: User registered successfully");
	});
});

app.post("/login", async (req, res) => {
	const reqData = req.body;
	if (!(reqData["userid"] && reqData["password"]))
		return res.status(400).send("Bad Request: Missing user ID or password");

	const userData = await credsCollection.findOne({
		userid: reqData["userid"],
	});
	if (!userData)
		return res
			.status(401)
			.send("Unauthorized: Invalid user ID or password");

	bcrypt.compare(
		reqData.password,
		userData.password,
		async (error, result) => {
			if (error)
				return res
					.status(500)
					.send("Internal Server Error: Unable to compare password");
			if (!result) {
				return res
					.status(401)
					.send("Unauthorized: Invalid user ID or password");
			}

			let token;
			try {
				token = await authUtils._generate_rt({
					userid: reqData.userid,
				});
			} catch (error) {
				return res
					.status(500)
					.send(
						"Internal Server Error: Unable to create refresh token"
					);
			}

			res.cookie("refreshToken", token, {
				httpOnly: true,
				secure: USE_HTTPS, // true when in production
				sameSite: "lax",
				path: authUtils.REFRESH_TOKEN.path,
				maxAge: authUtils.REFRESH_TOKEN.expiresIn.ms,
			});

			return res.status(200).send("Success: User logged in successfully");
		}
	);
});

module.exports = { app };
