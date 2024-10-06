import Image from "next/image";
import React from "react";

const InfoBox = ({ title, data, iconUrl }) => {
	return (
		<div className="h-5 px-5 flex items-center justify-start gap-3 rounded-lg py-10 bg-white min-w-60 flex-1">
			<div className="rounded-full flex items-center justify-center bg-gray-100 w-10 h-10">
				<Image src={iconUrl} alt="icon" width={25} height={25} />
			</div>
			<div className="flex flex-col">
				<h1 className="font-semibold text-[12px]">{title}</h1>
				<span className="font-semibold text-[14px]">{data}</span>
			</div>
		</div>
	);
};

export default InfoBox;
