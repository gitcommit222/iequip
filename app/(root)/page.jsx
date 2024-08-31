import React from "react";
import HeaderBox from "../../components/shared/Headerbox";
import InfoBox from "../../components/InfoBox";
import LineChart from "../../components/LineChart";

const Home = () => {
	return (
		<section>
			<HeaderBox
				title="Hello,"
				user="Admin"
				type="greeting"
				subtext="Track your data progress here."
			/>
			<div className="flex flex-col gap-4">
				<div className="flex gap-4 flex-wrap">
					<InfoBox />
					<InfoBox />
					<InfoBox />
					<InfoBox />
				</div>
				<div className="">
					<h1 className="font-semibold text-[17px] mb-1">Lost Items</h1>
					<div className="flex items-center rounded-lg bg-white h-[500px] p-5">
						<LineChart />
					</div>
				</div>
			</div>
		</section>
	);
};

export default Home;
