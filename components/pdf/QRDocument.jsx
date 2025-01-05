"use client";
import {
	Document,
	Page,
	View,
	Text,
	Image as PDFImage,
} from "@react-pdf/renderer";
import { pdfStyles } from "../../styles/pdfStyles";
import { chunk } from "../../utils/pdfUtils";
import { truncateText } from "../../helpers/truncateText";
import QRPDFHeader from "./pdfHeader";

const QRDocument = ({ selectedItems, filteredAndSortedItems }) => {
	return (
		<Document>
			{chunk(
				filteredAndSortedItems.filter((item) =>
					selectedItems.includes(item.id)
				),
				8
			).map((pageItems, pageIndex) => (
				<Page key={pageIndex} size="A4" style={pdfStyles.page}>
					{pageIndex === 0 && <QRPDFHeader />}
					{pageItems.map((item, index) => (
						<View key={index} style={pdfStyles.qrContainer}>
							<PDFImage
								style={pdfStyles.qrCode}
								src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
									item.barcode
								)}`}
							/>
							<Text style={pdfStyles.itemName}>
								{truncateText(item.name, 20)}
							</Text>
						</View>
					))}
				</Page>
			))}
		</Document>
	);
};

export default QRDocument;
