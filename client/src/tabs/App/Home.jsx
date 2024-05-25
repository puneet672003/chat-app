import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

import { FaUser } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { TbMessageCircle2Filled } from "react-icons/tb";
import { RiUserAddFill, RiSendPlane2Fill, RiAttachment2 } from "react-icons/ri";
import { BsEmojiLaughingFill } from "react-icons/bs";

import "animate.css";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import Welcome from "../../components/Welcome";

import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";
import { useUserData } from "../../context/UserData";
import { useFriendList } from "../../context/FriendListContext";
import { useRequestList } from "../../context/RequestListContext";
import { API_BASE_URL } from "../../utils/constants";

import ProfileTab from "../ProfileTab";
import SettingsTab from "../SettingsTab";
import AddFriendTab from "../AddFriend";

function Messages({ messages, selectedFriend, setUnreadMessages }) {
	useEffect(() => {
		requestAnimationFrame(() => {
			setUnreadMessages((prevUnreadMessages) => {
				const updatedUnreadMessages = { ...prevUnreadMessages };
				if (updatedUnreadMessages?.[selectedFriend] !== undefined)
					updatedUnreadMessages[selectedFriend] = 0;

				return updatedUnreadMessages;
			});
		});
	});

	return messages?.[selectedFriend]?.map((msg, index) => {
		return msg.received ? (
			<div key={index} className="msg-received flex justify-start">
				<span className="px-4 py-2 mt-1 bg-[#2a2a2f] text-white rounded-2xl rounded-tl-none">
					{msg.message}
				</span>
			</div>
		) : (
			<div key={index} className="msg-sent text-white flex justify-end">
				<span className="px-4 py-2 mt-1 bg-[#434476] text-white rounded-2xl rounded-tr-none">
					{msg.message}
				</span>
			</div>
		);
	});
}

function FriendList({
	friends,
	onClick,
	selectedFriend,
	unreadMessages,
	getFriendData,
}) {
	const [friendsData, setFriendsData] = useState({});
	const { socket } = useSocket();

	const handleUpdateFriendData = async (data) => {
		setFriendsData((prevData) => {
			if (prevData[data.id] !== undefined) {
				return {
					...prevData,
					[data.id]: { ...prevData[data.id], ...data.data },
				};
			} else {
				return prevData;
			}
		});
	};

	useEffect(() => {
		const fetchData = async () => {
			const data = {};
			await Promise.all(
				friends.map(async (friend) => {
					const friendData = await getFriendData(friend.userid);
					data[friend.userid] = friendData;
				})
			);

			setFriendsData(data);
			if (socket) socket.on("update-friendsdata", handleUpdateFriendData);
		};

		fetchData();
	}, [friends]);

	return (
		<ul className="w-full">
			{friends.map((friend, index) => {
				let bg = "";
				if (friend.userid === selectedFriend) bg += "bg-[#2E333D]";
				else bg += "hover:bg-[#2E333D]";

				return (
					<li
						key={index}
						className={
							"py-1 px-4 w-full flex text-white duration-200 " +
							bg
						}
					>
						<button
							to={`user/${friend.userid}`}
							className="w-full flex py-2"
							onClick={() => {
								onClick(friend.userid);
							}}
						>
							<div className="profile mr-4 min-w-12 h-12 flex items-center justify-center overflow-hidden rounded-full">
								<img
									src={`https://api.multiavatar.com/${friend.userid}.png`}
									alt=""
									className="object-cover w-full h-full"
								/>
							</div>
							<div className="grow flex flex-col justify-center items-start overflow-hidden overflow-ellipsis">
								<div className="name text-white text-lg whitespace-nowrap">
									{friendsData[friend.userid]?.displayname ||
										friend.userid}
								</div>
								{friend.isOnline ? (
									<div className="grow flex items-center">
										<div className="h-2 w-2 mr-2 bg-[#8E8FFA]  flex items-center justify-center rounded-[100%]"></div>
										<span className="text-sm text-[#cfcfcf]">
											online
										</span>
									</div>
								) : (
									<div className="grow flex items-center">
										<div className="h-2 w-2 mr-2 bg-[#9E9E9E] text-sm  flex items-center justify-center rounded-[100%]"></div>
										<span className="text-sm text-[#9E9E9E]">
											offline
										</span>
									</div>
								)}
							</div>
						</button>
						{Boolean(unreadMessages?.[friend.userid]) && (
							<div className="flex items-center">
								<div className="h-6 w-6 bg-[#6263ac] text-sm flex items-center justify-center rounded-[100%] animate__animated animate__pulse">
									{unreadMessages[friend.userid]}
								</div>
							</div>
						)}
					</li>
				);
			})}
		</ul>
	);
}

