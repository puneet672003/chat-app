import { useEffect, useState, createContext, useContext } from "react";
import { toast } from "react-toastify";

import { RiLogoutBoxRFill, RiFileCopyFill } from "react-icons/ri";
import { GoAlertFill } from "react-icons/go";

import {
	RootContainer,
	Header,
	MainWrapper,
	TopWrapper,
	BottomWrapper,
	Loading,
} from "./_layout";
import { useUserData } from "../context/UserData";
import { API_BASE_URL } from "../utils/constants";

const SubmitTypeContext = createContext();
const IsLoadingContext = createContext();

const useSubmitType = () => {
	const submitType = useContext(SubmitTypeContext);
	if (!submitType) {
		throw new Error(
			"useSubmitType must be used within a SubmitTypeProvider."
		);
	}

	return submitType.isSubmitType;
};

const useLoading = () => {
	const loading = useContext(IsLoadingContext);
	if (!loading)
		throw new Error("useLoading must be used within a LoadingProvider");

	return loading;
};

function FormWrapper({ isSubmitType, handleSubmit, children }) {
	const [loading, setLoading] = useState(false);
	const style = "flex justify-between mb-6";

	return (
		<SubmitTypeContext.Provider value={{ isSubmitType }}>
			<IsLoadingContext.Provider value={{ loading, setLoading }}>
				{isSubmitType ? (
					<form
						onSubmit={(e) => {
							handleSubmit(e, setLoading);
						}}
						className={style}
					>
						{children}
					</form>
				) : (
					<div className={style}>{children}</div>
				)}
			</IsLoadingContext.Provider>
		</SubmitTypeContext.Provider>
	);
}

function LabelName({ forId, children }) {
	return (
		<label htmlFor={forId} className="px-2 text-[#dbdbdb]">
			{children}
		</label>
	);
}

function LabelData({
	elementId,
	labelName,
	type,
	valueRef,
	placeholder,
	setStateFunction,
	autoFocus = true,
	extraStyles = "",
	children,
}) {
	const isSubmitType = useSubmitType();

	if (isSubmitType) {
		return (
			<input
				id={elementId}
				name={labelName}
				type={type}
				value={valueRef}
				className={
					"bg-inherit py-1 px-2 rounded-lg w-[80%] appearance-none outline-[#1f1f1f] focus:outline-none caret-white text-white placeholder-[#8b8b8b] " +
					extraStyles
				}
				placeholder={placeholder}
				onChange={(e) => {
					const { name, value } = e.target;
					setStateFunction((prevState) => {
						return { ...prevState, [name]: value };
					});
				}}
				autoFocus={autoFocus}
				required
			/>
		);
	} else {
		return <div className="py-1 px-2 text-white">{children}</div>;
	}
}

function LabelWrapper({ children }) {
	return <div className="flex flex-col w-full">{children}</div>;
}

function CopyButton({ valueToCopy }) {
	const [copied, setCopied] = useState(false);

	return (
		<button
			type={"button"}
			onClick={() => {
				if (navigator.clipboard) {
					navigator.clipboard.writeText(valueToCopy).then(() => {
						setCopied(true);
						setTimeout(() => setCopied(false), 1500);
					});
				}
			}}
			className={`relative my-2 text-white rounded-lg bg-[#3b3b3b] px-8 duration-200 hover:bg-[#515151]`}
		>
			Copy
			{copied && (
				<span className="absolute w-full h-full rounded-lg top-0 left-0 bg-[#5e5fa3] flex justify-center items-center">
					<RiFileCopyFill
						size={20}
						className="animate__animated animate__fadeIn animate__faster"
					/>
				</span>
			)}
		</button>
	);
}

