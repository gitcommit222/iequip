"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "../hooks/useAuth";
import toast from "react-hot-toast";
import Loader from "../components/loader/Loader";

const ProtectedRoute = ({ children }) => {
	const { data: user, isLoading, error, isError } = useUser();
	const router = useRouter();

	useEffect(() => {
		if (!user && !isLoading) {
			router.push("/sign-in");
		}
		if (isError) {
			toast.error("Session expired, please sign-in.");
		}
	});

	// Show loader while checking authentication state
	if (!user && !isLoading) {
		return <Loader />;
	}

	// Render the protected content
	return <>{children}</>;
};

export default ProtectedRoute;
