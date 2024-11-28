"use client";
import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QRCodeScanner = ({ onScanned }) => {
	const [scanResult, setScanResult] = useState(null);

	useEffect(() => {
		const scanner = new Html5QrcodeScanner("reader", {
			qrbox: {
				width: 500,
				height: 200,
			},
			fps: 5,
			videoConstraints: {
				facingMode: "environment", // Default to the rear camera
			},
		});

		const handleSuccess = async (result) => {
			setScanResult(result);
			if (onScanned) {
				await onScanned(result);
			}
			scanner.clear();
		};
		const handleError = (err) => {};
		scanner.render(handleSuccess, handleError);
	}, []);

	return <div>{scanResult ? null : <div id="reader"></div>}</div>;
};

export default QRCodeScanner;
