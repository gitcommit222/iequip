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
import { useState } from "react";
import { useAddItem } from "../hooks/useItem";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import { addItemFormSchema } from "../lib/schema";
import Image from "next/image";

const AddItemForm = ({ data }) => {
	const [file, setFile] = useState("");

	const [openModal, setOpenModal] = useState(false);

	const {
		mutateAsync: addItemMutation,
		isSuccess: isAddItemSuccess,
		isPending: isAddItemPending,
	} = useAddItem();

	const formik = useFormik({
		initialValues: {
			itemName: data ? data : "",
			category: data ? data : 0,
			quantity: data ? data : 1,
			unit: data ? data : "Unit",
			itemCondition: data ? data : "",
			file: data ? data : "",
		},
		validationSchema: addItemFormSchema,
		onSubmit: async (
			{ itemName, category, quantity, unit, itemCondition, file },
			{ resetForm }
		) => {
			const itemLetters = itemName.substring(0, 3).toUpperCase();
			const randomNum =
				Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000;
			const barcode = `${itemLetters}${category}${randomNum}`;

			const itemData = {
				name: itemName,
				category,
				quantity,
				barcode,
				unit,
				item_condition: itemCondition,
			};

			console.log(itemName);

			if (!file) {
				console.error("No file selected");
				return;
			}

			try {
				await toast.promise(addItemMutation({ file, itemData }), {
					success: "Item added!",
					loading: "Adding item...",
					error: "Error adding item.",
				});

				resetForm();
				setFile("");
				setOpenModal(false);
			} catch (error) {
				console.error("Error adding item:", error.message);
			}
		},
	});

	const { handleSubmit, handleChange, values, errors, touched, setFieldValue } =
		formik;

	return (
		<>
			<Button color="success" size="md" onClick={() => setOpenModal(true)}>
				New Item
			</Button>
			<Modal
				show={openModal}
				onClose={() => setOpenModal(false)}
				className="p-10"
			>
				<Modal.Body>
					<h1 className="text-[28px] font-medium mb-4">ADD ITEM FORM</h1>
					<form className="space-y-4" onSubmit={handleSubmit}>
						<div>
							<div className="mb-2 block">
								<Label htmlFor="itemName" value="Item Name" />
							</div>
							<TextInput
								id="itemName"
								type="text"
								name="itemName"
								onChange={handleChange}
								value={values.itemName}
								color={`${
									errors.itemName && touched.itemName ? "failure" : "gray"
								}`}
								helperText={errors.itemName ? errors.itemName : ""}
							/>
						</div>
						<div className="flex gap-3">
							<div className="flex-1">
								<div className="mb-2 block">
									<Label htmlFor="categories" value="Category" />
								</div>
								<Select
									id="categories"
									name="category"
									onChange={handleChange}
									value={values.category}
									color={`${
										errors.category && touched.category ? "failure" : "gray"
									}`}
									helperText={errors.category ? errors.category : ""}
								>
									<option value={0}>Flood & Typhoon</option>
									<option value={1}>Tsunami</option>
									<option value={2}>Covid-19</option>
								</Select>
							</div>
							<div className="max-w-[180px] w-[180px]">
								<div className="mb-2 block">
									<Label htmlFor="itemCondition" value="Condition" />
								</div>
								<Select
									id="itemCondition"
									name="itemCondition"
									onChange={handleChange}
									value={values.itemCondition}
									color={`${
										errors.itemCondition && touched.itemCondition
											? "failure"
											: "gray"
									}`}
									helperText={errors.itemCondition ? errors.itemCondition : ""}
								>
									<option value="" disabled></option>
									<option value="Good">Good</option>
									<option value="Slightly Damaged">Slightly Damaged</option>
									<option value="Damaged">Damaged</option>
								</Select>
							</div>
						</div>
						<div className="flex gap-3">
							<div className="flex-1">
								<div className="mb-2 block">
									<Label htmlFor="unit" value="Unit" />
								</div>
								<Select
									id="unit"
									name="unit"
									onChange={handleChange}
									value={values.unit}
									color={`${errors.unit && touched.unit ? "failure" : "gray"}`}
									helperText={errors.unit ? errors.unit : ""}
								>
									<option value="Unit">Unit</option>
									<option value="Set">Set</option>
									<option value="Pcs">Pcs</option>
								</Select>
							</div>
							<div className="max-w-[180px] w-[180px]">
								<div className="mb-2 block">
									<Label htmlFor="quantity" value="Quantity" />
								</div>
								<TextInput
									id="quantity"
									name="quantity"
									onChange={handleChange}
									value={values.quantity}
									color={`${
										errors.quantity && touched.quantity ? "failure" : "gray"
									}`}
									helperText={errors.quantity ? errors.quantity : ""}
								/>
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
										id="dropzone-file"
										className="hidden"
										accept="image/*"
										onChange={(e) => {
											const fileImage = e.target.files?.[0];
											setFieldValue("file", fileImage);
											setFile(
												fileImage ? URL.createObjectURL(fileImage) : undefined
											);
										}}
										name="quantity"
										color={`${
											errors.file && touched.file ? "failure" : "gray"
										}`}
										helperText={errors.file ? errors.file : ""}
									/>
								</Label>
							</div>
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
								disabled={isAddItemPending}
							>
								{isAddItemPending ? (
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
