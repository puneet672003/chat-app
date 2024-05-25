import { useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

import { API_BASE_URL } from "../../utils/constants";

export default function GoogleRegister() {
	const [registered, setRegistered] = useState(false);
	const [formData, setFormData] = useState({
		userid: "",
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const submitData = async () => {
			const res = await fetch(API_BASE_URL + "api/auth/google/register", {
				method: "POST",
				body: JSON.stringify(formData),
				credentials: "include",
				headers: {
					"content-type": "application/json",
				},
			});

			if (res.ok) {
				toast.success("Success! Login to continue");
				setRegistered(true);
			} else toast.error(`Cannot register: ${res.statusText}`);
		};

		submitData();
	};

	return (
		<>
			<div className="w-screen h-screen bg-[#7a7cf6] flex justify-center items-center">
				<div className="relative w-[70%] h-[80%] shadow-xl shadow-[#2b2b2b] bg-[#131217] flex flex-col justify-center items-center my-15 mx-10">
					<h1 className="my-5 font-poppins font-bold text-3xl text-center text-white ">
						CREATE YOUR USERNAME
					</h1>
					<form
						onSubmit={handleSubmit}
						className="w-full flex flex-col justify-center items-center"
					>
						<input
							className="mt-10 px-4 py-3 text-[#8EA3AF] w-[80%] bg-[#2c2e30] rounded-lg duration-200 border-2 border-[#2c2e30] hover:border-b-[#8E8FFA] focus:border-b-[#8E8FFA] focus:outline-none appearance-none caret-[#8E8FFA]"
							type="text"
							name="userid"
							value={formData.userid}
							onChange={handleInputChange}
							placeholder="User ID"
							autoComplete="off"
							autoFocus
						/>
						<button
							className="w-[80%] mt-5 px-4 py-2 rounded-full border-2  border-[#8E8FFA] text-[#8E8FFA] duration-200 hover:bg-[#8E8FFA] hover:text-black"
							type="submit"
						>
							Submit
						</button>
					</form>
				</div>
			</div>

			{registered && <Navigate to={"/login"} replace />}
		</>
	);
}
