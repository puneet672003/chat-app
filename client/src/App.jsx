import { Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import Login from "./tabs/Auth/Login";
import Home from "./tabs/App/Home";
import GoogleRegister from "./tabs/Auth/Google";
import Notification from "./components/Notification";
import MobileWarning from "./components/MobileWarning";
import { Loading } from "./tabs/_layout";

import useIsMobile from "./hooks/useMobile";
import { useAuth } from "./context/AuthContext";
import { API_BASE_URL } from "./utils/constants";

export default function App() {
	const isMounted = useRef(true);
	const isMobile = useIsMobile();
	const { authenticated, setAuthenticated } = useAuth();

	const [loading, setLoading] = useState(true);

	const checkAuthentication = async () => {
		if (!isMounted.current) return;

		try {
			const res = await fetch(API_BASE_URL + "hello", {
				credentials: "include",
			});

			if (res.ok) {
				setAuthenticated(true);
			} else {
				const refreshRes = await fetch(
					API_BASE_URL + "api/auth/refresh",
					{
						credentials: "include",
					}
				);

				if (refreshRes.ok) setAuthenticated(true);
				else setAuthenticated(false);
			}
		} catch (error) {
			console.error("Error authenticating: ", error);
			setAuthenticated(false);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		checkAuthentication();

		return () => {
			isMounted.current = false;
		};
	});

	if (isMobile) {
		return <MobileWarning />;
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center w-screen h-screen max-h-screen bg-[#131217]">
				<Loading />
			</div>
		);
	}

	return (
		<>
			<Notification />
			<Routes>
				<Route path="login" element={<Login />} />
				<Route path="app/*">
					<Route index element={<Home />} />
				</Route>
				<Route path="google/*">
					<Route path="register" element={<GoogleRegister />} />
				</Route>
				<Route
					path="/"
					element={
						authenticated ? (
							<Navigate to={"/app"} />
						) : (
							<Navigate to={"/login"} />
						)
					}
				/>
			</Routes>
		</>
	);
}
