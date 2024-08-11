const express = require("express");
const { google } = require("googleapis");

const authUtils = require("../../utils/_auth");
const {
	credsCollection,
	publicCollection,
	socialCollection,
} = require("../../utils/_db");

require("dotenv").config();

const USE_HTTPS = Boolean(Number(process.env.USE_HTTPS));
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CALLBACK_URL = new URL(process.env.GOOGLE_CALLBACK_URL);
const CALLBACK_ENDPOINT = "/" + CALLBACK_URL.pathname.split("/").slice(-1)[0];

const app = express.Router();

const oauth2Client = new google.auth.OAuth2(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	CALLBACK_URL.href
);

const people = google.people({ version: "v1", auth: oauth2Client });
const scopes = ["openid", "profile", "email"];
const url = oauth2Client.generateAuthUrl({
	access_type: "offline",
	scope: scopes,
	// redirect_uri: CALLBACK_URL.href,
});

app.post("/register", async (req, res) => {
	const userid = req.body?.userid;
	if (!userid)
		return res.status(400).send("Bad Request: No userid specified");

	const googleid = req.session?.googleid;
	if (!googleid)
		return res.status(400).send("Bad Request: No google id specified");

	if (await credsCollection.findOne({ userid: userid }))
		return res.status(409).send("Conflict: User ID already exists");

	try {
		await credsCollection.create({
			userid: userid,
			password: null,
			date: new Date(),
			googleid: googleid,
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
			.send("Internal Server Error: Unable to register user in db");
	}

	return res.status(200).send("Success: User registered successfully");
});

app.get("/login", (req, res) => {
	res.status(200).json({ url });
});

app.get(CALLBACK_ENDPOINT, async (req, res) => {
	const code = req.query?.code;
	if (!code) return res.status(400).send("Bad request: Code not provided");

	let tokens;
	try {
		const tokenResponse = await oauth2Client.getToken({
			code: code,
			redirect_uri: "https://vibexchat.vercel.app/google/register",
		});

		tokens = tokenResponse.tokens;
		oauth2Client.setCredentials(tokens);
	} catch (error) {
		console.error(error);
		return res.status(400).send("Bad request: Invalid callback code");
	}

	let googleid;
	try {
		const profile = await people.people.get({
			resourceName: "people/me",
			personFields: ["names", "emailAddresses", "photos"].join(","),
		});

		googleid = profile.data.resourceName.split("/")[1];
	} catch (error) {
		console.error("Error fetching user profile:", err);
		return res
			.status(500)
			.send("Internal Server Error: Error fetching user profile");
	}

	const userExists = await credsCollection.findOne({ googleid: googleid });
	if (userExists) {
		// req.session.userid = userExists.userid;
		let token;
		try {
			token = await authUtils._generate_rt({
				userid: userExists.userid,
				googleid: googleid,
			});
		} catch (error) {
			return res
				.status(500)
				.send("Internal Server Error: Unable to create refresh token");
		}

		res.cookie("refreshToken", token, {
			httpOnly: true,
			secure: USE_HTTPS, // true when in production
			sameSite: "none",
			path: authUtils.REFRESH_TOKEN.path,
			maxAge: authUtils.REFRESH_TOKEN.expiresIn.ms,
		});

		res.redirect("https://vibexchat.vercel.app/");
	} else {
		req.googleTokens = tokens;
		req.session.googleid = googleid;

		res.redirect("https://vibexchat.vercel.app/google/register");
	}
});

module.exports = { app };
