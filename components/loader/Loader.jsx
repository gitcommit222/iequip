import React from "react";
import Image from "next/image";
import { logo } from "../../public";
import "./loader.css";

const Loader = () => {
	return (
		<div className="w-full h-screen flex items-center justify-center">
			<Image
				src={logo}
				height={500}
				width={500}
				alt="logo"
				className="blinking"
			/>
		</div>
	);
};

export default Loader;
