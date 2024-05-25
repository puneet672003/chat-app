import React from "react";
import Lottie from "react-lottie";
import animationData from "../../assets/loader.json"; // Replace with the actual path

import "./_loader.css";

export function RootContainer({ children }) {
	return (
		<div className="absolute z-10 left-[4%] w-full h-full">
			<div className="relative h-full w-[96%] rounded-md backdrop-blur-md bg-opacity-70 flex flex-col items-center">
				{children}
			</div>
		</div>
	);
}

export function Header({ children }) {
	return (
		<>
			<div className="bubble-shape absolute top-0 -z-10 w-full h-[20%] bg-[#242424] backdrop-blur-md bg-opacity-70 rounded-b-[100%] animate__animated animate__fadeIn"></div>
			<div className="h-[10%]"></div>
			<div className="profile mb-4 h-[20%] flex items-center justify-center overflow-hidden rounded-full animate__animated animate__fadeIn text-white">
				{children}
			</div>
		</>
	);
}

export function MainWrapper({ children }) {
	return (
		<div className="relative grow max-h-[70%] px-8 py-8 mb-4 w-[60%] bg-[#242424] backdrop-blur-md bg-opacity-70 rounded-3xl flex flex-col justify-between animate__animated animate__slideInUp animate__faster">
			{children}
		</div>
	);
}

export function Loading({
	height = "100%",
	width = "100%",
	paddingY = 0,
	paddingX = 0,
}) {
	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData: animationData,
	};

	return (
		<div className={`px-${paddingX} py-${paddingY}`}>
			<Lottie options={defaultOptions} height={height} width={width} />
		</div>
	);
}

export function TopWrapper({ children }) {
	return <div className="top-wrapper">{children}</div>;
}

export function BottomWrapper({ children }) {
	return (
		<div className="bottom-wrapper w-full flex flex-row justify-center">
			{children}
		</div>
	);
}
