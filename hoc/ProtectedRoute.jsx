"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../components/loader/Loader";
import { useUser } from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
	const { data: user, isLoading, isError, error } = useUser();
	const router = useRouter();
	const [isHydrated, setIsHydrated] = useState(false);

	useEffect(() => {
		// Prevent React hydration issues
		setIsHydrated(true);
	}, []);

	useEffect(() => {
		// Redirect to sign-in if no user and not loading
		if (!isLoading && !user) {
			router.push("/sign-in");
		}
	}, [user, isLoading, isError, error, router]);

	// Show a loader while the user data is loading or still hydrating
	if (!isHydrated || isLoading) {
		return <Loader />;
	}

	if (!user) {
		return <Loader />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
