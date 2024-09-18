import React from "react";
import { useItemImage } from "../hooks/useItem";
import Image from "next/image";

const ItemImage = ({ imagePath, alt, width, height, className }) => {
	const { data: imageBlob, isLoading, isError } = useItemImage(imagePath);

	if (isLoading) return <div>Loading...</div>;
	if (isError) return <div>Error loading image</div>;

	const imageUrl = imageBlob ? URL.createObjectURL(imageBlob) : "";

	return (
		<Image
			src={imageUrl}
			alt={alt}
			width={width}
			height={height}
			onLoad={() => URL.revokeObjectURL(imageUrl)}
			className={className}
		/>
	);
};

export default ItemImage;
