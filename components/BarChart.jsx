"use client";
import React from "react";
import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	BarElement,
	CategoryScale,
	LinearScale,
	Tooltip,
	Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BarChart = () => {
	const barData = {
		labels: [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		],
		datasets: [
			{
				label: "Borrowed Items",
				data: [12, 19, 3, 5, 2, 3, 9, 6, 4, 8, 15, 7],
				backgroundColor: "rgba(53, 162, 235, 0.5)",
				borderColor: "rgb(53, 162, 235)",
				borderWidth: 1,
			},
		],
	};

	const barOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "top",
			},
			title: {
				display: true,
				text: "Monthly Borrowed Items",
				font: {
					size: 16,
				},
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				title: {
					display: true,
					text: "Number of Items",
				},
			},
			x: {
				title: {
					display: true,
					text: "Month",
				},
			},
		},
	};

	return (
		<div style={{ width: "100%", height: "400px", padding: "20px" }}>
			<Bar data={barData} options={barOptions} />
		</div>
	);
};

export default BarChart;
