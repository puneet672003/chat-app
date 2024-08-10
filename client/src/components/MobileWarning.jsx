import React from "react";
import Welcome from "./Welcome";

const MobileWarning = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-[#131313] p-4 text-white relative overflow-hidden">
			<div className="absolute top-0 left-0 w-[200px] h-[200px] bg-[#7080FD] rounded-full blur-xl opacity-50"></div>
			<div className="absolute bottom-0 right-0 w-[100px] h-[100px] bg-[#7080FD] rounded-full blur-3xl opacity-50"></div>
			<div className="relative z-10 bg-[#1a1a1a] p-8 rounded-lg shadow-lg text-center bg-opacity-80 backdrop-blur-md">
				<Welcome />
				<p className="text-xl">
					This website is best viewed on a larger screen. Please
					switch to a tablet or desktop for the best experience.
				</p>
			</div>
			<div className="absolute top-[30%] right-[15%] w-[150px] h-[150px] bg-[#7080FD] rounded-full blur-lg opacity-70"></div>
			<div className="absolute bottom-[20%] left-[10%] w-[100px] h-[100px] bg-[#7080FD] rounded-full blur-lg opacity-60"></div>
		</div>
	);
};

export default MobileWarning;
