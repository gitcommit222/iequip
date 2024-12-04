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
		return goodsData?.goods || [];
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

	const exportToExcel = () => {
		const dataToExport = filteredAndSortedGoods.map((item) => ({
			Name: item.item_name,
			Description: item.description,
			"Quantity Available": item.quantity_available,
			"Quantity Distributed": item.quantity_distributed,
			Unit: item.unit,
			Remarks: item.remarks,
		}));

		const ws = XLSX.utils.json_to_sheet(dataToExport);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Supplies");
		XLSX.writeFile(wb, "supplies.xlsx");
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
						<Table.HeadCell onClick={() => handleSort("quantity_distributed")}>
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
									<Table.Cell>{truncateText(item.description, 30)}</Table.Cell>
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
																<FaCheck size={16} className="text-green-500" />
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
