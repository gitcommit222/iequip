"use client";
import { View, Text, Image as PDFImage } from "@react-pdf/renderer";
import { pdfStyles } from "../../styles/pdfStyles";
import { getExportHeader } from "../../utils/pdfUtils";

const QRPDFHeader = () => {
	const headerData = getExportHeader();
	return (
		<View style={pdfStyles.header}>
			<View style={pdfStyles.logoContainer}>
				<PDFImage src={headerData.leftLogo} style={pdfStyles.logoLeft} />
				<View style={pdfStyles.headerText}>
					<Text style={pdfStyles.title}>{headerData.title}</Text>
					<Text style={pdfStyles.date}>{headerData.date}</Text>
					<Text style={pdfStyles.office}>{headerData.office}</Text>
				</View>
				<PDFImage src={headerData.rightLogo} style={pdfStyles.logoRight} />
			</View>
			<Text style={pdfStyles.category}>{headerData.category}</Text>
		</View>
	);
};

export default QRPDFHeader;
