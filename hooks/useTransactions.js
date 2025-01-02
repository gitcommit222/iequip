import api from "../utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const createTransaction = async ({
	recipientInfo,
	itemList,
	end_date,
	tested_by,
	proof_image,
	returned_condition,
}) => {
	// Added returned_condition
	const formData = new FormData();
	formData.append("recipientInfo", JSON.stringify(recipientInfo));
	formData.append("itemList", JSON.stringify(itemList));
	formData.append("end_date", end_date);
	formData.append("tested_by", tested_by);
	formData.append("returned_condition", returned_condition); // Added returned_condition

	if (proof_image) {
		formData.append("file", proof_image);
	}

	const response = await api.post("/transactions", formData);
	return response.data;
};

export const useCreateTransaction = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createTransaction,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
		},
	});
};

const returnBorrowedItems = async ({
	transactionId,
	returnedCondition,
	returnedQuantity,
	remarks,
}) => {
	const response = await api.post("/transactions/return", {
		transactionId,
		returnedCondition,
		returnedQuantity,
		remarks,
	});
	return response.data;
};

export const useReturnBorrowedItems = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: returnBorrowedItems,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
		},
	});
};

const getTransactions = async () => {
	const response = await api.get("/transactions");
	return response.data;
};

export const useGetTransactions = () => {
	return useQuery({
		queryKey: ["transactions"],
		queryFn: getTransactions,
	});
};

const getTransactionsByCategory = async (category) => {
	const response = await api.get(`/transactions/${category}`);
	return response.data;
};

export const useGetTransactionsByCategory = (category) => {
	return useQuery({
		queryKey: ["transactions", category],
		queryFn: () => getTransactionsByCategory(category),
		enabled: !!category,
	});
};

const getTransactionById = async (transactionId) => {
	const response = await api.get(`/transactions/id/${transactionId}`);
	return response.data;
};

export const useGetTransactionById = (transactionId) => {
	return useQuery({
		queryKey: ["transaction", transactionId],
		queryFn: () => getTransactionById(transactionId),
		enabled: !!transactionId,
	});
};

const deleteTransaction = async (transactionId) => {
	try {
		const response = await api.delete(`/transactions/${transactionId}`);
		return response.data;
	} catch (error) {
		// Handle errors based on the response from the server
		if (error.response) {
			// The request was made and the server responded with a status code
			console.error("Error:", error.response.data.error);
			throw new Error(error.response.data.error); // Rethrow the error for further handling
		} else if (error.request) {
			// The request was made but no response was received
			console.error("Error: No response received");
			throw new Error("No response received from the server");
		} else {
			// Something happened in setting up the request that triggered an Error
			console.error("Error:", error.message);
			throw new Error(error.message);
		}
	}
};

export const useDeleteTransaction = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteTransaction,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
		},
	});
};
