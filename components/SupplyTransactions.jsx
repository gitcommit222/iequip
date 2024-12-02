"use client";
import { Table, Tooltip, Modal } from "flowbite-react";
import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import {
	FaFileDownload,
	FaEye,
	FaUser,
	FaBox,
	FaCalendarAlt,
} from "react-icons/fa";
import {
	useDeleteSupplyTransaction,
	useGetSupplyTransactions,
} from "../hooks/useSupplyTransactions";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { generateSupplyDistributionReceipt } from "../lib/generateReceipt";

const SupplyTransactions = () => {
	const { data: distributed, isLoading: isDistributedItemLoading } =
		useGetSupplyTransactions();

	const { mutateAsync: deleteSupplyTransaction } = useDeleteSupplyTransaction();

	const [openModal, setOpenModal] = useState(false);
	const [selectedTransaction, setSelectedTransaction] = useState(null);

	const handleDelete = async (id) => {
		await toast.promise(deleteSupplyTransaction(id), {
			success: "Transaction deleted successfully",
			loading: "Deleting transaction...",
			error: "Failed to delete transaction",
		});
	};

	const handleView = (transaction) => {
		setSelectedTransaction(transaction);
		setOpenModal(true);
	};

	return (
		<>
			<div className="overflow-x-auto shadow-sm">
				<Table>
					<Table.Head>
						<Table.HeadCell>Recipient</Table.HeadCell>
						<Table.HeadCell>Email</Table.HeadCell>
						<Table.HeadCell>Item Received</Table.HeadCell>
						<Table.HeadCell>Date Distributed</Table.HeadCell>
						<Table.HeadCell>Released By</Table.HeadCell>
						<Table.HeadCell>Actions</Table.HeadCell>
					</Table.Head>
					<Table.Body className="divide-y">
						{distributed &&
							distributed.map((item) => (
								<Table.Row
									className={`bg-white dark:border-gray-700 dark:bg-gray-800`}
									key={item.id}
								>
									<Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
										{item?.recipient.name}
									</Table.Cell>
									<Table.Cell>{item?.recipient.email}</Table.Cell>
									<Table.Cell className="flex gap-2">
										{item?.supplies.map((s) => (
											<p key={s.id}>
												{s?.item_name} ({s?.quantity_distributed})
											</p>
										))}
									</Table.Cell>
									<Table.Cell className="capitalize">
										{format(new Date(item?.distribution_date), "MM/dd/yy")}
									</Table.Cell>
									<Table.Cell className="capitalize">
										{item?.released_by}
									</Table.Cell>
									<Table.Cell className="flex items-center gap-2">
										<Tooltip content="View Details">
											<button onClick={() => handleView(item)}>
												<FaEye size={19} className="text-blue-500" />
											</button>
										</Tooltip>
										<Tooltip content="Download Receipt">
											<button
												onClick={() => generateSupplyDistributionReceipt(item)}
											>
												<FaFileDownload size={19} className="text-green-500" />
											</button>
										</Tooltip>
										<Tooltip content="Delete">
											<button onClick={() => handleDelete(item?.id)}>
												<MdDelete size={21} className="text-red-500" />
											</button>
										</Tooltip>
									</Table.Cell>
								</Table.Row>
							))}
					</Table.Body>
				</Table>
			</div>

			<Modal show={openModal} onClose={() => setOpenModal(false)}>
				<Modal.Header className="border-b border-gray-200">
					<h2 className="text-xl font-semibold text-gray-800">
						Summary of Distribution
					</h2>
				</Modal.Header>
				<Modal.Body className="p-6">
					{selectedTransaction && (
						<div className="space-y-6">
							{/* Recipient Information */}
							<div className="bg-gray-50 p-4 rounded-lg">
								<h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
									<FaUser className="mr-2 text-gray-600" /> Recipient
									Information
								</h3>
								<div className="grid grid-cols-2 gap-3 text-gray-600">
									<p>
										<span className="font-medium">Name:</span>{" "}
										{selectedTransaction.recipient.name}
									</p>
									<p>
										<span className="font-medium">Email:</span>{" "}
										{selectedTransaction.recipient.email}
									</p>
									<p>
										<span className="font-medium">Contact:</span>{" "}
										{selectedTransaction.recipient.contact_number}
									</p>
									<p>
										<span className="font-medium">Department:</span>{" "}
										{selectedTransaction.recipient.department}
									</p>
								</div>
							</div>

							{/* Items Received */}
							<div className="bg-gray-50 p-4 rounded-lg">
								<h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
									<FaBox className="mr-2 text-gray-600" /> Items Received
								</h3>
								<div className="grid gap-2">
									{selectedTransaction.supplies.map((supply) => (
										<div
											key={supply.id}
											className="flex items-center justify-between bg-white p-2 rounded border border-gray-200"
										>
											<span className="font-medium text-gray-700">
												{supply.item_name}
											</span>
											<span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
												Qty: {supply.quantity_distributed}
											</span>
										</div>
									))}
								</div>
							</div>

							{/* Distribution Details */}
							<div className="bg-gray-50 p-4 rounded-lg">
								<h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
									<FaCalendarAlt className="mr-2 text-gray-600" /> Distribution
									Details
								</h3>
								<div className="grid grid-cols-2 gap-3 text-gray-600">
									<p>
										<span className="font-medium">Date:</span>{" "}
										{format(
											new Date(selectedTransaction.distribution_date),
											"MMMM dd, yyyy"
										)}
									</p>
									<p>
										<span className="font-medium">Released By:</span>{" "}
										{selectedTransaction.released_by}
									</p>
								</div>
							</div>
						</div>
					)}
				</Modal.Body>
			</Modal>
		</>
	);
};

export default SupplyTransactions;
