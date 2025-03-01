import api from "../utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const getItems = async (cursor) => {
	const response = await api.get(`items?limit=10&cursor=${cursor}`);

	return response.data;
};

export const useGetItems = (cursor) => {
	return useQuery({
		queryKey: ["items", cursor],
		queryFn: () => getItems(cursor),
		onSuccess: (data) => {
			console.log(data.items);
		},
		enabled: cursor !== undefined,
	});
};

const getAllItems = async () => {
	const response = await api.get(`/items?limit=1000&cursor=null`);
	return response.data;
};

export const useGetAllItems = () => {
	return useQuery({
		queryKey: ["allItems"],
		queryFn: getAllItems,
		retry: false,
	});
};

const getItemImage = async (filename) => {
	const response = await api.get(`/items/images/${filename}`, {
		responseType: "blob",
	});
	return response.data;
};

export const useItemImage = (imagePath) => {
	return useQuery({
		queryKey: ["itemImage", imagePath],
		queryFn: () => getItemImage(imagePath),
		enabled: !!imagePath,
		staleTime: 1000 * 60 * 60 * 24,
		retry: false,
	});
};

const addItem = async ({ file, itemData }) => {
	try {
		const formData = new FormData();
		if (file) {
			formData.append("item_picture", file);
		} else {
			throw new Error("No file selected");
		}

		for (const key in itemData) {
			if (itemData.hasOwnProperty(key)) {
				formData.append(key, itemData[key]);
			}
		}

		for (const [key, value] of formData.entries()) {
			console.log(`${key}:`, value);
		}

		const response = await api.post("/items/", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		return response.data;
	} catch (error) {
		console.error("Detailed error:", error);
		throw new Error(error.response?.data?.message || "Error uploading item");
	}
};

export const useAddItem = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: addItem,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["items", "allItems"] });
		},
		onError: (error) => {
			console.error("Upload failed:", error);
		},
	});
};

const deleteItem = async (itemId) => {
	const response = await api.delete(`/items/${itemId}`);

	return response.data;
};

export const useDeleteItems = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteItem,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["items", "allItems"] });
		},
		onError: (error) => {
			console.error("Upload failed:", error);
		},
	});
};

const getItemByBarcode = async (barcode) => {
	try {
		const response = await api.get(`/items/barcode/${barcode}`);
		return response.data;
	} catch (error) {
		if (error.response && error.response.data && error.response.data.message) {
			throw new Error(error.response.data.message);
		}
		throw new Error("An unexpected error occurred.");
	}
};

export const useGetItemByBarcode = (barcode) => {
	return useQuery({
		queryKey: ["item", barcode],
		queryFn: () => getItemByBarcode(barcode),
		enabled: !!barcode,
	});
};

const updateItem = async ({ file, itemId, newItemData }) => {
	try {
		const formData = new FormData();
		if (file) {
			formData.append("item_picture", file);
		}
		for (const key in newItemData) {
			if (newItemData.hasOwnProperty(key)) {
				formData.append(key, newItemData[key]);
			}
		}

		const response = await api.put(`/items/update/${itemId}`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		return response.data;
	} catch (error) {
		if (error.response && error.response.data && error.response.data.message) {
			throw new Error(error.response.data.message);
		}
		throw new Error("An unexpected error occurred.");
	}
};

export const useUpdateItem = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateItem,
		onSuccess: () => {
			queryClient.invalidateQueries(["items"]);
		},
	});
};

const bulkCreateItems = async (file) => {
	const formData = new FormData();

	formData.append("file", file);
	try {
		const response = await api.post("/items/bulk/create", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	} catch (error) {
		if (error.response && error.response.data && error.response.data.message) {
			throw new Error(error.response.data.message);
		}
		throw new Error("An unexpected error occurred.");
	}
};

export const useBulkCreateItems = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: bulkCreateItems,
		onSuccess: () => {
			queryClient.invalidateQueries(["items"]);
		},
	});
};
