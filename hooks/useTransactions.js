import api from "../utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const createTransaction = async ({ recipientInfo, itemInfo }) => {
	const response = await api.post("/transactions", {
		recipientInfo,
		itemInfo,
	});
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
	const response = await api.delete(`/transactions/${transactionId}`);
	return response.data;
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
