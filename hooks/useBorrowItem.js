import api from "../utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const borrowItem = async (submissionData) => {
	try {
		const response = await api.post("/borrow/borrow-item", submissionData);

		return response.data;
	} catch (error) {
		if (error.response) {
			throw new Error(error.response.data.message || "Login failed");
		} else if (error.request) {
			throw new Error("No response from server");
		} else {
			throw new Error("Error in login request: " + error.message);
		}
	}
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
