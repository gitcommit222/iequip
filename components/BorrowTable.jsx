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
import { generateAndDownloadReceipt } from "../lib/generateReceipt";
import PageTransition from "./animations/PageTransition";

const BorrowTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [sortOrder, setSortOrder] = useState("desc");

	const {
		mutateAsync: deleteTransaction,
		isError,
		error: deleteError,
	} = useDeleteTransaction();

	const { data: transactions, isLoading: isTransactionFetching } =
		useGetTransactionsByCategory("items");

	const handleDelete = async (id) => {
		try {
			await toast.promise(deleteTransaction(id), {
				success: "Transaction deleted successfully",
				loading: "Deleting transaction...",
				error: "The item is currently borrowed.",
			});
		} catch (error) {
			console.log("The item is currently borrowed.");
		}
	};

	const filteredAndSortedTransactions = useMemo(() => {
		if (!transactions) return [];
		return transactions?.data
			.filter((item) => {
				const matchesSearch =
					item.recipient.name
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					item.recipient.email
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					item.item?.name.toLowerCase().includes(searchTerm.toLowerCase());

				console.log(item.t_status);

				const matchesStatus =
					statusFilter === "all" || statusFilter === item.t_status;
				return matchesSearch && matchesStatus;
			})
			.sort((a, b) => {
				const dateA = new Date(a.start_date);
				const dateB = new Date(b.start_date);
				return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
			});
	}, [transactions, searchTerm, statusFilter, sortOrder]);

	const exportToExcel = async () => {
		const ExcelJS = require("exceljs");
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet("Borrowed Items", {
			views: [{ showGridLines: false }],
		});

		try {
			// Set column widths
			worksheet.columns = [
				{ width: 6 }, // NO.
				{ width: 30 }, // BORROWER NAME
				{ width: 35 }, // EMAIL
				{ width: 30 }, // BORROWED ITEM
				{ width: 15 }, // DATE BORROWED
				{ width: 15 }, // STATUS
			];

			// Add header rows with borders
			const addHeaderRow = (text, rowIndex) => {
				const row = worksheet.addRow([text]);
				worksheet.mergeCells(`A${rowIndex}:F${rowIndex}`);
				row.height = 20;
				row.font = { bold: true, size: 11 };
				row.alignment = { horizontal: "center", vertical: "middle" };

				// Add green border for first row
				if (rowIndex === 1) {
					worksheet.getCell(`A${rowIndex}`).border = {
						top: { style: "medium", color: { argb: "00FF00" } },
						left: { style: "medium", color: { argb: "00FF00" } },
						right: { style: "medium", color: { argb: "00FF00" } },
					};
				}

				// Add thin borders for other cells
				["A", "B", "C", "D", "E", "F"].forEach((col) => {
					const cell = worksheet.getCell(`${col}${rowIndex}`);
					cell.border = {
						...cell.border,
						left: { style: "thin" },
						right: { style: "thin" },
						bottom: { style: "thin" },
					};
				});
			};

			// Add headers with the current date
			const currentDate = format(new Date(), "MMMM dd, yyyy");
			addHeaderRow(
				"PROVINCIAL DISASTER RISK REDUCTION AND MANAGEMENT OFFICE",
				1
			);
			addHeaderRow("ADMINISTRATION AND TRAINING DIVISION", 2);
			addHeaderRow(currentDate, 3);
			addHeaderRow("PDRRMO Main office", 4);
			addHeaderRow("( Borrowed Items Report )", 5);

			// Add table headers
			const headerRow = worksheet.addRow([
				"NO.",
				"BORROWER NAME",
				"EMAIL",
				"BORROWED ITEM",
				"DATE BORROWED",
				"STATUS",
			]);
			headerRow.height = 25;
			headerRow.font = { bold: true, size: 11 };
			headerRow.alignment = { horizontal: "center", vertical: "middle" };

			// Style header cells
			headerRow.eachCell((cell) => {
				cell.border = {
					top: { style: "thin" },
					bottom: { style: "thin" },
					left: { style: "thin" },
					right: { style: "thin" },
				};
			});

			// Add data rows
			filteredAndSortedTransactions.forEach((item, index) => {
				const row = worksheet.addRow([
					index + 1,
					item.recipient.name,
					item.recipient.email,
					item.item?.name || "-",
					format(new Date(item.start_date), "MM/dd/yy"),
					item.t_status,
				]);

				row.height = 20;

				// Style data cells
				row.eachCell((cell, colNumber) => {
					cell.border = {
						top: { style: "thin" },
						bottom: { style: "thin" },
						left: { style: "thin" },
						right: { style: "thin" },
					};

					// Center align specific columns
					if (colNumber === 1 || colNumber === 5 || colNumber === 6) {
						cell.alignment = { horizontal: "center", vertical: "middle" };
					} else {
						cell.alignment = { vertical: "middle" };
					}
				});
			});

			// Add empty rows for spacing
			worksheet.addRow([]);
			worksheet.addRow([]);

			// Footer section
			const startRow = worksheet.rowCount + 1;
			worksheet.addRow([]).height = 20;

			// Add footer labels row with proper grid
			const labelRow = worksheet.addRow([
				"",
				"Prepared by:",
				"Reviewed by:",
				"Certified Correct:",
				"",
				"",
			]);
			labelRow.height = 20;
			labelRow.font = { size: 11 };

			// Style the label cells
			["B", "C", "D"].forEach((col) => {
				const cell = worksheet.getCell(`${col}${labelRow.number}`);
				cell.border = {
					top: { style: "thin" },
					left: { style: "thin" },
					right: { style: "thin" },
				};
				cell.alignment = { horizontal: "left", vertical: "bottom" };
			});

			// Add names row
			const namesRow = worksheet.addRow([
				"",
				"Romer F. Zulueta",
				"John Keneth P. Baronggo",
				"Mario D. Mulingbayan,Jr.",
				"",
				"",
			]);
			namesRow.height = 20;
			namesRow.font = { size: 11, underline: true, bold: true };

			// Style the name cells
			["B", "C", "D"].forEach((col) => {
				const cell = worksheet.getCell(`${col}${namesRow.number}`);
				cell.border = {
					left: { style: "thin" },
					right: { style: "thin" },
				};
				cell.alignment = { horizontal: "center", vertical: "bottom" };
			});

			// Add titles row
			const titlesRow = worksheet.addRow([
				"",
				"Admin Aide IV",
				"PGADH-PDRRMO",
				"PGDH-PDRRMO",
				"",
				"",
			]);
			titlesRow.height = 20;
			titlesRow.font = { size: 11 };

			// Style the title cells
			["B", "C", "D"].forEach((col) => {
				const cell = worksheet.getCell(`${col}${titlesRow.number}`);
				cell.border = {
					left: { style: "thin" },
					right: { style: "thin" },
					bottom: { style: "thin" },
				};
				cell.alignment = { horizontal: "center", vertical: "top" };
			});

			// Generate file
			const buffer = await workbook.xlsx.writeBuffer();
			const blob = new Blob([buffer], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			});
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `PDRRMO_Borrowed_Items_${format(
				new Date(),
				"MMM-dd-yyyy"
			)}.xlsx`;
			link.click();
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Error generating Excel file:", error);
			toast.error("Error generating Excel file");
		}
	};

	const toggleSortOrder = () => {
		setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
	};

	return (
		<PageTransition>
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
						<option value="returned">Returned</option>
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
							<Table.HeadCell>Return Date</Table.HeadCell>
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
											{format(new Date(item.end_date), "MM/dd/yy")}
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
												<button
													onClick={() => generateAndDownloadReceipt(item)}
												>
													<FaFileDownload
														size={19}
														className="text-green-500"
													/>
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
		</PageTransition>
	);
};

export default BorrowTable;
