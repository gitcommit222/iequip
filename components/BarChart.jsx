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

const BarChart = ({
	data,
	title = "Most Borrowed Items",
	label = "Times Borrowed",
	barColor = "rgba(53, 162, 235, 0.7)",
	borderColor = "rgba(53, 162, 235, 1)",
}) => {
	// Array of pleasant colors for the bars
	const colors = [
		barColor, // Primary color (customizable)
		"rgba(255, 99, 132, 0.7)", // Pink
		"rgba(75, 192, 192, 0.7)", // Teal
		"rgba(255, 159, 64, 0.7)", // Orange
		"rgba(153, 102, 255, 0.7)", // Purple
		"rgba(255, 205, 86, 0.7)", // Yellow
		"rgba(54, 162, 235, 0.7)", // Light blue
		"rgba(255, 99, 255, 0.7)", // Magenta
		"rgba(76, 175, 80, 0.7)", // Green
		"rgba(255, 82, 82, 0.7)", // Red
	];

	const borderColors = colors.map((color) => color.replace("0.7)", "1)"));

	const chartData = {
		labels: data.map((item) => item.itemName),
		datasets: [
			{
				label: label,
				data: data.map((item) => item.count),
				backgroundColor: data.map((_, index) => colors[index % colors.length]),
				borderColor: data.map(
					(_, index) => borderColors[index % borderColors.length]
				),
				borderWidth: 1,
				borderRadius: 4,
				barThickness: 30,
				maxBarThickness: 35,
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
				text: title,
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
