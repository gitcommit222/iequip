import React from "react";
import { logo } from "../../../public";
import Image from "next/image";
import { Button, Label, TextInput } from "flowbite-react";
import Link from "next/link";

const SignIn = () => {
	return (
		<div className="space-y-4 font-Montserrat">
			{/* <h1 className="text-[25px] font-bold">GEAR KEEPER</h1> */}
			<div className="flex flex-col items-center border-b-2 border-b-gray-300">
				<Image src={logo} alt="logo" height={150} width={200} />
				<p className="text-[15px] text-gray-500 font-Montserrat mb-5">
					Welcome to GearKeeper - Please login to your account
				</p>
			</div>
			<div>
				<form className="flex max-w-md flex-col gap-4">
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
							required
						/>
					</div>
					<Button type="submit" className="bg-green-500">
						Submit
					</Button>
					<p className="text-gray2 text-[14px] text-center">
						Don't have an account?{" "}
						<Link className="font-medium text-black" href="sign-up">
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
