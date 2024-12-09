"use client";
import { useRef, useState, useMemo, useEffect } from "react";
import { toPng } from "html-to-image";
import {
	FaImage,
	FaSearch,
	FaFileExport,
	FaSortAmountDown,
	FaSortAmountUp,
	FaCheck,
	FaCopy,
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
import {
	PDFDownloadLink,
	Document,
	Page,
	View,
	Text,
	StyleSheet,
	pdf,
	Image as PDFImage,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";

const styles = StyleSheet.create({
	page: {
		padding: 20,
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 20,
	},
	qrContainer: {
		width: "45%",
		marginBottom: 20,
		alignItems: "center",
	},
	itemName: {
		fontSize: 10,
		marginTop: 5,
		textAlign: "center",
	},
	qrCode: {
		width: 100,
		height: 100,
	},
});

const Items = () => {
	const barcodeRef = useRef();
	const [searchTerm, setSearchTerm] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [sortConfig, setSortConfig] = useState({
		key: "name",
		direction: "asc",
	});
	const [selectedItems, setSelectedItems] = useState([]);

	const { mutateAsync: deleteItem } = useDeleteItems();
	const { data: items, isLoading: isItemLoading } = useGetItems();

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
		return items.items
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

	const exportToExcel = () => {
		const dataToExport = filteredAndSortedItems.map((item) => ({
			Name: item.name,
			Category: categoriesList[item.category],
			Quantity: item.quantity,
			Unit: item.unit,
			Condition: item.item_condition,
			Barcode: item.barcode,
		}));

		const ws = XLSX.utils.json_to_sheet(dataToExport);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Items");
		XLSX.writeFile(wb, "items.xlsx");
	};

	const copyBarcodeToClipboard = (barcode) => {
		navigator.clipboard.writeText(barcode).catch((err) => {
			console.error("Could not copy barcode: ", err);
		});
	};

	useEffect(() => {
		if (items && items.items.length > 0) {
			const latestItem = items.items[items.items.length - 1];
			copyBarcodeToClipboard(latestItem.barcode);
		}
	}, [items]);

	const handleItemSelect = (itemId) => {
		setSelectedItems(prev => {
			if (prev.includes(itemId)) {
				return prev.filter(id => id !== itemId);
			} else {
				return [...prev, itemId];
			}
		});
	};

	const QRDocument = () => (
		<Document>
			{chunk(
				filteredAndSortedItems.filter(item => selectedItems.includes(item.id)),
				8
			).map((pageItems, pageIndex) => (
				<Page key={pageIndex} size="A4" style={styles.page}>
					{pageItems.map((item, index) => (
						<View key={index} style={styles.qrContainer}>
							<PDFImage
								style={styles.qrCode}
								src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
									item.barcode
								)}`}
							/>
							<Text style={styles.itemName}>{truncateText(item.name, 20)}</Text>
						</View>
					))}
				</Page>
			))}
		</Document>
	);

	const exportQRCodesToPDF = async () => {
		if (selectedItems.length === 0) {
			toast.error('Please select items to export');
			return;
		}

		const blob = await pdf(<QRDocument />).toBlob();
		saveAs(blob, "qr-codes.pdf");
	};

	// Helper function to split array into chunks
	const chunk = (arr, size) => {
		const chunks = [];
		for (let i = 0; i < arr.length; i += size) {
			chunks.push(arr.slice(i, i + size));
		}
		return chunks;
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
				<Button onClick={exportQRCodesToPDF} color="info">
					<FaFileExport className="mr-2" />
					Export QR Codes
				</Button>
			</div>
			<div className="overflow-x-auto  min-h-[500px]">
				<Table>
					<Table.Head>
						<Table.HeadCell>
							Select
						</Table.HeadCell>
						<Table.HeadCell onClick={() => handleSort("name")}>
							Item name
						</Table.HeadCell>
						<Table.HeadCell onClick={() => handleSort("category")}>
							Category
						</Table.HeadCell>
						{/* <Table.HeadCell onClick={() => handleSort("quantity")}>
							Quantity
						</Table.HeadCell>
						<Table.HeadCell onClick={() => handleSort("unit")}>
							Unit
						</Table.HeadCell> */}
						<Table.HeadCell onClick={() => handleSort("item_condition")}>
							Condition
						</Table.HeadCell>
						<Table.HeadCell>QR Code</Table.HeadCell>
						<Table.HeadCell>Images</Table.HeadCell>
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
										/>
									</Table.Cell>
									<Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
										<Tooltip content={item.name}>
											{truncateText(item?.name, 20)}
										</Tooltip>
									</Table.Cell>
									<Table.Cell>{categoriesList[item.category]}</Table.Cell>
									{/* <Table.Cell>
										{item.quantity > 0 ? item.quantity : "Out of Stock"}
									</Table.Cell>
									<Table.Cell>{item.unit}</Table.Cell> */}
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
																renderAs="svg"
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
												<ItemImage
													imagePath={item?.image_path}
													width={600}
													height={400}
													alt="item image"
													className="object-contain"
												/>
											}
										/>
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
		</section>
	);
};

export default Items;
