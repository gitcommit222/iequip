import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import ProtectedRoute from "../../hoc/ProtectedRoute";
import AppBar from "../../components/AppBar";

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
