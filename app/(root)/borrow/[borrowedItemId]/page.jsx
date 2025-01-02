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
import Image from "next/image";
import { getImageUrl } from "../../../../utils/imageUtils";

const BorrowedItemPage = ({ params }) => {
	const bItemId = params.borrowedItemId;
	const {
		mutateAsync: returnItem,
		isPending: isReturnItemPending,
		isSuccess: isReturnItemSuccess,
	} = useReturnBorrowedItems();

	const { data: borrowedItem, isLoading: isItemLoading } =
		useGetTransactionById(parseInt(bItemId));

	console.log(borrowedItem);

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
		<section className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
			<div className="container mx-auto px-4 py-8">
				<Headerbox
					title="Borrowed Item Details"
					subtext="Review and return the borrowed item"
					className="mb-8 bg-white rounded-xl shadow-sm p-8 border border-gray-100"
				/>

				<div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
					<div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
						<div>
							<h2 className="text-3xl font-bold text-gray-800 mb-2">
								Review your borrowed item
							</h2>
							<p className="text-gray-600">
								Please review the item details and return if ready.
							</p>
						</div>
						<div
							className={`px-4 py-2 rounded-full ${
								borrowedItem?.t_status === "returned"
									? "bg-green-50 text-green-700 border border-green-200"
									: "bg-amber-50 text-amber-700 border border-amber-200"
							}`}
						>
							<div className="flex items-center space-x-2">
								{borrowedItem?.t_status === "returned" ? (
									<FaCheckCircle className="w-4 h-4" />
								) : (
									<FaCircleExclamation className="w-4 h-4" />
								)}
								<span className="font-medium">
									{borrowedItem?.t_status === "returned"
										? "Returned"
										: "Borrowed"}
								</span>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-12">
						<div className="space-y-6">
							<div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
								<h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
									<span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
										<span className="text-sm">1</span>
									</span>
									Borrower details
								</h3>
								<div className="space-y-3 text-gray-600">
									<div className="flex flex-col">
										<span className="text-sm text-gray-500">Borrower</span>
										<span className="font-medium">
											{borrowedItem?.recipient?.name}
										</span>
									</div>
									<div className="flex flex-col">
										<span className="text-sm text-gray-500">Contact No.</span>
										<span className="font-medium">
											{borrowedItem?.recipient?.contact_number}
										</span>
									</div>
									<div className="flex flex-col">
										<span className="text-sm text-gray-500">Email</span>
										<span className="font-medium text-wrap">
											{borrowedItem?.recipient.email}
										</span>
									</div>
									<div className="flex flex-col">
										<span className="text-sm text-gray-500">
											Tested & Released By
										</span>
										<span className="font-medium">
											{borrowedItem?.tested_by || "--"}
										</span>
									</div>
								</div>
							</div>
						</div>

						<div className="space-y-6">
							<div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
								<h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
									<span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
										<span className="text-sm">2</span>
									</span>
									Item details
								</h3>
								<div className="space-y-3 text-gray-600">
									<div className="flex flex-col">
										<span className="text-sm text-gray-500">Name</span>
										<span className="font-medium">
											{borrowedItem?.item?.name}
										</span>
									</div>
									<div className="flex flex-col">
										<span className="text-sm text-gray-500">Category</span>
										<span className="font-medium">
											{categoriesList[borrowedItem?.item?.category]}
										</span>
									</div>
									<div className="flex flex-col">
										<span className="text-sm text-gray-500">Condition</span>
										<span className="font-medium">
											{borrowedItem?.item?.item_condition}
										</span>
									</div>
									<div className="flex flex-col">
										<span className="text-sm text-gray-500">Date Borrowed</span>
										<span className="font-medium">
											{borrowedItem?.start_date
												? format(
														new Date(borrowedItem?.start_date),
														"MMMM dd, yyyy"
												  )
												: "-"}
										</span>
									</div>
									<div className="flex flex-col">
										<span className="text-sm text-gray-500">
											Expected Return Date
										</span>
										<span className="font-medium">
											{borrowedItem?.end_date
												? format(
														new Date(borrowedItem?.end_date),
														"MMMM dd, yyyy"
												  )
												: "-"}
										</span>
									</div>
								</div>
								<div className="mt-6">
									<div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
										<ItemImage
											imagePath={borrowedItem?.item?.image_path || fallback}
											width={300}
											height={200}
											className="object-contain w-full h-auto rounded-md"
											alt="ItemImage"
										/>
									</div>
								</div>
							</div>
						</div>

						<div className="space-y-6">
							<div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
								<h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
									<span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
										<span className="text-sm">3</span>
									</span>
									Proof of Transaction
								</h3>
								<div className="mt-2">
									<div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
										<Image
											src={getImageUrl(borrowedItem?.signature) || fallback}
											alt="Proof of Transaction"
											width={200}
											height={200}
											className="w-full h-[200px] object-cover rounded-md"
										/>
									</div>
									<p className="text-sm text-gray-500 mt-2">
										Image showing the transaction details and signatures
									</p>
								</div>
							</div>
						</div>

						<div className="space-y-6">
							<div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
								<h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
									<span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
										<span className="text-sm">4</span>
									</span>
									Return item
								</h3>
								<div className="space-y-4">
									<div>
										<Label
											htmlFor="returnedCondition"
											value="Returned Condition"
											className="mb-2 block text-sm font-medium text-gray-700"
										/>
										<Select
											id="returnedCondition"
											onChange={(e) => setNewCondition(e.target.value)}
											value={newCondition}
											name="returnedCondition"
											className="bg-white border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
										>
											<option value={borrowedItem?.item?.item_condition}>
												{borrowedItem?.item?.item_condition}
											</option>
											<option value="good">Good</option>
											<option value="Slightly Damaged">Slightly Damaged</option>
											<option value="damaged">Damaged</option>
										</Select>
									</div>
									<div>
										<Label
											htmlFor="quantity"
											value="Returned Quantity"
											className="mb-2 block text-sm font-medium text-gray-700"
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
											className="bg-white border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
											disabled={
												isReturnItemPending ||
												borrowedItem?.t_status === "returned"
											}
										/>
									</div>
									<div>
										<Label
											htmlFor="remarks"
											value="Remarks"
											className="mb-2 block text-sm font-medium text-gray-700"
										/>
										<Textarea
											id="remarks"
											value={remarks}
											onChange={(e) => setRemarks(e.target.value)}
											rows={3}
											className="bg-white border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
											placeholder="Add any additional notes or remarks about the returned item"
											disabled={
												isReturnItemPending ||
												borrowedItem?.t_status === "returned"
											}
										/>
									</div>
									<Button
										color="dark"
										onClick={handleReturnItem}
										disabled={
											isReturnItemPending ||
											borrowedItem?.t_status === "returned"
										}
										className="w-full mt-4 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200"
									>
										<div className="flex items-center justify-center space-x-2">
											{borrowedItem?.t_status === "returned" ? (
												<>
													<FaCheckCircle className="w-4 h-4" />
													<span>Returned</span>
												</>
											) : (
												<>
													<FaMinusCircle className="w-4 h-4" />
													<span>Set as Returned</span>
												</>
											)}
										</div>
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default BorrowedItemPage;
