"use client";
import React, { useEffect, useState } from "react";
import { logo } from "../../../public";
import Image from "next/image";
import { Button, Label, TextInput } from "flowbite-react";
import Link from "next/link";
import { useLogin } from "../../../hooks/useAuth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const SignIn = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const loginMutation = useLogin();

	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await loginMutation.mutateAsync({ email, password });
		} catch (error) {
			console.error("Login failed:");
		}
	};

	useEffect(() => {
		if (loginMutation.isSuccess) {
			toast.success(loginMutation.data.message);
			router.push("/");
			setEmail("");
			setPassword("");
		}
	}, [loginMutation.isSuccess]);

	return (
		<div className="space-y-4 font-Montserrat px-10">
			<div className="flex flex-col items-center border-b-2 border-b-gray-300">
				<Image src={logo} alt="logo" height={150} width={200} />
				<p className="text-[15px] text-gray-500 font-Montserrat mb-5">
					Welcome to GearKeeper - Please login to your account
				</p>
			</div>
			<div>
				<form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit}>
					<div>
						<div className="mb-2 block">
							<Label htmlFor="email1" value="Your email" />
						</div>
						<TextInput
							id="email1"
							type="email"
							placeholder="example@email.com"
							color="gray"
							required
							className="focused:ring-green-500"
							onChange={(e) => setEmail(e.target.value)}
							value={email}
						/>
					</div>
					<div>
						<div className="mb-2 flex justify-between">
							<Label htmlFor="password1" value="Your password" />
							<Link href="/forgot-password" className="text-[14px] font-medium">
								Forgot password?
							</Link>
						</div>
						<TextInput
							id="password1"
							type="password"
							className="focus:ring-green-500 focus:border-green-500"
							onChange={(e) => setPassword(e.target.value)}
							value={password}
							required
						/>
					</div>
					<Button type="submit" className="bg-green-500">
						Submit
					</Button>
					<p className="text-gray2 text-[14px] text-center">
						Don't have an account?{" "}
						<Link className="font-medium text-primary" href="sign-up">
							Sign up
						</Link>
						.
					</p>
				</form>
			</div>
		</div>
	);
};

export default SignIn;