function EmojiWrapper({ setFormData, inputMessageRef, buttonSize = 20 }) {
	const [emojiPicker, setEmojiPicker] = useState(false);
	const wrapperRef = useRef(null);

	const handleEmojiSelect = (emoji) => {
		setFormData((prevFormData) => {
			const newFormData = { ...prevFormData };
			newFormData[inputMessageRef.current.name] += emoji.native;

			return newFormData;
		});
		inputMessageRef.current.focus();
	};

	useEffect(() => {
		const handleOutsideClick = (event) => {
			if (
				wrapperRef.current &&
				!wrapperRef.current.contains(event.target)
			) {
				setEmojiPicker(false);
			}
		};

		const handleKeyDown = (event) => {
			if (event.key == "Enter") {
				setEmojiPicker(false);
			}
		};

		if (emojiPicker) {
			document.addEventListener("mousedown", handleOutsideClick);
			document.addEventListener("keydown", handleKeyDown);
		} else {
			document.removeEventListener("mousedown", handleOutsideClick);
			document.removeEventListener("keydown", handleKeyDown);
		}
	});

	return (
		<div ref={wrapperRef} className="emoji-wrapper">
			<button
				type="button"
				onClick={() => {
					setEmojiPicker(!emojiPicker);
				}}
				className="h-full mx-1.5 text-white duration-200 hover:text-[#8E8FFA]"
			>
				<BsEmojiLaughingFill size={buttonSize} />
			</button>

			{emojiPicker && (
				<div className="absolute bottom-[8%] right-4 z-10 animate__animated animate__slideInUp animate__faster">
					<Picker
						data={data}
						onEmojiSelect={handleEmojiSelect}
						theme="dark"
					/>
				</div>
			)}
		</div>
	);
}

