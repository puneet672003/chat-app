import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const RequestListContext = createContext();

export function RequestListProvider({ children }) {
	const [requestList, setRequestList] = useState([]);

	return (
		<RequestListContext.Provider value={{ requestList, setRequestList }}>
			{children}
		</RequestListContext.Provider>
	);
}

RequestListProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export function useRequestList() {
	const context = useContext(RequestListContext);

	if (!context) {
		throw new Error(
			"useRequestList must be used within a RequestListProvider."
		);
	}

	return context;
}
