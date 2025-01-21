"use client";
import {
	Label,
	TextInput,
	Select,
	Button,
	Modal,
	Spinner,
	FileInput,
	Datepicker,
} from "flowbite-react";
import { useState, useEffect } from "react";
import { useCreateGoods, useUpdateGoods } from "../hooks/useGoods";
import toast from "react-hot-toast";
import { addSupplyFormSchema } from "../lib/schema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaPlus } from "react-icons/fa";
import { supplyCategories, supplyUnits } from "../lib/supplyCategory";
import Image from "next/image";

const AddSupplyForm = ({
	data,
	className,
	btnTitle = "New Supply",
	type = "add",
	goodsId,
}) => {
	const [openModal, setOpenModal] = useState(false);
	const [previewUrl, setPreviewUrl] = useState(data?.image_path || "");

	// Add this useEffect to ensure the file state always has a valid URL
	useEffect(() => {
		if (data?.image_path) {
			setPreviewUrl(ensureValidImageUrl(data.image_path));
		}
	}, [data]);

	const { mutateAsync: createGoods, isPending: isCreateGoodsPending } =
		useCreateGoods();

	const { mutateAsync: updateGoods, isPending: isUpdateGoodsPending } =
		useUpdateGoods();

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: {
			item_name: data ? data?.item_name : "",
			description: data ? data.description : "",
			quantity_available: data ? data.quantity_available : 0,
			quantity_distributed: data ? data.quantity_distributed : 0,
			unit: data ? data.unit : "",
			remarks: data ? data.remarks : "",
			category: data ? data.category : "",
			file: data ? data.image_path : "",
			expiration_date: data ? data.expiration_date : "",
			purchase_date: data ? data.purchase_date : "",
		},
		resolver: yupResolver(addSupplyFormSchema),
	});

	const onSubmit = async (formData) => {
		try {
			if (type === "add") {
				await toast.promise(createGoods(formData), {
					success: "Supply added!",
					loading: "Adding supply...",
					error: "Error adding supply.",
				});
			} else {
				await toast.promise(
					updateGoods({ id: goodsId, updatedData: formData }),
					{
						success: "Supply updated!",
						loading: "Updating supply...",
						error: "Error updating supply.",
					}
				);
			}
			reset();
			setOpenModal(false);
			setPreviewUrl(""); // Reset the preview URL
		} catch (error) {
			console.error("Error adding/updating supply:", error.message);
		}
	};

	// Add this function to ensure the image URL is valid
	const ensureValidImageUrl = (url) => {
		if (!url) return "";
		if (url.startsWith("http://") || url.startsWith("https://")) return url;
		return url.startsWith("/") ? url : `/${url}`;
	};

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
						{type === "add" ? "ADD SUPPLY FORM" : "EDIT SUPPLY FORM"}
					</h1>
					<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
						<div>
							<div className="mb-2 block">
								<Label htmlFor="item_name" value="Supply Name" />
							</div>
							<TextInput
								{...register("item_name")}
								id="item_name"
								type="text"
								name="item_name"
								color={`${errors.item_name ? "failure" : "gray"}`}
								helperText={errors.item_name ? errors.item_name.message : ""}
							/>
						</div>
						<div>
							<div className="mb-2 block">
								<Label htmlFor="description" value="Description" />
							</div>
							<TextInput
								{...register("description")}
								id="description"
								type="text"
								name="description"
								color={`${errors.description ? "failure" : "gray"}`}
								helperText={
									errors.description ? errors.description.message : ""
								}
							/>
						</div>
						<div className="flex gap-4">
							<div className="flex-1">
								<div className="mb-2 block">
									<Label
										htmlFor="quantity_available"
										value="Available Quantity"
									/>
								</div>
								<TextInput
									{...register("quantity_available")}
									id="quantity_available"
									type="number"
									name="quantity_available"
									color={`${errors.quantity_available ? "failure" : "gray"}`}
									helperText={
										errors.quantity_available
											? errors.quantity_available.message
											: ""
									}
								/>
							</div>
							<div className="flex-1">
								<div className="mb-2 block">
									<Label htmlFor="unit" value="Unit" />
								</div>
								<Select
									{...register("unit")}
									id="unit"
									name="unit"
									color={`${errors.unit ? "failure" : "gray"}`}
									helperText={errors.unit ? errors.unit.message : ""}
								>
									<option value="">Select a unit</option>
									{supplyUnits.map((unit) => (
										<option key={unit} value={unit}>
											{unit}
										</option>
									))}
								</Select>
							</div>
						</div>
						<div>
							<div className="mb-2 block">
								<Label htmlFor="remarks" value="Remarks" />
							</div>
							<TextInput
								{...register("remarks")}
								id="remarks"
								type="text"
								name="remarks"
								color={`${errors.remarks ? "failure" : "gray"}`}
								helperText={errors.remarks ? errors.remarks.message : ""}
							/>
						</div>
						<div>
							<div className="mb-2 block">
								<Label htmlFor="category" value="Category" />
							</div>
							<Select
								{...register("category")}
								id="category"
								name="category"
								color={`${errors.category ? "failure" : "gray"}`}
								helperText={errors.category ? errors.category.message : ""}
							>
								<option value="">Select a category</option>
								{supplyCategories.map((category, i) => (
									<option key={category} value={i}>
										{category}
									</option>
								))}
							</Select>
						</div>
						<div>
							<div className="mb-2 block">
								<Label htmlFor="expiration_date" value="Expiration Date" />
								<input
									{...register("expiration_date")}
									id="expiration_date"
									name="expiration_date"
									type="date"
								/>
							</div>
						</div>
						<div>
							<div className="mb-2 block">
								<Label htmlFor="purchase_date" value="Purchase Date" />
								<input
									{...register("purchase_date")}
									id="purchase_date"
									name="purchase_date"
									type="date"
								/>
							</div>
						</div>
						<div className="space-y-1">
							<h3 className="text-[18px] font-medium text-gray-500 font-Montserrat mb-2">
								Supply Image
							</h3>
							<div className="flex w-full items-center justify-center h-full">
								<Label
									htmlFor="dropzone-file"
									className="flex h-80 w-full cursor-pointer flex-col relative items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
								>
									<div className="flex flex-col items-center justify-center pb-6 pt-5 ">
										{previewUrl ? (
											<Image
												src={previewUrl}
												alt="selectedImage"
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
											if (fileImage) {
												const url = URL.createObjectURL(fileImage);
												setPreviewUrl(url);
											} else {
												setPreviewUrl("");
											}
										}}
										color={`${errors.file ? "failure" : "gray"}`}
										helperText={errors.file ? errors.file.message : ""}
									/>
								</Label>
							</div>
						</div>
						<div className="flex gap-3">
							<Button
								type="submit"
								color="success"
								className="text-white flex-1"
								disabled={
									isSubmitting || isCreateGoodsPending || isUpdateGoodsPending
								}
							>
								{isSubmitting ||
								isCreateGoodsPending ||
								isUpdateGoodsPending ? (
									<Spinner aria-label="Default status example" />
								) : type === "add" ? (
									"Add Supply"
								) : (
									"Update Supply"
								)}
							</Button>
							<Button
								onClick={() => setOpenModal(false)}
								color="gray"
								className="flex-1"
							>
								Cancel
							</Button>
						</div>
					</form>
				</Modal.Body>
			</Modal>
		</>
	);
};

export default AddSupplyForm;
