import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const FriendListContext = createContext();

export function FriendListProvider({ children }) {
	const [friendList, setFriendList] = useState([]);

	return (
		<FriendListContext.Provider value={{ friendList, setFriendList }}>
			{children}
		</FriendListContext.Provider>
	);
}

FriendListProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export function useFriendList() {
	const context = useContext(FriendListContext);

	if (!context) {
		throw new Error(
			"useFriendList must be used within a FriendListProvider."
		);
	}

	return context;
}