export default function Home() {
	const isMounted = useRef(true);
	const scrollingContainerRef = useRef(null);
	const inputMessageRef = useRef(null);

	const { socket, setSocket } = useSocket();
	const { authenticated } = useAuth();
	const { setUserData } = useUserData();
	const { friendList: friends, setFriendList: setFriends } = useFriendList();
	const {
		requestList: requests,
		setRequestList: setRequests,
	} = useRequestList();

	const [formData, setFormData] = useState({
		message: "",
	});
	const [originalFriendList, setOriginalFriendList] = useState([]);
	const [selectedFriend, setSelectedFriend] = useState(null);
	const [messages, setMessages] = useState({});
	const [unreadMessages, setUnreadMessages] = useState({});

	const [profileTab, setProfileTab] = useState(false);
	const [settingsTab, setSettingsTab] = useState(false);
	const [messagesTab, setMessagesTab] = useState(true);
	const [addFriendTab, setAddFriendTab] = useState(false);

	const wsConnection = () => {
		const socket = io(API_BASE_URL, {
			withCredentials: true,
			transports: ["websocket", "polling"],
		});

		socket.on("connect", async () => {
			console.log("Successfully connected to websocket server.");
			console.log("Socket id: ", socket.id);

			setSocket(socket);
		});

		socket.on("disconnect", () => {
			console.log("Disconnected from server.");
			console.log("Socket id: ", socket.id);
		});

		socket.on("connect_error", () => {
			console.log("connection error.");
		});

		socket.on("authentication_error", (data) => {
			console.log(data.type);
			console.log(data.message);
		});

		socket.on("update-message", handleUpdateMessage);
		socket.on("update-friendlist", handleUpdateFriendlist);
		socket.on("update-userdata", handleUpdateUserdata);
		socket.on("update-requestlist", handleUpdateRequestlist);
		socket.on("update-friendstatus", handleUpdateFriendStatus);
	};

	const updateFriendList = async () => {
		const res = await fetch(API_BASE_URL + "api/fetch/friends", {
			method: "GET",
			credentials: "include",
		});

		if (res.ok) {
			const jsonData = await res.json();
			console.log(jsonData.data);
			setOriginalFriendList(jsonData.data);
			setFriends(jsonData.data);
		}
	};

	const updateUserData = async () => {
		const res = await fetch(API_BASE_URL + "api/fetch/profile/me", {
			method: "GET",
			credentials: "include",
		});

		if (res.ok) {
			const jsonData = await res.json();
			setUserData(jsonData.data);
		}
	};

	const updateRequestList = async () => {
		const res = await fetch(API_BASE_URL + "api/fetch/requests", {
			method: "GET",
			credentials: "include",
		});

		if (res.ok) {
			const jsonData = await res.json();
			setRequests(jsonData.data);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!formData.message) return;

		(async () => {
			const res = await fetch(API_BASE_URL + "api/post/message", {
				method: "POST",
				credentials: "include",
				body: JSON.stringify({
					message: formData.message,
					to: selectedFriend,
				}),
				headers: {
					"content-type": "application/json",
				},
			});

			if (res.ok) {
				const jsonData = await res.json();

				if (jsonData.message === "FriendIsOffline") {
					return toast.warn(
						"User you are trying to connect is offline."
					);
				}

				setFormData({ message: "" });
			}
		})();
	};

	const handleSearchChange = (e) => {
		const query = e.target.value;
		if (!query) setFriends(originalFriendList);

		const filtered = originalFriendList.filter((friend) =>
			friend.userid.toLowerCase().includes(query.toLowerCase())
		);
		setFriends(filtered);
	};

	const handleUpdateMessage = (data) => {
		const { message, received, messageid } = data;
		const user = received ? data.from : data.to;

		if (received) {
			setUnreadMessages((prevUnreadMessages) => {
				const newUnreadMessages = { ...prevUnreadMessages };

				if (newUnreadMessages?.[user] === undefined) {
					newUnreadMessages[user] = 1;
				} else {
					newUnreadMessages[user] += 1;
				}

				return newUnreadMessages;
			});
		}

		setMessages((prevMessages) => {
			const msgData = {
				message,
				received,
				messageId: messageid,
			};

			const newMessages = { ...prevMessages };
			if (newMessages?.[user] == undefined) {
				newMessages[user] = [msgData];
			} else {
				newMessages[user].push(msgData);
			}

			return newMessages;
		});
	};

	const handleUpdateFriendlist = async () => {
		console.log("updating friend list.");
		await updateFriendList();
	};

	const handleUpdateUserdata = (data) => {
		setUserData(data);
	};

	const handleUpdateRequestlist = async () => {
		console.log("updating request list.");
		await updateRequestList();
	};

	const handleUpdateFriendStatus = async (data) => {
		setOriginalFriendList((originalFriendList) =>
			originalFriendList.map((friendData) => {
				if (friendData.userid == data.id)
					return { ...friendData, isOnline: data.data.isOnline };
				return friendData;
			})
		);

		setFriends((originalFriendList) =>
			originalFriendList.map((friendData) => {
				if (friendData.userid == data.id)
					return { ...friendData, isOnline: data.data.isOnline };
				return friendData;
			})
		);
	};

	const getFriendData = async (id) => {
		const res = await fetch(API_BASE_URL + "api/fetch/profile/", {
			method: "POST",
			credentials: "include",
			body: JSON.stringify({ userid: id }),
			headers: {
				"content-type": "application/json",
			},
		});

		if (res.ok) {
			const jsonData = await res.json();
			return jsonData.data;
		}
	};

	useEffect(() => {
		if (!isMounted.current) return;

		(async () => {
			await updateUserData();
			await updateFriendList();
			await updateRequestList();
		})();

		if (!socket || socket.connected) wsConnection();

		return () => {
			isMounted.current = false;
		};
	});

	useEffect(() => {
		const scrollingContainer = scrollingContainerRef.current;
		if (scrollingContainer) {
			scrollingContainer.scrollTop = scrollingContainer.scrollHeight;
		}
	}, [messages]);

	return (
		<>
			{!authenticated && <Navigate to={"/login"} replace />}

			<main className="relative w-screen h-screen bg-[#131313] overflow-hidden">
				{profileTab && <ProfileTab />}
				{settingsTab && <SettingsTab />}
				{addFriendTab && <AddFriendTab />}

				<div className="w-full h-full flex flex-row">
					<div className="action-bar h-full w-[4%] max-w-15 bg-black flex flex-col justify-center">
						<button
							onClick={() => {
								setSettingsTab(false);
								setAddFriendTab(false);

								setProfileTab((prevProfileTab) => {
									setMessagesTab(prevProfileTab);
									return !prevProfileTab;
								});
							}}
							className={
								"profile-btn my-2 w-full cursor-pointer flex justify-center hover:scale-150 duration-200 hover:text-[#8E8FFA]" +
								(profileTab
									? " text-[#8E8FFA] scale-150"
									: " text-white")
							}
						>
							<FaUser size={20} />
						</button>
						<button
							onClick={() => {
								setProfileTab(false);
								setAddFriendTab(false);

								setSettingsTab((prevSettingsTab) => {
									setMessagesTab(prevSettingsTab);
									return !prevSettingsTab;
								});
							}}
							className={
								"settings-btn my-2 cursor-pointer flex justify-center hover:scale-150 duration-200 hover:text-[#8E8FFA]" +
								(settingsTab
									? " text-[#8E8FFA] scale-150"
									: " text-white")
							}
						>
							<IoMdSettings size={25} />
						</button>
						<button
							onClick={() => {
								setProfileTab(false);
								setSettingsTab(false);
								setMessagesTab(true);
								setAddFriendTab(false);
							}}
							className={
								"messages-btn my-2 cursor-pointer flex justify-center hover:scale-150 duration-200 hover:text-[#8E8FFA]" +
								(messagesTab
									? " text-[#8E8FFA] scale-150"
									: " text-white")
							}
						>
							<TbMessageCircle2Filled size={25} />
						</button>
						<button
							onClick={() => {
								setProfileTab(false);
								setSettingsTab(false);

								setAddFriendTab((prevAddFriendTab) => {
									setMessagesTab(prevAddFriendTab);
									return !prevAddFriendTab;
								});
							}}
							className={
								"add-btn  my-2 cursor-pointer flex justify-center hover:scale-150 duration-200 hover:text-[#8E8FFA]" +
								(addFriendTab
									? " text-[#8E8FFA] scale-150"
									: " text-white")
							}
						>
							<RiUserAddFill size={25} />
						</button>
					</div>
					<div className="side-bar h-full w-[20%] bg-[#18181B] flex flex-col justify-start items-center focus-within:outline-none">
						<input
							type="text"
							className="bg-[#2E333D] my-4 py-2 px-4 rounded-xl w-[80%] appearance-none outline-[#2E333D] focus:outline-none border-2 border-[#2E333D] duration-200 hover:border-b-[#8E8FFA] focus:border-b-[#8E8FFA] caret-[#8E8FFA] text-white"
							placeholder="Search"
							onChange={handleSearchChange}
						/>
						<FriendList
							friends={friends}
							onClick={(friend) => setSelectedFriend(friend)}
							selectedFriend={selectedFriend}
							unreadMessages={unreadMessages}
							getFriendData={getFriendData}
						/>
					</div>
					{selectedFriend == null ? (
						<div className="grow h-full flex flex-col justify-center items-center ">
							<Welcome />
							<h2 className="mb-24 font-rocksalt text-white text-4xl">
								WELCOME
							</h2>
						</div>
					) : (
						<div className="relative messages grow flex flex-col-reverse">
							<form
								onSubmit={handleSubmit}
								className="msg-input h-[8%] bottom-0 w-full flex p-2 text-white duration-200 border-2 border-[#131313] hover:border-b-[#8E8FFA] focus-within:border-b-[#8E8FFA] rounded-lg"
							>
								<input
									ref={inputMessageRef}
									type="text"
									name="message"
									value={formData.message}
									onChange={handleInputChange}
									placeholder="Type a message"
									autoComplete="off"
									autoFocus
									className="grow h-full bg-[#131313] focus:outline-none caret-[#8E8FFA]"
								/>
								<button
									type="button"
									onClick={() => {}}
									className="h-full mx-1.5 text-white duration-200 hover:text-[#8E8FFA]"
								>
									<RiAttachment2 size={20} />
								</button>

								<EmojiWrapper
									inputMessageRef={inputMessageRef}
									setFormData={setFormData}
								/>

								<button
									type="submit"
									className="h-full mx-1.5 text-white duration-200 hover:text-[#8E8FFA]"
								>
									<RiSendPlane2Fill size={20} />
								</button>
							</form>

							<div
								ref={scrollingContainerRef}
								className="msg-area max-h-[92%] px-4 py-4 overflow-y-auto scrollbar-none"
							>
								<Messages
									messages={messages}
									selectedFriend={selectedFriend}
									setUnreadMessages={setUnreadMessages}
								/>
							</div>
						</div>
					)}
				</div>
			</main>
		</>
	);
}
