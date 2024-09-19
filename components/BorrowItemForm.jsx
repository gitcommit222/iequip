"use client";
import { useFormik } from "formik";
import { Button, Datepicker, Label, Modal, TextInput } from "flowbite-react";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { BorrowItemSchema } from "../lib/schema";
import { useGetItemByBarcode } from "../hooks/useItem";
import ItemImage from "../components/ItemImage";

import { categoriesList } from "../lib/categories";

import { FaCheckCircle } from "react-icons/fa";
import { FaMinusCircle } from "react-icons/fa";
import { FaCircleExclamation } from "react-icons/fa6";

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
			returnDate: data ? data.end_date : Date.now(),
		},
		validationSchema: BorrowItemSchema,
		onSubmit: ({ fullName, email, age, contactNumber, department }) => {},
	});

	const { values, errors, touched, handleChange, handleSubmit } = formik;

	console.log(values.returnDate);

	const {
		data: itemWithBarcode,
		isLoading: isItemLoading,
		isError: isItemError,
		error: itemError,
	} = useGetItemByBarcode(
		values.itemBarcode.length >= 11 ? values.itemBarcode : null
	);

	return (
		<>
			<Button color="success" onClick={() => setOpenModal(true)}>
				Borrow
			</Button>
			<Modal
				show={openModal}
				size="xl"
				onClose={() => setOpenModal(false)}
				popup
			>
				<Modal.Body className="hide-scrollbar">
					<div className="w-full py-4">
						<div className="mb-4">
							<h1 className="font-semibold text-[25px]">Borrow Item Form</h1>
							<p className="text-gray-700]">
								Fill in the fields to complete the borrow request.
							</p>
						</div>
						<form onSubmit={handleSubmit}>
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
												id="borrowerName"
												name="fullName"
												type="text"
												placeholder="e.g. Juan Dela Cruz"
												onChange={handleChange}
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
												id="borrowerAge"
												name="age"
												type="number"
												placeholder="e.g. 21"
												onChange={handleChange}
												value={values.age}
												color={`${
													errors.age && touched.age ? "failure" : "gray"
												}`}
												helperText={errors.age ? errors.age : ""}
											/>
										</div>
									</div>
									<div className="field-container flex gap-3">
										<div className="flex-1">
											<div className="mb-1 block">
												<Label htmlFor="borrowerEmail" value="Email" />
											</div>
											<TextInput
												id="borrowerEmail"
												name="email"
												type="email"
												placeholder="e.g. example@email.com"
												onChange={handleChange}
												value={values.email}
												color={`${
													errors.email && touched.email ? "failure" : "gray"
												}`}
												helperText={errors.email ? errors.email : ""}
											/>
										</div>
										<div className="flex-1">
											<div className="mb-1 block">
												<Label htmlFor="contactNumber" value="Contact Number" />
											</div>
											<TextInput
												id="contactNumber"
												name="contactNumber"
												type="text"
												placeholder="e.g. 09123456789"
												onChange={handleChange}
												value={values.contactNumber}
												color={`${
													errors.contactNumber && touched.contactNumber
														? "failure"
														: "gray"
												}`}
												helperText={
													errors.contactNumber ? errors.contactNumber : ""
												}
											/>
										</div>
									</div>
									<div className="field-container">
										<div className="mb-1 block">
											<Label htmlFor="borrowerName" value="Full Address" />
										</div>
										<TextInput
											id="borrowerName"
											name="fullAddress"
											type="text"
											placeholder="e.g. House no. Street, Barangay, Municipality, Province"
											onChange={handleChange}
											value={values.fullAddress}
											color={`${
												errors.fullAddress && touched.fullAddress
													? "failure"
													: "gray"
											}`}
											helperText={errors.fullAddress ? errors.fullAddress : ""}
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
											id="department"
											name="department"
											type="text"
											placeholder="e.g. Provincial Governor's Office (PGO)"
											onChange={handleChange}
											value={values.department}
											color={`${
												errors.department && touched.department
													? "failure"
													: "gray"
											}`}
											helperText={errors.department ? errors.department : ""}
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
													id="itemBarcode"
													type="text"
													placeholder="e.g. ITE12312312"
													name="itemBarcode"
													onChange={handleChange}
													value={values.itemBarcode}
													color={`${
														errors.itemBarcode && touched.itemBarcode
															? "failure"
															: "gray"
													}`}
													helperText={
														errors.itemBarcode ? errors.itemBarcode : ""
													}
												/>
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
									{isItemError && !isItemLoading && (
										<p className="text-center text-[14px] text-gray-500">
											{itemError?.message}
										</p>
									)}
									<div>
										<div className="mb-1 block">
											<Label htmlFor="returnDate" value="Return Date" />
										</div>
										<Datepicker
											weekStart={1} // Monday
											name="returnDate"
											onChange={handleChange}
											color={`${
												errors.returnDate && touched.returnDate
													? "failure"
													: "gray"
											}`}
											helperText={errors.returnDate ? errors.returnDate : ""}
										/>
									</div>
									<div>
										<div className="mb-1 block">
											<Label htmlFor="testedBy" value="Tested By" />
										</div>
										<TextInput
											id="testedBy"
											name="testedBy"
											type="text"
											placeholder="e.g. Kien Jayjan Peralta"
											onChange={handleChange}
											value={values.testedBy}
											color={`${
												errors.testedBy && touched.testedBy ? "failure" : "gray"
											}`}
											helperText={errors.testedBy ? errors.testedBy : ""}
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
									<Button color="success" type="submit" className="flex-1">
										Confirm
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
