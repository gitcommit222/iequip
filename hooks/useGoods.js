import api from "../utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const getGoods = async () => {
	const response = await api.get("/goods");
	return response.data;
};

export const useGetGoods = () => {
	return useQuery({
		queryKey: ["goods"],
		queryFn: getGoods,
	});
};

const getGoodsById = async (id) => {
	const response = await api.get(`/goods/id/${id}`);
	return response.data;
};

export const useGetGoodsById = (id) => {
	return useQuery({
		queryKey: ["goods", id],
		queryFn: () => getGoodsById(id),
		enabled: !!id,
	});
};

const getGoodsZeroQuantity = async () => {
	const response = await api.get("/goods/goods-zero-quantity");
	return response.data;
};

export const useGetGoodsZeroQuantity = () => {
	return useQuery({
		queryKey: ["goodsZeroQuantity"],
		queryFn: getGoodsZeroQuantity,
	});
};

const createGoods = async (goodsData) => {
	const formData = new FormData();
	for (const key in goodsData) {
		if (key === "file" && goodsData[key][0]) {
			formData.append("file", goodsData[key][0]);
		} else {
			formData.append(key, goodsData[key]);
		}
	}
	const response = await api.post("/goods", formData, {
		headers: { "Content-Type": "multipart/form-data" },
	});
	return response.data;
};

export const useCreateGoods = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createGoods,
		onSuccess: () => {
			queryClient.invalidateQueries(["goods"]);
		},
		onError: (error) => {
			if (
				error.response &&
				error.response.data &&
				error.response.data.message
			) {
				throw new Error(error.response.data.message);
			}
			throw new Error("An unexpected error occurred while creating goods.");
		},
	});
};

const updateGoods = async ({ id, updatedData }) => {
	const formData = new FormData();
	for (const key in updatedData) {
		if (key === "file" && updatedData[key]) {
			formData.append("file", updatedData[key]);
		} else {
			formData.append(key, updatedData[key]);
		}
	}
	const response = await api.put(`/goods/id/${id}`, formData, {
		headers: { "Content-Type": "multipart/form-data" },
	});
	return response.data;
};

export const useUpdateGoods = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateGoods,
		onSuccess: () => {
			queryClient.invalidateQueries(["goods"]);
		},
		onError: (error) => {
			if (
				error.response &&
				error.response.data &&
				error.response.data.message
			) {
				throw new Error(error.response.data.message);
			}
			throw new Error("An unexpected error occurred while updating goods.");
		},
	});
};

const deleteGoods = async (id) => {
	const response = await api.delete(`/goods/id/${id}`);
	return response.data;
};

export const useDeleteGoods = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteGoods,
		onSuccess: () => {
			queryClient.invalidateQueries(["goods"]);
		},
		onError: (error) => {
			if (
				error.response &&
				error.response.data &&
				error.response.data.message
			) {
				throw new Error(error.response.data.message);
			}
			throw new Error("An unexpected error occurred while deleting goods.");
		},
	});
};
