"use client";
import { useRef, useState, useMemo, useEffect } from "react";
import Barcode from "react-barcode";
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

const Items = () => {
	const barcodeRef = useRef();
	const [searchTerm, setSearchTerm] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [sortConfig, setSortConfig] = useState({
		key: "name",
		direction: "asc",
	});

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
					link.download = "barcode.png";
					link.click();
				})
				.catch((error) => {
					console.error("Error converting barcode to image:", error);
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
			</div>
			<div className="overflow-x-auto  min-h-[500px]">
				<Table>
					<Table.Head>
						<Table.HeadCell onClick={() => handleSort("name")}>
							Item name
						</Table.HeadCell>
						<Table.HeadCell onClick={() => handleSort("category")}>
							Category
						</Table.HeadCell>
						<Table.HeadCell onClick={() => handleSort("quantity")}>
							Quantity
						</Table.HeadCell>
						<Table.HeadCell onClick={() => handleSort("unit")}>
							Unit
						</Table.HeadCell>
						<Table.HeadCell onClick={() => handleSort("item_condition")}>
							Condition
						</Table.HeadCell>
						<Table.HeadCell>Barcode</Table.HeadCell>
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
									<Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
										<Tooltip content={item.name}>
											{truncateText(item?.name, 20)}
										</Tooltip>
									</Table.Cell>
									<Table.Cell>{categoriesList[item.category]}</Table.Cell>
									<Table.Cell>
										{item.quantity > 0 ? item.quantity : "Out of Stock"}
									</Table.Cell>
									<Table.Cell>{item.unit}</Table.Cell>
									<Table.Cell className="w-[20px] text-center">
										<Badge color="success" className="text-[12px] text-nowrap">
											<Tooltip content={item.item_condition}>
												<p className="text-center">GOOD</p>
											</Tooltip>
										</Badge>
									</Table.Cell>
									<Table.Cell>
										<div className="flex items-center space-x-2">
											<CustomPopover
												trigger="hover"
												title="Item barcode"
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
														<div ref={barcodeRef}>
															<Barcode
																value={item.barcode}
																width={1.3}
																height={50}
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
												title="Copy barcode to clipboard"
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
