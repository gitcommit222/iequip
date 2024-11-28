"use client";
import { Button, Datepicker, Label, Modal, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { BorrowItemSchema } from "../lib/schema";
import ItemImage from "../components/ItemImage";

import { useGetItemByBarcode } from "../hooks/useItem";
import { useCreateTransaction } from "../hooks/useTransactions";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { format, parseISO } from "date-fns"; // Add parseISO import

import { categoriesList } from "../lib/categories";
import { FaCircleExclamation } from "react-icons/fa6";
import { BsUpcScan } from "react-icons/bs";

import { FaCheckCircle, FaMinusCircle } from "react-icons/fa";
import toast from "react-hot-toast";

import QRCodeScanner from "../components/QRScanner";

const BorrowItemForm = ({ data }) => {
	const [openModal, setOpenModal] = useState(false);
	const [openScanner, setOpenScanner] = useState(false);
	const [barcode, setBarcode] = useState("");

	const borrowItemMutation = useCreateTransaction();

	const {
		register,
		handleSubmit,
		reset,
		setError,
		control,
		watch,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: {
			fullName: data?.fullName || "",
			email: data?.email || "",
			age: data?.age || 18,
			contactNumber: data?.contactNumber || "",
			fullAddress: data?.address || "",
			department: data?.department || "",
			itemBarcode: data?.barcode || "",
			itemQty: data?.quantity || 1,
			testedBy: data?.testedBy || "",
			returnDate: data?.end_date
				? format(parseISO(data.end_date), "yyyy-MM-dd'T'HH:mm")
				: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
		},
		resolver: yupResolver(BorrowItemSchema),
	});

	const watchedBarcode = watch("itemBarcode");

	const {
		data: itemWithBarcode,
		isLoading: isItemLoading,
		isError: isItemError,
		error: itemError,
	} = useGetItemByBarcode(watchedBarcode?.length >= 11 ? watchedBarcode : null);

	const onSubmit = async (formData) => {
		try {
			await toast.promise(
				borrowItemMutation.mutateAsync({
					recipientInfo: {
						name: formData.fullName,
						email: formData.email,
						age: formData.age,
						contact_number: formData.contactNumber,
						department: formData.department,
						address: formData.fullAddress,
					},
					itemInfo: {
						category: "items",
						item_id: itemWithBarcode?.item.id,
						borrowed_qty: formData.itemQty,
						end_date: formData.returnDate,
						tested_by: formData.testedBy,
					},
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

	const handleDateChange = (e) => {
		const newDate = e.target.value;
		setValue("returnDate", newDate);
	};

	useEffect(() => {
		// When the modal opens, we need to ensure that the scanner only initializes then.
		if (openScanner) {
			console.log("Modal opened, initializing scanner...");
		}
	}, [openScanner]);

	return (
		<>
			<Button color="success" pill size="sm" onClick={() => setOpenModal(true)}>
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
												color={`${errors.fullName ? "failure" : "gray"}`}
												helperText={
													errors.fullName ? errors.fullName.message : ""
												}
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
									<h1 className="form-header">Item Info</h1>
									<div>
										<div className="mb-1 block">
											<Label htmlFor="itemBarcode" value="Item Barcode" />
										</div>
										<div className="flex gap-2 items-center">
											<div className="flex-1">
												<TextInput
													{...register("itemBarcode")}
													id="itemBarcode"
													type="text"
													placeholder="e.g. ITE12312312"
													name="itemBarcode"
													color={`${errors.itemBarcode ? "failure" : "gray"}`}
													onChange={(e) => setBarcode(e.target.value)}
													helperText={
														errors.itemBarcode ? errors.itemBarcode.message : ""
													}
												/>
											</div>
											<div>
												<Button
													onClick={() => {
														setValue("itemBarcode", barcode);
													}}
													color="gray"
												>
													Search
												</Button>
											</div>
											<div>
												<Button
													color="success"
													onClick={() => setOpenScanner(true)}
												>
													<BsUpcScan size={18} />
												</Button>
												<Modal
													show={openScanner}
													size="md"
													onClose={() => setOpenScanner(false)}
													popup
												>
													<Modal.Header />
													<Modal.Body>
														<QRCodeScanner />
													</Modal.Body>
												</Modal>
											</div>
										</div>
									</div>
									{itemWithBarcode && !isItemLoading && (
										<div className="flex flex-col gap-2 items-center">
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
															Stocks:{" "}
															<span>{itemWithBarcode.item.quantity}</span>
														</p>
													</div>
												</div>
												<div>
													<div
														className={`mr-4 flex gap-2 items-center ${
															itemWithBarcode.item.item_condition === "Good"
																? "text-primary"
																: itemWithBarcode.item.item_condition ===
																  "Damaged"
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
													<div className="max-w-[50px] mt-2">
														<TextInput
															{...register("itemQty")}
															id="itemQty"
															name="itemQty"
															type="number"
															className="hide-arrows"
															color={`${errors.itemQty ? "failure" : "gray"}`}
															helperText={
																errors.itemQty ? errors.itemQty.message : ""
															}
															min={1}
														/>
													</div>
												</div>
											</div>
											<div className="flex gap-2 w-full justify-start">
												<div>
													<div className="mb-1">
														<Label htmlFor="returnDate" value="Return Date" />
													</div>
													<TextInput
														{...register("returnDate")}
														id="returnDate"
														type="datetime-local"
														color={`${errors.returnDate ? "failure" : "gray"}`}
														helperText={
															errors.returnDate ? errors.returnDate.message : ""
														}
														onChange={handleDateChange}
														value={watch("returnDate")}
													/>
												</div>
												<div className="flex-1">
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
										</div>
									)}
									{isItemError && itemError && (
										<p className="text-center text-[14px] text-gray-500">
											Item Not found.
										</p>
									)}
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

export default BorrowItemForm;
