"use client";
import { Table, Tooltip, TextInput, Select, Button } from "flowbite-react";
import Link from "next/link";
import {
	useGetTransactionsByCategory,
	useDeleteTransaction,
} from "../hooks/useTransactions";
import { GrFormView } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import {
	FaSearch,
	FaFileExport,
	FaSortAmountDown,
	FaSortAmountUp,
	FaFileDownload,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { generateAndDownloadReceipt } from "../lib/generateReceipt";

const BorrowTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [sortOrder, setSortOrder] = useState("desc");

	const { mutateAsync: deleteTransaction } = useDeleteTransaction();

	const { data: transactions, isLoading: isTransactionFetching } =
		useGetTransactionsByCategory("items");

	const handleDelete = async (id) => {
		await toast.promise(deleteTransaction(id), {
			success: "Transaction deleted successfully",
			loading: "Deleting transaction...",
			error: "Failed to delete transaction",
		});
	};

	const filteredAndSortedTransactions = useMemo(() => {
		if (!transactions) return [];
		return transactions
			.filter((item) => {
				const matchesSearch =
					item.recipient.name
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					item.recipient.email
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					item.item?.name.toLowerCase().includes(searchTerm.toLowerCase());

				const matchesStatus =
					statusFilter === "all" ||
					(statusFilter === "borrowed" && item.item.status !== "available") ||
					(statusFilter === "available" && item.item.status === "available") ||
					(statusFilter === "lost" && item.item.status === "lost");

				return matchesSearch && matchesStatus;
			})
			.sort((a, b) => {
				const dateA = new Date(a.start_date);
				const dateB = new Date(b.start_date);
				return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
			});
	}, [transactions, searchTerm, statusFilter, sortOrder]);

	const exportToExcel = () => {
		const dataToExport = filteredAndSortedTransactions.map((item) => ({
			"Borrower Name": item.recipient.name,
			Email: item.recipient.email,
			"Borrowed Item": item.item?.name || "-",
			"Date Borrowed": format(new Date(item.start_date), "MM/dd/yy"),
			Status:
				item?.item.status === "available" ? "Returned" : item?.item.status,
		}));

		const ws = XLSX.utils.json_to_sheet(dataToExport);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Borrowed Items");
		XLSX.writeFile(wb, "borrowed_items.xlsx");
	};

	const toggleSortOrder = () => {
		setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
	};

	return (
		<div className="space-y-4">
			<div className="flex gap-4">
				<TextInput
					icon={FaSearch}
					placeholder="Search by name, email, or item"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="flex-grow"
				/>
				<Select
					value={statusFilter}
					onChange={(e) => setStatusFilter(e.target.value)}
				>
					<option value="all">All Status</option>
					<option value="borrowed">Borrowed</option>
					<option value="available">Returned</option>
					<option value="lost">Lost</option>
				</Select>
				<Button onClick={toggleSortOrder} color="light">
					{sortOrder === "asc" ? (
						<FaSortAmountUp className="mr-2" />
					) : (
						<FaSortAmountDown className="mr-2" />
					)}
					Sort by Date
				</Button>
				<Button onClick={exportToExcel} color="success">
					<FaFileExport className="mr-2" />
					Export to Excel
				</Button>
			</div>
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
						{!isTransactionFetching &&
							filteredAndSortedTransactions.map((item) => (
								<Table.Row
									key={item.id}
									className={`bg-white dark:border-gray-700 dark:bg-gray-800`}
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
										{item?.t_status}
									</Table.Cell>
									<Table.Cell className="flex items-center gap-2">
										<Tooltip content="View">
											<Link href={`/borrow/${item?.id}`}>
												<GrFormView size={23} className="text-blue-500" />
											</Link>
										</Tooltip>
										<Tooltip content="Download Receipt">
											<button onClick={() => generateAndDownloadReceipt(item)}>
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
		</div>
	);
};

export default BorrowTable;
