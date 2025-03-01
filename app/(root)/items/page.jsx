"use client";
import { useRef, useState, useMemo, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { toPng } from "html-to-image";
import {
	FaImage,
	FaSearch,
	FaFileExport,
	FaSortAmountDown,
	FaSortAmountUp,
	FaCheck,
	FaCopy,
	FaChevronLeft,
	FaChevronRight,
} from "react-icons/fa";
import {
	Table,
	Button,
	Tooltip,
	Badge,
	TextInput,
	Select,
	FileInput,
} from "flowbite-react";
import Image from "next/image";
import { saveBtn, view } from "../../../public";
import {
	useBulkCreateItems,
	useDeleteItems,
	useGetItems,
} from "../../../hooks/useItem";
import CustomPopover from "../../../components/shared/Popover";
import AddItemForm from "../../../components/AddItemForm";
import CustomModal from "../../../components/shared/CustomModal";
import { truncateText } from "../../../helpers/truncateText";
import toast from "react-hot-toast";
import { categoriesList } from "../../../lib/categories";
import Headerbox from "../../../components/shared/Headerbox";
import { QRCodeCanvas } from "qrcode.react";
import { getImageUrl } from "../../../utils/imageUtils";
import { format } from "date-fns";
import MiniLoader from "../../../components/loader/miniLoader";
import PageTransition from "../../../components/animations/PageTransition";

const Items = () => {
	const barcodeRef = useRef();
	const [searchTerm, setSearchTerm] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [sortConfig, setSortConfig] = useState({
		key: "name",
		direction: "asc",
	});
	const [selectedItems, setSelectedItems] = useState([]);
	const [cursor, setCursor] = useState(null);
	const [prevCursor, setPrevCursor] = useState(null);
	const [cursorStack, setCursorStack] = useState([]);

	const { mutateAsync: deleteItem } = useDeleteItems();
	const { data: items, isLoading: isItemLoading } = useGetItems(cursor);

	const handleDeleteItem = (itemId) => {
		toast.promise(deleteItem(itemId), {
			success: "Item deleted",
			loading: "Deleting...",
			error: "Can't delete item",
		});
	};

	const downloadBarcode = () => {
		if (barcodeRef.current) {
			toPng(barcodeRef.current)
				.then((dataUrl) => {
					const link = document.createElement("a");
					link.href = dataUrl;
					link.download = "QRCode.png";
					link.click();
				})
				.catch((error) => {
					console.error("Error converting QRCode to image:", error);
				});
		}
	};

	const filteredAndSortedItems = useMemo(() => {
		if (!items) return [];
		return items?.data
			.filter((item) => {
				const matchesSearch = item.name
					.toLowerCase()
					.includes(searchTerm.toLowerCase());
				const matchesCategory =
					categoryFilter === "all" ||
					item.category === parseInt(categoryFilter);
				return matchesSearch && matchesCategory;
			})
			.sort((a, b) => {
				if (a[sortConfig.key] < b[sortConfig.key]) {
					return sortConfig.direction === "asc" ? -1 : 1;
				}
				if (a[sortConfig.key] > b[sortConfig.key]) {
					return sortConfig.direction === "asc" ? 1 : -1;
				}
				return 0;
			});
	}, [items, searchTerm, categoryFilter, sortConfig]);

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
		const worksheet = workbook.addWorksheet("Equipment List", {
			views: [{ showGridLines: false }],
		});

		try {
			// Set column widths
			worksheet.columns = [
				{ width: 6 }, // NO.
				{ width: 45 }, // ITEM
				{ width: 8 }, // QTY
				{ width: 8 }, // UNIT
			];

			// Add header rows with borders
			const addHeaderRow = (text, rowIndex) => {
				const row = worksheet.addRow([text]);
				worksheet.mergeCells(`A${rowIndex}:D${rowIndex}`);
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
				["A", "B", "C", "D"].forEach((col) => {
					const cell = worksheet.getCell(`${col}${rowIndex}`);
					cell.border = {
						...cell.border,
						left: { style: "thin" },
						right: { style: "thin" },
						bottom: { style: "thin" },
					};
				});
			};

			// Determine the category name for the filename
			const uniqueCategories = new Set(
				filteredAndSortedItems.map((item) => item.category)
			);

			const categoryName =
				uniqueCategories.size > 1
					? "All"
					: categoryFilter === "all"
					? "All"
					: categoriesList[parseInt(categoryFilter)];

			// Add headers with the current date
			const currentDate = format(new Date(), "MMMM dd, yyyy"); // Format the current date
			addHeaderRow(
				"PROVINCIAL DISASTER RISK REDUCTION AND MANAGEMENT OFFICE",
				1
			);
			addHeaderRow("ADMINISTRATION AND TRAINING DIVISION", 2);
			addHeaderRow(currentDate, 3); // Use current date in the header
			addHeaderRow("PDRRMO Main office", 4);
			addHeaderRow(`( ${categoryName + " Rescue Equipment"} )`, 5); // Use current filtered category

			// Add table headers
			const headerRow = worksheet.addRow(["NO.", "ITEM", "QTY", "UNIT"]);
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

			// Calculate total quantities for each unique barcode prefix (first 4 characters)
			const itemCount = (item) => {
				return filteredAndSortedItems.reduce(
					(total, currentItem) =>
						total +
						(currentItem.barcode.slice(0, 4) === item.barcode.slice(0, 4)
							? 1
							: 0),
					0
				);
			};

			// Map data to rows, including the updated quantities
			const filteredData = filteredAndSortedItems.map((item, index) => {
				const totalQty = itemCount(item); // Get the total quantity for this prefix
				return [
					index + 1, // NO.
					item.name, // ITEM
					totalQty || "", // QTY
					item.unit || "PCS", // UNIT
				];
			});

			// Add data rows to the worksheet
			filteredData.forEach((rowData) => {
				const row = worksheet.addRow(rowData);
				row.height = 20;

				// Style data cells
				row.eachCell((cell, colNumber) => {
					cell.border = {
						top: { style: "thin" },
						bottom: { style: "thin" },
						left: { style: "thin" },
						right: { style: "thin" },
					};

					// Center align number and quantity columns
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
			worksheet.getColumn(1).width = 4; // Narrow first column
			worksheet.getColumn(2).width = 30; // For prepared by section
			worksheet.getColumn(3).width = 30; // For reviewed by section
			worksheet.getColumn(4).width = 30; // For certified correct section
			worksheet.getColumn(5).width = 4; // Last column
			worksheet.getColumn(6).width = 8; // Unit column

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
			link.download = `PDRRMO_Equipment_${categoryName}_${format(
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

	const copyBarcodeToClipboard = (barcode) => {
		navigator.clipboard.writeText(barcode).catch((err) => {
			console.error("Could not copy barcode: ", err);
		});
	};

	const handleItemSelect = (itemId) => {
		setSelectedItems((prev) => {
			if (prev.includes(itemId)) {
				return prev.filter((id) => id !== itemId);
			} else {
				return [...prev, itemId];
			}
		});
	};

	const handleExportPDF = async () => {
		if (typeof window === "undefined") return;

		try {
			const { exportQRCodesToPDF } = await import(
				"../../../components/pdf/PDFExport"
			);
			await exportQRCodesToPDF(selectedItems, filteredAndSortedItems);
		} catch (error) {
			console.error("Error loading PDF export:", error);
			toast.error("Failed to load PDF export functionality");
		}
	};

	const loadMoreItems = () => {
		if (items?.meta?.hasNextPage) {
			setCursorStack((prev) => [...prev, cursor]);
			setCursor(items.meta.nextCursor);
		}
	};

	const loadPreviousItems = () => {
		if (cursorStack.length > 0) {
			const lastCursor = cursorStack.pop();
			setCursorStack([...cursorStack]);
			setCursor(lastCursor);
		}
	};

	const { mutateAsync: bulkCreateItems, isPending: isCreating } =
		useBulkCreateItems();

	const handleFileUpload = async (e) => {
		const file = e.target.files[0];

		console.log(file);
		if (file) {
			try {
				await bulkCreateItems(file);
				toast.success("Items created successfully");
			} catch (error) {
				toast.error(error.message);
			}
		}
	};

	return (
		<section className="space-y-4">
			<div className="w-full flex items-center justify-between mb-4">
				<Headerbox
					title="Items"
					subtext="Manage and keep track of your items here."
				/>
				<div className="flex flex-col sm:flex-row justify-end items-center gap-4 w-full max-w-xl">
					<label
						className={`relative flex items-center justify-center w-full sm:w-auto px-6 py-4 bg-white border ${
							isCreating ? "border-green-300" : "border-gray-300"
						} rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition-colors group`}
					>
						<div className="flex flex-col items-center space-y-2">
							{isCreating ? (
								<>
									<svg
										className="animate-spin h-6 w-6 text-green-500"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									<span className="text-sm font-medium text-green-600">
										Creating items...
									</span>
								</>
							) : (
								<>
									<span className="text-sm font-medium text-gray-600 group-hover:text-gray-800">
										Import Items
									</span>
								</>
							)}
						</div>
						<input
							type="file"
							accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
							onChange={handleFileUpload}
							className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
							disabled={isCreating}
						/>
					</label>

					<div className="flex items-center w-full sm:w-auto">
						<button className="flex items-center justify-center gap-2 px-6 py-4 bg-green-50 border border-green-200 rounded-lg shadow-sm hover:bg-green-100 transition-colors text-sm font-medium text-green-600">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
									clipRule="evenodd"
								/>
							</svg>
							New Item
						</button>
					</div>
				</div>
			</div>
			<PageTransition>
				<div className="flex gap-4">
					<TextInput
						icon={FaSearch}
						placeholder="Search items..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="flex-grow"
					/>
					<Select
						value={categoryFilter}
						onChange={(e) => setCategoryFilter(e.target.value)}
					>
						<option value="all">All Categories</option>
						{categoriesList.map((category, index) => (
							<option key={index} value={index.toString()}>
								{category}
							</option>
						))}
					</Select>
					<Button onClick={() => handleSort("name")} color="light">
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
					<Button onClick={handleExportPDF} color="info">
						<FaFileExport className="mr-2" />
						Export QR Codes
					</Button>
				</div>
				<div className="overflow-x-auto min-h-[500px]">
					<Table>
						<Table.Head>
							<Table.HeadCell>Select</Table.HeadCell>
							<Table.HeadCell onClick={() => handleSort("name")}>
								Item name
							</Table.HeadCell>
							<Table.HeadCell onClick={() => handleSort("category")}>
								Category
							</Table.HeadCell>
							<Table.HeadCell onClick={() => handleSort("item_condition")}>
								Condition
							</Table.HeadCell>
							<Table.HeadCell>QR Code</Table.HeadCell>
							<Table.HeadCell>Images</Table.HeadCell>
							<Table.HeadCell>Availability</Table.HeadCell>
							<Table.HeadCell>Actions</Table.HeadCell>
						</Table.Head>
						<Table.Body className="divide-y">
							{isItemLoading ? (
								<Table.Row>
									<Table.Cell colSpan={8}>
										<MiniLoader />
									</Table.Cell>
								</Table.Row>
							) : (
								filteredAndSortedItems.map((item) => (
									<Table.Row
										key={item?.id}
										className={`bg-white dark:border-gray-700 dark:bg-gray-800 disabled:opacity-50 ${
											item?.item_condition === "Damaged" ||
											item.status === "borrowed"
												? "opacity-50 pointer-events-none"
												: ""
										}`}
										aria-disabled={
											item?.item_condition === "Damaged" ||
											item.status === "borrowed"
										}
									>
										<Table.Cell>
											<input
												type="checkbox"
												checked={selectedItems.includes(item.id)}
												onChange={() => handleItemSelect(item.id)}
												className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
												disabled={item.item_condition === "Damaged"}
											/>
										</Table.Cell>
										<Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
											<Tooltip content={item.name}>
												{truncateText(item?.name, 20)}
											</Tooltip>
										</Table.Cell>
										<Table.Cell>{categoriesList[item.category]}</Table.Cell>
										<Table.Cell className="w-[20px] text-center">
											<Badge
												color={
													item.item_condition === "Good"
														? "success"
														: item.item_condition === "Slightly Damaged"
														? "warning"
														: "failure"
												}
												className="text-[12px] text-nowrap"
											>
												<p className="text-center">{item.item_condition}</p>
											</Badge>
										</Table.Cell>
										<Table.Cell>
											<div className="flex items-center space-x-2">
												<CustomPopover
													trigger="hover"
													title="Item QR Code"
													saveBtn={
														<Button
															size="xs"
															color="gray"
															onClick={downloadBarcode}
															disabled={
																item.item_condition === "Damaged" ||
																item.status === "borrowed"
															}
														>
															<Image
																src={saveBtn}
																alt="save"
																height={15}
																width={15}
																className="object-contain"
															/>
														</Button>
													}
													content={
														<div className="p-3">
															<div ref={barcodeRef} className="bg-white p-4">
																<QRCodeCanvas
																	value={JSON.stringify(item.barcode)}
																	level="M"
																/>
															</div>
														</div>
													}
													button={
														<Button size="xs" color="gray">
															<Image
																src={view}
																alt="view"
																height={15}
																width={15}
															/>
														</Button>
													}
												/>
												<Button
													size="xs"
													color="gray"
													onClick={() => copyBarcodeToClipboard(item.barcode)}
													title="Copy QR Code value to clipboard"
													disabled={
														item.item_condition === "Damaged" ||
														item.status === "borrowed"
													}
												>
													<FaCopy size={15} />
												</Button>
											</div>
										</Table.Cell>
										<Table.Cell>
											<CustomModal
												btnTitle={<FaImage />}
												btnColor="gray"
												btnSize="sm"
												headerTitle={item.name}
												mainContent={
													<Image
														src={getImageUrl(item?.image_path)}
														width={600}
														height={400}
														alt="item image"
														className="object-contain"
													/>
												}
											/>
										</Table.Cell>
										<Table.Cell>
											{item.item_condition === "Damaged" ||
											item.status === "borrowed" ? (
												<span className="text-red-500">Not Available</span>
											) : (
												<span className="text-green-500">Available</span>
											)}
										</Table.Cell>
										<Table.Cell className="flex gap-2">
											<AddItemForm
												className="text-cyan-500 font-medium"
												btnTitle="Edit"
												itemId={item.id}
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
															You want to delete this item?
														</p>
														<div className="flex gap-3 items-center justify-center">
															<Button
																onClick={() => handleDeleteItem(item?.id)}
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
									</Table.Row>
								))
							)}
						</Table.Body>
					</Table>
				</div>
				<div className="flex justify-between">
					<Button
						onClick={loadPreviousItems}
						color="light"
						disabled={cursorStack.length === 0}
					>
						<FaChevronLeft className="mr-2" />
						Previous
					</Button>
					<Button
						onClick={loadMoreItems}
						color="light"
						disabled={!items?.meta?.hasNextPage}
					>
						Next
						<FaChevronRight className="ml-2" />
					</Button>
				</div>
			</PageTransition>
		</section>
	);
};

export default Items;
