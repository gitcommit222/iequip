// components/LoadingScreen.tsx
"use client";

import { motion } from "framer-motion";

export default function LoadingScreen() {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 z-50 flex items-center justify-center bg-background"
		>
			<motion.div
				animate={{
					scale: [1, 1.2, 1],
				}}
				transition={{
					duration: 1,
					repeat: Infinity,
					ease: "easeInOut",
				}}
				className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin"
			/>
		</motion.div>
	);
}
