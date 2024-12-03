import api from "../utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const getItems = async () => {
	const response = await api.get("/items/");

	return response.data;
};

export const useGetItems = () => {
	return useQuery({
		queryKey: ["items"],
		queryFn: getItems,
		onSuccess: (data) => {
			console.log(data.items);
		},
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
		enabled: !!imagePath, // Only run the query if imagePath is provided
	});
};

const addItem = async ({ file, itemData }) => {
	try {
		const formData = new FormData();
		if (file) {
			formData.append("image", file);
		} else {
			throw new Error("No file selected");
		}

		for (const key in itemData) {
			if (itemData.hasOwnProperty(key)) {
				formData.append(key, itemData[key]);
			}
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
			queryClient.invalidateQueries(["items"]);
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
			queryClient.invalidateQueries(["items"]);
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

const updateItem = async ({ itemId, newItemData }) => {
	try {
		const response = await api.put(`/items/update/${itemId}`, {
			newItemData,
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
