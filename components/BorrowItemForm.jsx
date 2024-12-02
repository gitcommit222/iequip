"use client";
import {
	Button,
	Datepicker,
	Label,
	Modal,
	Select,
	TextInput,
} from "flowbite-react";
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
import { BiQrScan } from "react-icons/bi";

import { FaCheckCircle, FaMinusCircle } from "react-icons/fa";
import toast from "react-hot-toast";

import QRCodeScanner from "../components/QRScanner";
import { useUser } from "../hooks/useAuth";

const BorrowItemForm = ({ data }) => {
	const [openModal, setOpenModal] = useState(false);
	const [openScanner, setOpenScanner] = useState(false);
	const [barcode, setBarcode] = useState("");

	const { data: user } = useUser();

	const borrowItemMutation = useCreateTransaction();

	const {
		register,
		handleSubmit,
		reset,
		setError,
		control,
		trigger,
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
			testedBy: data?.testedBy || user?.fetchedUser?.name,
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

	const handleOnScanned = (result) => {
		if (result) {
			setBarcode(result.replace(/"/g, ""));
			setValue("itemBarcode", barcode);
			setOpenScanner(false);
		}
	};

	const departmentOptions = [
		{ value: "PGO", label: "PGO (Provincial Governor's Office)" },
		{ value: "GSO", label: "GSO (General Supplies Office)" },
		{ value: "HRMO", label: "HRMO (Human Resource Management Office)" },
		{ value: "PTO", label: "PTO (Provincial Treasurers Office)" },
		{ value: "PACCO", label: "PACCO (Provincial Accounting Office)" },
		{ value: "PASSO", label: "PASSO (Provincial Assesor Office)" },
		{ value: "PEO", label: "PEO (Provincial Engineering Office)" },
		{
			value: "PPDO",
			label: "PPDO (Provincial Planning and Development Office)",
		},
		{ value: "PEPO", label: "PEPO (Provincial Equipment Pool Office)" },
		{
			value: "PSWDO",
			label: "PSWDO (Provincial Social Welfare and Development Office)",
		},
		{
			value: "DICT",
			label: "DICT (Department of Information and Communication Technology)",
		},
		{ value: "OPAD", label: "OPAD (Office of Provincial Administrator)" },
		{ value: "PBO", label: "PBO (Provincial Budget Office)" },
		{ value: "ENRO", label: "ENRO (Environment and Natural Resources Office)" },
		{ value: "OPA", label: "OPA (Office of the Provincial Agriculturist)" },
		{ value: "CSC", label: "CSC (Civil Service on Commission)" },
		{ value: "COA", label: "COA (Commission On Audit)" },
		{ value: "CONGRESS", label: "Office of The Congress" },
		{ value: "LEGAL", label: "Legal Office" },
		{
			value: "DILG",
			label: "DILG (Department of Interior and Local Government)",
		},
		{ value: "COMMELEC", label: "Provincial Commelec" },
		{ value: "RTC", label: "Regional Trial Court" },
		{ value: "MTC", label: "Municipal Trial Court" },
		{ value: "FISCAL", label: "FISCAL" },
		{ value: "DSWD", label: "DSWD (Department of Social Welfare Development)" },
		{ value: "ABRA_DE_ILOG", label: "Abra de Ilog" },
		{ value: "CALINTAAN", label: "Calintaan" },
		{ value: "LOOC", label: "Looc" },
		{ value: "LUBANG", label: "Lubang" },
		{ value: "MAGSAYSAY", label: "Magsaysay" },
		{ value: "MAMBURAO", label: "Mamburao" },
		{ value: "PALUAN", label: "Paluan" },
		{ value: "RIZAL", label: "Rizal" },
		{ value: "SABLAYAN", label: "Sablayan" },
		{ value: "SAN_JOSE", label: "San Jose" },
		{ value: "SANTA_CRUZ", label: "Santa Cruz" },
		{ value: "ABRA_DE_ILOG_BARANGAY_1", label: "Barangay 1, Abra de Ilog" },
		{ value: "ABRA_DE_ILOG_BARANGAY_2", label: "Barangay 2, Abra de Ilog" },
		{ value: "ABRA_ARMADO", label: "Armado, Abra de Ilog" },
		{ value: "ABRA_BALAO", label: "Balao, Abra de Ilog" },
		{ value: "ABRA_CABACAO", label: "Cabacao, Abra de Ilog" },
		{ value: "ABRA_LUMANGBAYAN", label: "Lumangbayan, Abra de Ilog" },
		{ value: "ABRA_MALAYLAY", label: "Malaylay, Abra de Ilog" },
		{ value: "ABRA_POBLACION", label: "Poblacion, Abra de Ilog" },
		{ value: "ABRA_PUERTO", label: "Puerto, Abra de Ilog" },
		{ value: "ABRA_UDALO", label: "Udalo, Abra de Ilog" },
		{ value: "ABRA_WAWA", label: "Wawa, Abra de Ilog" },
		{ value: "CALINTAAN_CONCEPCION", label: "Concepcion, Calintaan" },
		{ value: "CALINTAAN_IRIRON", label: "Iriron, Calintaan" },
		{ value: "CALINTAAN_MALPALON", label: "Malpalon, Calintaan" },
		{ value: "CALINTAAN_POBLACION", label: "Poblacion, Calintaan" },
		{ value: "CALINTAAN_POYPOY", label: "Poypoy, Calintaan" },
		{ value: "CALINTAAN_TANYAG", label: "Tanyag, Calintaan" },
		{ value: "LOOC_AGKAWAYAN", label: "Agkawayan, Looc" },
		{ value: "LOOC_AMBIL", label: "Ambil, Looc" },
		{ value: "LOOC_BONBON", label: "Bonbon, Looc" },
		{ value: "LOOC_BULACAN", label: "Bulacan, Looc" },
		{ value: "LOOC_KANLURAN", label: "Kanluran, Looc" },
		{ value: "LOOC_MAMBURAO", label: "Mamburao, Looc" },
		{ value: "LOOC_POBLACION", label: "Poblacion, Looc" },
		{ value: "LOOC_TALAOTAO", label: "Talaotao, Looc" },
		{ value: "LUBANG_BINAKAS", label: "Binakas, Lubang" },
		{ value: "LUBANG_CABRA", label: "Cabra, Lubang" },
		{ value: "LUBANG_MALIGAYA", label: "Maligaya, Lubang" },
		{ value: "LUBANG_MALIIG", label: "Maliig, Lubang" },
		{ value: "LUBANG_POBLACION", label: "Poblacion, Lubang" },
		{ value: "LUBANG_TAGBAC", label: "Tagbac, Lubang" },
		{ value: "LUBANG_TANGAL", label: "Tangal, Lubang" },
		{ value: "LUBANG_VIGO", label: "Vigo, Lubang" },
		{ value: "MAGSAYSAY_CAGURAY", label: "Caguray, Magsaysay" },
		{ value: "MAGSAYSAY_GAPASAN", label: "Gapasan, Magsaysay" },
		{ value: "MAGSAYSAY_LASTE", label: "Laste, Magsaysay" },
		{ value: "MAGSAYSAY_NICOLAS", label: "Nicolas, Magsaysay" },
		{ value: "MAGSAYSAY_POBLACION", label: "Poblacion, Magsaysay" },
		{ value: "MAGSAYSAY_SIBALAT", label: "Sibalat, Magsaysay" },
		{ value: "MAGSAYSAY_TUBILI", label: "Tubili, Magsaysay" },
		{ value: "MAMBURAO_BALANSAY", label: "Balansay, Mamburao" },
		{ value: "MAMBURAO_FATIMA", label: "Fatima, Mamburao" },
		{ value: "MAMBURAO_PAYOMPON", label: "Payompon, Mamburao" },
		{ value: "MAMBURAO_POBLACION_1", label: "Poblacion 1, Mamburao" },
		{ value: "MAMBURAO_POBLACION_2", label: "Poblacion 2, Mamburao" },
		{ value: "MAMBURAO_POBLACION_3", label: "Poblacion 3, Mamburao" },
		{ value: "MAMBURAO_POBLACION_4", label: "Poblacion 4, Mamburao" },
		{ value: "MAMBURAO_POBLACION_5", label: "Poblacion 5, Mamburao" },
		{ value: "MAMBURAO_TALABAAN", label: "Talabaan, Mamburao" },
		{ value: "MAMBURAO_TANGKALAN", label: "Tangkalan, Mamburao" },
		{ value: "MAMBURAO_TAYAMAAN", label: "Tayamaan, Mamburao" },
		{ value: "PALUAN_ALIPAOY", label: "Alipaoy, Paluan" },
		{ value: "PALUAN_HANDANG", label: "Handang, Paluan" },
		{ value: "PALUAN_HARRISON", label: "Harrison, Paluan" },
		{ value: "PALUAN_LUMANGBAYAN", label: "Lumangbayan, Paluan" },
		{ value: "PALUAN_MARIKIT", label: "Marikit, Paluan" },
		{ value: "PALUAN_POBLACION", label: "Poblacion, Paluan" },
		{ value: "PALUAN_SILAHIS", label: "Silahis, Paluan" },
		{ value: "PALUAN_TUBILI", label: "Tubili, Paluan" },
		{ value: "RIZAL_ADELA", label: "Adela, Rizal" },
		{ value: "RIZAL_AGUAS", label: "Aguas, Rizal" },
		{ value: "RIZAL_MALAWAAN", label: "Malawaan, Rizal" },
		{ value: "RIZAL_POBLACION", label: "Poblacion, Rizal" },
		{ value: "RIZAL_RUMBANG", label: "Rumbang, Rizal" },
		{ value: "RIZAL_SALVACION", label: "Salvacion, Rizal" },
		{ value: "SABLAYAN_BATONG_BUHAY", label: "Batong Buhay, Sablayan" },
		{ value: "SABLAYAN_BURGOS", label: "Burgos, Sablayan" },
		{ value: "SABLAYAN_CLAUDIO_SALGADO", label: "Claudio Salgado, Sablayan" },
		{
			value: "SABLAYAN_GEN_EMILIO_AGUINALDO",
			label: "Gen. Emilio Aguinaldo, Sablayan",
		},
		{ value: "SABLAYAN_IBUD", label: "Ibud, Sablayan" },
		{ value: "SABLAYAN_ILVITA", label: "Ilvita, Sablayan" },
		{ value: "SABLAYAN_LIGAYA", label: "Ligaya, Sablayan" },
		{ value: "SABLAYAN_POBLACION", label: "Poblacion, Sablayan" },
		{ value: "SABLAYAN_SAN_AGUSTIN", label: "San Agustin, Sablayan" },
		{ value: "SABLAYAN_SAN_FRANCISCO", label: "San Francisco, Sablayan" },
		{ value: "SABLAYAN_SANTA_LUCIA", label: "Santa Lucia, Sablayan" },
		{ value: "SABLAYAN_VICTORIA", label: "Victoria, Sablayan" },
		{ value: "SAN_JOSE_BAGONG_SIKAT", label: "Bagong Sikat, San Jose" },
		{ value: "SAN_JOSE_BANGKAL", label: "Bangkal, San Jose" },
		{ value: "SAN_JOSE_BUBOG", label: "Bubog, San Jose" },
		{ value: "SAN_JOSE_CENTRAL", label: "Central, San Jose" },
		{ value: "SAN_JOSE_INASAKAN", label: "Inasakan, San Jose" },
		{
			value: "SAN_JOSE_LABANGAN_POBLACION",
			label: "Labangan Poblacion, San Jose",
		},
		{ value: "SAN_JOSE_MANGARIN", label: "Mangarin, San Jose" },
		{ value: "SAN_JOSE_MURTHA", label: "Murtha, San Jose" },
		{ value: "SAN_JOSE_NATANDOL", label: "Natandol, San Jose" },
		{ value: "SAN_JOSE_PAG_ASA", label: "Pag-asa, San Jose" },
		{ value: "SANTA_CRUZ_ALACAAK", label: "Alacaak, Santa Cruz" },
		{ value: "SANTA_CRUZ_BARAHAN", label: "Barahan, Santa Cruz" },
		{ value: "SANTA_CRUZ_CASAGUE", label: "Casague, Santa Cruz" },
		{ value: "SANTA_CRUZ_DAYAP", label: "Dayap, Santa Cruz" },
		{ value: "SANTA_CRUZ_LUMANGBAYAN", label: "Lumangbayan, Santa Cruz" },
		{ value: "SANTA_CRUZ_MULAWIN", label: "Mulawin, Santa Cruz" },
		{ value: "SANTA_CRUZ_POBLACION", label: "Poblacion, Santa Cruz" },
		{ value: "SANTA_CRUZ_SAN_VICENTE", label: "San Vicente, Santa Cruz" },
	];

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
											<Label htmlFor="department" value="Department" />
										</div>
										<Select
											{...register("department")}
											id="department"
											name="department"
											className={`rounded-lg w-full ${
												errors.department ? "border-red-500" : "border-gray-300"
											}`}
										>
											<option value="">Select Department</option>
											{departmentOptions.map((dept) => (
												<option key={dept.value} value={dept.value}>
													{dept.label}
												</option>
											))}
										</Select>
									</div>
								</div>
								<div className="space-y-3 mb-5">
									<h1 className="form-header">Item Info</h1>
									<div>
										<div className="mb-1 block">
											<Label htmlFor="itemBarcode" value="Item QR Code" />
										</div>
										<div className="flex gap-2 items-center">
											<div className="flex-1">
												<TextInput
													{...register("itemBarcode")}
													id="itemBarcode"
													type="text"
													placeholder={`${barcode || "e.g. ITE12312312"} `}
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
													<BiQrScan size={18} />
												</Button>
												<Modal
													show={openScanner}
													size="md"
													onClose={() => setOpenScanner(false)}
													popup
												>
													<Modal.Header />
													<Modal.Body>
														<QRCodeScanner onScanned={handleOnScanned} />
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
															disabled
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
														defaultValue={user?.fetchedUser?.name}
														type="text"
														disabled
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
