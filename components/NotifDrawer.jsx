"use client";
import { Button, Drawer, Tooltip } from "flowbite-react";
import { useState } from "react";
import { GoBell } from "react-icons/go";

export default function NotifDrawer({ color = "gray" }) {
	const [isOpenDrawer, setIsOpenDrawer] = useState(false);

	const handleClose = () => setIsOpenDrawer(false);

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
				<Drawer.Header title="Notifications" />
				<Drawer.Items></Drawer.Items>
			</Drawer>
		</>
	);
}
