export const getImageUrl = (path) => {
	if (!path) return "/placeholder-image.jpg";
	return `${process.env.NEXT_PUBLIC_API_URL_IMAGE}/${path}`;
};
