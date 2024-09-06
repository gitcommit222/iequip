"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "../hooks/useAuth";
import toast from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
	const { data: user, isLoading, error, isError } = useUser();
	// const [initialLoading, setInitialLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		if (!user && !isLoading) {
			router.push("/sign-in");
		}
		if (isError) {
			toast.error(error.message);
		}
	});

	// Show loader while checking authentication state
	if (!user && !isLoading) {
		return <p>Loading...</p>;
	}

	// Render the protected content
	return <>{children}</>;
};

export default ProtectedRoute;
