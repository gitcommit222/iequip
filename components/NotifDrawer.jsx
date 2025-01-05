"use client";
import { Badge, Button, Drawer, Tooltip } from "flowbite-react";
import { useState } from "react";
import { GoBell } from "react-icons/go";
import { useDeleteNotif, useGetNotifications } from "../hooks/useNotification";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";

export default function NotifDrawer({ color = "gray" }) {
	const [isOpenDrawer, setIsOpenDrawer] = useState(false);

	const { data: notifs } = useGetNotifications();

	const { mutateAsync: deleteNotif } = useDeleteNotif();

	const handleClose = () => setIsOpenDrawer(false);

	const handleDeleteNotif = async (id) => {
		await toast.promise(deleteNotif(id), {
			success: "Notification deleted successfully",
			loading: "Deleting Notification...",
			error: "Failed to delete Notification",
		});
	};

	return (
		<>
			<div className="flex items-center justify-center">
				<Tooltip content="Notifications">
					<Button color={color} onClick={() => setIsOpenDrawer(true)}>
						<GoBell size={18} />
					</Button>
				</Tooltip>
			</div>
			<Drawer open={isOpenDrawer} onClose={handleClose} position="right">
				<Drawer.Header title="Notifications" titleIcon={GoBell} />
				<div className="flex gap-2 flex-col">
					{notifs?.map((notif) => (
						<Drawer.Items className="border p-3 rounded-md" key={notif.id}>
							<div className="flex justify-between">
								<h1 className="font-semibold text-[14px] text-gray-700">
									{notif.Notification.title}
								</h1>
								<div className="flex gap-1">
									<p className="text-[14px] text-gray-600">
										<Badge color="info">New</Badge>
									</p>
									<button
										className="text-red-500"
										onClick={() => handleDeleteNotif(notif.Notification.id)}
									>
										<MdDelete />
									</button>
								</div>
							</div>
							<div className="mt-2">
								<p className="text-[12px] text-gray-600">
									{notif.Notification.message}
								</p>
							</div>
						</Drawer.Items>
					))}
				</div>
			</Drawer>
		</>
	);
}
