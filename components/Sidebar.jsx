"use client";
import React from "react";
import Image from "next/image";
import { logo, signout } from "../public";
import Link from "next/link";
import { navLinks } from "../constants";
import { usePathname } from "next/navigation";

const Sidebar = () => {
	const pathname = usePathname();
	return (
		<aside className="sidebar">
			<div className="flex size-full flex-col gap-2">
				<div className="border-b p-2 flex items-center justify-center">
					<Link href="/">
						<Image src={logo} alt="logo" width={106} />
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
						{/* <div className="w-full ">
						<button className="flex items-center gap-2">
							<Image src={signout} height={20} width={20} alt="sign-out" />
							Sign out
						</button>
					</div> */}
					</ul>
				</nav>
			</div>
		</aside>
	);
};

export default Sidebar;
