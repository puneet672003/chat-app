import { useState } from "react";
import { toast } from "react-toastify";

import { RiUserAddFill } from "react-icons/ri";
import { FaSearch } from "react-icons/fa";
import { GiCheckMark, GiCrossMark } from "react-icons/gi";

import { useRequestList } from "../context/RequestListContext";
import { RootContainer, Header, MainWrapper, BottomWrapper } from "./_layout";
import { API_BASE_URL } from "../utils/constants";

function SearchUser({ inputValue, handleChange, submitQuery }) {
	return (
		<form onSubmit={submitQuery} className="flex">
			<input
				type="text"
				onChange={handleChange}
				value={inputValue}
				className="bg-[#2E333D] my-4 py-2 px-4 rounded-xl w-[80%] appearance-none outline-[#2E333D] focus:outline-none border-2 border-[#2E333D] duration-200 hover:border-b-[#8E8FFA] focus:border-b-[#8E8FFA] caret-[#8E8FFA] text-white"
				placeholder="User Name"
			/>

			<button
				type="submit"
				className="mx-2 grow flex justify-center items-center text-white duration-200 hover:text-[#8E8FFA]"
			>
				Search <FaSearch className="mx-3" />
			</button>
		</form>
	);
}

function AddButton({ submitFunction, children }) {
	return (
		<button
			onClick={submitFunction}
			className="relative py-2 text-white rounded-lg px-8 duration-200 bg-[#5e5fa3] hover:bg-[#6f71c4]"
		>
			{children}
		</button>
	);
}

function UserDetails({ userDetails }) {
	if (Object.keys(userDetails).length === 0) return;

	return (
		<div className="grow flex items-center px-4">
			<div className="profile mr-10 w-40 h-40 flex items-center justify-center overflow-hidden rounded-full">
				<img
					src={`https://api.multiavatar.com/${userDetails.username}.png`}
					alt=""
					className="object-cover w-full h-full"
				/>
			</div>
			<table className="details grow">
				<tbody>
					<tr className="display-name text-lg">
						<td className="text-[#dbdbdb] px-2">Display Name:</td>
						<td className="text-white px-2">
							{userDetails.displayname || userDetails.username}
						</td>
					</tr>

					<tr className="user-name text-lg">
						<td className="text-[#dbdbdb] px-2">User Name:</td>
						<td className="text-white px-2">
							{userDetails.username}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}

function RequestList() {
	const { requestList } = useRequestList();

	const acceptRequest = async (userid) => {
		console.log("Accepting request of: ", userid);

		const res = await fetch(API_BASE_URL + "api/update/request", {
			method: "POST",
			credentials: "include",
			body: JSON.stringify({ action: "accept", from: userid }),
			headers: {
				"content-type": "application/json",
			},
		});

		if (res.ok) toast.success(`Success! Added ${userid}`);
	};

	const rejectRequest = async (userid) => {
		console.log("Rejecting request of: ", userid);

		const res = await fetch(API_BASE_URL + "api/update/request", {
			method: "POST",
			credentials: "include",
			body: JSON.stringify({ action: "reject", from: userid }),
			headers: {
				"content-type": "application/json",
			},
		});

		if (res.ok) toast.info(`Success! Rejected request from ${userid}`);
	};

	return (
		<>
			<span className="p-2 text-[#dbdbdb] text-lg">
				{requestList.length} Incoming friend requests
			</span>
			<ul className="requests my-2 h-full overflow-y-auto scrollbar-none">
				{requestList.map((username) => {
					return (
						<li
							key={username}
							className="w-full px-4 py-2 mb-2 rounded-lg text-white flex items-center text-lg border-b-2 border-[#3B3B3B] border-opacity-60 hover:bg-opacity-70 hover:bg-[#3B3B3B] duration-200"
						>
							<div className="profile mr-6 w-12 h-12 flex items-center justify-center overflow-hidden rounded-full">
								<img
									src={`https://api.multiavatar.com/${username}.png`}
									alt=""
									className="object-cover w-full h-full"
								/>
							</div>
							{username}
							<div className="grow flex flex-row-reverse items-center">
								<button
									onClick={() => rejectRequest(username)}
									className="px-3 text-red-500 hover:scale-150 duration-200"
								>
									<GiCrossMark />
								</button>
								<button
									onClick={() => acceptRequest(username)}
									className="px-3 text-[#8E8FFA] hover:scale-150 duration-200"
								>
									<GiCheckMark />
								</button>
							</div>
						</li>
					);
				})}
			</ul>
		</>
	);
}

export default function AddFriendTab({}) {
	const [friendDetails, setFriendDetails] = useState({});

	const [loading, setLoading] = useState(false);
	const [addFriend, setAddFriend] = useState(false);
	const [query, setQuery] = useState("");
	const [sent, setSent] = useState(false);

	const handleChange = (e) => {
		e.preventDefault();

		const { value } = e.target;
		setQuery(value);
	};

	const submitQuery = async (e) => {
		e.preventDefault();
		console.log("Submitting query: ", query);

		const res = await fetch(API_BASE_URL + "api/fetch/profile", {
			method: "POST",
			body: JSON.stringify({ userid: query }),
			headers: {
				"content-type": "application/json",
			},
		});

		if (res.ok) {
			const jsonData = await res.json();
			setFriendDetails({
				username: jsonData.data.userid,
				displayname: jsonData.data.displayname,
			});
		}

		setQuery("");
	};

	const submitRequest = async () => {
		console.log("Sending request to: ", friendDetails.username);

		const res = await fetch(API_BASE_URL + "api/post/request", {
			method: "POST",
			credentials: "include",
			body: JSON.stringify({ to: friendDetails.username }),
			headers: {
				"content-type": "application/json",
			},
		});

		if (res.ok) {
			setSent(true);
			toast.success("Request sent!");
		}
	};

	return (
		<RootContainer>
			<Header>
				<RiUserAddFill size={80} />
			</Header>
			<MainWrapper>
				{addFriend && (
					<SearchUser
						inputValue={query}
						handleChange={handleChange}
						submitQuery={submitQuery}
					/>
				)}

				{!query &&
				Object.keys(friendDetails).length === 0 &&
				!addFriend ? (
					<>
						<RequestList />
						<BottomWrapper>
							<AddButton
								submitFunction={() => {
									setAddFriend(true);
								}}
							>
								Add Friend
							</AddButton>
						</BottomWrapper>
					</>
				) : (
					<>
						<UserDetails userDetails={friendDetails} />

						<BottomWrapper>
							{Object.keys(friendDetails).length !== 0 && (
								<AddButton submitFunction={submitRequest}>
									Send Request
									{sent && (
										<span className="absolute w-full h-full rounded-lg top-0 left-0 bg-[#5e5fa3] flex justify-center items-center">
											[✔] Sent
										</span>
									)}
								</AddButton>
							)}
						</BottomWrapper>
					</>
				)}
			</MainWrapper>
		</RootContainer>
	);
}
