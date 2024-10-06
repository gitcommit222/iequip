import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import Providers from "../hoc/Providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

const montserrat = Montserrat({
	subsets: ["latin"],
	variable: "--font-Montserrat",
});

export const metadata = {
	title: "I-EQUIP",
	description: "Generated by create next app",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={`${inter.className} ${montserrat.className}`}>
				<Providers>
					{children}
					<Toaster />
				</Providers>
			</body>
		</html>
	);
}
