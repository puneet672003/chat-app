const mongoose = require("mongoose");
const logger = require("../logger");

require("dotenv").config();

// constants
const DB_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;

const credsSchema = new mongoose.Schema({
	userid: String,
	password: String,
	date: Date,
	googleid: String,
});

const publicSchema = new mongoose.Schema({
	userid: String,
	displayname: String,
	bio: String,
	profileicon: String,
});

const socialSchema = new mongoose.Schema({
	userid: String,
	friends: { type: Array, default: [] },
	requests: { type: Array, default: [] },
});

credsSchema.index({ userid: 1, googleid: 1 });
publicSchema.index({ userid: 1 });
socialSchema.index({ userid: 1 });

const credsCollection = new mongoose.model("credentials", credsSchema);
const publicCollection = new mongoose.model("publics", publicSchema);
const socialCollection = new mongoose.model("socials", socialSchema);

async function connect_db() {
	try {
		logger.info("Connecting to database.");
		await mongoose.connect(`${DB_URL}/${DB_NAME}`);
	} catch (error) {
		return logger.error("Cannnot connect to db: ", error);
	}

	logger.info("Connected to database.");
	return mongoose;
}

module.exports = {
	credsCollection,
	publicCollection,
	socialCollection,
	connect_db,
};
