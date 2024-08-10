const express = require("express");

const authUtils = require("../../utils/_auth");
const manualRoute = require("./manual");
const googleRoute = require("./google");

const app = express.Router();

app.use("/manual", manualRoute.app);
app.use("/google", googleRoute.app);

const USE_HTTPS = Boolean(Number(process.env.USE_HTTPS));

const _verify = async (token) => {
	try {
		const data = await authUtils._verify(token);
		return { authorized: true, user: data };
	} catch (error) {
		return { authorized: false };
	}
};

const authenticate = async (req, res, next) => {
	const accessToken = req?.cookies?.token;
	if (!accessToken)
		return res.status(403).send("Forbidden: missing access token");

	const verifiedData = await _verify(accessToken);
	if (!verifiedData.authorized)
		return res.status(401).send("Unauthorized: Invalid or Expired token");

	req.user = verifiedData.user;
	next();
};

app.get("/refresh", async (req, res) => {
	const refreshToken = req?.cookies?.refreshToken;
	if (!refreshToken) {
		return res
			.status(401)
			.send("Unauthorized: Refresh token expired / not available");
	}

	let token;
	try {
		token = await authUtils._generate_at(refreshToken);
	} catch (error) {
		if (error)
			return res
				.status(403)
				.send("Forbidden: Invalid / Expired refresh token");
	}

	res.cookie("token", token, {
		httpOnly: true,
		secure: USE_HTTPS,
		sameSite: "none",
		maxAge: authUtils.ACCESS_TOKEN.expiresIn.ms,
	});

	return res.status(200).send("Success: Token refreshed successfully");
});

app.delete("/logout", authenticate, (req, res) => {
	res.clearCookie("token");
	res.clearCookie("refreshToken", { path: authUtils.REFRESH_TOKEN.path });

	req.session.destroy((err) => {
		if (err && err.code !== "ENDENT")
			console.error("Error destroying session: ", error);
	});

	return res.status(200).send("Success: User logged out successfully");
});

module.exports = { app, authenticate, _verify };
