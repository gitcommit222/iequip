"use client";
import {
	Label,
	TextInput,
	Select,
	Datepicker,
	FileInput,
	Textarea,
	Button,
	Modal,
	Spinner,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useAddItem } from "../hooks/useItem";
import toast from "react-hot-toast";

const AddItemForm = () => {
	const [itemName, setItemName] = useState("");
	const [category, setCategory] = useState(0);
	const [quantity, setQuantity] = useState(1);
	const [unit, setUnit] = useState("Pcs");
	const [itemCondition, setItemCondition] = useState(null);
	const [file, setFile] = useState(null);
	const [remarks, setRemarks] = useState("");

	const [openModal, setOpenModal] = useState(false);

	const {
		mutateAsync: addItemMutation,
		isSuccess: isAddItemSuccess,
		isPending: isAddItemPending,
	} = useAddItem();

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Generate the barcode
		const itemLetters = itemName.substring(0, 3).toUpperCase();
		const randomNum =
			Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000;
		const barcode = `${itemLetters}${category}${randomNum}`;

		const itemData = {
			name: itemName,
			category,
			quantity,
			remarks,
			barcode,
			unit,
			item_condition: itemCondition,
		};

		if (!file) {
			console.error("No file selected");
			return;
		}

		try {
			toast.promise(addItemMutation({ file, itemData }), {
				success: "Item added!",
				loading: "Adding item...",
				error: "Error adding item.",
			});
			setCategory(0);
			setItemName("");
			setQuantity(1);
			setRemarks("");
			setFile(null);
			setOpenModal(false);
		} catch (error) {
			console.error("Error adding item:", error.message);
		}
	};

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
								onChange={(e) => setItemName(e.target.value)}
								value={itemName}
								className="focused:ring-2-primary"
							/>
						</div>
						<div className="flex gap-3">
							<div className="flex-1">
								<div className="mb-2 block">
									<Label htmlFor="categories" value="Category" />
								</div>
								<Select
									id="categories"
									onChange={(e) => setCategory(e.target.value)}
									value={category}
									required
								>
									<option value={0}>Flood & Typhoon</option>
									<option value={1}>Tsunami</option>
									<option value={2}>Covid-19</option>
								</Select>
							</div>
							<div className="max-w-[180px]">
								<div className="mb-2 block">
									<Label htmlFor="quantity" value="Quantity" />
								</div>
								<TextInput
									id="quantity"
									type="number"
									onChange={(e) => setQuantity(e.target.value)}
									value={quantity}
								/>
							</div>
						</div>
						<div className="flex gap-3">
							<div className="flex-1">
								<div className="mb-2 block">
									<Label htmlFor="issuedDate" value="Date Issued" />
								</div>
								<Datepicker
									minDate={new Date(2023, 0, 1)}
									maxDate={new Date(2023, 3, 30)}
									id="issuedDate"
								/>
							</div>
							<div className="max-w-[180px] w-[180px]">
								<div className="mb-2 block">
									<Label htmlFor="unit" value="Unit" />
								</div>
								<Select
									id="unit"
									onChange={(e) => setUnit(e.target.value)}
									value={unit}
									required
								>
									<option value="Unit">Unit</option>
									<option value="Set">Set</option>
									<option value="Pcs">Pcs</option>
								</Select>
							</div>
						</div>
						<div className="flex gap-3">
							<div className="flex-1">
								<div className="mb-2 block">
									<Label
										htmlFor="file-upload-helper-text"
										value="Upload Item Image"
									/>
								</div>
								<FileInput
									id="file-upload-helper-text"
									className="text-[14px]"
									onChange={(e) => setFile(e.target.files[0])}
								/>
							</div>
							<div className="max-w-[180px] w-[180px]">
								<div className="mb-2 block">
									<Label htmlFor="itemCondition" value="Condition" />
								</div>
								<Select
									id="itemCondition"
									onChange={(e) => setItemCondition(e.target.value)}
									value={unit}
									required
								>
									<option value="Good">Good</option>
									<option value="Slightly Damaged">Slightly Damaged</option>
									<option value="Damaged">Damaged</option>
								</Select>
							</div>
						</div>
						<div>
							<div className="mb-2 block">
								<Label htmlFor="remarks" value="Remarks" />
							</div>
							<Textarea
								id="remarks"
								placeholder="Leave a comment..."
								rows={6}
								onChange={(e) => setRemarks(e.target.value)}
							/>
						</div>
						<div className="flex gap-3">
							<Button
								type="submit"
								color="success"
								className="text-white"
								disabled={isAddItemPending}
							>
								{isAddItemPending ? (
									<Spinner aria-label="Default status example" />
								) : (
									"Save"
								)}
							</Button>
							<Button onClick={() => setOpenModal(false)} color="gray">
								Cancel
							</Button>
						</div>
					</form>
				</Modal.Body>
			</Modal>
		</>
	);
};

export default AddItemForm;
