# Chat App

Welcome to the Chat App! This README will guide you through the installation and setup process to get your chat application up and running.

Watch the demo of this chat application on YouTube: [Chat App Demo](https://www.youtube.com/watch?v=_11_Q9bmtDc)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Download and install from [Node.js official website](https://nodejs.org/).
- **MongoDB**: Ensure MongoDB service is running. You can start it using `mongod`.
- **DataBase**: Ensure you have a db setup with collections: credentials, publics and socials.

## Setup Instructions

Follow these steps to set up and run the Chat App:

### 1. Environment Configuration

First, you need to configure the environment variables. Edit the provided environment file and save it as `.env`.

```sh
cp env.example .env
```

Edit the `.env` file to include your specific environment variables.

### 2. Server Setup

Navigate to the server directory, install the necessary packages, and start the server:

```sh
cd server
npm install
node server.js
```

### 3. Client Setup

Navigate to the client directory, install the necessary packages, and start the front end:

```sh
cd client
npm install
npm run dev
```

## Running the Application

Once both the server and client are set up, you should be able to access the chat application through your web browser.

## Additional Information

- **Backend**: The server is set up using Node.js and connects to a MongoDB database.
- **Frontend**: The client side is built with modern JavaScript frameworks and tools.

Happy chatting!
