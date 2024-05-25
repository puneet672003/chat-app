const jwt = require("jsonwebtoken");

require("dotenv").config();

// constants
const ACCESS_TOKEN = {
	expiresIn: {
		string: "1h",
		ms: 60 * 60 * 1000,
	},
};
const REFRESH_TOKEN = {
	path: `/api/auth/`,
	expiresIn: {
		string: "30d",
		ms: 30 * 24 * 60 * 60 * 1000,
	},
};

// environment variables
const SECRET_KEY = process.env.SECRET_KEY;

const _verify = async (token) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, SECRET_KEY, (error, user) => {
			if (error) reject(error);
			else resolve(user);
		});
	});
};

const _generate_token = async (payload, options) => {
	return new Promise((resolve, reject) => {
		jwt.sign(payload, SECRET_KEY, options, (error, token) => {
			if (error) reject(error);
			else resolve(token);
		});
	});
};

const _generate_rt = async (payload) => {
	return _generate_token(payload, {
		expiresIn: REFRESH_TOKEN.expiresIn.string,
	});
};

const _generate_at = async (refreshToken) => {
	let payload;
	try {
		payload = await _verify(refreshToken);
	} catch (error) {
		throw error;
	}

	return _generate_token(
		{ userid: payload?.userid, googleid: payload?.googleid },
		{
			expiresIn: ACCESS_TOKEN.expiresIn.string,
		}
	);
};

module.exports = {
	REFRESH_TOKEN,
	ACCESS_TOKEN,
	_verify,
	_generate_token,
	_generate_rt,
	_generate_at,
};
