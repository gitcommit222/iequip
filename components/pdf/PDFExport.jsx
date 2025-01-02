"use client";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { format } from "date-fns";
import toast from "react-hot-toast";
import QRDocument from "./QRDocument";

export const exportQRCodesToPDF = async (
	selectedItems,
	filteredAndSortedItems
) => {
	if (selectedItems.length === 0) {
		toast.error("Please select items to export");
		return;
	}

	try {
		const blob = await pdf(
			<QRDocument
				selectedItems={selectedItems}
				filteredAndSortedItems={filteredAndSortedItems}
			/>
		).toBlob();
		saveAs(blob, `QR_Codes_${format(new Date(), "yyyy-MM-dd")}.pdf`);
	} catch (error) {
		console.error("PDF generation error:", error);
		toast.error("Failed to generate PDF");
	}
};
