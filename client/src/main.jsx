import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import { UserSettingsProvider } from "./context/UserSettings.jsx";
import { UserDataProvider } from "./context/UserData.jsx";
import { FriendListProvider } from "./context/FriendListContext.jsx";
import { RequestListProvider } from "./context/RequestListContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
	<AuthProvider>
		<SocketProvider>
			<UserDataProvider>
				<FriendListProvider>
					<RequestListProvider>
						<UserSettingsProvider>
							<BrowserRouter>
								<App />
							</BrowserRouter>
						</UserSettingsProvider>
					</RequestListProvider>
				</FriendListProvider>
			</UserDataProvider>
		</SocketProvider>
	</AuthProvider>
);
