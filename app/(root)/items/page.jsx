"use client";
import { useRef } from "react";
import Barcode from "react-barcode";
import { toPng } from "html-to-image";
import Headerbox from "../../../components/shared/Headerbox";

import { Table, Button } from "flowbite-react";
import Link from "next/link";
import Image from "next/image";
import { saveBtn, view } from "../../../public";

import CustomPopover from "../../../components/shared/Popover";
import CustomModal from "../../../components/shared/CustomModal";
import AddItemForm from "../../../components/AddItemForm";

const Items = () => {
	const barcodeRef = useRef();

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
	return (
		<section>
			<div className="w-full flex items-center justify-between">
				<Headerbox
					title="Items"
					subtext="Manage and keep track of your items here."
				/>
				<div>
					<CustomModal
						btnTitle="New Item"
						headerTitle="ADD ITEM FORM"
						cancelText="Cancel"
						saveText="Save"
						mainContent={<AddItemForm />}
					/>
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
							<Table.HeadCell>Issued At</Table.HeadCell>
							<Table.HeadCell>
								<span>Actions</span>
							</Table.HeadCell>
						</Table.Head>
						<Table.Body className="divide-y">
							<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
								<Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
									Basket Stretcher
								</Table.Cell>
								<Table.Cell>500</Table.Cell>
								<Table.Cell>Flood and Typhoon</Table.Cell>
								<Table.Cell>pcs</Table.Cell>
								<Table.Cell>
									<CustomPopover
										trigger="hover"
										title="Item barcode"
										saveBtn={
											<Button size="xs" color="gray" onClick={downloadBarcode}>
												<Image
													src={saveBtn}
													alt="save"
													height={17}
													width={17}
													objectFit="contain"
												/>
											</Button>
										}
										content={
											<div className="p-3">
												<div ref={barcodeRef}>
													<Barcode
														value="BASKET060095"
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
								<Table.Cell>08-31-2024</Table.Cell>
								<Table.Cell className="flex gap-2">
									<Link
										href="#"
										className="font-medium text-cyan-600 hover:underline "
									>
										Edit
									</Link>
									<Link
										href="#"
										className="font-medium text-red-500 hover:underline "
									>
										Remove
									</Link>
								</Table.Cell>
							</Table.Row>
							<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
								<Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
									Binocular
								</Table.Cell>
								<Table.Cell>4</Table.Cell>
								<Table.Cell>Tsunami</Table.Cell>
								<Table.Cell>pcs</Table.Cell>
								<Table.Cell>
									<CustomPopover
										trigger="hover"
										title="Item barcode"
										saveBtn={
											<Button size="xs" color="gray" onClick={downloadBarcode}>
												<Image
													src={saveBtn}
													alt="save"
													height={17}
													width={17}
													objectFit="contain"
												/>
											</Button>
										}
										content={
											<div className="p-3">
												<div ref={barcodeRef}>
													<Barcode
														value="BINOCULAR060095"
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
								<Table.Cell>08-31-2024</Table.Cell>
								<Table.Cell className="flex gap-2">
									<Link
										href="#"
										className="font-medium text-cyan-600 hover:underline "
									>
										Edit
									</Link>
									<Link
										href="#"
										className="font-medium text-red-500 hover:underline "
									>
										Remove
									</Link>
								</Table.Cell>
							</Table.Row>
						</Table.Body>
					</Table>
					<div className="w-full p-2">
						<p className="text-center text-[14px] text-gray-300" aria-disabled>
							List of items
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Items;
