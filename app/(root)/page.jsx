"use client";
import React from "react";
import HeaderBox from "../../components/shared/Headerbox";
import InfoBox from "../../components/InfoBox";
import BarChart from "../../components/BarChart";
import PieChart from "../../components/PieChart";
import { useGetItems } from "../../hooks/useItem";

const Home = () => {
	const { data: items, isLoading } = useGetItems();

	const totalItems = items && items?.items?.length;
	return (
		<section>
			<HeaderBox
				title="Hello,"
				user="User"
				type="greeting"
				subtext="Track your data progress here."
			/>
			<div className="space-y-6">
				<div className="flex gap-4 flex-wrap">
					<InfoBox title="Total Items" data={isLoading ? "..." : totalItems} />
					<InfoBox title="Borrowed Items" data={25} />
					<InfoBox title="Returned Items" data={13} />
					<InfoBox title="Lost Items" data={4} />
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
					<div className="min-w-[40%]">
						<h1 className="font-semibold text-[17px] mb-1">
							Most Borrowed Categories
						</h1>
						<div className="bg-white w-full h-[500px] rounded-lg flex items-center justify-center">
							<PieChart />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Home;
