import { format } from "date-fns";

export const chunk = (arr, size) => {
	const chunks = [];
	for (let i = 0; i < arr.length; i += size) {
		chunks.push(arr.slice(i, i + size));
	}
	return chunks;
};

export const getExportHeader = () => ({
	title: "Republic of the Philippines",
	subtitle: "PROVINCE OF OCCIDENTAL MINDORO",
	date: format(new Date(), "MMMM dd, yyyy"),
	office: "PDRRMO Main office",
	category: "( FLOOD AND TYPHOON RESCUE EQUIPMENT )",
	leftLogo: "/images/provinceLogo.png",
	rightLogo: "/images/pdrrmo_logo.png",
});
