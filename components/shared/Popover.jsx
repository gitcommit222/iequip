import { Popover } from "flowbite-react";

const CustomPopover = ({
	content,
	button,
	title,
	trigger,
	placement = "bottom",
	saveBtn,
}) => {
	return (
		<Popover
			aria-labelledby="default-popover"
			trigger={trigger && trigger}
			placement={placement && placement}
			content={
				<div className="text-sm text-gray-500 dark:text-gray-400">
					<div className="border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 flex justify-between items-center">
						<h3
							id="default-popover"
							className="font-semibold text-gray-900 dark:text-white"
						>
							{title}
						</h3>
						{saveBtn && saveBtn}
					</div>
					{content}
				</div>
			}
		>
			{button}
		</Popover>
	);
};

export default CustomPopover;
