"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { logo, signout } from "../public";
import Link from "next/link";
import { navLinks } from "../constants";
import { usePathname, useRouter } from "next/navigation";
import { useLogout } from "../hooks/useAuth";
import toast from "react-hot-toast";

const Sidebar = () => {
	const pathname = usePathname();

	const {
		mutateAsync: logout,
		isPending: isLogoutPending,
		isSuccess: isLogoutSuccess,
	} = useLogout();

	const router = useRouter();

	useEffect(() => {
		let toastId;

		if (isLogoutPending) {
			// Show loading toast and store the ID
			toastId = toast.loading("Logging out...");
		}

		if (isLogoutSuccess) {
			router.push("/sign-in");
		}

		return () => {
			// Clean up: Dismiss the toast if the component unmounts or process ends unexpectedly
			if (toastId) {
				toast.dismiss(toastId);
			}
		};
	}, [isLogoutSuccess, isLogoutPending]);

	return (
		<aside className="sidebar">
			<div className="flex size-full flex-col gap-2">
				<div className="border-b flex items-center justify-center">
					<Link href="/">
						<Image src={logo} alt="logo" width={150} height={106} />
					</Link>
				</div>
				<nav className="sidebar-nav ">
					<ul className="sidebar-nav_elements">
						{navLinks.map((item) => {
							const isActive = item.url === pathname;

							return (
								<li
									key={item.url}
									className={`sidebar-nav_element group ${
										isActive ? "bg-green-500 text-white" : "text-gray-600"
									}`}
								>
									<Link href={item.url} className="sidebar-link">
										<Image
											src={item.icon}
											alt="nav items logo"
											width={18}
											height={18}
											className={`${
												isActive ? "brightness-0 invert" : "brightness-0"
											}`}
										/>
										{item.label}
									</Link>
								</li>
							);
						})}
					</ul>
					<button
						onClick={async () => await logout()}
						className="text-black flex justify-center items-center gap-3 text-[14px]"
					>
						<Image src={signout} alt="out" width={14} height={14} />
						Logout
					</button>
				</nav>
			</div>
		</aside>
	);
};

export default Sidebar;
