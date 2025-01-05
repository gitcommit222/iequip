"use client";
import {
	Label,
	TextInput,
	Select,
	FileInput,
	Button,
	Modal,
	Spinner,
} from "flowbite-react";
import { useEffect, useState } from "react";
import {
	useAddItem,
	useGetItemByBarcode,
	useItemImage,
	useUpdateItem,
} from "../hooks/useItem";
import toast from "react-hot-toast";
import { addItemFormSchema } from "../lib/schema";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { categoriesList } from "../lib/categories";
import { FaPlus } from "react-icons/fa";

const AddItemForm = ({
	data,
	className,
	btnTitle = "New Item",
	type = "add",
	itemId,
	datePurchase,
}) => {
	const [file, setFile] = useState("");

	const {
		data: imageBlob,
		isLoading,
		isError,
	} = useItemImage(data ? data.image_path : undefined);

	const imageUrl = imageBlob ? URL.createObjectURL(imageBlob) : "";

	const [openModal, setOpenModal] = useState(false);

	const {
		mutateAsync: addItemMutation,
		isSuccess: isAddItemSuccess,
		isPending: isAddItemPending,
	} = useAddItem();

	const { mutateAsync: updateItem } = useUpdateItem();

	const {
		register,
		handleSubmit,
		reset,
		setError,
		setValue,
		getValues,
		trigger,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: {
			itemName: data ? data?.name : "",
			category: data ? data.category : 0,
			itemCondition: data ? data.item_condition : "",
			file: data ? data.image_path : "",
			datePurchase: data ? data.date_purchase : "",
		},
		resolver: yupResolver(addItemFormSchema),
	});

	// Add this useEffect hook to update form values when data changes
	useEffect(() => {
		if (data) {
			setValue("itemName", data.name);
			setValue("category", data.category);
			setValue("file", data.image_path);
			setValue("datePurchase", data.date_purchase);
		}
	}, [data, setValue]);

	const onSubmit = async (data) => {
		const { itemName, category, itemCondition, file, datePurchase } = data;
		try {
			const itemData = {
				name: itemName,
				category,
				item_condition: itemCondition,
				unit: "pcs",
				quantity: 1,
				date_purchase: datePurchase,
			};

			if (type === "add") {
				if (!file) {
					console.error("No file selected");
					return;
				}

				const itemLetters = itemName.substring(0, 3).toUpperCase();
				const randomNum =
					Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000;
				const barcode = `${itemLetters}${category}${randomNum}`;
				itemData.barcode = barcode;

				try {
					await toast.promise(addItemMutation({ file, itemData }), {
						success: "Item added!",
						loading: "Adding item...",
						error: "Error adding item.",
					});
				} catch (error) {
					console.error("Error adding item:", error.message);
					return;
				}
			} else {
				try {
					const fileToUpdate = file instanceof File ? file : undefined;

					await toast.promise(
						updateItem({
							file: fileToUpdate,
							itemId,
							newItemData: itemData,
						}),
						{
							success: "Item updated!",
							loading: "Updating item...",
							error: "Error updating item.",
						}
					);
				} catch (error) {
					console.error("Error updating item:", error.message);
					return;
				}
			}

			reset();
			setFile("");
			setOpenModal(false);
		} catch (error) {
			setError("root", {
				message: "Invalid credentials",
			});
		}
	};

	const condition = getValues("itemCondition");

	useEffect(() => {
		if (condition !== "Good") trigger("itemCondition");
	}, [condition]);

	return (
		<>
			<button
				className={`${className} flex items-center gap-2`}
				onClick={() => setOpenModal(true)}
			>
				{type === "add" && <FaPlus />}
				{btnTitle}
			</button>
			<Modal
				show={openModal}
				onClose={() => setOpenModal(false)}
				className="p-10"
			>
				<Modal.Body className="hide-scrollbar">
					<h1 className="text-[28px] font-medium mb-4">
						{type === "add" ? "ADD ITEM FORM" : "EDIT ITEM FORM"}
					</h1>
					<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
						<div>
							<div className="mb-2 block">
								<Label htmlFor="itemName" value="Item Name" />
							</div>
							<TextInput
								{...register("itemName")}
								id="itemName"
								type="text"
								name="itemName"
								color={`${errors.itemName ? "failure" : "gray"}`}
								helperText={errors.itemName ? errors.itemName.message : ""}
							/>
						</div>
						<div className="flex gap-3">
							<div className="flex-1">
								<div className="mb-2 block">
									<Label htmlFor="categories" value="Category" />
								</div>
								<Select
									{...register("category")}
									id="categories"
									name="category"
									color={`${errors.category ? "failure" : "gray"}`}
									helperText={errors.category ? errors.category.name : ""}
								>
									{categoriesList.map((cat, i) => (
										<option key={i} value={i}>
											{cat}
										</option>
									))}
								</Select>
							</div>
						</div>
						<div className="flex gap-3">
							<div className="flex-1">
								<div className="mb-2 block">
									<Label htmlFor="itemCondition" value="Item Condition" />
								</div>
								<Select
									{...register("itemCondition")}
									id="itemCondition"
									name="itemCondition"
									color={`${errors.itemCondition ? "failure" : "gray"}`}
									helperText={
										errors.itemCondition ? errors.itemCondition.message : ""
									}
								>
									<option value="" disabled></option>
									<option value="Good">Good</option>
									<option value="Slightly Damaged">Slightly Damaged</option>
									<option value="Damaged">Damaged</option>
								</Select>
							</div>
						</div>
						<div className="space-y-1">
							<h3 className="text-[18px] font-medium text-gray-500 font-Montserrat mb-2">
								Item Image
							</h3>
							<div className="flex w-full items-center justify-center h-full">
								<Label
									htmlFor="dropzone-file"
									className="flex h-80 w-full cursor-pointer flex-col relative items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
								>
									<div className="flex flex-col items-center justify-center pb-6 pt-5 ">
										{file ? (
											<Image
												src={file}
												alt="selectedImage"
												fill
												className="object-contain"
											/>
										) : imageUrl ? (
											<Image
												src={imageUrl}
												alt="defaultImage"
												fill
												className="object-contain"
											/>
										) : (
											<>
												<svg
													className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
													aria-hidden="true"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 20 16"
												>
													<path
														stroke="currentColor"
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
													/>
												</svg>
												<p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
													<span className="font-semibold">Click to upload</span>{" "}
												</p>
												<p className="text-xs text-gray-500 dark:text-gray-400">
													SVG, PNG, JPG or GIF (MAX. 800x400px)
												</p>
											</>
										)}
									</div>
									<FileInput
										{...register("file")}
										id="dropzone-file"
										className="hidden"
										accept="image/*"
										onChange={(e) => {
											const fileImage = e.target.files?.[0];
											setValue("file", fileImage);
											setFile(
												fileImage ? URL.createObjectURL(fileImage) : undefined
											);
										}}
										name="quantity"
										color={`${errors.file ? "failure" : "gray"}`}
										helperText={errors.file ? errors.file.message : ""}
									/>
								</Label>
							</div>
						</div>
						<div>
							<div className="mb-2 block">
								<Label htmlFor="datePurchase" value="Date of Purchase" />
							</div>
							<TextInput
								{...register("datePurchase")}
								id="datePurchase"
								type="date"
								name="datePurchase"
								color={`${errors.datePurchase ? "failure" : "gray"}`}
								helperText={
									errors.datePurchase ? errors.datePurchase.message : ""
								}
							/>
						</div>
						<div className="flex gap-3">
							<Button
								onClick={() => setOpenModal(false)}
								color="gray"
								className="flex-1"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								color="success"
								className="text-white flex-1"
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									<Spinner aria-label="Default status example" />
								) : (
									"Submit"
								)}
							</Button>
						</div>
					</form>
				</Modal.Body>
			</Modal>
		</>
	);
};

export default AddItemForm;
