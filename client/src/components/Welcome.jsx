import React from "react";
import Lottie from "react-lottie";
import animationData from "../../assets/welcome.json"; // Replace with the actual path

function Welcome({}) {
	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData: animationData,
	};

	return (
		<div>
			<Lottie options={defaultOptions} height={400} width={400} />
		</div>
	);
}

export default Welcome;
