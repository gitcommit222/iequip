"use client";
import { Table, Tooltip, Modal, Button } from "flowbite-react";
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
import ExcelJS from "exceljs";

const SupplyTransactions = () => {
	const { data: distributed, isLoading: isDistributedItemLoading } =
		useGetSupplyTransactions();

	console.log(distributed);

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

	const exportToExcel = async () => {
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet("Supply Transactions", {
			views: [{ showGridLines: false }],
		});

		try {
			// Set column widths
			worksheet.columns = [
				{ width: 30 }, // Recipient
				{ width: 30 }, // Email
				{ width: 30 }, // Item Received
				{ width: 20 }, // Date Distributed
				{ width: 30 }, // Released By
			];

			// Add headers with the current date
			const currentDate = format(new Date(), "MMMM dd, yyyy");
			const headerRows = [
				"PROVINCIAL DISASTER RISK REDUCTION AND MANAGEMENT OFFICE",
				"ADMINISTRATION AND TRAINING DIVISION",
				currentDate,
				"PDRRMO Main office",
				"( Supply Transactions )",
			];

			headerRows.forEach((text, index) => {
				const row = worksheet.addRow([text]);
				worksheet.mergeCells(`A${index + 1}:E${index + 1}`);
				row.height = 20;
				row.font = { bold: true, size: 12 };
				row.alignment = { horizontal: "center", vertical: "middle" };
			});

			// Add table headers
			const headerRow = worksheet.addRow([
				"Recipient",
				"Email",
				"Item Received",
				"Date Distributed",
				"Released By",
			]);
			headerRow.font = { bold: true, size: 11 };
			headerRow.alignment = { horizontal: "center", vertical: "middle" };

			// Style header cells and add borders
			headerRow.eachCell((cell) => {
				cell.border = {
					top: { style: "thin" },
					bottom: { style: "thin" },
					left: { style: "thin" },
					right: { style: "thin" },
				};
			});

			// Add data rows
			if (distributed && distributed.data) {
				distributed.data.forEach((item) => {
					const itemRow = [
						item.recipient.name,
						item.recipient.email,
						item.supplies
							.map(
								(s) => `${s.item_name} (${s.SupplyTransactionItems.quantity})`
							)
							.join(", "),
						format(new Date(item.distribution_date), "MM/dd/yy"),
						item.released_by,
					];
					const row = worksheet.addRow(itemRow);
					row.eachCell((cell) => {
						cell.border = {
							top: { style: "thin" },
							bottom: { style: "thin" },
							left: { style: "thin" },
							right: { style: "thin" },
						};
					});
				});
			}

			worksheet.addRow([]);
			worksheet.addRow([]);

			// Footer section
			const footerRow = worksheet.addRow([
				"",
				"Prepared by:",
				"Reviewed by:",
				"Certified Correct:",
				"",
			]);
			footerRow.height = 20;
			footerRow.font = { size: 11 };

			// Style footer cells
			["B", "C", "D"].forEach((col) => {
				const cell = worksheet.getCell(`${col}${footerRow.number}`);
				cell.border = {
					top: { style: "thin" },
					left: { style: "thin" },
					right: { style: "thin" },
					bottom: { style: "thin" },
				};
				cell.alignment = { horizontal: "left", vertical: "bottom" };
			});

			// Add names row
			const namesRow = worksheet.addRow([
				"",
				"Romer F. Zulueta",
				"John Keneth P. Baronggo",
				"Mario D. Mulingbayan, Jr.",
				"",
			]);
			namesRow.height = 20;
			namesRow.font = { size: 11, underline: true, bold: true };

			// Style name cells
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
			]);
			titlesRow.height = 20;
			titlesRow.font = { size: 11 };

			// Style title cells
			["B", "C", "D"].forEach((col) => {
				const cell = worksheet.getCell(`${col}${titlesRow.number}`);
				cell.border = {
					left: { style: "thin" },
					right: { style: "thin" },
					bottom: { style: "thin" },
				};
				cell.alignment = { horizontal: "center", vertical: "top" };
			});

			// Apply borders to all cells in the worksheet
			worksheet.eachRow((row) => {
				row.eachCell((cell) => {
					cell.border = {
						top: { style: "thin" },
						bottom: { style: "thin" },
						left: { style: "thin" },
						right: { style: "thin" },
					};
				});
			});

			// Generate file
			const blob = await workbook.xlsx.writeBuffer();
			const url = window.URL.createObjectURL(new Blob([blob]));
			const link = document.createElement("a");
			link.href = url;
			link.download = `Supply_Transactions_${currentDate}.xlsx`;
			link.click();
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Error generating Excel file:", error);
			toast.error("Error generating Excel file");
		}
	};

	return (
		<>
			<div className=" w-full flex items-center justify-end mb-2">
				<Button onClick={exportToExcel} color="success">
					Export to Excel
				</Button>
			</div>
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
							distributed.data.map((item) => (
								<Table.Row
									className="bg-white dark:border-gray-700 dark:bg-gray-800"
									key={item.id}
								>
									<Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
										{item.recipient.name}
									</Table.Cell>
									<Table.Cell>{item.recipient.email}</Table.Cell>
									<Table.Cell className="flex gap-2">
										{item.supplies.map((s) => (
											<p key={s.id}>
												{s.item_name} ({s.SupplyTransactionItems.quantity})
											</p>
										))}
									</Table.Cell>
									<Table.Cell className="capitalize">
										{format(new Date(item.distribution_date), "MM/dd/yy")}
									</Table.Cell>
									<Table.Cell className="capitalize">
										{item.released_by}
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
											<button onClick={() => handleDelete(item.id)}>
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
