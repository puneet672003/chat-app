import { useState, useEffect } from "react";
import { IoMdSettings } from "react-icons/io";

import {
	RootContainer,
	Header,
	MainWrapper,
	TopWrapper,
	BottomWrapper,
	Loading,
} from "./_layout";
import { useUserSettings } from "../context/UserSettings";
import ComingSoon from "../components/ComingSoon";

function CheckBox({ id, handleChange, children }) {
	const { userSettings } = useUserSettings();

	return (
		<>
			<label
				htmlFor={id}
				className="px-2 mb-4 flex justify-between cursor-pointer"
			>
				<span className="text-md font-medium text-[#dbdbdb]">
					{children}
				</span>
				<input
					id={id}
					type="checkbox"
					name={id}
					onChange={handleChange}
					className="sr-only peer"
				/>
				<div className="relative w-11 h-6 bg-[#3f3f3f] peer-focus:outline-none rounded-full duration-300 peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all after:duration-300 peer-checked:bg-[#8E8FFA]"></div>
			</label>
		</>
	);
}

function SaveButton({ newSettings, submitFunction }) {
	if (Object.keys(newSettings).length === 0) return;

	return (
		<button
			onClick={submitFunction}
			className="py-2 text-white rounded-lg px-8 duration-200 bg-[#5e5fa3] hover:bg-[#6f71c4]"
		>
			Save
		</button>
	);
}

export default function SettingsTab({}) {
	const [loading, setLoading] = useState(false);
	const [newSettings, setNewSettings] = useState({});

	const handleChange = (e) => {
		const { name, type } = e.target;

		let value;
		if (type === "checkbox") {
			value = e.target.checked;
		} else value = e.target.value;

		setNewSettings((prevSettings) => {
			return { ...prevSettings, [name]: value };
		});
	};

	const submitSettings = () => {
		console.log("Submitting new settings: ", newSettings);
		setNewSettings({});
	};

	return (
		<RootContainer>
			<Header>
				<IoMdSettings size={80} />
			</Header>

			<MainWrapper>
				{loading ? (
					<Loading />
				) : (
					<>
						<div className=" grow flex flex-col justify-center items-center">
							<ComingSoon />
							<h2 className="my-4 mb-8 font-rocksalt text-white text-4xl">
								COMING&emsp;SOON
							</h2>
						</div>
						{/* <TopWrapper>
							<CheckBox
								id={"darkmode"}
								handleChange={handleChange}
							>
								Dark Mode
							</CheckBox>
							<CheckBox
								id={"allowrequests"}
								handleChange={handleChange}
							>
								Allow Friend Requests
							</CheckBox>
						</TopWrapper>

						<BottomWrapper>
							<SaveButton
								newSettings={newSettings}
								submitFunction={submitSettings}
							/>
						</BottomWrapper> */}
					</>
				)}
			</MainWrapper>
		</RootContainer>
	);
}
