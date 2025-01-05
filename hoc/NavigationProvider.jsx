"use client";

import { useLoading } from "../hooks/ui/useLoading";
import LoadingScreen from "../components/animations/LoadingScreen";

export default function NavigationProvider({ children }) {
	const isLoading = useLoading();

	return (
		<>
			{isLoading && <LoadingScreen />}
			{children}
		</>
	);
}
