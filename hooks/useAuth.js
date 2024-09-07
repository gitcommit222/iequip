import api from "../utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const loginUser = async ({ email, password }) => {
	const response = await api.post("/users/auth", { email, password });

	return response.data;
};

export const useLogin = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: loginUser,
		onSuccess: (data) => queryClient.setQueryData(["user"], data.user),
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

const logoutUser = async () => {
	const response = await api.post("/users/logout");

	return response.data;
};

export const useLogout = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: logoutUser,
		onSuccess: () => {
			queryClient.removeQueries(["user"]);
		},
	});
};
