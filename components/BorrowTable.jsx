"use client";
import { Table } from "flowbite-react";

const BorrowTable = () => {
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
					<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
						<Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
							Kien Peralta
						</Table.Cell>
						<Table.Cell>09123456789</Table.Cell>
						<Table.Cell>kien@email.com</Table.Cell>
						<Table.Cell>Basket Stretcher</Table.Cell>
						<Table.Cell>09/15/24</Table.Cell>
						<Table.Cell>09/27/24</Table.Cell>
						<Table.Cell>Borrowed</Table.Cell>
						<Table.Cell>
							<a
								href="#"
								className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
							>
								Edit
							</a>
						</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table>
		</div>
	);
};

export default BorrowTable;
