"use client";
import { Table, Tooltip } from "flowbite-react";
import React from "react";
import { MdDelete } from "react-icons/md";
import { FaFileDownload } from "react-icons/fa";
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

	const handleDelete = async (id) => {
		await toast.promise(deleteSupplyTransaction(id), {
			success: "Transaction deleted successfully",
			loading: "Deleting transaction...",
			error: "Failed to delete transaction",
		});
	};

	return (
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
										<p key={s.id}>{s?.item_name}</p>
									))}
								</Table.Cell>
								<Table.Cell className="capitalize">
									{format(new Date(item?.distribution_date), "MM/dd/yy")}
								</Table.Cell>
								<Table.Cell className="capitalize">
									{item?.released_by}
								</Table.Cell>
								<Table.Cell className="flex items-center gap-2">
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
	);
};

export default SupplyTransactions;
