import api from "../utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const createSupplyTransaction = async (supplyTransactionData) => {
	const response = await api.post(
		"/supply-transactions",
		supplyTransactionData,
		{
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}
	);
	return response.data;
};

export const useCreateSupplyTransaction = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createSupplyTransaction,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["supplyTransactions"] });
			queryClient.invalidateQueries({ queryKey: ["goods"] });
		},
	});
};

const getSupplyTransactions = async () => {
	const response = await api.get("/supply-transactions");
	return response.data;
};

export const useGetSupplyTransactions = () => {
	return useQuery({
		queryKey: ["supplyTransactions"],
		queryFn: getSupplyTransactions,
	});
};

const getSupplyTransactionById = async (supplyTransactionId) => {
	const response = await api.get(`/supply-transactions/${supplyTransactionId}`);
	return response.data;
};

export const useGetSupplyTransactionById = (supplyTransactionId) => {
	return useQuery({
		queryKey: ["supplyTransaction", supplyTransactionId],
		queryFn: () => getSupplyTransactionById(supplyTransactionId),
		enabled: !!supplyTransactionId,
	});
};

const updateSupplyTransaction = async ({ supplyTransactionId, updateData }) => {
	const response = await api.put(
		`/supply-transactions/${supplyTransactionId}`,
		updateData
	);
	return response.data;
};

export const useUpdateSupplyTransaction = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateSupplyTransaction,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["supplyTransactions"] });
			queryClient.invalidateQueries({ queryKey: ["goods"] });
		},
	});
};

const deleteSupplyTransaction = async (supplyTransactionId) => {
	const response = await api.delete(
		`/supply-transactions/${supplyTransactionId}`
	);
	return response.data;
};

export const useDeleteSupplyTransaction = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteSupplyTransaction,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["supplyTransactions"] });
			queryClient.invalidateQueries({ queryKey: ["goods"] });
		},
	});
};
