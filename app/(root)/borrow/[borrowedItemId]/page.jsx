"use client";
import { format } from "date-fns";
import ItemImage from "../../../../components/ItemImage";
import Headerbox from "../../../../components/shared/Headerbox";
import {
	useGetBorrowedItemById,
	useReturnItem,
} from "../../../../hooks/useBorrowItem";
import { categoriesList } from "../../../../lib/categories";
import { FaCheckCircle } from "react-icons/fa";
import { FaMinusCircle } from "react-icons/fa";
import { FaCircleExclamation } from "react-icons/fa6";
import { Button, Label, Select } from "flowbite-react";
import { useState } from "react";
import toast from "react-hot-toast";

const BorrowedItemPage = ({ params }) => {
	const bItemId = params.borrowedItemId;

	const [newCondition, setNewCondition] = useState("");

	const { mutateAsync: returnItem, isPending: isReturnItemPending } =
		useReturnItem();

	const { data: borrowedItem, isLoading: isItemLoading } =
		useGetBorrowedItemById(parseInt(bItemId));

	const handleReturnItem = async () => {
		try {
			await toast.promise(returnItem({ newCondition, borrowItemId: bItemId }), {
				success: "Item returned!",
				loading: "Returning item...",
				error: "Error returning item.",
			});

			setNewCondition("");
		} catch (error) {
			console.error("Error returning item:", error.message);
		}
	};

	return (
		<section>
			<Headerbox
				title={borrowedItem && borrowedItem?.borrowed?.Item?.name}
				subtext={
					borrowedItem && categoriesList[borrowedItem?.borrowed?.Item?.category]
				}
			/>
			<div className="w-full border flex gap-3 bg-white rounded-md shadow-sm p-4">
				<div className="w-[210px] flex items-center justify-center border rounded-md p-2">
					<ItemImage
						imagePath={borrowedItem?.borrowed?.Item?.image_path}
						width={300}
						height={200}
						className="object-contain"
						alt="ItemImage"
					/>
				</div>
				<div className=" flex-1 space-y-1">
					<h1 className="font-bold text-[34px] ">
						{borrowedItem?.borrowed?.Item?.name}
					</h1>
					<p className="text-gray-500">
						{categoriesList[borrowedItem?.borrowed?.Item?.category]}
					</p>
					<div
						className={`mr-4 flex gap-2 items-center ${
							borrowedItem?.borrowed?.Item?.item_condition === "Good"
								? "text-primary"
								: borrowedItem?.borrowed?.Item?.item_condition === "Damaged"
								? "text-red-500"
								: "text-yellow-300"
						}`}
					>
						<p className="text-[14px] font-medium">
							{borrowedItem?.borrowed?.Item?.item_condition} Condition
						</p>
						{borrowedItem?.borrowed?.Item?.item_condition === "Good" ? (
							<FaCheckCircle size={17} />
						) : borrowedItem?.borrowed?.Item?.item_condition === "Damaged" ? (
							<FaCircleExclamation size={17} />
						) : (
							<FaMinusCircle size={17} />
						)}
					</div>
					<div>
						<p>
							Date Borrowed -{" "}
							{(borrowedItem &&
								format(borrowedItem?.borrowed?.start_date, "MMMM dd, yyyy")) ||
								"-"}
						</p>
						<p>
							Expected Return Date -{" "}
							{(borrowedItem &&
								format(borrowedItem?.borrowed?.end_date, "MMMM dd, yyyy")) ||
								"-"}
						</p>
					</div>
				</div>
				<div className="flex-1 flex flex-col justify-between items-start">
					{" "}
					<p className="text-gray-500">
						Borrower :{" "}
						<span className="font-semibold text-black">
							{borrowedItem?.borrowed?.Borrower.name}
						</span>
					</p>
					<p className="text-gray-500">
						Contact No. :{" "}
						<span className="font-semibold text-black">
							{borrowedItem?.borrowed?.Borrower.contact_number}
						</span>
					</p>
					<p className="text-gray-500">
						Email :{" "}
						<span className="font-semibold text-black">
							{borrowedItem?.borrowed?.Borrower.email}
						</span>
					</p>
					<p className="text-gray-500">
						Released By :{" "}
						<span className="font-semibold text-black">
							{borrowedItem?.borrowed?.released_by}
						</span>
					</p>
				</div>
				<div className="w-[200px] flex flex-col justify-center gap-4">
					<div className="max-w-md">
						<div className="mb-2 block">
							<Label htmlFor="condition" value="Item Condition" />
						</div>
						<Select
							disabled={
								isReturnItemPending ||
								borrowedItem?.borrowed?.status === "returned"
							}
							id="condition"
							onChange={(e) => setNewCondition(e.target.value)}
							value={newCondition}
						>
							<option>{borrowedItem?.borrowed?.Item?.item_condition}</option>
							<option>Good</option>
							<option>Slightly Damaged</option>
							<option>Damaged</option>
						</Select>
					</div>
					<Button
						color="gray"
						size="lg"
						onClick={handleReturnItem}
						disabled={
							isReturnItemPending ||
							borrowedItem?.borrowed.status === "returned"
						}
					>
						{borrowedItem?.borrowed.status === "returned"
							? "Returned"
							: "Return Item"}
					</Button>
				</div>
			</div>
		</section>
	);
};

export default BorrowedItemPage;
