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
		onError: (error) => {
			queryClient.setQueryData("Login failed.", error.message);
		},
	});
};

const fetchUser = async () => {
	const response = await api.get("/user");

	return response.data;
};

export const useUser = () => {
	const queryClient = useQueryClient();
	return useQuery({
		queryKey: ["user"],
		queryFn: fetchUser,
		retry: false,
		staleTime: Infinity,
		cacheTime: Infinity,
		onError: (error) => {
			queryClient.setQueryData("Fetch user failed", error.message);
		},
	});
};
