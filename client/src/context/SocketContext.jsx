import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const SocketContext = createContext();

export function SocketProvider({ children }) {
	const [socket, setSocket] = useState(null);

	return (
		<SocketContext.Provider value={{ socket, setSocket }}>
			{children}
		</SocketContext.Provider>
	);
}

SocketProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export function useSocket() {
	const context = useContext(SocketContext);

	if (!context) {
		throw new Error("useSocket must be used within a SocketProvider.");
	}

	return context;
}
