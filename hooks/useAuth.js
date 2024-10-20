import api from "../utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const loginUser = async ({ email, password }) => {
	try {
		const response = await api.post("/users/auth", { email, password });

		return response.data;
	} catch (error) {
		if (error.response && error.response.data && error.response.data.message) {
			throw new Error(error.response.data.message);
		}
		throw new Error("An unexpected error occurred.");
	}
};

export const useLogin = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: loginUser,
		onSuccess: (data) => queryClient.setQueryData(["user"], data.user),
		onError: () => {},
	});
};

const fetchUser = async () => {
	const response = await api.get("/users/me");

	return response.data;
};

export const useUser = () => {
	return useQuery({
		queryKey: ["user"],
		queryFn: fetchUser,
		retry: false,
		staleTime: Infinity,
		cacheTime: Infinity,
	});
};

const logoutUser = () => {
	localStorage.removeItem("token");
};

export const useLogout = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: logoutUser,
		onSuccess: () => {
			queryClient.setQueryData(["user"], null);
		},
	});
};
