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
