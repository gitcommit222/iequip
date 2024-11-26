"use client";
import { format } from "date-fns";
import ItemImage from "../../../../components/ItemImage";
import Headerbox from "../../../../components/shared/Headerbox";

import { categoriesList } from "../../../../lib/categories";
import { FaCheckCircle } from "react-icons/fa";
import { FaMinusCircle } from "react-icons/fa";
import { FaCircleExclamation } from "react-icons/fa6";

import { Button, Label, Select, TextInput, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
	useGetTransactionById,
	useReturnBorrowedItems,
} from "../../../../hooks/useTransactions";
import { fallback } from "../../../../public";

const BorrowedItemPage = ({ params }) => {
	const bItemId = params.borrowedItemId;

	const {
		mutateAsync: returnItem,
		isPending: isReturnItemPending,
		isSuccess: isReturnItemSuccess,
	} = useReturnBorrowedItems();

	const { data: borrowedItem, isLoading: isItemLoading } =
		useGetTransactionById(parseInt(bItemId));

	const [newCondition, setNewCondition] = useState("");
	const [returnedQuantity, setReturnedQuantity] = useState(1);
	const [remarks, setRemarks] = useState("");

	useEffect(() => {
		setNewCondition(borrowedItem?.item?.item_condition || "");
		setReturnedQuantity(borrowedItem?.borrowed_quantity || 1);
	}, [borrowedItem]);

	const router = useRouter();

	const handleReturnItem = async () => {
		try {
			await toast.promise(
				returnItem({
					transactionId: bItemId,
					returnedCondition: newCondition,
					returnedQuantity,
					remarks,
				}),
				{
					success: "Item returned!",
					loading: "Returning item...",
					error: "Error returning item.",
				}
			);

			setNewCondition("");
		} catch (error) {
			console.error("Error returning item:", error.message);
		}
	};
	useEffect(() => {
		if (isReturnItemSuccess) {
			router.push("/borrow");
		}
	}, [isReturnItemSuccess]);

	return (
		<section className="container mx-auto">
			<Headerbox
				title="Borrowed Item Details"
				subtext="Review and return the borrowed item"
				className="mb-6"
			/>

			<div className="bg-white rounded-lg shadow-md p-6 mt-6">
				<h2 className="text-2xl font-bold mb-4">Review your borrowed item</h2>
				<p className="mb-6 text-gray-600">
					Please review the item details and return if ready.
				</p>
				<div className="flex flex-col lg:flex-row justify-between gap-8">
					<div className="flex-1">
						<h3 className="text-xl font-semibold mb-3">Borrower details</h3>
						<div className="mb-4 text-gray-600">
							<p>Borrower: {borrowedItem?.recipient?.name}</p>
							<p>Contact No.: {borrowedItem?.recipient?.contact_number}</p>
							<p>Email: {borrowedItem?.recipient.email}</p>
							<p>Tested & Released By: {borrowedItem?.tested_by || "--"}</p>
						</div>
					</div>

					<div className="flex-1">
						<h3 className="text-xl font-semibold mb-3">Item details</h3>
						<div className="mb-4 text-gray-600">
							<p>
								<span className="font-medium">Name:</span>{" "}
								{borrowedItem?.item?.name}
							</p>
							<p>
								<span className="font-medium">Category:</span>{" "}
								{categoriesList[borrowedItem?.item?.category]}
							</p>
							<p>
								<span className="font-medium">Condition:</span>{" "}
								{borrowedItem?.item?.item_condition}
							</p>
							<p>
								<span className="font-medium">Date Borrowed:</span>{" "}
								{borrowedItem?.start_date
									? format(new Date(borrowedItem?.start_date), "MMMM dd, yyyy")
									: "-"}
							</p>
							<p>
								<span className="font-medium">Expected Return Date:</span>{" "}
								{borrowedItem?.end_date
									? format(new Date(borrowedItem?.end_date), "MMMM dd, yyyy")
									: "-"}
							</p>
						</div>
						<div className="w-full max-w-[210px] border rounded-md p-2 mb-4">
							<ItemImage
								imagePath={borrowedItem?.item?.image_path || fallback}
								width={300}
								height={200}
								className="object-contain w-full h-auto"
								alt="ItemImage"
							/>
						</div>
					</div>

					<div className="flex-1 max-w-full lg:max-w-[300px]">
						<h3 className="text-xl font-semibold mb-3">Return item</h3>
						<div className="space-y-3">
							<div>
								<Label
									htmlFor="quantity"
									value="Returned Quantity"
									className="mb-1 block text-sm"
								/>
								<TextInput
									id="quantity"
									type="number"
									value={returnedQuantity}
									onChange={(e) =>
										setReturnedQuantity(parseInt(e.target.value))
									}
									min={1}
									max={borrowedItem?.borrowed_quantity || 1}
									className="w-full text-sm"
									size="sm"
									disabled={
										isReturnItemPending || borrowedItem?.t_status === "returned"
									}
								/>
							</div>

							<div>
								<Label
									htmlFor="remarks"
									value="Remarks"
									className="mb-1 block text-sm"
								/>
								<Textarea
									id="remarks"
									value={remarks}
									onChange={(e) => setRemarks(e.target.value)}
									rows={3}
									className="w-full text-sm"
									placeholder="Add any additional notes or remarks about the returned item"
									disabled={
										isReturnItemPending || borrowedItem?.t_status === "returned"
									}
								/>
							</div>

							<Button
								color="dark"
								size="sm"
								onClick={handleReturnItem}
								disabled={
									isReturnItemPending || borrowedItem?.t_status === "returned"
								}
								className="w-full mt-2"
							>
								{borrowedItem?.t_status === "returned"
									? "Returned"
									: "Set as Returned"}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default BorrowedItemPage;
