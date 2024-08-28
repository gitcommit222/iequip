import { Field, Input, Label, Button } from "@headlessui/react";
import clsx from "clsx";

const SignIn = () => {
	return (
		<section className="border p-5 rounded-lg bg-white min-w-[300px]">
			<h1 className="font-semibold text-center">SIGN IN</h1>
			<div className="w-full px-4 flex flex-col gap-3">
				<Field>
					<Label className="text-sm/6 font-medium text-gray-700">Email</Label>
					<Input
						className={clsx(
							"mt-1 block w-full rounded-lg border-none bg-gray-100 py-1.5 px-3 text-sm/6 text-gray-700",
							"focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
						)}
					/>
				</Field>
				<Field>
					<Label className="text-sm/6 font-medium text-gray-700">
						Password
					</Label>
					<Input
						className={clsx(
							"mt-1 block w-full rounded-lg border-none bg-gray-100 py-1.5 px-3 text-sm/6 text-gray-700",
							"focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
						)}
						type="password"
					/>
				</Field>
				<Button className="mt-1 text-center gap-2 rounded-md bg-green-500 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-green-600 data-[open]:bg-green-700 data-[focus]:outline-1 data-[focus]:outline-white">
					Sign In
				</Button>
			</div>
		</section>
	);
};

export default SignIn;
