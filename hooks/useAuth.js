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
		onSuccess: (data) => {
			queryClient.setQueryData(["user"], data.user);
			localStorage.setItem("token", data.token);
		},
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

const logoutUser = async () => {
	const response = await api.post("/users/logout");

	return response.data;
};

export const useLogout = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: logoutUser,
		onSuccess: () => {
			localStorage.removeItem("token");
			queryClient.setQueryData(["user"], null);
		},
	});
};

const fetchUsers = async () => {
	const response = await api.get("/users/users");

	return response.data;
};

export const useUsers = () => {
	return useQuery({
		queryKey: ["users"],
		queryFn: fetchUsers,
	});
};

const fetchUserById = async (id) => {
	const response = await api.get(`/users/users/${id}`);

	return response.data;
};

export const useUserById = (id) => {
	return useQuery({
		queryKey: ["user", id],
		queryFn: () => fetchUserById(id),
	});
};

const changePassword = async ({ userId, currentPassword, newPassword }) => {
	const response = await api.put(`/users/change-password/${userId}`, {
		currentPassword,
		newPassword,
	});

	return response.data;
};

export const useChangePassword = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: changePassword,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
	});
};

const updateUser = async ({ userId, name, email }) => {
	const response = await api.put(`/users/update/${userId}`, { name, email });

	return response.data;
};

export const useUpdateUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
	});
};

const deleteUser = async (userId) => {
	const response = await api.get(`/users/remove/${userId}`);

	return response.data;
};

export const useDeleteUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});
};

const registerUser = async ({ name, email, password }) => {
	const response = await api.post("/users/register", { name, email, password });

	return response.data;
};

export const useRegisterUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: registerUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});
};

const fetchLogs = async (userId) => {
	const response = await api.get(`/users/logs/${userId}`);

	return response.data;
};

export const useLogs = (userId) => {
	return useQuery({
		queryKey: ["logs", userId],
		queryFn: () => fetchLogs(userId),
		enabled: !!userId,
	});
};
