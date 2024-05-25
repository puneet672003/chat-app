import { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [authenticated, setAuthenticated] = useState();

	return (
		<AuthContext.Provider value={{ authenticated, setAuthenticated }}>
			{children}
		</AuthContext.Provider>
	);
}

AuthProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within a AuthProvider.");
	}

	return context;
}
