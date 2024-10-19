"use client";
import { Table, Tooltip } from "flowbite-react";
import { useFetchBorrowedItems } from "../hooks/useBorrowItem";
import Link from "next/link";
import {
	useGetTransactionsByCategory,
	useDeleteTransaction,
} from "../hooks/useTransactions";
import { GrFormView } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import { format } from "date-fns";

const BorrowTable = () => {
	const { mutateAsync: deleteTransaction } = useDeleteTransaction();

	const { data: transactions, isLoading: isTransactionFetching } =
		useGetTransactionsByCategory("items");

	console.log(transactions);

	const handleDelete = async (id) => {
		await toast.promise(deleteTransaction(id), {
			success: "Transaction deleted successfully",
			loading: "Deleting transaction...",
			error: "Failed to delete transaction",
		});
	};

	return (
		<div className="overflow-x-auto shadow-sm">
			<Table>
				<Table.Head>
					<Table.HeadCell>Borrower name</Table.HeadCell>
					<Table.HeadCell>Email</Table.HeadCell>
					<Table.HeadCell>Borrowed Item</Table.HeadCell>
					<Table.HeadCell>Date Borrowed</Table.HeadCell>
					<Table.HeadCell>Status</Table.HeadCell>
					<Table.HeadCell>Actions</Table.HeadCell>
				</Table.Head>
				<Table.Body className="divide-y">
					{transactions &&
						!isTransactionFetching &&
						transactions.map((item) => (
							<Table.Row
								key={item.id}
								className="bg-white dark:border-gray-700 dark:bg-gray-800"
							>
								<Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
									{item.recipient.name}
								</Table.Cell>
								<Table.Cell>{item.recipient.email}</Table.Cell>
								<Table.Cell>{item.item?.name || "-"}</Table.Cell>
								<Table.Cell>
									{format(new Date(item.start_date), "MM/dd/yy")}
								</Table.Cell>
								<Table.Cell className="capitalize">
									{item?.item.status}
								</Table.Cell>
								<Table.Cell className="flex gap-2">
									<Tooltip content="View">
										<Link href={`/borrow/${item?.id}`}>
											<GrFormView size={23} className="text-blue-500" />
										</Link>
									</Tooltip>
									<Tooltip content="Delete">
										<button onClick={() => handleDelete(item?.id)}>
											<MdDelete size={23} className="text-red-500" />
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

export default BorrowTable;
