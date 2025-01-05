"use client";
import React, { useState, useEffect } from "react";
import Headerbox from "../../../components/shared/Headerbox";
import { Tabs } from "flowbite-react";
import { HiUserCircle } from "react-icons/hi";
import { TbLogs } from "react-icons/tb";

import { FaUsersCog } from "react-icons/fa";
import { Table } from "flowbite-react";
import {
	useUsers,
	useUser,
	useChangePassword,
	useUpdateUser,
	useRegisterUser,
	useDeleteUser,
} from "../../../hooks/useAuth";
import CustomModal from "../../../components/shared/CustomModal";
import toast from "react-hot-toast";
import LogsTable from "../../../components/LogsTable";
import PageTransition from "../../../components/animations/PageTransition";

const User = () => {
	const { data: users } = useUsers();
	const { data: currentUser } = useUser();
	const { mutateAsync: changePassword } = useChangePassword();

	const [name, setName] = useState(currentUser?.fetchedUser?.name || "");
	const [email, setEmail] = useState(currentUser?.fetchedUser?.email || "");
	const [isChanged, setIsChanged] = useState(false);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [newUserName, setNewUserName] = useState("");
	const [newUserEmail, setNewUserEmail] = useState("");
	const [newUserPassword, setNewUserPassword] = useState("");

	useEffect(() => {
		setIsChanged(
			name !== currentUser?.fetchedUser?.name ||
				email !== currentUser?.fetchedUser?.email
		);
	}, [name, email, currentUser]);

	const handleChangePassword = async () => {
		await toast.promise(
			changePassword({
				userId: user?.fetchedUser?.id,
				currentPassword,
				newPassword,
			}),
			{
				loading: "Changing password...",
				success: "Password changed successfully",
				error: "Error changing password",
			}
		);
		setCurrentPassword("");
		setNewPassword("");
	};

	const passwordChangeForm = (
		<div className="space-y-4">
			<div>
				<label className="block text-gray-700 mb-2">Current Password:</label>
				<input
					type="password"
					value={currentPassword}
					onChange={(e) => setCurrentPassword(e.target.value)}
					className="border rounded w-full p-2"
				/>
			</div>
			<div>
				<label className="block text-gray-700 mb-2">New Password:</label>
				<input
					type="password"
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
					className="border rounded w-full p-2"
				/>
			</div>
			<button
				onClick={handleChangePassword}
				className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
				disabled={!currentPassword || !newPassword}
			>
				Change Password
			</button>
		</div>
	);

	const { mutateAsync: updateUser } = useUpdateUser();

	const handleUpdateUser = async () => {
		await toast.promise(
			updateUser({ userId: currentUser?.fetchedUser?.id, name, email }),
			{
				loading: "Updating user...",
				success: "User updated successfully",
				error: "Error updating user",
			}
		);
	};

	const { mutateAsync: registerUser } = useRegisterUser();

	const handleRegisterUser = async () => {
		await toast.promise(
			registerUser({
				name: newUserName,
				email: newUserEmail,
				password: newUserPassword,
			}),
			{
				loading: "Registering user...",
				success: "User registered successfully",
				error: "Error registering user",
			}
		);
	};

	const addUserForm = (
		<div className="space-y-4">
			<div>
				<label className="block text-gray-700 mb-2">Name:</label>
				<input
					type="text"
					value={newUserName}
					onChange={(e) => setNewUserName(e.target.value)}
					className="border rounded w-full p-2"
				/>
			</div>
			<div>
				<label className="block text-gray-700 mb-2">Email:</label>
				<input
					type="email"
					value={newUserEmail}
					onChange={(e) => setNewUserEmail(e.target.value)}
					className="border rounded w-full p-2"
				/>
			</div>
			<div>
				<label className="block text-gray-700 mb-2">Password:</label>
				<input
					type="password"
					value={newUserPassword}
					onChange={(e) => setNewUserPassword(e.target.value)}
					className="border rounded w-full p-2"
				/>
			</div>
			<button
				onClick={handleRegisterUser}
				className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
				disabled={!newUserName || !newUserEmail || !newUserPassword}
			>
				Save
			</button>
		</div>
	);

	const { mutateAsync: deleteUser } = useDeleteUser();

	const handleDeleteUser = async (userId) => {
		await toast.promise(deleteUser(userId), {
			loading: "Deleting user...",
			success: "User deleted successfully",
			error: "Error deleting user",
		});
	};

	return (
		<section>
			<Headerbox title="Users" subtext="View and manage users data here." />
			<PageTransition>
				<div className=" h-screen">
					<Tabs aria-label="Tabs with icons" variant="default" color="success">
						<Tabs.Item active title="Users" icon={FaUsersCog}>
							<div className="mb-4">
								<CustomModal
									btnTitle="Add New User"
									headerTitle="Create New User"
									mainContent={addUserForm}
									btnColor="success"
								/>
							</div>
							<Table>
								<Table.Head>
									<Table.HeadCell>Name</Table.HeadCell>
									<Table.HeadCell>Email</Table.HeadCell>
									<Table.HeadCell>Actions</Table.HeadCell>
								</Table.Head>
								<Table.Body>
									{users &&
										users.map((user) => (
											<Table.Row key={user.id}>
												<Table.Cell>{user.name}</Table.Cell>
												<Table.Cell>{user.email}</Table.Cell>

												<Table.Cell>
													<button
														onClick={() => handleDeleteUser(user.id)}
														className="text-red-500 ml-2 disabled:cursor-not-allowed disabled:text-gray-400"
														disabled={user?.id === currentUser?.fetchedUser?.id}
													>
														Delete
													</button>
												</Table.Cell>
											</Table.Row>
										))}
								</Table.Body>
							</Table>
						</Tabs.Item>
						<Tabs.Item active title="Profile" icon={HiUserCircle}>
							<form className="p-4 bg-white rounded shadow-md">
								<div className="mb-4">
									<label className="block text-gray-700">Name:</label>
									<input
										type="text"
										value={name}
										onChange={(e) => setName(e.target.value)}
										className="border rounded w-full p-2 mt-1"
									/>
								</div>
								<div className="mb-4">
									<label className="block text-gray-700">Email:</label>
									<input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="border rounded w-full p-2 mt-1"
									/>
								</div>
								<div className="mt-4 flex space-x-2">
									<button
										onClick={handleUpdateUser}
										className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
										disabled={!isChanged}
									>
										Edit
									</button>
									<button
										type="button"
										className="bg-gray-300 text-gray-700 rounded px-4 py-2 hover:bg-gray-400"
									>
										Reset
									</button>
									<CustomModal
										btnTitle="Change Password"
										headerTitle="Change Password"
										mainContent={passwordChangeForm}
										btnColor="success"
									/>
								</div>
							</form>
						</Tabs.Item>
						<Tabs.Item title="Logs" icon={TbLogs}>
							<LogsTable />
						</Tabs.Item>
					</Tabs>
				</div>
			</PageTransition>
		</section>
	);
};

export default User;
