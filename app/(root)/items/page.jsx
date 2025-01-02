"use client";
import { useRef, useState, useMemo, useEffect } from "react";
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
} from "flowbite-react";
import Image from "next/image";
import { saveBtn, view } from "../../../public";
import { useDeleteItems, useGetItems } from "../../../hooks/useItem";
import CustomPopover from "../../../components/shared/Popover";
import AddItemForm from "../../../components/AddItemForm";
import CustomModal from "../../../components/shared/CustomModal";
import { truncateText } from "../../../helpers/truncateText";
import toast from "react-hot-toast";
import { categoriesList } from "../../../lib/categories";
import * as XLSX from "xlsx";
import ItemImage from "../../../components/ItemImage";
import Headerbox from "../../../components/shared/Headerbox";
import QRCode, { QRCodeCanvas } from "qrcode.react";
import { getImageUrl } from "../../../utils/imageUtils";
import { format } from "date-fns";

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
		const wb = XLSX.utils.book_new();
		try {
			const provinceLogo = await fetch("/images/provinceLogo.png")
				.then((res) => res.blob())
				.then((blob) => {
					return new Promise((resolve) => {
						const reader = new FileReader();
						reader.onload = () => resolve(reader.result);
						reader.readAsDataURL(blob);
					});
				});

			const pdrrmoLogo = await fetch("/images/pdrrmo_logo.png")
				.then((res) => res.blob())
				.then((blob) => {
					return new Promise((resolve) => {
						const reader = new FileReader();
						reader.onload = () => resolve(reader.result);
						reader.readAsDataURL(blob);
					});
				});

			const headerRows = [
				[{ t: "s", v: "" }],
				["Republic of the Philippines"],
				["ADMINISTRATION AND TRAINING DIVISION"],
				[format(new Date(), "MMMM dd, yyyy")],
				["PDRRMO Main office"],
				["( FLOOD AND TYPHOON RESCUE EQUIPMENT )"],
				[],
			];

			const itemsData = [
				["Name", "Category", "Quantity", "Unit", "Condition", "Barcode"],
				...filteredAndSortedItems.map((item) => [
					item.name,
					categoriesList[item.category],
					item.quantity,
					item.unit,
					item.item_condition,
					item.barcode,
				]),
			];

			const fullData = [...headerRows, ...itemsData];
			const ws = XLSX.utils.aoa_to_sheet(fullData);

			ws["!images"] = [
				{
					name: "provinceLogo",
					data: provinceLogo,
					position: {
						type: "twoCellAnchor",
						from: { col: 0, row: 0 },
						to: { col: 2, row: 2 },
					},
				},
				{
					name: "pdrrmoLogo",
					data: pdrrmoLogo,
					position: {
						type: "twoCellAnchor",
						from: { col: 4, row: 0 },
						to: { col: 6, row: 2 },
					},
				},
			];

			const columnWidths = [
				{ wch: 40 },
				{ wch: 25 },
				{ wch: 15 },
				{ wch: 15 },
				{ wch: 20 },
				{ wch: 25 },
			];
			ws["!cols"] = columnWidths;

			ws["!merges"] = [
				{ s: { r: 1, c: 0 }, e: { r: 1, c: 5 } },
				{ s: { r: 2, c: 0 }, e: { r: 2, c: 5 } },
				{ s: { r: 3, c: 0 }, e: { r: 3, c: 5 } },
				{ s: { r: 4, c: 0 }, e: { r: 4, c: 5 } },
				{ s: { r: 5, c: 0 }, e: { r: 5, c: 5 } },
			];

			const headerStyle = {
				font: { bold: true, sz: 12 },
				alignment: { horizontal: "center", vertical: "center" },
			};

			for (let i = 1; i <= 5; i++) {
				const cellRef = XLSX.utils.encode_cell({ r: i, c: 0 });
				if (!ws[cellRef]) ws[cellRef] = {};
				ws[cellRef].s = headerStyle;
			}

			XLSX.utils.book_append_sheet(wb, ws, "Items");
			XLSX.writeFile(
				wb,
				`PDRRMO_Equipment_${new Date().toLocaleDateString()}.xlsx`
			);
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
			setPrevCursor(cursor);
			setCursor(items.meta.nextCursor);
		}
	};

	const loadPreviousItems = () => {
		if (prevCursor) {
			setCursor(prevCursor);
			setPrevCursor(null);
		}
	};

	return (
		<section className="space-y-4">
			<div className="w-full flex items-center justify-between mb-4">
				<Headerbox
					title="Items"
					subtext="Manage and keep track of your items here."
				/>
				<AddItemForm className="text-[12px] border border-gray-300 p-3 rounded-md hover:text-green-400" />
			</div>
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
						{!isItemLoading &&
							filteredAndSortedItems.map((item) => (
								<Table.Row
									key={item?.id}
									className={`bg-white dark:border-gray-700 dark:bg-gray-800 ${
										item.quantity === 0 ? "opacity-50 pointer-events-none" : ""
									}`}
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
									<Table.Cell className="text-center">
										{item.item_condition === "Damaged" ? (
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
																<FaCheck size={16} className="text-green-500" />
																<p>Yes</p>
															</div>
														</Button>
													</div>
												</div>
											}
										/>
									</Table.Cell>
								</Table.Row>
							))}
					</Table.Body>
				</Table>
			</div>
			<div className="flex justify-between">
				<Button
					onClick={loadPreviousItems}
					color="light"
					disabled={!prevCursor}
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
		</section>
	);
};

export default Items;
