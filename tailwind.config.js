/** @type {import('tailwindcss').Config} */

const flowbite = require("flowbite-react/tailwind");

module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		flowbite.content(),
	],
	theme: {
		extend: {
			colors: {
				primary: "#21C461",
				gray2: "#6b7280",
			},
			backgroundImage: {
				"bg-image": "url(/images/bgImage.jpg)",
			},
			borderImage: {
				"bg-border": "url(/images/border.png)",
			},
		},
	},
	plugins: [flowbite.plugin()],
};
