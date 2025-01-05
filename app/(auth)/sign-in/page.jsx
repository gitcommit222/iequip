"use client";
import React, { Suspense, useEffect, useState } from "react";
import { logo } from "../../../public";
import Image from "next/image";
import { Button, Label, TextInput } from "flowbite-react";
import Link from "next/link";
import { useLogin } from "../../../hooks/useAuth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInSchema } from "../../../lib/schema";
import MiniLoader from "../../../components/loader/miniLoader";

const SignIn = () => {
	const loginMutation = useLogin();

	const router = useRouter();

	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		resolver: yupResolver(signInSchema),
	});

	const onSubmit = async (data) => {
		const { email, password } = data;
		try {
			await loginMutation.mutateAsync({ email, password });
			reset();
		} catch (error) {
			setError("root", {
				message: "Invalid credentials",
			});
		}
	};

	console.log("re-render");

	useEffect(() => {
		const { isSuccess, isError, data, error } = loginMutation;

		if (isSuccess) {
			toast.success(data?.message);
			router.push("/");
		} else if (isError) {
			console.error("Login failed:", error);
		}
	}, [
		loginMutation.isSuccess,
		loginMutation.isError,
		loginMutation.data,
		loginMutation.error,
	]);

	return (
		<Suspense fallback={<MiniLoader />}>
			<div className="space-y-4 font-Montserrat px-10">
				<div className="flex flex-col items-center border-b-2 border-b-gray-300">
					<Image src={logo} alt="logo" height={150} width={200} />
					<p className="text-[15px] text-gray-500 font-Montserrat mb-5">
						Welcome to I-Equip - Please login to your account
					</p>
				</div>
				<div>
					<form
						className="flex max-w-md flex-col gap-4"
						onSubmit={handleSubmit(onSubmit)}
					>
						<div>
							<div className="mb-2 block">
								<Label htmlFor="email1" value="Your email" />
							</div>
							<TextInput
								id="email1"
								type="text"
								placeholder="example@email.com"
								color={errors.email ? "failure" : "gray"}
								helperText={errors.email && errors.email.message}
								className="focused:ring-green-500"
								{...register("email")}
							/>
						</div>
						<div>
							<div className="mb-2 flex justify-between">
								<Label htmlFor="password1" value="Your password" />
								<Link
									href="/forgot-password"
									className="text-[14px] font-medium"
								>
									Forgot password?
								</Link>
							</div>
							<TextInput
								id="password1"
								type="password"
								className="focus:ring-green-500 focus:border-green-500"
								{...register("password")}
								color={errors.password ? "failure" : "gray"}
								helperText={errors.password && errors.password.message}
							/>
						</div>
						{errors.root && (
							<div className="text-red-500">{errors.root.message}</div>
						)}
						<Button
							type="submit"
							disabled={isSubmitting}
							className="bg-green-500"
							color="success"
						>
							{isSubmitting ? "Logging in..." : "Login"}
						</Button>
						{/* <p className="text-gray2 text-[14px] text-center">
						Don't have an account?{" "}
						<Link className="font-medium text-primary" href="sign-up">
						Sign up
						</Link>
						.
					</p> */}
					</form>
				</div>
			</div>
		</Suspense>
	);
};

export default SignIn;
