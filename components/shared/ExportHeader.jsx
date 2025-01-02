import { format } from "date-fns";
import Image from "next/image";

export default function ExportHeader({ type = "excel" }) {
	const currentDate = format(new Date(), "MMMM dd, yyyy");

	// PDF styles are different from Excel/HTML styles
	if (type === "pdf") {
		return {
			title: "PROVINCIAL DISASTER RISK REDUCTION AND MANAGEMENT OFFICE",
			subtitle: "ADMINISTRATION AND TRAINING DIVISION",
			date: currentDate,
			office: "PDRRMO Main office",
			category: "( FLOOD AND TYPHOON RESCUE EQUIPMENT )",
			leftLogo: "/placeholder.svg?height=96&width=96",
			rightLogo: "/placeholder.svg?height=96&width=96",
		};
	}

	return (
		<div className="w-full bg-white p-6 print:p-0">
			<div className="text-center">
				<h1 className="text-green-600 font-bold text-xl mb-4">
					PROVINCIAL DISASTER RISK REDUCTION AND MANAGEMENT OFFICE
				</h1>

				<div className="flex justify-between items-center mb-4">
					<div className="w-24 h-24 relative">
						<Image
							src="/provinceLogo.png"
							alt="Provincial Seal"
							width={96}
							height={96}
							className="object-contain"
						/>
					</div>

					<div className="flex-1 px-4">
						<h2 className="text-lg font-semibold mb-2">
							ADMINISTRATION AND TRAINING DIVISION
						</h2>
						<p className="text-gray-600 mb-2">{currentDate}</p>
						<p className="text-gray-800">PDRRMO Main office</p>
					</div>

					<div className="w-24 h-24 relative">
						<Image
							src="/pdrrmo_logo.png"
							alt="PDRRMO Logo"
							width={96}
							height={96}
							className="object-contain"
						/>
					</div>
				</div>

				<div className="border-2 border-gray-200 py-2 px-4 inline-block rounded-md">
					<h3 className="text-lg font-bold">
						( FLOOD AND TYPHOON RESCUE EQUIPMENT )
					</h3>
				</div>
			</div>
		</div>
	);
}
