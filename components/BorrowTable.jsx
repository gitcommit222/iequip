"use client";
import { Table, Tooltip } from "flowbite-react";
import { useFetchBorrowedItems } from "../hooks/useBorrowItem";
import { format } from "date-fns";
import Link from "next/link";
import { GrFormView } from "react-icons/gr";
import { MdDelete } from "react-icons/md";

const BorrowTable = () => {
	const {
		data: borrowedItems,
		isError: isFetchItemsError,
		isLoading: isItemFetching,
	} = useFetchBorrowedItems();

	if (borrowedItems && !isItemFetching) {
		console.log(borrowedItems);
	}

	return (
		<div className="overflow-x-auto shadow-sm">
			<Table>
				<Table.Head>
					<Table.HeadCell>Borrower name</Table.HeadCell>
					<Table.HeadCell>Email</Table.HeadCell>
					<Table.HeadCell>Borrowed Item</Table.HeadCell>
					<Table.HeadCell>Date Borrowed</Table.HeadCell>
					<Table.HeadCell>Status</Table.HeadCell>
					<Table.HeadCell>Actions</Table.HeadCell>
				</Table.Head>
				<Table.Body className="divide-y">
					{borrowedItems &&
						!isItemFetching &&
						borrowedItems.borrowedItems.map((item) => (
							<Table.Row
								key={item.id}
								className="bg-white dark:border-gray-700 dark:bg-gray-800"
							>
								<Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
									{item.Borrower.name}
								</Table.Cell>
								<Table.Cell>{item.Borrower.email}</Table.Cell>
								<Table.Cell>{item.Item?.name || "-"}</Table.Cell>
								<Table.Cell>09/15/24</Table.Cell>
								<Table.Cell>{item?.status}</Table.Cell>
								<Table.Cell className="flex gap-2">
									<Tooltip content="View">
										<Link href={`/borrow/${item?.item_id}`}>
											<GrFormView size={23} className="text-blue-500" />
										</Link>
									</Tooltip>
									<Tooltip content="Delete">
										<button>
											<MdDelete size={23} className="text-red-500" />
										</button>
									</Tooltip>
								</Table.Cell>
							</Table.Row>
						))}
				</Table.Body>
			</Table>
		</div>
	);
};

export default BorrowTable;
