import api from "../utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const borrowItem = async ({
	name,
	email,
	age,
	contact_number,
	department,
	address,
	item_id,
	end_date,
	tested_by,
	remarks,
}) => {
	const response = await api.post("/items/borrow", {
		name,
		email,
		age,
		contact_number,
		department,
		address,
		item_id,
		end_date,
		tested_by,
		remarks,
	});

	return response.data;
};

export const useBorrowItem = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: borrowItem,
		onSuccess: () => {
			queryClient.invalidateQueries(["borrowedItems"]);
		},
		onError: (error) => {
			if (
				error.response &&
				error.response.data &&
				error.response.data.message
			) {
				throw new Error(error.response.data.message);
			}
			throw new Error("An unexpected error occurred.");
		},
	});
};

const fetchBorrowedItems = async () => {
	try {
		const response = await api.get("/items/borrowed-items");

		return response.data;
	} catch (error) {
		console.log(error);
	}
};

export const useFetchBorrowedItems = () => {
	return useQuery({
		queryKey: ["borrowedItems"],
		queryFn: fetchBorrowedItems,
	});
};
