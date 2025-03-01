import { Label } from "flowbite-react";
import React, { useState, useRef, useEffect } from "react";

const WebcamImageCapture = ({ setProofImage }) => {
	const [isCapturing, setIsCapturing] = useState(false);
	const [previewImage, setPreviewImage] = useState(null);
	const [fileName, setFileName] = useState("");
	const [cameraReady, setCameraReady] = useState(false);
	const [cameraError, setCameraError] = useState(null);
	const videoRef = useRef(null);
	const streamRef = useRef(null);
	const fileInputRef = useRef(null);

	// Clean up webcam when component unmounts
	useEffect(() => {
		return () => {
			if (streamRef.current) {
				streamRef.current.getTracks().forEach((track) => track.stop());
			}
		};
	}, []);

	// Function to check if camera is actually streaming
	const checkVideoStream = () => {
		if (videoRef.current) {
			const video = videoRef.current;

			// If video dimensions are 0, stream isn't properly working
			if (video.videoWidth === 0 || video.videoHeight === 0) {
				return false;
			}

			// Additional check: if the stream has video tracks that aren't enabled
			if (streamRef.current) {
				const videoTracks = streamRef.current.getVideoTracks();
				if (videoTracks.length === 0 || !videoTracks[0].enabled) {
					return false;
				}
			}

			return true;
		}
		return false;
	};

	const startCamera = async () => {
		try {
			// Reset error state
			setCameraError(null);

			// Stop any existing stream
			if (streamRef.current) {
				streamRef.current.getTracks().forEach((track) => track.stop());
				streamRef.current = null;
			}

			// Clear video source
			if (videoRef.current) {
				videoRef.current.srcObject = null;
			}

			// Set capturing state first
			setIsCapturing(true);
			setCameraReady(false);

			// Request camera access with constraints
			const constraints = {
				video: {
					width: { ideal: 1280 },
					height: { ideal: 720 },
					facingMode: "user",
				},
			};

			console.log("Requesting camera access...");
			const stream = await navigator.mediaDevices.getUserMedia(constraints);
			console.log("Camera access granted", stream);

			// Check if we have video tracks
			const videoTracks = stream.getVideoTracks();
			if (videoTracks.length === 0) {
				throw new Error("No video tracks found in the stream");
			}

			console.log(
				"Video tracks:",
				videoTracks.map(
					(t) => `${t.label} (${t.enabled ? "enabled" : "disabled"})`
				)
			);

			// Store stream reference
			streamRef.current = stream;

			// Set the stream to the video element
			if (videoRef.current) {
				console.log("Setting video source...");
				videoRef.current.srcObject = stream;

				// Set up event listeners
				videoRef.current.onloadedmetadata = () => {
					console.log("Video metadata loaded");

					videoRef.current
						.play()
						.then(() => {
							console.log("Video playback started");

							// Additional timeout to ensure video is really playing
							setTimeout(() => {
								if (checkVideoStream()) {
									console.log("Camera confirmed working");
									setCameraReady(true);
								} else {
									console.error(
										"Video stream appears to be not working properly"
									);
									setCameraError(
										"Camera stream not working correctly. Please try again or use a different browser."
									);
								}
							}, 1000);
						})
						.catch((err) => {
							console.error("Failed to play video:", err);
							setCameraError(`Failed to start video playback: ${err.message}`);
						});
				};

				videoRef.current.onerror = (err) => {
					console.error("Video element error:", err);
					setCameraError(
						`Video element error: ${err.message || "Unknown error"}`
					);
				};
			}
		} catch (err) {
			console.error("Error accessing webcam:", err);
			setCameraError(`Unable to access webcam: ${err.message}`);
			setIsCapturing(false);
		}
	};

	const stopCamera = () => {
		console.log("Stopping camera");
		setCameraError(null);

		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => {
				console.log(`Stopping track: ${track.label}`);
				track.stop();
			});
			streamRef.current = null;
		}

		if (videoRef.current) {
			videoRef.current.srcObject = null;
		}

		setIsCapturing(false);
		setCameraReady(false);
	};

	const capturePhoto = () => {
		if (!videoRef.current || !cameraReady) return;

		try {
			console.log("Capturing photo...");
			const canvas = document.createElement("canvas");
			const videoElement = videoRef.current;

			// Set canvas dimensions to match the video
			const width = videoElement.videoWidth;
			const height = videoElement.videoHeight;

			console.log(`Video dimensions: ${width}x${height}`);

			if (width === 0 || height === 0) {
				throw new Error("Cannot capture from video with zero dimensions");
			}

			canvas.width = width;
			canvas.height = height;

			// Draw the current video frame to the canvas
			const ctx = canvas.getContext("2d");
			ctx.drawImage(videoElement, 0, 0, width, height);

			// Convert to blob
			canvas.toBlob(
				(blob) => {
					if (blob) {
						console.log(`Captured photo: ${blob.size} bytes`);

						// Create a File object
						const capturedFile = new File([blob], "webcam-capture.jpg", {
							type: "image/jpeg",
						});

						// Update the state with the captured image
						setProofImage(capturedFile);
						setPreviewImage(URL.createObjectURL(blob));
						setFileName("webcam-capture.jpg");

						// Stop the camera after capturing
						stopCamera();
					} else {
						throw new Error("Failed to create image blob");
					}
				},
				"image/jpeg",
				0.9
			);
		} catch (err) {
			console.error("Error capturing photo:", err);
			setCameraError(`Failed to capture photo: ${err.message}`);
		}
	};

	const handleFileInput = (e) => {
		const file = e.target.files[0];
		if (file) {
			setProofImage(file);
			setPreviewImage(URL.createObjectURL(file));
			setFileName(file.name);
		}
	};

	// Alternative methods if getUserMedia is failing
	const retryWithFallback = async () => {
		setCameraError("Trying alternate camera access method...");

		try {
			// Try with basic constraints
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: false,
			});

			streamRef.current = stream;

			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				videoRef.current.onloadedmetadata = () => {
					videoRef.current
						.play()
						.then(() => {
							setTimeout(() => setCameraReady(true), 500);
						})
						.catch((err) => {
							setCameraError(`Fallback method failed: ${err.message}`);
						});
				};
			}
		} catch (err) {
			setCameraError(`Fallback camera method failed: ${err.message}`);
		}
	};

	return (
		<div className="mb-2">
			<div className="mb-1 block">
				<Label htmlFor="proofImage" value="Proof of Transaction Image" />
			</div>

			{isCapturing ? (
				<div className="mb-4 border rounded p-4 bg-gray-50">
					<div className="mb-3 relative">
						{/* Video element */}
						<video
							ref={videoRef}
							autoPlay
							playsInline
							muted
							className="w-full max-w-md mx-auto border rounded"
							style={{ maxHeight: "300px", objectFit: "cover" }}
						/>

						{/* Camera loading indicator */}
						{!cameraReady && !cameraError && (
							<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
								<div className="text-center">
									<svg
										className="animate-spin h-8 w-8 mx-auto mb-2"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									<p>Camera initializing...</p>
								</div>
							</div>
						)}

						{/* Error message overlay */}
						{cameraError && (
							<div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-70 text-white">
								<div className="text-center p-4">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-8 w-8 mx-auto mb-2"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									<p className="font-medium">{cameraError}</p>
									<div className="mt-3 flex justify-center gap-2">
										<button
											onClick={retryWithFallback}
											className="px-3 py-1 bg-white text-red-600 rounded text-sm font-medium"
										>
											Try Alternate Method
										</button>
										<button
											onClick={stopCamera}
											className="px-3 py-1 bg-white text-red-600 rounded text-sm font-medium"
										>
											Cancel
										</button>
									</div>
								</div>
							</div>
						)}

						{/* Camera capture icon overlay */}
						{cameraReady && (
							<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
								<svg
									className="h-16 w-16 text-white opacity-70"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<circle cx="12" cy="12" r="10" />
									<circle cx="12" cy="12" r="3" />
								</svg>
							</div>
						)}
					</div>

					{/* Capture action buttons */}
					<div className="flex justify-center gap-4">
						{cameraReady && (
							<button
								type="button"
								onClick={capturePhoto}
								className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md flex items-center justify-center gap-2"
							>
								<svg
									className="h-6 w-6"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<circle cx="12" cy="12" r="10" />
									<circle cx="12" cy="12" r="3" />
								</svg>
								Capture Photo
							</button>
						)}

						<button
							type="button"
							onClick={stopCamera}
							className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition shadow-md"
						>
							Cancel
						</button>
					</div>

					{cameraReady && (
						<div className="text-center mt-3 text-gray-700">
							Click the "Capture Photo" button to take a picture
						</div>
					)}
				</div>
			) : (
				<div>
					<div className="flex flex-col sm:flex-row gap-4 mb-3">
						<input
							ref={fileInputRef}
							type="file"
							id="proofImage"
							accept="image/*"
							onChange={handleFileInput}
							className="hidden"
						/>

						<button
							type="button"
							onClick={() => fileInputRef.current.click()}
							className="px-4 py-2 border rounded hover:bg-gray-50 transition flex items-center gap-2"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 text-gray-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
							Choose File
						</button>

						<button
							type="button"
							onClick={startCamera}
							className="px-4 py-2 border rounded hover:bg-gray-50 transition flex items-center gap-2"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 text-gray-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
								/>
							</svg>
							Use Webcam
						</button>
					</div>

					{previewImage && (
						<div className="mt-3">
							<div className="text-sm text-gray-600 mb-2">{fileName}</div>
							<img
								src={previewImage}
								alt="Preview"
								className="max-w-xs border rounded"
								style={{ maxHeight: "200px", objectFit: "contain" }}
							/>
						</div>
					)}
				</div>
			)}

			{/* Option to use file input if camera is not available */}
			{cameraError && (
				<div className="mt-4 text-sm text-gray-700">
					If camera access isn't working, you can also{" "}
					<button
						onClick={() => {
							stopCamera();
							setTimeout(() => fileInputRef.current.click(), 100);
						}}
						className="text-blue-600 underline"
					>
						upload an image
					</button>{" "}
					instead.
				</div>
			)}
		</div>
	);
};

export default WebcamImageCapture;
