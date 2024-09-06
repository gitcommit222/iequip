import Sidebar from "../../components/Sidebar";
import ProtectedRoute from "../../hoc/ProtectedRoute";

export default function MainLayout({ children }) {
	return (
		<main className="flex bg-gray-50 root">
			<ProtectedRoute>
				<Sidebar />
				<section className="ml-[280px] py-10 pr-10 w-full">{children}</section>
			</ProtectedRoute>
		</main>
	);
}
