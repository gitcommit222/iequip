import React from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

const BarChart = ({ data }) => {
	const chartData = {
		labels: data.map((item) => item.itemName),
		datasets: [
			{
				label: "Times Borrowed",
				data: data.map((item) => item.count),
				backgroundColor: "rgba(53, 162, 235, 0.7)",
				borderColor: "rgba(53, 162, 235, 1)",
				borderWidth: 1,
				borderRadius: 4,
				barThickness: 30, // Makes bars thinner
				maxBarThickness: 35, // Ensures bars don't get too thick
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "top",
				padding: 20,
				labels: {
					font: {
						size: 12,
					},
				},
			},
			title: {
				display: true,
				text: "Most Borrowed Items",
				padding: {
					top: 10,
					bottom: 20,
				},
				font: {
					size: 16,
					weight: "bold",
				},
			},
			tooltip: {
				backgroundColor: "rgba(0, 0, 0, 0.8)",
				padding: 12,
				titleFont: {
					size: 13,
				},
				bodyFont: {
					size: 12,
				},
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				grid: {
					color: "rgba(0, 0, 0, 0.05)",
				},
				ticks: {
					font: {
						size: 12,
					},
				},
			},
			x: {
				grid: {
					display: false,
				},
				ticks: {
					font: {
						size: 12,
					},
				},
			},
		},
	};

	return (
		<div style={{ height: "400px", width: "90%" }}>
			<Bar options={options} data={chartData} />
		</div>
	);
};

export default BarChart;
