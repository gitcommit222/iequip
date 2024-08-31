import React from "react";

const InfoBox = () => {
	return (
		<div className="h-5 px-5 flex items-center justify-start gap-3 rounded-lg py-10 bg-white min-w-60 flex-1">
			<div className="rounded-full bg-gray-100 w-10 h-10"></div>
			<div className="flex flex-col">
				<h1 className="font-semibold text-[12px]">Returned Items</h1>
				<span className="font-semibold text-[14px]">18</span>
			</div>
		</div>
	);
};

export default InfoBox;
