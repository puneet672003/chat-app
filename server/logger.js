const winston = require("winston");

// Function to format the timestamp
function customTimestamp() {
	const date = new Date();
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();
	return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

const logger = winston.createLogger({
	level: "info", // Set the log level to info to capture non-error messages
	format: winston.format.combine(
		winston.format.timestamp({ format: customTimestamp }),
		winston.format.printf(({ timestamp, level, message, stack }) => {
			if (stack) {
				return `${timestamp} ${level}: ${message}\n${stack}`;
			}
			return `${timestamp} ${level}: ${message}`;
		})
	),
	transports: [
		new winston.transports.File({
			filename: "logs/error.log",
			level: "error",
			format: winston.format.combine(
				winston.format.timestamp({ format: customTimestamp }),
				winston.format.errors({ stack: true })
			),
		}),
		new winston.transports.File({
			filename: "logs/combined.log",
			format: winston.format.combine(
				winston.format.timestamp({ format: customTimestamp }),
				winston.format.errors({ stack: true })
			),
		}),
	],
});

module.exports = logger;
