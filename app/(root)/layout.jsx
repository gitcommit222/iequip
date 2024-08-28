import Sidebar from "../../components/Sidebar";

export default function MainLayout({ children }) {
	return (
		<main className="flex bg-gray-50 root">
			<Sidebar />
			<section className="px-7 py-10">{children}</section>
		</main>
	);
}
