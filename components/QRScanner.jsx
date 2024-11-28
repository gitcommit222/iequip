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
			scanner.clear();
			setScanResult(result);
		};
		const handleError = (err) => {};
		scanner.render(handleSuccess, handleError);
	}, []);

	return (
		<div>
			<h1>Scan Bar code here:</h1>
			{scanResult ? <div>{scanResult}</div> : <div id="reader"></div>}
		</div>
	);
};

export default React.memo(QRCodeScanner);
