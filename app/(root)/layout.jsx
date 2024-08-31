import Sidebar from "../../components/Sidebar";

export default function MainLayout({ children }) {
	return (
		<main className="flex bg-gray-50 root">
			<Sidebar />
			<section className="ml-[300px] py-10 pr-10 w-full">{children}</section>
		</main>
	);
}
