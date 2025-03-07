"use client";
import React from "react";
import Headerbox from "../../../components/shared/Headerbox";
import ActivityTable from "../../../components/activity/ActivityTable";
import { useActivityLogs } from "../../../hooks/useActivityLogs";

const ActivityLog = () => {
	const { data: activities, isLoading, error } = useActivityLogs();

	return (
		<div>
			<Headerbox title="Activity Log" subtext="View all activity logs here." />

			{isLoading && <div className="text-center py-4">Loading...</div>}
			{error && (
				<div className="text-center py-4 text-red-500">
					Error loading activity logs.
				</div>
			)}
			{activities?.data && <ActivityTable activities={activities?.data} />}
		</div>
	);
};

export default ActivityLog;