function SaveEditButton({ handleOnClick = null }) {
	const { loading } = useLoading();
	const isSubmitType = useSubmitType();

	return (
		<button
			type={isSubmitType ? "submit" : "button"}
			onClick={!isSubmitType ? handleOnClick : null}
			className={`relative my-2 text-white rounded-lg bg-[#3b3b3b] px-8 duration-200 ${
				isSubmitType
					? "bg-[#5e5fa3] hover:bg-[#6f71c4]"
					: "bg-[#3b3b3b] hover:bg-[#515151]"
			}`}
		>
			{isSubmitType ? "Save" : "Edit"}
			{loading && (
				<div className="absolute z-10 top-0 left-0 w-full h-full bg-[#3b3b3b] rounded-lg flex justify-center items-center">
					<Loading width={40} height={40} />
				</div>
			)}
		</button>
	);
}

function CrucialButton({ handleOnClick, extraStyles, children }) {
	return (
		<button
			type="button"
			onClick={handleOnClick}
			className={
				"logout-button  w-full py-2 px-4 rounded-lg bg-red-700 bg-opacity-80 text-white flex justify-between items-center hover:bg-red-600 " +
				extraStyles
			}
		>
			{children}
		</button>
	);
}

function ConfirmPassword() {
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [badRequest, setBadReqest] = useState(false);
	const [passwordData, setPasswordData] = useState({
		current: "",
		new: "",
		confirm: "",
	});

	const customInputStyle =
		"w-full !bg-[#292929] !bg-opacity-70 py-2 mx-1 !border-[#292929] focus:border-b-2 focus:border-b-[#8E8FFA] duration-200";

	const submitPassword = async (e) => {
		e.preventDefault();
		if (
			!(
				passwordData?.current &&
				passwordData?.new &&
				passwordData?.confirm
			)
		) {
			toast.error("Must fill all the fields");
			return setBadReqest(true);
		}

		if (passwordData.new !== passwordData.confirm) {
			toast.error(
				"New password and Confirm password field didn't match!"
			);
			setPasswordData((prevData) => {
				return { ...prevData, confirm: "" };
			});
			setBadReqest(true);
		}

		setLoading(true);
		const res = await fetch(API_BASE_URL + "api/update/password", {
			method: "POST",
			credentials: "include",
			body: JSON.stringify(passwordData),
			headers: {
				"content-type": "application/json",
			},
		});

		setLoading(false);

		if (res.ok) {
			toast.success("Done!");
			setSuccess(true);
		} else {
			toast.error(`Cannot update password: ${res.statusText}`);
		}
	};

	return (
		<>
			<TopWrapper>
				<FormWrapper isSubmitType={true} handleSubmit={submitPassword}>
					<LabelWrapper>
						<LabelName>Current Password</LabelName>
						<LabelData
							elementId={"current-passs"}
							type={"password"}
							labelName={"current"}
							valueRef={passwordData.current}
							setStateFunction={setPasswordData}
							extraStyles={
								customInputStyle +
								(badRequest
									? !passwordData.current
										? " !border-b-2 !border-b-red-600"
										: ""
									: "")
							}
						/>
					</LabelWrapper>
				</FormWrapper>

				<FormWrapper isSubmitType={true} handleSubmit={submitPassword}>
					<LabelWrapper>
						<LabelName>New Password</LabelName>
						<LabelData
							elementId={"new-passs"}
							type={"password"}
							labelName={"new"}
							valueRef={passwordData.new}
							setStateFunction={setPasswordData}
							extraStyles={
								customInputStyle +
								(badRequest
									? !passwordData.new
										? " !border-b-2 !border-b-red-600"
										: ""
									: "")
							}
							autoFocus={false}
						/>
					</LabelWrapper>
				</FormWrapper>

				<FormWrapper isSubmitType={true} handleSubmit={submitPassword}>
					<LabelWrapper>
						<LabelName>Confirm Password</LabelName>
						<LabelData
							elementId={"confirm-passs"}
							type={"password"}
							labelName={"confirm"}
							valueRef={passwordData.confirm}
							setStateFunction={setPasswordData}
							extraStyles={
								customInputStyle +
								(badRequest
									? !passwordData.confirm
										? " !border-b-2 !border-b-red-600"
										: ""
									: "")
							}
							autoFocus={false}
						/>
					</LabelWrapper>
				</FormWrapper>
			</TopWrapper>

			<BottomWrapper>
				{loading ? (
					<CrucialButton extraStyles={"!bg-[#5e5fa3]"}>
						Updating password..
						<div className="h-full flex justify-center items-center">
							<Loading width={30} height={30} />
						</div>
					</CrucialButton>
				) : success ? (
					<CrucialButton
						extraStyles={"!bg-green-600 !hover:bg-green-800"}
					>
						Success
						<span>:D</span>
					</CrucialButton>
				) : (
					<CrucialButton handleOnClick={submitPassword}>
						Change Password
						<GoAlertFill size={18} />
					</CrucialButton>
				)}
			</BottomWrapper>
		</>
	);
}

