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
		mutate: logout,
		isPending: isLogoutPending,
		isSuccess: isLogoutSuccess,
	} = useLogout();

	const router = useRouter();

	const handleLogout = () => {
		try {
			console.log("Logout button clicked");
			logout();
			router.push("/sign-in");
		} catch (error) {
			console.error("Logout error:", error);
			toast.error("Logout failed. Please try again.");
		}
	};

	return (
		<aside className="sidebar">
			<div className="flex size-full flex-col gap-2">
				<div className="border-b flex items-center justify-center">
					<Link href="/">
						<Image src={logo} alt="logo" width={150} height={106} />
					</Link>
				</div>
				<nav className="sidebar-nav">
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
												isActive ? "brightness-0 invert" : "brightness-50"
											}`}
										/>
										{item.label}
									</Link>
								</li>
							);
						})}
					</ul>
					<li className="sidebar-nav_element group text-gray-600">
						<button
							onClick={handleLogout}
							className="sidebar-link w-full flex items-center"
							disabled={isLogoutPending}
						>
							<Image
								src={signout}
								alt="out"
								width={18}
								height={18}
								className="brightness-0"
							/>
							<span>Logout</span>
						</button>
					</li>
				</nav>
			</div>
		</aside>
	);
};

export default Sidebar;
