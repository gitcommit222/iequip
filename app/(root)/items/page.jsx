"use client";
import { useRef } from "react";
import Barcode from "react-barcode";
import { toPng } from "html-to-image";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { CiCircleCheck } from "react-icons/ci";
import { FaRegTrashCan } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";
import { FaImage } from "react-icons/fa6";

import Headerbox from "../../../components/shared/Headerbox";
import ItemImage from "../../../components/ItemImage";

import { Table, Button, Tooltip, Badge } from "flowbite-react";
import Link from "next/link";
import Image from "next/image";
import { saveBtn, view } from "../../../public";

import { useDeleteItems, useGetItems } from "../../../hooks/useItem";

import CustomPopover from "../../../components/shared/Popover";
import AddItemForm from "../../../components/AddItemForm";
import CustomModal from "../../../components/shared/CustomModal";

import { truncateText } from "../../../helpers/truncateText";
import toast from "react-hot-toast";

import { categoriesList } from "../../../lib/categories";

const Items = () => {
	const barcodeRef = useRef();

	const { mutateAsync: deleteItem } = useDeleteItems();

	const {
		data: items,
		isLoading: isItemLoading,
		isError: isFetchingItemError,
		error: fetchItemError,
	} = useGetItems();

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

	console.log("re-render");

	return (
		<section>
			<div className="w-full flex items-center justify-between">
				<Headerbox
					title="Items"
					subtext="Manage and keep track of your items here."
				/>
				<div>
					<AddItemForm className="text-[12px] border border-gray-300 p-3 rounded-md hover:text-green-400" />
				</div>
			</div>
			<div className=" border rounded-lg w-full min-h-[600px] bg-white">
				<div>
					<Table>
						<Table.Head>
							<Table.HeadCell>Item name</Table.HeadCell>
							<Table.HeadCell>Stocks</Table.HeadCell>
							<Table.HeadCell>Category</Table.HeadCell>
							<Table.HeadCell>Unit</Table.HeadCell>
							<Table.HeadCell>Condition</Table.HeadCell>
							<Table.HeadCell>Barcode</Table.HeadCell>
							<Table.HeadCell>Images</Table.HeadCell>
							<Table.HeadCell>
								<span>Actions</span>
							</Table.HeadCell>
						</Table.Head>
						<Table.Body className="divide-y">
							{!isItemLoading &&
								items &&
								items.items.map((item) => (
									<Table.Row
										key={item?.id}
										className="bg-white dark:border-gray-700 dark:bg-gray-800"
									>
										<Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
											<Tooltip content={item.name}>
												{truncateText(item?.name, 20)}
											</Tooltip>
										</Table.Cell>
										<Table.Cell>{item.quantity}</Table.Cell>
										<Table.Cell>{categoriesList[item.category]}</Table.Cell>
										<Table.Cell>{item.unit}</Table.Cell>
										<Table.Cell className="w-[20px] text-center">
											<Badge
												color={
													item.item_condition == "Good"
														? "success"
														: item.item_condition == "Slightly Damaged"
														? "warning"
														: "failure"
												}
												className="text-[12px] "
											>
												<Tooltip content={item.item_condition}>
													<p className="text-center">
														{truncateText(item.item_condition, 9)}
													</p>
												</Tooltip>
											</Badge>
										</Table.Cell>
										<Table.Cell className="flex items-center justify-center">
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
												btnTitle="edit"
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
																	<CiCircleCheck
																		size={23}
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
								))}
						</Table.Body>
					</Table>
					{items && items.items.length < 1 && (
						<div className="w-full p-2">
							<p
								className="text-center text-[14px] text-gray-300"
								aria-disabled
							>
								No Items Found
							</p>
						</div>
					)}
				</div>
			</div>
		</section>
	);
};

export default Items;
