"use client";
import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const LineChart = () => {
	const data = {
		labels: [
			"2024-08-20",
			"2024-08-21",
			"2024-08-22",
			"2024-08-23",
			"2024-08-24",
			"2024-08-25",
			"2024-08-26",
			"2024-08-27",
			"2024-08-28",
			"2024-08-29",
		],
		datasets: [
			{
				label: "Lost Item Data",
				data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
				borderColor: "rgba(75, 192, 192, 1)",
				backgroundColor: "rgba(75, 192, 192, 0.2)",
				fill: true,
				tension: 0.4, // smooth line
			},
		],
	};

	return <Line data={data} />;
};

export default LineChart;
