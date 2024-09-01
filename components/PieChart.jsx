"use client";
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
	const pieData = {
		labels: ["Flood and Typhoon", "Tsunami", "Covid-19"],
		datasets: [
			{
				label: "Item Categories",
				data: [40, 20, 40],
				backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
				hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
			},
		],
	};

	const pieOptions = {
		responsive: true,
		maintainAspectRatio: false,
	};

	return (
		<div style={{ width: "100%", height: "400px" }}>
			<Pie data={pieData} options={pieOptions} />
		</div>
	);
};

export default PieChart;
