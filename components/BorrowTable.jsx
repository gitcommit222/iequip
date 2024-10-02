"use client";
import { Table } from "flowbite-react";
import { useFetchBorrowedItems } from "../hooks/useBorrowItem";
import { format } from "date-fns";

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
					<Table.HeadCell>Contact No.</Table.HeadCell>
					<Table.HeadCell>Email</Table.HeadCell>
					<Table.HeadCell>Borrowed Item</Table.HeadCell>
					<Table.HeadCell>Date Borrowed</Table.HeadCell>
					<Table.HeadCell>Return Date</Table.HeadCell>
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
								<Table.Cell>{item.Borrower.contact_number}</Table.Cell>
								<Table.Cell>{item.Borrower.email}</Table.Cell>
								<Table.Cell>{item.Item?.name || "-"}</Table.Cell>
								<Table.Cell>09/15/24</Table.Cell>
								<Table.Cell>{format(item.end_date, "dd-MM-yyy")}</Table.Cell>
								<Table.Cell>{item.status}</Table.Cell>
								<Table.Cell>
									<a
										href="#"
										className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
									>
										Edit
									</a>
								</Table.Cell>
							</Table.Row>
						))}
				</Table.Body>
			</Table>
		</div>
	);
};

export default BorrowTable;
