// hooks/useLoading.ts
"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function useLoading() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const handleStart = () => setIsLoading(true);
		const handleComplete = () => setIsLoading(false);

		window.addEventListener("beforeunload", handleStart);
		window.addEventListener("load", handleComplete);

		return () => {
			window.removeEventListener("beforeunload", handleStart);
			window.removeEventListener("load", handleComplete);
		};
	}, []);

	// Reset loading state when route changes
	useEffect(() => {
		setIsLoading(false);
	}, [pathname, searchParams]);

	return isLoading;
}
