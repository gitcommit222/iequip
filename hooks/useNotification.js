import api from "../utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const getNotifications = async () => {
	const response = await api.get("/notification/");

	return response.data;
};

export const useGetNotifications = () => {
	return useQuery({
		queryKey: ["notifs"],
		queryFn: getNotifications,
	});
};

const deleteNotif = async (id) => {
	const response = await api.delete(`/notification/${id}`);

	return response.data;
};

export const useDeleteNotif = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteNotif,
		onSuccess: () => queryClient.invalidateQueries(["notifs"]),
	});
};
