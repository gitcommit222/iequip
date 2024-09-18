import Image from "next/image";
import { border } from "../../public";

export default function AuthLayout({ children }) {
	return (
		<main className="flex flex-col h-screen w-full bg-gray-50 ">
			<section className="w-full min-h-[220px] border h-screen bg-bg-image bg-contain" />
			<div className="h-5 relative">
				<Image
					src={border}
					fill
					className="object-cover border-none outline-none"
					alt="pddrmo cover"
				/>
			</div>
			<section className="flex items-center justify-center flex-1 pb-5">
				{children}
			</section>
		</main>
	);
}
