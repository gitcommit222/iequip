import api from "../utils/api";
import { useQuery } from "@tanstack/react-query";

const fetchRecipients = async () => {
	const response = await api.get("/recipients");
	if (!response.ok) {
		throw new Error("Failed to fetch recipients");
	}
	return response.data;
};

export const useRecipients = () => {
	return useQuery({
		queryKey: ["recipients"],
		queryFn: fetchRecipients,
	});
};
