import React from "react";

const ActivityTable = ({ activities }) => {
	if (!activities?.length) {
		return <div className="text-center py-4">No activity logs found.</div>;
	}

	return (
		<div className="overflow-x-auto">
			<table className="w-full border-collapse">
				<thead>
					<tr className="bg-gray-100">
						<th className="p-4 text-left border">Action</th>
						<th className="p-4 text-left border">User</th>
						<th className="p-4 text-left border">Name</th>
						<th className="p-4 text-left border">Description</th>
						<th className="p-4 text-left border">Timestamp</th>
					</tr>
				</thead>
				<tbody>
					{activities.map((activity, index) => (
						<tr key={index} className="border-b hover:bg-gray-50">
							<td className="p-4 border">{activity.activity}</td>
							<td className="p-4 border">{activity?.User.name}</td>
							<td className="p-4 border">{activity.name}</td>
							<td className="p-4 border">{activity.desc}</td>
							<td className="p-4 border">
								{new Date(activity.createdAt).toLocaleString()}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ActivityTable;
