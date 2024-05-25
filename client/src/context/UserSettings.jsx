import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const UserSettingsContext = createContext();

export function UserSettingsProvider({ children }) {
	const [userSettings, setUserSettings] = useState({
		darkmode: true,
		allowrequests: false,
	});

	return (
		<UserSettingsContext.Provider value={{ userSettings, setUserSettings }}>
			{children}
		</UserSettingsContext.Provider>
	);
}

UserSettingsProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export function useUserSettings() {
	const context = useContext(UserSettingsContext);

	if (!context) {
		throw new Error(
			"useUserSettings must be used within a UserSettingsProvider."
		);
	}

	return context;
}
