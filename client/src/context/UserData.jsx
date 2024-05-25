import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const UserDataContext = createContext();

export function UserDataProvider({ children }) {
	const [userData, setUserData] = useState({});

	return (
		<UserDataContext.Provider value={{ userData, setUserData }}>
			{children}
		</UserDataContext.Provider>
	);
}

UserDataProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export function useUserData() {
	const context = useContext(UserDataContext);

	if (!context) {
		throw new Error("userUserData must be used within a UserDataProvider.");
	}

	return context;
}
