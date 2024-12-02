"use client";
import React from "react";
import HeaderBox from "../../components/shared/Headerbox";
import InfoBox from "../../components/InfoBox";
import BarChart from "../../components/BarChart";
import PieChart from "../../components/PieChart";
import { useGetItems } from "../../hooks/useItem";
import { useFetchBorrowedItems } from "../../hooks/useBorrowItem";
import NotifDrawer from "../../components/NotifDrawer";
import { borrowedItem, item, lostItem, returnedItem } from "../../public";
import { useGetTransactionsByCategory } from "../../hooks/useTransactions";
import { useUser } from "../../hooks/useAuth";

const Home = () => {
	const { data: items, isLoading } = useGetItems();

	const totalItems = items && items?.items?.length;

	const { data: currentUser } = useUser();

	const { data: transactions, isLoading: isTransactionsLoading } =
		useGetTransactionsByCategory("items");

	const totalLostItems =
		transactions && transactions?.filter((t) => t.t_status === "lost")?.length;

	const totalBorrowedItems =
		transactions &&
		transactions?.filter((t) => t.t_status === "borrowed")?.length;

	const totalReturnedItems =
		transactions &&
		transactions?.filter((t) => t.t_status === "returned")?.length;

	return (
		<section>
			<div className="flex items-center justify-between">
				<HeaderBox
					title={`Hello, ${currentUser?.fetchedUser?.name || "User"}`}
					type="greeting"
					subtext="Track your data progress here."
				/>
				<div>
					<NotifDrawer />
				</div>
			</div>
			<div className="space-y-6">
				<div className="flex gap-4 flex-wrap">
					<InfoBox
						title="Total Items"
						data={isLoading ? "..." : totalItems || 0}
						iconUrl={item}
					/>
					<InfoBox
						title="Borrowed Items"
						data={isTransactionsLoading ? "..." : totalBorrowedItems || 0}
						iconUrl={borrowedItem}
					/>
					<InfoBox
						title="Returned Items"
						data={isTransactionsLoading ? "..." : totalReturnedItems || 0}
						iconUrl={returnedItem}
					/>
				</div>
				<div className="flex flex-wrap items-center justify-center gap-3">
					<div className="flex-1">
						<h1 className="font-semibold text-[17px] mb-1">
							Most Borrowed Items
						</h1>
						<div className="rounded-lg bg-white h-[500px] p-3 flex items-center justify-center">
							<BarChart />
						</div>
					</div>
					{/* <div className="min-w-[40%]">
						<h1 className="font-semibold text-[17px] mb-1">
							Most Borrowed Categories
						</h1>
						<div className="bg-white w-full h-[500px] rounded-lg flex items-center justify-center">
							<PieChart />
						</div>
					</div> */}
				</div>
			</div>
		</section>
	);
};

export default Home;
