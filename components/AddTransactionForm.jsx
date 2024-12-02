import React from "react";
import { Button, Modal, Label, TextInput, Select } from "flowbite-react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { transactionSchema } from "../lib/schema";
import ItemImage from "./ItemImage";
import { useUser } from "../hooks/useAuth";

const AddTransactionForm = ({
	createSupplyTransaction,
	supplies,
	isOpen,
	onClose,
}) => {
	const { data: user } = useUser();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: yupResolver(transactionSchema),
		defaultValues: {
			fullName: "",
			email: "",
			age: 18,
			contactNumber: "",
			fullAddress: "",
			department: "",
			distribution_date: new Date().toISOString().split("T")[0],
			released_by: user?.fetchedUser.name || "",
			remarks: "",
			supply_quantities: supplies.map((supply) => ({
				id: supply.id,
				quantity: 1,
			})),
		},
	});

	const onSubmit = async (data) => {
		try {
			await toast.promise(createSupplyTransaction(data), {
				loading: "Creating transaction...",
				success: "Transaction created successfully",
				error: "Failed to create transaction",
			});
			onClose();
			reset();
		} catch (error) {
			console.error("Error creating transaction:", error);
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
	];

	return (
		<Modal show={isOpen} onClose={onClose} popup size="7xl">
			<Modal.Body className="hide-scrollbar">
				<div className="w-full py-4">
					<div className="mb-4">
						<h1 className="font-semibold text-[25px]">Distribute Supplies</h1>
						<p className="text-gray-700">
							Enter recipient information and quantities for selected supplies.
						</p>
					</div>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="flex gap-6">
							{/* Left column: Recipient Info */}
							<div className="w-1/2 space-y-4">
								<h1 className="form-header">Recipient Info</h1>
								<div className="field-container flex gap-3">
									<div className="flex-1">
										<Label htmlFor="fullName" value="Recipient's Full Name" />
										<TextInput
											{...register("fullName")}
											id="fullName"
											type="text"
											placeholder="e.g. Juan Dela Cruz"
											color={errors.fullName ? "failure" : "gray"}
											helperText={errors.fullName?.message}
										/>
									</div>
									<div className="min-w-[85px]">
										<Label htmlFor="age" value="Age" />
										<TextInput
											{...register("age")}
											id="age"
											type="number"
											placeholder="e.g. 21"
											color={errors.age ? "failure" : "gray"}
											helperText={errors.age?.message}
										/>
									</div>
								</div>
								<div className="field-container flex gap-3">
									<div className="flex-1">
										<Label htmlFor="email" value="Email" />
										<TextInput
											{...register("email")}
											id="email"
											type="text"
											placeholder="e.g. example@email.com"
											color={errors.email ? "failure" : "gray"}
											helperText={errors.email?.message}
										/>
									</div>
									<div className="flex-1">
										<Label htmlFor="contactNumber" value="Contact Number" />
										<TextInput
											{...register("contactNumber")}
											id="contactNumber"
											type="text"
											placeholder="e.g. 09123456789"
											color={errors.contactNumber ? "failure" : "gray"}
											helperText={errors.contactNumber?.message}
										/>
									</div>
								</div>
								<div className="field-container">
									<Label htmlFor="fullAddress" value="Full Address" />
									<TextInput
										{...register("fullAddress")}
										id="fullAddress"
										type="text"
										placeholder="e.g. House no. Street, Barangay, Municipality, Province"
										color={errors.fullAddress ? "failure" : "gray"}
										helperText={errors.fullAddress?.message}
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

							{/* Right column: Transaction Details and Selected Supplies */}
							<div className="w-1/2 space-y-4">
								<h1 className="form-header">Transaction Details</h1>
								<div className="field-container">
									<Label
										htmlFor="distribution_date"
										value="Distribution Date"
									/>
									<TextInput
										{...register("distribution_date")}
										id="distribution_date"
										type="date"
										color={errors.distribution_date ? "failure" : "gray"}
										helperText={errors.distribution_date?.message}
									/>
								</div>
								<div className="field-container">
									<Label htmlFor="released_by" value="Released By" />
									<TextInput
										{...register("released_by")}
										id="released_by"
										type="text"
										disabled
										color={errors.released_by ? "failure" : "gray"}
										helperText={errors.released_by?.message}
									/>
								</div>
								<div className="field-container">
									<Label htmlFor="remarks" value="Remarks" />
									<TextInput
										{...register("remarks")}
										id="remarks"
										type="text"
										color={errors.remarks ? "failure" : "gray"}
										helperText={errors.remarks?.message}
									/>
								</div>
								<div className="field-container space-y-3 border rounded-lg p-4 bg-gray-50">
									<Label
										value="Selected Supplies"
										className="text-lg font-semibold"
									/>
									<div className="space-y-4 max-h-[300px] overflow-y-auto">
										{supplies.map((supply, index) => (
											<div
												key={supply.id}
												className="flex items-center gap-4 bg-white p-3 rounded-md shadow-sm"
											>
												<ItemImage
													imagePath={supply.image_path}
													alt={supply.item_name}
													width={50}
													height={50}
													className="rounded-md object-cover"
												/>
												<div className="flex-grow">
													<span className="font-medium">
														{supply.item_name}
													</span>
													<p className="text-sm text-gray-500">
														Available: {supply.quantity_available}
													</p>
												</div>
												<div className="flex items-center gap-2">
													<Label
														htmlFor={`quantity-${supply.id}`}
														className="sr-only"
													>
														Quantity
													</Label>
													<TextInput
														id={`quantity-${supply.id}`}
														{...register(`supply_quantities.${index}.quantity`)}
														type="number"
														min="1"
														max={supply.quantity_available}
														defaultValue="1"
														className="w-20"
													/>
													<span className="text-sm text-gray-500">
														{supply.unit}
													</span>
												</div>
												<input
													type="hidden"
													{...register(`supply_quantities.${index}.id`)}
													value={supply.id}
												/>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
						<div className="flex justify-end gap-2 mt-6">
							<Button color="gray" onClick={onClose}>
								Cancel
							</Button>
							<Button disabled={isSubmitting} color="success" type="submit">
								{isSubmitting ? "Creating..." : "Create Transaction"}
							</Button>
						</div>
					</form>
				</div>
			</Modal.Body>
		</Modal>
	);
};

export default AddTransactionForm;
