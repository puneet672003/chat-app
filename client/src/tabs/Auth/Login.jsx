import { useState, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../utils/constants";

const GoogleIcon = ({ width, height }) => {
	return (
		<div className="pr-2">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				x="0px"
				y="0px"
				width={width}
				height={height}
				viewBox="0 0 256 256"
			>
				<g
					fill="currentColor"
					fillRule="nonzero"
					stroke="none"
					strokeWidth="1"
					strokeLinecap="butt"
					strokeLinejoin="miter"
					strokeMiterlimit="10"
					strokeDasharray=""
					strokeDashoffset="0"
					fontFamily="none"
					fontWeight="none"
					fontSize="none"
					textAnchor="none"
					style={{ mixBlendMode: "normal" }}
				>
					<g transform="scale(8.53333,8.53333)">
						<path d="M15.00391,3c-6.629,0 -12.00391,5.373 -12.00391,12c0,6.627 5.37491,12 12.00391,12c10.01,0 12.26517,-9.293 11.32617,-14h-1.33008h-2.26758h-7.73242v4h7.73828c-0.88958,3.44825 -4.01233,6 -7.73828,6c-4.418,0 -8,-3.582 -8,-8c0,-4.418 3.582,-8 8,-8c2.009,0 3.83914,0.74575 5.24414,1.96875l2.8418,-2.83984c-2.134,-1.944 -4.96903,-3.12891 -8.08203,-3.12891z"></path>
					</g>
				</g>
			</svg>
		</div>
	);
};

function LoginForm({
	googleAuth,
	resetLink,
	toggleForm,
	handleInputChange,
	handleSubmit,
	formData,
}) {
	return (
		<div className="w-screen h-screen bg-[#131217] flex justify-center items-center">
			<div className="w-[70%] h-[80%] bg-[#7a7cf6] flex flex-col">
				{/* ============================================================= */}

				<div className="top-container w-full flex items-center h-[40%]">
					<div className="w-1/2 h-full bg-[#18181B] flex justify-center items-center">
						<h1 className="my-5 font-poppins font-bold text-3xl text-center text-white">
							SIGN IN
						</h1>
					</div>

					<div className="w-1/2 h-full">
						<div className="h-full w-[70%] bg-[#8082f9] flex justify-center items-center">
							{/* <h1 className="font-poppins font-bold text-1xl text-[#b9baf8]">
								Chat App
							</h1> */}
						</div>
					</div>
				</div>

				<form
					className="h-full w-full flex flex-col shadow-xl shadow-[#2b2b2b]"
					onSubmit={handleSubmit}
				>
					{/* ============================================================= */}
					<div className="mid-container w-full flex h-[70%]">
						<div className="flex flex-col items-center w-1/2 h-full justify-center bg-[#18181B]">
							<div className="mb-10 px-4 py-2 rounded-full border-2 border-[#8E8FFA] w-[80%] text-[#8E8FFA] text-center duration-200 hover:bg-[#8E8FFA] hover:text-black focus-within:bg-[#8E8FFA] focus-within:text-black">
								<a
									href={googleAuth}
									className="flex justify-center items-center focus:outline-none"
								>
									<GoogleIcon
										width={"1.5rem"}
										height={"1.5rem"}
										color={"#8e8ffa"}
										hoverColor={"#000000"}
									/>
									Continue with google
								</a>
							</div>

							<input
								className="my-1 px-4 py-3 text-[#8EA3AF] w-[80%] bg-[#2c2e30] rounded-lg duration-200 border-2 border-[#2c2e30] hover:border-b-[#8E8FFA] focus:border-b-[#8E8FFA] focus:outline-none appearance-none caret-[#8E8FFA]"
								type="text"
								name="userid"
								value={formData.userid}
								onChange={handleInputChange}
								placeholder="User ID"
								autoComplete="off"
								autoFocus
							/>
							<input
								className="my-1 px-4 py-3 text-[#8EA3AF] w-[80%] bg-[#2c2e30] rounded-lg duration-200 border-2 border-[#2c2e30] hover:border-b-[#8E8FFA] focus:border-b-[#8E8FFA] focus:outline-none appearance-none caret-[#8E8FFA]"
								type="password"
								name="password"
								value={formData.password}
								onChange={handleInputChange}
								placeholder="Password"
							/>
						</div>

						<div className="w-1/2 flex justify-center items-center">
							<p className="px-10 text-2xl text-[#dbdbf6]">
								Ready to dive into the conversation? <br />
								Rvegister to start chatting now!
							</p>
						</div>
					</div>

					{/* ============================================================= */}
					<div className="bottom-container flex grow relative">
						<div className="w-1/2 flex justify-end bg-[#18181B]">
							<div className="mr-8">
								<div className="px-2 py-2 text-white text-center duartion-200 hover:text-[#8082f9] focus-within:text-[#8082f9]">
									<a
										href={resetLink}
										className="focus:outline-none"
									>
										Forgot password?
									</a>
								</div>
							</div>

							<div className="w-[40%]">
								<button
									className="px-4 py-2 w-full rounded-l-full border-2 border-r-0 border-[#8E8FFA] text-[#8E8FFA] duration-200 hover:bg-[#8E8FFA] hover:text-black"
									type="submit"
								>
									Submit
								</button>
							</div>
						</div>
						<div className="w-1/2 flex">
							<div className="w-[40%]">
								<button
									className="px-4 py-2 w-full rounded-r-full border-2 border-l-0 border-[#dbdbf6] text-[#dbdbf6] duration-200 hover:bg-[#dbdbf6] hover:text-black"
									onClick={toggleForm}
									type="button"
								>
									Register
								</button>
							</div>

							<div className="absolute bottom-0 right-0">
								<div className="h-full flex items-end justify-end">
									<div className="w-[200px] h-[200px] bg-[#8082f9] rounded-tl-full rounded-0"></div>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}

function RegisterForm({
	googleAuth,
	helpLink,
	toggleForm,
	handleInputChange,
	handleSubmit,
	formData,
}) {
	return (
		<div className="w-screen h-screen bg-[#131217] flex justify-center items-center">
			<div className="w-[70%] h-[80%] bg-[#7a7cf6] flex flex-col">
				{/* ============================================================= */}

				<div className="top-container w-full flex items-center h-[40%]">
					<div className="w-1/2 h-full flex justify-end">
						<div className="h-full w-[70%] bg-[#8082f9] flex justify-center items-center">
							{/* <h1 className="font-poppins font-bold text-1xl text-[#b9baf8]">
								Chat App
							</h1> */}
						</div>
					</div>
					<div className="w-1/2 h-full bg-[#18181B] flex justify-center items-center">
						<h1 className="my-5 font-poppins font-bold text-3xl text-center text-white ">
							REGISTER
						</h1>
					</div>
				</div>

				<form
					className="h-full w-full flex flex-col shadow-xl shadow-[#2b2b2b]"
					onSubmit={handleSubmit}
				>
					{/* ============================================================= */}
					<div className="mid-container w-full flex h-[70%]">
						<div className="w-1/2 flex justify-center items-center">
							<p className="px-10 text-2xl text-[#dbdbf6] text-right">
								Ready to dive into the conversation? <br />
								Login to start chatting now!
							</p>
						</div>

						<div className="flex flex-col items-center w-1/2 h-full justify-center bg-[#18181B]">
							<div className="mb-10 px-4 py-2 rounded-full border-2 border-[#8E8FFA] w-[80%] text-[#8E8FFA] text-center duration-200 hover:bg-[#8E8FFA] hover:text-black cursor-pointer focus:outline-none focus-within:bg-[#8E8FFA] focus-within:text-black">
								<a
									href={googleAuth}
									className="flex justify-center items-center focus:outline-none"
								>
									<GoogleIcon
										width={"1.5rem"}
										height={"1.5rem"}
										color={"#8e8ffa"}
										hoverColor={"#000000"}
									/>
									Continue with google
								</a>
							</div>

							<input
								className="my-1 px-4 py-3 text-[#8EA3AF] w-[80%] bg-[#2c2e30] rounded-lg duration-200 border-2 border-[#2c2e30] hover:border-b-[#8E8FFA] focus:border-b-[#8E8FFA] focus:outline-none appearance-none caret-[#8E8FFA]"
								type="text"
								name="userid"
								value={formData.userid}
								onChange={handleInputChange}
								placeholder="User ID"
								autoComplete="off"
								autoFocus
							/>
							<input
								className="my-1 px-4 py-3 text-[#8EA3AF] w-[80%] bg-[#2c2e30] rounded-lg duration-200 border-2 border-[#2c2e30] hover:border-b-[#8E8FFA] focus:border-b-[#8E8FFA] focus:outline-none appearance-none caret-[#8E8FFA]"
								type="password"
								name="password"
								value={formData.password}
								onChange={handleInputChange}
								placeholder="Password"
							/>
						</div>
					</div>

					{/* ============================================================= */}
					<div className="bottom-container flex grow relative">
						<div className="w-1/2 flex justify-end">
							<div className="w-[40%]">
								<button
									className="px-4 py-2 w-full rounded-l-full border-2 border-r-0 border-[#dbdbf6] text-[#dbdbf6] duration-200 hover:bg-[#dbdbf6] hover:text-black"
									onClick={toggleForm}
									type="button"
								>
									Login
								</button>
							</div>

							<div className="absolute bottom-0 left-0">
								<div className="h-full flex items-end justify-end">
									<div className="w-[200px] h-[200px] bg-[#8082f9] rounded-tr-full rounded-0"></div>
								</div>
							</div>
						</div>

						<div className="w-1/2 flex justify-start bg-[#18181B]">
							<div className="w-[40%]">
								<button
									className="px-4 py-2 w-full rounded-r-full border-2 border-l-0 border-[#8E8FFA] text-[#8E8FFA] duration-200 hover:bg-[#8E8FFA] hover:text-black"
									type="submit"
								>
									Submit
								</button>
							</div>

							<div className="ml-8">
								<div className="px-2 py-2 text-white text-center duration-200 hover:text-[#8082f9] focus-within:text-[#8082f9]">
									<a
										className="focus:outline-none"
										href={helpLink}
									>
										Need help?
									</a>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}

export default function Login() {
	const isMounted = useRef(true);
	const { authenticated, setAuthenticated } = useAuth();

	const [isLoginForm, setIsLoginForm] = useState(true);
	const [registered, setRegistered] = useState(false);
	const [googleAuth, setGoogleAuth] = useState("");
	const [formData, setFormData] = useState({
		userid: "",
		password: "",
	});

	const toggleForm = () => {
		setFormData({
			userid: "",
			password: "",
		});
		setIsLoginForm(!isLoginForm);
	};

	useEffect(() => {
		if (!isMounted.current) return;

		const getURL = async () => {
			const res = await fetch(API_BASE_URL + "api/auth/google/login");

			try {
				if (res.ok) {
					const { url } = await res.json();
					setGoogleAuth(url);
				} else {
					console.error("Failed to fetch Google Auth URL");
				}
			} catch (error) {
				console.error("Error fetching Goolge Auth URL: ", error);
			}
		};
		getURL();

		return () => {
			isMounted.current = false;
		};
	}, []);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleLoginSubmit = (e) => {
		e.preventDefault();
		const submitData = async () => {
			const res = await fetch(API_BASE_URL + "api/auth/manual/login", {
				method: "POST",
				body: JSON.stringify(formData),
				credentials: "include",
				headers: {
					"content-type": "application/json",
				},
			});

			if (res.ok) {
				const refRes = await fetch(API_BASE_URL + "api/auth/refresh", {
					method: "GET",
					credentials: "include",
				});

				if (refRes.ok) {
					toast.success("Successfully logged in!");
					setAuthenticated(true);
				}
			} else {
				toast.error(`Cannot login: ${res.statusText}`);
			}
		};

		submitData();
	};

	const handleRegisterSubmit = (e) => {
		e.preventDefault();
		const submitData = async () => {
			const res = await fetch(API_BASE_URL + "api/auth/manual/register", {
				method: "POST",
				body: JSON.stringify(formData),
				headers: {
					"content-type": "application/json",
				},
			});

			if (res.ok) {
				toast.success("Success! Login to continue");
				setRegistered(true);
			} else {
				toast.error(`Cannot register: ${res.statusText}`);
			}
		};

		submitData();
	};

	return (
		<>
			{/* if authenticated redirect */}
			{authenticated && <Navigate to={"/app"} replace />}

			{isLoginForm || registered ? (
				<LoginForm
					googleAuth={googleAuth}
					resetLink={""}
					toggleForm={toggleForm}
					handleInputChange={handleInputChange}
					handleSubmit={handleLoginSubmit}
					formData={formData}
				/>
			) : (
				<RegisterForm
					googleAuth={googleAuth}
					helpLink={""}
					toggleForm={toggleForm}
					handleInputChange={handleInputChange}
					handleSubmit={handleRegisterSubmit}
					formData={formData}
				/>
			)}
		</>
	);
}
