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
			toast.error("Please sign-in.");
		}
	});

	if (!user && !isLoading) {
		return <Loader />;
	}

	return <>{user && children}</>;
};

export default ProtectedRoute;
