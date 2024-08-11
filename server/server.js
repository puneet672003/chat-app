const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const session = require("express-session");
const http = require("http");
const MongoStore = require("connect-mongo");

const db = require("./utils/_db");
const api = require("./api");
const webSocket = require("./websocket");
const logger = require("./logger");

require("dotenv").config();

const SERVER_PORT = Number(process.env.SERVER_PORT);
const USE_HTTPS = Boolean(Number(process.env.USE_HTTPS));
const DEVELOPMENT = Boolean(Number(process.env.DEVELOPMENT));

const app = express();
const httpServer = http.createServer(app);
const ws = new webSocket(httpServer);

async function main() {
	try {
		// Connect to the database
		const mongoose = await db.connect_db();

		// Configure session middleware
		app.use(
			session({
				secret: process.env.SESSION_SECRET,
				resave: false,
				saveUninitialized: true,
				store: MongoStore.create({
					mongoUrl: `${process.env.DB_URL}/${process.env.DB_NAME}`, // Updated to use mongoUrl
					mongooseConnection: mongoose.connection,
				}),
				cookie: { secure: USE_HTTPS, httpOnly: true, sameSite: "none" },
			})
		);

		// Setup middlewares
		if (DEVELOPMENT) {
			app.use(
				cors({
					origin: process.env.DEVELOPMENT_URL,
					credentials: true,
				})
			);
		} else {
			app.use(
				cors({
					origin: process.env.WEB_URL,
					credentials: true,
				})
			);
		}

		app.use(cookieParser());
		app.use(express.json());

		app.use("/api", (req, res, next) => {
			req.ws = ws;
			next();
		});

		// Setup routes
		app.use("/api", api.app);
		app.get("/hello", api.authenticate, (req, res) => {
			res.status(200).send("Hellowwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww");
		});

		// Error handling middleware
		app.use((err, req, res, next) => {
			if (err) {
				logger.error(err);
				return res.status(500).send("Internal Server Error");
			}
			next();
		});

		// Start the server
		httpServer.listen(SERVER_PORT, (error) => {
			if (error) {
				logger.error(error);
			} else {
				logger.info("Server is up.");
			}
		});
	} catch (error) {
		logger.error("Error during initialization: ", error);
	}
}

// Handle unhandled promise rejections and uncaught exceptions
process.on("unhandledRejection", (reason, promise) =>
	logger.info(`Unhandled Rejection at: ${promise} \n\treason: ${reason}`)
);
process.on("uncaughtException", (err) => logger.error(err));

// Start the application
main();
