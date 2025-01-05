"use client";
import { useState, useMemo, useCallback } from "react";
import Headerbox from "../../../components/shared/Headerbox";
import { Button, Table, TextInput, Tooltip, Checkbox } from "flowbite-react";
import {
	FaSearch,
	FaFileExport,
	FaSortAmountDown,
	FaSortAmountUp,
	FaCheck,
} from "react-icons/fa";
import { useDeleteGoods, useGetGoods } from "../../../hooks/useGoods";
import AddSupplyForm from "../../../components/AddSupplyForm";
import CustomPopover from "../../../components/shared/Popover";
import { truncateText } from "../../../helpers/truncateText";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { supplyCategories } from "../../../lib/supplyCategory";
import AddTransactionForm from "../../../components/AddTransactionForm";
import { useCreateSupplyTransaction } from "../../../hooks/useSupplyTransactions";
import PageTransition from "../../../components/animations/PageTransition";
import ExcelJS from "exceljs";
import { format } from "date-fns"; // Ensure date formatting library is available

const Supplies = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [sortConfig, setSortConfig] = useState({
		key: "item_name",
		direction: "asc",
	});
	const [selectedItems, setSelectedItems] = useState([]);
	const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

	const { mutateAsync: deleteGoods } = useDeleteGoods();
	const { data: goodsData, isLoading: isGoodsLoading } = useGetGoods();
	const { mutateAsync: createSupplyTransaction } = useCreateSupplyTransaction();

	const goods = useMemo(() => {
		return goodsData?.data || [];
	}, [goodsData]);

	const handleDeleteGoods = (goodsId) => {
		toast.promise(deleteGoods(goodsId), {
			success: "Supply deleted",
			loading: "Deleting...",
			error: "Can't delete supply",
		});
	};

	const filteredAndSortedGoods = useMemo(() => {
		if (!goods || !Array.isArray(goods)) return [];
		return goods
			.filter((item) =>
				item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
			)
			.sort((a, b) => {
				if (a[sortConfig.key] < b[sortConfig.key]) {
					return sortConfig.direction === "asc" ? -1 : 1;
				}
				if (a[sortConfig.key] > b[sortConfig.key]) {
					return sortConfig.direction === "asc" ? 1 : -1;
				}
				return 0;
			});
	}, [goods, searchTerm, sortConfig]);

	const handleSort = (key) => {
		setSortConfig((prevConfig) => ({
			key,
			direction:
				prevConfig.key === key && prevConfig.direction === "asc"
					? "desc"
					: "asc",
		}));
	};
	const exportToExcel = async () => {
		const ExcelJS = require("exceljs");
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet("Supplies", {
			views: [{ showGridLines: false }],
		});

		try {
			// Set column widths for better formatting
			worksheet.columns = [
				{ width: 10 }, // NO. (wider)
				{ width: 20 }, // ITEM (smaller, same size as Quantity Available)
				{ width: 20 }, // QTY (same size as ITEM column)
				{ width: 15 }, // QUANTITY DISTRIBUTED (slightly wider for better readability)
				{ width: 15 }, // UNIT (same width as ITEM and QTY columns)
			];

			// Add header rows with borders
			const addHeaderRow = (text, rowIndex) => {
				const row = worksheet.addRow([text]);
				worksheet.mergeCells(`A${rowIndex}:E${rowIndex}`);
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
				["A", "B", "C", "D", "E"].forEach((col) => {
					const cell = worksheet.getCell(`${col}${rowIndex}`);
					cell.border = {
						...cell.border,
						left: { style: "thin" },
						right: { style: "thin" },
						bottom: { style: "thin" },
					};
				});
			};

			// Determine the category name for the filename (if any)
			const uniqueCategories = new Set(
				filteredAndSortedGoods.map((supply) => supply.category)
			);

			const categoryName =
				uniqueCategories.size > 1
					? "All"
					: categoryFilter === "all"
					? "All"
					: supplyCategories[parseInt(categoryFilter)];

			// Add headers with the current date
			const currentDate = format(new Date(), "MMMM dd, yyyy"); // Format the current date
			addHeaderRow(
				"PROVINCIAL DISASTER RISK REDUCTION AND MANAGEMENT OFFICE",
				1
			);
			addHeaderRow("ADMINISTRATION AND TRAINING DIVISION", 2);
			addHeaderRow(currentDate, 3); // Use current date in the header
			addHeaderRow("PDRRMO Main office", 4);
			addHeaderRow(`( ${categoryName + " Supplies"} )`, 5); // Use current filtered category

			// Add table headers
			const headerRow = worksheet.addRow([
				"NO.",
				"ITEM",
				"AVAILABLE",
				"DISTRIBUTED",
				"UNIT",
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

			// Convert data to the format you provided earlier
			const dataToExport = filteredAndSortedGoods.map((item, index) => ({
				NO: index + 1,
				Name: item.item_name,
				"Quantity Available": item.quantity_available,
				"Quantity Distributed": item.quantity_distributed,
				Unit: item.unit,
			}));

			// Add data rows
			dataToExport.forEach((rowData) => {
				const row = worksheet.addRow([
					rowData.NO,
					rowData.Name,
					rowData["Quantity Available"],
					rowData["Quantity Distributed"],
					rowData.Unit,
				]);
				row.height = 20;

				// Style data cells (apply borders to columns A to F)
				row.eachCell((cell, colNumber) => {
					// Apply thin borders for all cells
					const cellLetter = String.fromCharCode(65 + colNumber - 1); // Converts to column letter
					cell.border = {
						top: { style: "thin" },
						bottom: { style: "thin" },
						left: { style: "thin" },
						right: { style: "thin" },
					};

					// Center align number and quantity columns (NO, Quantity columns)
					if (colNumber === 1 || colNumber === 3 || colNumber === 4) {
						cell.alignment = { horizontal: "center", vertical: "middle" };
					} else {
						cell.alignment = { vertical: "middle" };
					}
				});
			});

			// Add empty rows for spacing
			worksheet.addRow([]);
			worksheet.addRow([]);

			// Footer section starting after the data
			const startRow = worksheet.rowCount + 1;

			// Add an empty row before footer
			worksheet.addRow([]).height = 20;

			// Configure footer column widths
			worksheet.getColumn(1).width = 6; // NO. Column, wider
			worksheet.getColumn(2).width = 50; // ITEM Column
			worksheet.getColumn(3).width = 30; // QTY Column
			worksheet.getColumn(4).width = 30; // QUANTITY DISTRIBUTED
			worksheet.getColumn(5).width = 6; // UNIT Column

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

			// Add empty rows at the bottom for spacing
			worksheet.addRow([]).height = 20;
			worksheet.addRow([]).height = 20;

			// Generate file
			const buffer = await workbook.xlsx.writeBuffer();
			const blob = new Blob([buffer], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			});
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `PDRRMO_Supplies_${categoryName}_${format(
				new Date(),
				"MMM-dd-yyyy"
			)}.xlsx`; // Current date in filename
			link.click();
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Error generating Excel file:", error);
			toast.error("Error generating Excel file");
		}
	};

	const handleItemSelect = useCallback((item) => {
		setSelectedItems((prev) =>
			prev.some((i) => i.id === item.id)
				? prev.filter((i) => i.id !== item.id)
				: [...prev, item]
		);
	}, []);

	const handleDistribute = useCallback(() => {
		if (selectedItems.length > 0) {
			setIsTransactionModalOpen(true);
		} else {
			toast.error("Please select at least one item to distribute");
		}
	}, [selectedItems]);

	return (
		<section className="space-y-4">
			<div className="w-full flex items-center justify-between mb-4">
				<Headerbox
					title="Supplies"
					subtext="Manage and keep track of your supplies here."
				/>
				<div className="flex gap-2">
					<Button
						onClick={handleDistribute}
						color="gray"
						disabled={selectedItems.length === 0}
					>
						Distribute
					</Button>
					<AddSupplyForm
						type="add"
						className="text-[12px] border border-gray-300 p-3 rounded-md hover:text-green-400"
					/>
				</div>
			</div>
			<PageTransition>
				<div className="flex gap-4">
					<TextInput
						icon={FaSearch}
						placeholder="Search supplies..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="flex-grow"
					/>
					<Button onClick={() => handleSort("item_name")} color="light">
						{sortConfig.direction === "asc" ? (
							<FaSortAmountUp className="mr-2" />
						) : (
							<FaSortAmountDown className="mr-2" />
						)}
						Sort by Name
					</Button>

					<Button onClick={exportToExcel} color="success">
						<FaFileExport className="mr-2" />
						Export to Excel
					</Button>
				</div>
				<div className="bg-white rounded-lg shadow-sm overflow-x-auto">
					<Table hoverable>
						<Table.Head>
							<Table.HeadCell>Select</Table.HeadCell>
							<Table.HeadCell onClick={() => handleSort("item_name")}>
								Supply name
							</Table.HeadCell>
							<Table.HeadCell onClick={() => handleSort("category")}>
								Category
							</Table.HeadCell>
							<Table.HeadCell onClick={() => handleSort("description")}>
								Description
							</Table.HeadCell>
							<Table.HeadCell onClick={() => handleSort("quantity_available")}>
								Quantity Available
							</Table.HeadCell>
							<Table.HeadCell
								onClick={() => handleSort("quantity_distributed")}
							>
								Quantity Distributed
							</Table.HeadCell>

							<Table.HeadCell onClick={() => handleSort("remarks")}>
								Expiration Date
							</Table.HeadCell>
							<Table.HeadCell>Actions</Table.HeadCell>
						</Table.Head>
						<Table.Body className="divide-y">
							{!isGoodsLoading &&
								filteredAndSortedGoods.map((item, index) => (
									<tr
										key={item?.id}
										className={`bg-white dark:border-gray-700 dark:bg-gray-800 ${
											item.quantity_available === 0
												? "opacity-50 pointer-events-none"
												: ""
										}`}
									>
										<Table.Cell>
											<Checkbox
												checked={selectedItems.some((i) => i.id === item.id)}
												onChange={() => handleItemSelect(item)}
												disabled={item.quantity_available === 0}
											/>
										</Table.Cell>
										<Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
											<Tooltip content={item.item_name}>
												{truncateText(item?.item_name, 20)}
											</Tooltip>
										</Table.Cell>
										<Table.Cell>{supplyCategories[item.category]}</Table.Cell>
										<Table.Cell>
											{truncateText(item.description, 30)}
										</Table.Cell>
										<Table.Cell>{item.quantity_available}</Table.Cell>
										<Table.Cell>{item.quantity_distributed}</Table.Cell>
										<Table.Cell>{item.expiration_date}</Table.Cell>
										<Table.Cell className="flex gap-2">
											<AddSupplyForm
												className="text-cyan-500 font-medium"
												btnTitle="Edit"
												goodsId={item.id}
												data={item}
												type="edit"
											/>
											<CustomPopover
												title="Are you sure?"
												button={
													<button className="font-medium text-red-500">
														Delete
													</button>
												}
												content={
													<div className="p-3">
														<p className="text-[14px] mb-2">
															You want to delete this supply?
														</p>
														<div className="flex gap-3 items-center justify-center">
															<Button
																onClick={() => handleDeleteGoods(item?.id)}
																pill
																size="xs"
																color="gray"
															>
																<div className="flex items-center gap-1 justify-center">
																	<FaCheck
																		size={16}
																		className="text-green-500"
																	/>
																	<p>Yes</p>
																</div>
															</Button>
														</div>
													</div>
												}
											/>
										</Table.Cell>
									</tr>
								))}
						</Table.Body>
					</Table>
				</div>
			</PageTransition>
			{isTransactionModalOpen && (
				<AddTransactionForm
					createSupplyTransaction={createSupplyTransaction}
					supplies={selectedItems}
					isOpen={isTransactionModalOpen}
					onClose={() => setIsTransactionModalOpen(false)}
				/>
			)}
		</section>
	);
};

export default Supplies;
