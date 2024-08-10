import { useState, useEffect } from "react";

const useIsMobile = () => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkIfMobile = () => {
			const userAgent = navigator.userAgent.toLowerCase();
			const isMobileDevice = /android|iphone|ipad|ipod|windows phone|mobile/i.test(
				userAgent
			);
			setIsMobile(isMobileDevice);
		};

		checkIfMobile();

		const handleResize = () => {
			if (window.innerWidth < 768 || window.innerHeight < 500) {
				setIsMobile(true);
			} else {
				setIsMobile(false);
			}
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return isMobile;
};

export default useIsMobile;
