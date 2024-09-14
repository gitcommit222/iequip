"use client";
import { useEffect, useRef, useState } from "react";
import Barcode from "react-barcode";
import { toPng } from "html-to-image";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { CiCircleCheck } from "react-icons/ci";
import { FaRegTrashCan } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";

import Headerbox from "../../../components/shared/Headerbox";
import ItemImage from "../../../components/ItemImage";

import { Table, Button, Tooltip } from "flowbite-react";
import Link from "next/link";
import Image from "next/image";
import { saveBtn, view } from "../../../public";

import { useDeleteItems, useGetItems } from "../../../hooks/useItem";

import CustomPopover from "../../../components/shared/Popover";
import AddItemForm from "../../../components/AddItemForm";

import { truncateText } from "../../../helpers/truncateText";
import toast from "react-hot-toast";

const Items = () => {
	const barcodeRef = useRef();

	const {
		mutateAsync: deleteItem,
		isSuccess: isDeleteItemSuccess,
		isPending: isDeleteItemPending,
	} = useDeleteItems();

	useEffect(() => {
		let toastId;

		if (isDeleteItemPending) {
			toastId = toast.loading("Deleting Item");
		}

		if (isDeleteItemSuccess) {
			toast.success("Item deleted successfully!", { id: toastId });
		}
		return () => {
			if (toastId) {
				toast.dismiss(toastId);
			}
		};
	}, [isDeleteItemSuccess, isDeleteItemPending]);

	const {
		data: items,
		isLoading: isItemLoading,
		isError: isFetchingItemError,
		error: fetchItemError,
	} = useGetItems();

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

	const categoriesList = ["Flood & Typhoon", "Tsunami", "Covid-19"];

	return (
		<section>
			<div className="w-full flex items-center justify-between">
				<Headerbox
					title="Items"
					subtext="Manage and keep track of your items here."
				/>
				<div>
					<AddItemForm />
				</div>
			</div>
			<div className=" border rounded-lg w-full min-h-[600px] bg-white z-100">
				<div>
					<Table>
						<Table.Head>
							<Table.HeadCell>Item name</Table.HeadCell>
							<Table.HeadCell>Stocks</Table.HeadCell>
							<Table.HeadCell>Category</Table.HeadCell>
							<Table.HeadCell>Unit</Table.HeadCell>
							<Table.HeadCell>Barcode</Table.HeadCell>
							<Table.HeadCell>Images</Table.HeadCell>
							<Table.HeadCell>Condition</Table.HeadCell>
							<Table.HeadCell>Issued At</Table.HeadCell>
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
										<Table.Cell>pcs</Table.Cell>
										<Table.Cell>
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
													<Button size="xs" className="bg-green-500">
														<Image
															src={view}
															alt="view"
															height={15}
															width={15}
															className="brightness-0 invert"
														/>
													</Button>
												}
											/>
										</Table.Cell>
										<Table.Cell>
											<ItemImage
												imagePath={item.image_path}
												alt="item image"
												height={50}
												width={50}
											/>
										</Table.Cell>
										<Table.Cell>{item.condition}</Table.Cell>
										<Table.Cell>08-31-2024</Table.Cell>
										<Table.Cell className="flex gap-2">
											<Button size="xs" className="font-medium">
												<CiEdit size={12} />
											</Button>
											<CustomPopover
												title="Are you sure?"
												button={
													<Button
														color="failure"
														size="xs"
														className="font-medium "
													>
														<FaRegTrashCan size={12} />
													</Button>
												}
												content={
													<div className="p-3">
														<p className="text-[14px] mb-2">
															You want to delete this item?
														</p>
														<div className="flex gap-3 items-center justify-center">
															{/* <Button
																className="flex items-center gap-1 justify-center"
																pill
																size="xs"
																color="gray"
															>
																<div className="flex items-center gap-1 justify-center">
																	<IoIosCloseCircleOutline
																		className="text-red-500"
																		size={23}
																	/>
																	<p>No</p>
																</div>
															</Button> */}
															<Button
																onClick={async () => deleteItem(item.id)}
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
