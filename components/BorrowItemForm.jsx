"use client";
import { Button, Datepicker, Label, Modal, TextInput } from "flowbite-react";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { BorrowItemSchema } from "../lib/schema";
import ItemImage from "../components/ItemImage";

import { useGetItemByBarcode } from "../hooks/useItem";
import { useBorrowItem } from "../hooks/useBorrowItem";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { categoriesList } from "../lib/categories";
import { FaCheckCircle } from "react-icons/fa";
import { FaMinusCircle } from "react-icons/fa";
import { FaCircleExclamation } from "react-icons/fa6";
import toast from "react-hot-toast";

const BorrowItemForm = ({ data }) => {
	const [openModal, setOpenModal] = useState(false);

	const formik = useFormik({
		initialValues: {
			fullName: data ? data.fullName : "",
			email: data ? data.email : "",
			age: data ? data.age : 18,
			contactNumber: data ? data.contactNumber : "",
			fullAddress: data ? data.address : "",
			department: data ? data.department : "",
			itemBarcode: data ? data.barcode : "",
			testedBy: data ? data.testedBy : "",
			returnDate: data ? new Date(data.end_date) : new Date(),
		},
		resolver: yupResolver(BorrowItemSchema),
	});

	const { values, errors, touched, handleChange, handleSubmit, setFieldValue } =
		formik;

	console.log(new Date(values.returnDate));

	const handleBarcodeChange = useCallback(
		debounce((value) => {
			setFieldValue("itemBarcode", value);
		}, 300),
		[values.itemBarcode]
	);

	const {
		data: itemWithBarcode,
		isLoading: isItemLoading,
		isError: isItemError,
		error: itemError,
	} = useGetItemByBarcode(barcode.length >= 11 ? barcode : null);

	const handleSelectedDate = (date) => {
		setValue("returnDate", new Date(date).toISOString().split("T")[0]);
	};

	console.log(getValues().returnDate);

	const onSubmit = async (data) => {
		const {
			fullName,
			email,
			age,
			contactNumber,
			department,
			fullAddress,
			testedBy,
			returnDate,
		} = data;
		try {
			await toast.promise(
				borrowItemMutation({
					name: fullName,
					email,
					age,
					contact_number: contactNumber,
					department,
					address: fullAddress,
					item_id: itemWithBarcode?.item.id,
					end_date: returnDate,
					tested_by: testedBy,
				}),
				{
					success: "Borrow Success!",
					loading: "Loading...",
					error: "Something went wrong.",
				}
			);

			reset();
			setBarcode("");
			setOpenModal(false);
		} catch (error) {
			setError("root", {
				message: "Invalid Inputs",
			});
		}
	};

	return (
		<>
			<Button color="success" onClick={() => setOpenModal(true)}>
				Borrow
			</Button>
			<Modal show={openModal} onClose={() => setOpenModal(false)} popup>
				<Modal.Body className="hide-scrollbar">
					<div className="w-full py-4">
						<div className="mb-4">
							<h1 className="font-semibold text-[25px]">Borrow Item Form</h1>
							<p className="text-gray-700]">
								Fill in the fields to complete the borrow request.
							</p>
						</div>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div>
								<div className="flex-1 space-y-3 mb-5">
									<h1 className="form-header">Borrowers Info</h1>
									<div className="field-container flex gap-3">
										<div className="flex-1">
											<div className="mb-1 block">
												<Label
													htmlFor="borrowerName"
													value="Borrowers Full Name"
												/>
											</div>
											<TextInput
												{...register("fullName")}
												id="borrowerName"
												name="fullName"
												type="text"
												placeholder="e.g. Juan Dela Cruz"
												onChange={(e) =>
													setFieldValue("fullName", e.target.value)
												}
												value={values.fullName}
												color={`${
													errors.fullName && touched.fullName
														? "failure"
														: "gray"
												}`}
												helperText={errors.fullName ? errors.fullName : ""}
											/>
										</div>
										<div className="min-w-[85px]">
											<div className="mb-1 block">
												<Label htmlFor="borrowerAge" value="Age" />
											</div>
											<TextInput
												{...register("age")}
												id="borrowerAge"
												name="age"
												type="number"
												placeholder="e.g. 21"
												color={`${errors.age ? "failure" : "gray"}`}
												helperText={errors.age ? errors.age.message : ""}
											/>
										</div>
									</div>
									<div className="field-container flex gap-3">
										<div className="flex-1">
											<div className="mb-1 block">
												<Label htmlFor="borrowerEmail" value="Email" />
											</div>
											<TextInput
												{...register("email")}
												id="borrowerEmail"
												name="email"
												type="text"
												placeholder="e.g. example@email.com"
												color={`${errors.email ? "failure" : "gray"}`}
												helperText={errors.email ? errors.email.message : ""}
											/>
										</div>
										<div className="flex-1">
											<div className="mb-1 block">
												<Label htmlFor="contactNumber" value="Contact Number" />
											</div>
											<TextInput
												{...register("contactNumber")}
												id="contactNumber"
												name="contactNumber"
												type="text"
												placeholder="e.g. 09123456789"
												color={`${errors.contactNumber ? "failure" : "gray"}`}
												helperText={
													errors.contactNumber
														? errors.contactNumber.message
														: ""
												}
											/>
										</div>
									</div>
									<div className="field-container">
										<div className="mb-1 block">
											<Label htmlFor="fullAddress" value="Full Address" />
										</div>
										<TextInput
											{...register("fullAddress")}
											id="fullAddress"
											name="fullAddress"
											type="text"
											placeholder="e.g. House no. Street, Barangay, Municipality, Province"
											color={`${errors.fullAddress ? "failure" : "gray"}`}
											helperText={
												errors.fullAddress ? errors.fullAddress.message : ""
											}
										/>
									</div>
									<div className="field-container">
										<div className="mb-1 block">
											<Label
												htmlFor="department"
												value="Department (Optional)"
											/>
										</div>
										<TextInput
											{...register("department")}
											id="department"
											name="department"
											type="text"
											placeholder="e.g. Provincial Governor's Office (PGO)"
											color={`${errors.department ? "failure" : "gray"}`}
											helperText={
												errors.department ? errors.department.message : ""
											}
										/>
									</div>
								</div>
								<div className="space-y-3 mb-5">
									<h1 className="form-header">Items</h1>
									<div>
										<div className="mb-1 block">
											<Label htmlFor="itemBarcode" value="Item Barcode" />
										</div>
										<div className="flex gap-2">
											<div className="flex-1">
												<TextInput
													{...register("itemBarcode")}
													id="itemBarcode"
													type="text"
													placeholder="e.g. ITE12312312"
													name="itemBarcode"
													onChange={(e) => handleBarcodeChange(e.target.value)}
													value={values.itemBarcode}
													color={`${
														errors.itemBarcode && touched.itemBarcode
															? "failure"
															: "gray"
													}`}
													helperText={
														errors.itemBarcode ? errors.itemBarcode.message : ""
													}
												/>
											</div>
											<div>
												<Button
													onClick={() => {
														setBarcode(getValues().itemBarcode);
														trigger("itemBarcode");
													}}
													color="gray"
												>
													Search
												</Button>
											</div>
										</div>
									</div>
									{itemWithBarcode && !isItemLoading && (
										<div className="item-container">
											<div className="rounded-lg flex items-center gap-2">
												<ItemImage
													imagePath={itemWithBarcode.item.image_path}
													width={60}
													height={60}
													className="object-contain rounded-lg"
													alt="item image"
												/>
												<div>
													<h3 className="font-semibold text-[20px]">
														{itemWithBarcode.item?.name}
													</h3>
													<h5 className="text-gray-500 text-[14px]">
														{categoriesList[itemWithBarcode.item.category]}
													</h5>
													<p className="text-gray-500 text-[14px]">
														Stocks: <span>{itemWithBarcode.item.quantity}</span>
													</p>
												</div>
											</div>
											<div
												className={`mr-4 flex gap-2 items-center ${
													itemWithBarcode.item.item_condition === "Good"
														? "text-primary"
														: itemWithBarcode.item.item_condition === "Damaged"
														? "text-red-500"
														: "text-yellow-300"
												}`}
											>
												<p className="text-[14px] font-medium">
													{itemWithBarcode.item.item_condition}
												</p>
												{itemWithBarcode.item.item_condition === "Good" ? (
													<FaCheckCircle size={21} />
												) : itemWithBarcode.item.item_condition ===
												  "Damaged" ? (
													<FaCircleExclamation size={21} />
												) : (
													<FaMinusCircle size={21} />
												)}
											</div>
										</div>
									)}
									{isItemError && itemError && (
										<p className="text-center text-[14px] text-gray-500">
											Item Not found.
										</p>
									)}
									<div>
										<div className="mb-1 block">
											<Label htmlFor="returnDate" value="Return Date" />
										</div>
										<input
											type="date"
											name="returnDate"
											value={
												values.returnDate
													? values.returnDate.toISOString().split("T")[0]
													: ""
											}
											onChange={(e) => {
												setFieldValue("returnDate", new Date(e.target.value));
											}}
											onBlur={() => formik.setFieldTouched("returnDate", true)}
											className="rounded-md border-gray-400 w-full"
										/>
									</div>
									<div>
										<div className="mb-1 block">
											<Label htmlFor="testedBy" value="Tested By" />
										</div>
										<TextInput
											{...register("testedBy")}
											id="testedBy"
											name="testedBy"
											type="text"
											placeholder="e.g. Kien Jayjan Peralta"
											color={`${errors.testedBy ? "failure" : "gray"}`}
											helperText={
												errors.testedBy ? errors.testedBy.message : ""
											}
										/>
									</div>
								</div>
								<div className="flex gap-2 w-full">
									<Button
										color="gray"
										className="flex-1"
										onClick={() => setOpenModal(false)}
									>
										Cancel
									</Button>
									<Button
										disabled={isSubmitting}
										color="success"
										type="submit"
										className="flex-1"
									>
										{isSubmitting ? "Submitting.." : "Confirm"}
									</Button>
								</div>
							</div>
						</form>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
};

const ItemBarcode = ({ value, error, handleChange }) => {};

export default BorrowItemForm;