export default function ProfileTab({}) {
	const { userData } = useUserData();
	const [loading, setLoading] = useState(false);

	const [editDisplayName, setEditDisplayName] = useState(false);
	const [editPassword, setEditPassword] = useState(false);

	const [displayNameData, setDisplayNameData] = useState({
		displayname: "",
	});

	const submitDisplayName = async (e, setLoading) => {
		e.preventDefault();
		setLoading(true);

		const res = await fetch(
			API_BASE_URL + "api/update/profile/displayname",
			{
				method: "POST",
				credentials: "include",
				body: JSON.stringify({
					displayname: displayNameData.displayname,
				}),
				headers: {
					"content-type": "application/json",
				},
			}
		);

		setLoading(false);
		setEditDisplayName(false);

		if (res.ok) toast.success("Done!");
		else toast.success(`Cannot update display name: ${res.statusText}`);
	};

	return (
		<RootContainer>
			<Header>
				<img
					src={`https://api.multiavatar.com/${userData.userid}.png`}
					alt="profile-icon"
					className="object-cover w-full h-full"
				/>
			</Header>
			<MainWrapper>
				{loading ? (
					<div className="w-full h-full flex justify-center items-center">
						<div className="w-100 h-100">
							<Loading />
						</div>
					</div>
				) : editPassword ? (
					<ConfirmPassword />
				) : (
					<>
						<TopWrapper>
							<FormWrapper
								isSubmitType={false}
								handleSubmit={null}
							>
								<LabelWrapper>
									<LabelName forId={"user-name"}>
										USER NAME
									</LabelName>

									<LabelData
										elementId={"user-name"}
										type={"text"}
									>
										{userData.userid}
									</LabelData>
								</LabelWrapper>

								<CopyButton valueToCopy={userData.userid} />
							</FormWrapper>

							<FormWrapper
								isSubmitType={editDisplayName}
								handleSubmit={submitDisplayName}
							>
								<LabelWrapper>
									<LabelName forId={"display-name"}>
										DISPLAY NAME
									</LabelName>

									<LabelData
										elementId={"display-name"}
										type={"text"}
										labelName={"displayname"}
										valueRef={displayNameData.displayname}
										placeholder={"New Display Name"}
										setStateFunction={setDisplayNameData}
									>
										{userData.displayname
											? userData.displayname
											: userData.userid}
									</LabelData>
								</LabelWrapper>

								<SaveEditButton
									handleOnClick={() => {
										setEditDisplayName(!editDisplayName);
									}}
								/>
							</FormWrapper>

							<FormWrapper
								isSubmitType={false}
								handleSubmit={null}
							>
								<LabelWrapper>
									<LabelName forId={"password"}>
										PASSWORD
									</LabelName>

									<LabelData
										elementId={"password"}
										type={"text"}
									>
										****************
									</LabelData>
								</LabelWrapper>

								<SaveEditButton
									handleOnClick={() => {
										setEditPassword(!editPassword);
									}}
								/>
							</FormWrapper>
						</TopWrapper>

						<BottomWrapper>
							<CrucialButton>
								Logout from this device
								<RiLogoutBoxRFill size={18} />
							</CrucialButton>
						</BottomWrapper>
					</>
				)}
			</MainWrapper>
			)
		</RootContainer>
	);
}
