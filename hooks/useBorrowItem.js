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
	item_qty,
	remarks,
}) => {
	const response = await api.post("/borrow/borrow-item", {
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
		item_qty,
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
		const response = await api.get("/borrow/");

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

const getBorrowedItemById = async (itemId) => {
	try {
		const response = await api.get(`/borrow/${itemId}`);

		return response.data;
	} catch (error) {
		console.log(error);
	}
};

export const useGetBorrowedItemById = (itemId) => {
	return useQuery({
		queryKey: ["borrowedItem", itemId],
		queryFn: () => getBorrowedItemById(itemId),
		enabled: !!itemId,
	});
};

const returnItem = async ({ newCondition, borrowItemId }) => {
	const response = await api.put(`/borrow/return/${borrowItemId}`, {
		newCondition,
	});

	return response.data;
};

export const useReturnItem = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: returnItem,
		onSuccess: () => {
			queryClient.invalidateQueries(["borrowedItems"]);
		},
	});
};
