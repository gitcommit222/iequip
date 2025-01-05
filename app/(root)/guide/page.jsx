import React from "react";
import HeaderBox from "../../../components/shared/Headerbox";
import Link from "next/link";
import {
	FaRocket,
	FaUsers,
	FaClipboardList,
	FaChartBar,
	FaCog,
	FaQuestionCircle,
	FaBoxOpen,
	FaExchangeAlt,
	FaQrcode,
	FaFileExport,
	FaSearch,
	FaUserPlus,
	FaClipboard,
	FaDownload,
	FaBarcode,
	FaEdit,
	FaTrash,
	FaCheckCircle,
} from "react-icons/fa";
import PageTransition from "../../../components/animations/PageTransition";

const GuidesPage = () => {
	const guides = [
		{
			title: "Getting Started",
			icon: <FaRocket className="text-2xl text-blue-500" />,
			sections: [
				{
					title: "System Login",
					description: "Access the system",
					steps: [
						"Visit the login page",
						"Enter your email and password",
						"Click 'Login' to access the dashboard",
						"For first-time users, contact admin for credentials",
					],
				},
				{
					title: "Dashboard Overview",
					description: "Understanding your dashboard",
					steps: [
						"View total items count",
						"Check borrowed items status",
						"Monitor returned items",
						"Track lost items",
						"Access quick analytics charts",
					],
				},
				{
					title: "Navigation",
					description: "System navigation guide",
					steps: [
						"Use the sidebar menu for main sections",
						"Access quick actions from the top bar",
						"Use breadcrumbs for current location",
						"Check notifications for updates",
					],
				},
			],
		},
		{
			title: "Item Management",
			icon: <FaBoxOpen className="text-2xl text-green-500" />,
			sections: [
				{
					title: "Adding Items",
					description: "Add new items to inventory",
					steps: [
						"Click 'New Item' button",
						"Fill in item details (name, category, quantity)",
						"Upload item image (optional)",
						"Set item condition and status",
						"Save to add to inventory",
					],
				},
				{
					title: "Managing Items",
					description: "Update and track items",
					steps: [
						"Search items using the search bar",
						"Filter by category or status",
						"Edit item details using the edit button",
						"Update quantities and conditions",
						"Generate/print QR codes",
						"Export item lists to Excel",
					],
				},
				{
					title: "QR Code System",
					description: "QR code management",
					steps: [
						"Select items for QR generation",
						"Click 'Generate QR' button",
						"Download QR codes individually or in bulk",
						"Print QR codes for physical tagging",
						"Use scanner for quick item lookup",
					],
				},
			],
		},
		{
			title: "Borrowing System",
			icon: <FaExchangeAlt className="text-2xl text-purple-500" />,
			sections: [
				{
					title: "Borrowing Process",
					description: "Complete borrowing guide",
					steps: [
						"Click 'Borrow' button",
						"Enter borrower information",
						"Select items to borrow",
						"Specify quantity and duration",
						"Review and confirm borrowing",
						"Download borrowing receipt",
					],
				},
				{
					title: "Return Process",
					description: "Item return procedures",
					steps: [
						"Locate borrowed item in system",
						"Click 'Return' button",
						"Check item condition",
						"Record any damages or issues",
						"Confirm return and update status",
						"Generate return receipt",
					],
				},
				{
					title: "Transaction History",
					description: "Track borrowing history",
					steps: [
						"Access borrowing records",
						"View current borrowed items",
						"Check return deadlines",
						"Export transaction reports",
						"Monitor late returns",
					],
				},
			],
		},
		{
			title: "Supply Management",
			icon: <FaClipboardList className="text-2xl text-orange-500" />,
			sections: [
				{
					title: "Supply Inventory",
					description: "Manage supply items",
					steps: [
						"Add new supplies",
						"Update quantities",
						"Set minimum stock levels",
						"Track supply usage",
						"Generate inventory reports",
					],
				},
				{
					title: "Distribution",
					description: "Supply distribution process",
					steps: [
						"Select items for distribution",
						"Enter recipient details",
						"Specify quantities",
						"Record distribution date",
						"Generate distribution receipt",
						"Update inventory automatically",
					],
				},
				{
					title: "Supply Reports",
					description: "Supply tracking and reports",
					steps: [
						"Generate stock reports",
						"View distribution history",
						"Track supply consumption",
						"Export data to Excel",
						"Monitor low stock alerts",
					],
				},
			],
		},
		{
			title: "Reports & Analytics",
			icon: <FaChartBar className="text-2xl text-indigo-500" />,
			sections: [
				{
					title: "Generate Reports",
					description: "Create system reports",
					steps: [
						"Select report type",
						"Choose date range",
						"Filter by categories",
						"Generate PDF/Excel reports",
						"Schedule automated reports",
					],
				},
				{
					title: "Analytics Dashboard",
					description: "Understanding metrics",
					steps: [
						"View borrowing trends",
						"Monitor supply usage",
						"Track user activity",
						"Analyze peak periods",
						"Identify popular items",
					],
				},
				{
					title: "Data Export",
					description: "Export system data",
					steps: [
						"Select data category",
						"Choose export format",
						"Apply filters if needed",
						"Download exported files",
						"Schedule automated exports",
					],
				},
			],
		},
		{
			title: "User Management",
			icon: <FaUsers className="text-2xl text-red-500" />,
			sections: [
				{
					title: "User Administration",
					description: "Manage system users",
					steps: [
						"Add new users",
						"Assign user roles",
						"Set permissions",
						"Reset passwords",
						"Deactivate accounts",
					],
				},
				{
					title: "Activity Monitoring",
					description: "Track user activities",
					steps: [
						"View login history",
						"Track user actions",
						"Monitor system usage",
						"Generate activity reports",
						"Set up alerts",
					],
				},
				{
					title: "Security Settings",
					description: "System security management",
					steps: [
						"Configure password policies",
						"Set up two-factor authentication",
						"Manage access controls",
						"Review security logs",
						"Update security settings",
					],
				},
			],
		},
	];

	return (
		<section className="min-h-screen p-4 bg-gray-50">
			<HeaderBox
				title="System Guide"
				subtext="Complete documentation for using the GearKeeper system"
			/>
			<PageTransition>
				<div className="max-w-7xl  mt-8 space-y-8">
					{/* Search Bar */}
					<div className="bg-white rounded-lg shadow-sm p-4">
						<div className="relative">
							<FaSearch className="absolute left-3 top-3 text-gray-400" />
							<input
								type="text"
								placeholder="Search guides..."
								className="w-full p-2 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					</div>

					{/* Guide Categories */}
					{guides.map((guide, index) => (
						<div key={index} className="bg-white rounded-lg shadow-sm">
							<div className="p-6 border-b border-gray-100">
								<div className="flex items-center gap-3">
									{guide.icon}
									<h2 className="text-2xl font-bold">{guide.title}</h2>
								</div>
							</div>

							<div className="grid md:grid-cols-3 gap-6 p-6">
								{guide.sections.map((section, sectionIndex) => (
									<div
										key={sectionIndex}
										className="p-4 border border-gray-100 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-all"
									>
										<h3 className="font-semibold mb-2 flex items-center gap-2">
											{section.title}
										</h3>
										<p className="text-sm text-gray-600 mb-4">
											{section.description}
										</p>
										<div className="space-y-2">
											{section.steps.map((step, stepIndex) => (
												<div
													key={stepIndex}
													className="flex items-start gap-2 text-sm"
												>
													<div className="min-w-[20px] mt-1">
														<FaCheckCircle className="text-green-500" />
													</div>
													<p>{step}</p>
												</div>
											))}
										</div>
									</div>
								))}
							</div>
						</div>
					))}

					{/* Help Section */}
					{/* <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
						<div className="flex items-center gap-3 mb-3">
							<FaQuestionCircle className="text-2xl" />
							<h2 className="text-xl font-bold">Need Additional Help?</h2>
						</div>
						<p className="mb-4">
							Can't find what you're looking for? Our support team is here to
							help!
						</p>
						<div className="flex gap-4">
							<button className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
								Contact Support
							</button>
						</div>
					</div> */}
				</div>
			</PageTransition>
		</section>
	);
};

export default GuidesPage;
