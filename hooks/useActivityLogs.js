import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

const getActivityLogs = async () => {
	const response = await api.get("/activity/log");
	return response.data;
};

export const useActivityLogs = () => {
	return useQuery({
		queryKey: ["activity-logs"],
		queryFn: getActivityLogs,
	});
};
