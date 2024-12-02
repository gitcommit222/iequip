"use client";
import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	BarElement,
	CategoryScale,
	LinearScale,
	Tooltip,
	Legend,
} from "chart.js";
import { useGetTransactionsByCategory } from "../hooks/useTransactions";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BarChart = () => {
	const { data: transactions } = useGetTransactionsByCategory("items");

	const monthlyData = useMemo(() => {
		if (!transactions) return {};

		// Group transactions by item name
		const itemTransactions = {};

		transactions.forEach((transaction) => {
			if (transaction.t_status === "borrowed") {
				const itemName = transaction.item?.name || "Unknown Item";
				if (!itemTransactions[itemName]) {
					itemTransactions[itemName] = Array(12).fill(0);
				}
				const month = new Date(transaction.start_date).getMonth();
				itemTransactions[itemName][month] += transaction.borrowed_quantity;
			}
		});

		// Filter items with total borrows >= 5
		const filteredTransactions = {};
		Object.entries(itemTransactions).forEach(([itemName, quantities]) => {
			const totalBorrows = quantities.reduce((sum, qty) => sum + qty, 0);
			if (totalBorrows >= 5) {
				filteredTransactions[itemName] = quantities;
			}
		});

		return filteredTransactions;
	}, [transactions]);

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
		datasets: Object.entries(monthlyData).map(
			([itemName, quantities], index) => ({
				label: itemName,
				data: quantities,
				backgroundColor: `hsla(${index * 37}, 70%, 50%, 0.5)`,
				borderColor: `hsla(${index * 37}, 70%, 50%, 1)`,
				borderWidth: 1,
			})
		),
	};

	const barOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "top",
				display: true,
			},
			title: {
				display: true,
				text: "Monthly Borrowed Items Analysis",
				font: { size: 16 },
			},
			tooltip: {
				callbacks: {
					label: (context) => {
						return `${context.dataset.label}: ${context.parsed.y} units`;
					},
				},
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				title: {
					display: true,
					text: "Number of Items Borrowed",
				},
				stacked: true,
			},
			x: {
				title: {
					display: true,
					text: "Month",
				},
				stacked: true,
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
