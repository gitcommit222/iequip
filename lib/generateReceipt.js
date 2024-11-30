import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { format } from "date-fns";

export const generateAndDownloadReceipt = async (item) => {
	try {
		console.log("Starting PDF generation");
		const pdfDoc = await PDFDocument.create();
		const page = pdfDoc.addPage([600, 800]);
		const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
		const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

		console.log("Loading logos");
		// Load and embed logos
		let provinceLogo, pdrrmoLogo;
		try {
			provinceLogo = await pdfDoc.embedPng(
				await fetch("/images/provinceLogo.png").then((res) => res.arrayBuffer())
			);
			console.log("Province logo loaded successfully");
		} catch (error) {
			console.error("Error loading province logo:", error);
		}

		try {
			pdrrmoLogo = await pdfDoc.embedPng(
				await fetch("/images/pdrrmo_logo.png").then((res) => res.arrayBuffer())
			);
			console.log("PDRRMO logo loaded successfully");
		} catch (error) {
			console.error("Error loading PDRRMO logo:", error);
		}

		// Only draw logos if they were successfully loaded
		const logoHeight = 50;
		const pageWidth = 600;
		const logoY = 735;

		if (provinceLogo) {
			const provinceAspectRatio = provinceLogo.width / provinceLogo.height;
			const provinceWidth = logoHeight * provinceAspectRatio;
			page.drawImage(provinceLogo, {
				x: 50,
				y: logoY,
				width: provinceWidth,
				height: logoHeight,
			});
			console.log("Province logo drawn");
		} else {
			console.log("Province logo not available for drawing");
		}

		if (pdrrmoLogo) {
			const pdrrmoAspectRatio = pdrrmoLogo.width / pdrrmoLogo.height;
			const pdrrmoWidth = logoHeight * pdrrmoAspectRatio;
			page.drawImage(pdrrmoLogo, {
				x: pageWidth - pdrrmoWidth - 50,
				y: logoY,
				width: pdrrmoWidth,
				height: logoHeight,
			});
			console.log("PDRRMO logo drawn");
		} else {
			console.log("PDRRMO logo not available for drawing");
		}
		// Header
		page.drawText("Republic of the Philippines", {
			x: 220,
			y: 750,
			size: 12,
			font: boldFont,
		});
		page.drawText("PROVINCE OF OCCIDENTAL MINDORO", {
			x: 190,
			y: 735,
			size: 12,
			font: boldFont,
		});
		page.drawText("Mamburao", { x: 265, y: 720, size: 12, font });

		// Office name
		page.drawText("PROVINCIAL DISASTER RISK REDUCTION MANAGEMENT OFFICE", {
			x: 120,
			y: 700,
			size: 10,
			font,
		});
		page.drawText("(PDRRMO)", { x: 270, y: 685, size: 10, font });

		// Title
		page.drawText("ACKNOWLEDGEMENT RECEIPT", {
			x: 200,
			y: 650,
			size: 16,
			font: boldFont,
		});

		// Content
		const fontSize = 10;
		page.drawText(
			"This is to certify that the undersigned received the ff. items in good condition.",
			{ x: 50, y: 620, size: fontSize, font }
		);

		// Table
		const tableTop = 590;
		const tableBottom = 500;

		page.drawLine({
			start: { x: 50, y: tableTop },
			end: { x: 550, y: tableTop },
			thickness: 1,
		});
		page.drawLine({
			start: { x: 50, y: tableTop },
			end: { x: 50, y: tableBottom },
			thickness: 1,
		});
		page.drawLine({
			start: { x: 100, y: tableTop },
			end: { x: 100, y: tableBottom },
			thickness: 1,
		});
		page.drawLine({
			start: { x: 450, y: tableTop },
			end: { x: 450, y: tableBottom },
			thickness: 1,
		});
		page.drawLine({
			start: { x: 550, y: tableTop },
			end: { x: 550, y: tableBottom },
			thickness: 1,
		});
		page.drawLine({
			start: { x: 50, y: tableBottom },
			end: { x: 550, y: tableBottom },
			thickness: 1,
		});

		page.drawText("ITEM NO.", {
			x: 54,
			y: 575,
			size: fontSize,
			font: boldFont,
		});
		page.drawText("DESCRIPTION", {
			x: 250,
			y: 575,
			size: fontSize,
			font: boldFont,
		});
		page.drawText("QUANTITY", {
			x: 470,
			y: 575,
			size: fontSize,
			font: boldFont,
		});

		page.drawText("1", { x: 70, y: 555, size: fontSize, font });
		page.drawText(item.item.name, { x: 110, y: 555, size: fontSize, font });
		page.drawText(item.borrowed_quantity?.toString() || "N/A", {
			x: 470,
			y: 555,
			size: fontSize,
			font,
		});

		page.drawText("****Nothing Follows****", {
			x: 230,
			y: 543,
			size: fontSize,
			font,
		});

		// Signature and details
		page.drawText("Signature of recipients:", {
			x: 50,
			y: 460,
			size: fontSize,
			font,
		});
		page.drawLine({
			start: { x: 160, y: 460 },
			end: { x: 250, y: 460 },
			thickness: 0.5,
		});

		page.drawText(`Name: ${item.recipient.name}`, {
			x: 50,
			y: 440,
			size: fontSize,
			font,
		});
		page.drawText(`Office: ${item.recipient.department || "N/A"}`, {
			x: 50,
			y: 420,
			size: fontSize,
			font,
		});
		page.drawText(`Date: ${format(new Date(item.start_date), "MM/dd/yy")}`, {
			x: 50,
			y: 400,
			size: fontSize,
			font,
		});
		page.drawText(
			`Borrowed Date: ${format(new Date(item.start_date), "MM/dd/yy")}`,
			{
				x: 50,
				y: 380,
				size: fontSize,
				font,
			}
		);

		page.drawText(
			`Return Date: ${format(new Date(item.end_date), "MM/dd/yy")}`,
			{
				x: 50,
				y: 360,
				size: fontSize,
				font,
			}
		);

		page.drawText("Tested By:", { x: 50, y: 340, size: fontSize, font });
		page.drawText(item.tested_by, {
			x: 50,
			y: 320,
			size: fontSize,
			font: boldFont,
		});

		// Approvals
		page.drawText("Released by:", { x: 350, y: 460, size: fontSize, font });
		page.drawText("ROMER F. ZULUETA", {
			x: 350,
			y: 440,
			size: fontSize,
			font: boldFont,
		});
		page.drawText("Admin Aide IV", { x: 350, y: 420, size: fontSize, font });

		page.drawText("Approved by:", { x: 350, y: 380, size: fontSize, font });
		page.drawText("JOHN KENETH P. BARONGGO", {
			x: 350,
			y: 360,
			size: fontSize,
			font: boldFont,
		});
		page.drawText("OIC-PGADH-LDRRMOIV", {
			x: 350,
			y: 340,
			size: fontSize,
			font,
		});

		page.drawText("Noted by:", { x: 350, y: 300, size: fontSize, font });
		page.drawText("MARIO D. MULINGBAYAN, JR.", {
			x: 350,
			y: 280,
			size: fontSize,
			font: boldFont,
		});
		page.drawText("PGDH-PDRRMO", { x: 350, y: 260, size: fontSize, font });

		console.log("Saving PDF");
		const pdfBytes = await pdfDoc.save();
		const blob = new Blob([pdfBytes], { type: "application/pdf" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = `receipt_${item.id}.pdf`;
		link.click();

		console.log("PDF generated and download initiated");
	} catch (error) {
		console.error("Error generating PDF:", error);
	}
};

export const generateSupplyDistributionReceipt = async (item) => {
	try {
		console.log("Starting Supply Distribution PDF generation");
		const pdfDoc = await PDFDocument.create();
		const page = pdfDoc.addPage([600, 800]);
		const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
		const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

		// Load logos (same as before)
		let provinceLogo, pdrrmoLogo;
		try {
			provinceLogo = await pdfDoc.embedPng(
				await fetch("/images/provinceLogo.png").then((res) => res.arrayBuffer())
			);
		} catch (error) {
			console.error("Error loading province logo:", error);
		}

		try {
			pdrrmoLogo = await pdfDoc.embedPng(
				await fetch("/images/pdrrmo_logo.png").then((res) => res.arrayBuffer())
			);
		} catch (error) {
			console.error("Error loading PDRRMO logo:", error);
		}

		// Draw logos (same as before)
		const logoHeight = 50;
		const pageWidth = 600;
		const logoY = 735;

		if (provinceLogo) {
			const provinceAspectRatio = provinceLogo.width / provinceLogo.height;
			const provinceWidth = logoHeight * provinceAspectRatio;
			page.drawImage(provinceLogo, {
				x: 50,
				y: logoY,
				width: provinceWidth,
				height: logoHeight,
			});
		}

		if (pdrrmoLogo) {
			const pdrrmoAspectRatio = pdrrmoLogo.width / pdrrmoLogo.height;
			const pdrrmoWidth = logoHeight * pdrrmoAspectRatio;
			page.drawImage(pdrrmoLogo, {
				x: pageWidth - pdrrmoWidth - 50,
				y: logoY,
				width: pdrrmoWidth,
				height: logoHeight,
			});
		}

		// Header (same as before)
		page.drawText("Republic of the Philippines", {
			x: 220,
			y: 750,
			size: 12,
			font: boldFont,
		});
		page.drawText("PROVINCE OF OCCIDENTAL MINDORO", {
			x: 190,
			y: 735,
			size: 12,
			font: boldFont,
		});
		page.drawText("Mamburao", { x: 265, y: 720, size: 12, font });

		// Office name
		page.drawText("PROVINCIAL DISASTER RISK REDUCTION MANAGEMENT OFFICE", {
			x: 120,
			y: 700,
			size: 10,
			font,
		});
		page.drawText("(PDRRMO)", { x: 270, y: 685, size: 10, font });

		// Title
		page.drawText("SUPPLY DISTRIBUTION RECEIPT", {
			x: 200,
			y: 650,
			size: 16,
			font: boldFont,
		});

		// Content
		const fontSize = 10;
		page.drawText(
			"This is to certify that the undersigned received the following supplies:",
			{ x: 50, y: 620, size: fontSize, font }
		);

		// Table
		const tableTop = 590;
		const tableBottom = 500;

		// Draw all table lines
		page.drawLine({
			start: { x: 50, y: tableTop },
			end: { x: 550, y: tableTop },
			thickness: 1,
		});
		page.drawLine({
			start: { x: 50, y: tableTop },
			end: { x: 50, y: tableBottom },
			thickness: 1,
		});
		page.drawLine({
			start: { x: 100, y: tableTop },
			end: { x: 100, y: tableBottom },
			thickness: 1,
		});
		page.drawLine({
			start: { x: 450, y: tableTop },
			end: { x: 450, y: tableBottom },
			thickness: 1,
		});
		page.drawLine({
			start: { x: 550, y: tableTop },
			end: { x: 550, y: tableBottom },
			thickness: 1,
		});
		page.drawLine({
			start: { x: 50, y: tableBottom },
			end: { x: 550, y: tableBottom },
			thickness: 1,
		});

		// Table content
		const itemStartY = 555;
		const itemSpacing = 20;

		// Draw table headers
		page.drawText("ITEM NO.", {
			x: 54,
			y: 575,
			size: fontSize,
			font: boldFont,
		});
		page.drawText("DESCRIPTION", {
			x: 250,
			y: 575,
			size: fontSize,
			font: boldFont,
		});
		page.drawText("QUANTITY", {
			x: 470,
			y: 575,
			size: fontSize,
			font: boldFont,
		});

		// Calculate new table bottom based on number of items
		const itemCount = item.supplies.length;

		// Redraw table with adjusted height
		const drawTableLines = () => {
			// Vertical lines
			page.drawLine({
				start: { x: 50, y: tableTop },
				end: { x: 50, y: tableBottom },
				thickness: 1,
			});
			page.drawLine({
				start: { x: 100, y: tableTop },
				end: { x: 100, y: tableBottom },
				thickness: 1,
			});
			page.drawLine({
				start: { x: 450, y: tableTop },
				end: { x: 450, y: tableBottom },
				thickness: 1,
			});
			page.drawLine({
				start: { x: 550, y: tableTop },
				end: { x: 550, y: tableBottom },
				thickness: 1,
			});

			// Horizontal lines
			page.drawLine({
				start: { x: 50, y: tableTop },
				end: { x: 550, y: tableTop },
				thickness: 1,
			});
			page.drawLine({
				start: { x: 50, y: tableBottom },
				end: { x: 550, y: tableBottom },
				thickness: 1,
			});
		};

		drawTableLines();

		// Draw items
		item.supplies.forEach((supply, index) => {
			const yPosition = itemStartY - index * itemSpacing;

			// Item number
			page.drawText((index + 1).toString(), {
				x: 70,
				y: yPosition,
				size: fontSize,
				font,
			});

			// Item name
			page.drawText(supply.item_name || "N/A", {
				x: 110,
				y: yPosition,
				size: fontSize,
				font,
			});

			// Quantity
			page.drawText(supply.quantity_distributed?.toString() || "N/A", {
				x: 470,
				y: yPosition,
				size: fontSize,
				font,
			});
		});

		// Nothing follows text
		page.drawText("****Nothing Follows****", {
			x: 230,
			y: tableBottom + 10,
			size: fontSize,
			font,
		});

		// Adjust all following y-coordinates based on new table bottom
		const signatureStartY = tableBottom - 40;

		// Update signature section y-coordinates
		page.drawText("Signature of recipient:", {
			x: 50,
			y: signatureStartY,
			size: fontSize,
			font,
		});
		page.drawLine({
			start: { x: 160, y: signatureStartY },
			end: { x: 250, y: signatureStartY },
			thickness: 0.5,
		});

		page.drawText(`Name: ${item.recipient.name}`, {
			x: 50,
			y: signatureStartY - 20,
			size: fontSize,
			font,
		});
		page.drawText(
			`Office/Municipality: ${item.recipient.department || "N/A"}`,
			{
				x: 50,
				y: signatureStartY - 40,
				size: fontSize,
				font,
			}
		);
		page.drawText(
			`Date: ${format(new Date(item.distribution_date), "MM/dd/yy")}`,
			{
				x: 50,
				y: signatureStartY - 60,
				size: fontSize,
				font,
			}
		);

		// Approvals
		page.drawText("Released by:", {
			x: 350,
			y: signatureStartY,
			size: fontSize,
			font,
		});
		page.drawText("ROMER F. ZULUETA", {
			x: 350,
			y: signatureStartY - 20,
			size: fontSize,
			font: boldFont,
		});
		page.drawText("Admin Aide IV", {
			x: 350,
			y: signatureStartY - 40,
			size: fontSize,
			font,
		});

		page.drawText("Approved by:", {
			x: 350,
			y: signatureStartY - 60,
			size: fontSize,
			font,
		});
		page.drawText("JOHN KENETH P. BARONGGO", {
			x: 350,
			y: signatureStartY - 80,
			size: fontSize,
			font: boldFont,
		});
		page.drawText("OIC-PGADH-LDRRMOIV", {
			x: 350,
			y: signatureStartY - 100,
			size: fontSize,
			font,
		});

		page.drawText("Noted by:", {
			x: 350,
			y: signatureStartY - 120,
			size: fontSize,
			font,
		});
		page.drawText("MARIO D. MULINGBAYAN, JR.", {
			x: 350,
			y: signatureStartY - 140,
			size: fontSize,
			font: boldFont,
		});
		page.drawText("PGDH-PDRRMO", {
			x: 350,
			y: signatureStartY - 160,
			size: fontSize,
			font,
		});

		console.log("Saving PDF");
		const pdfBytes = await pdfDoc.save();
		const blob = new Blob([pdfBytes], { type: "application/pdf" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = `receipt_${item.id}.pdf`;
		link.click();

		console.log("PDF generated and download initiated");
	} catch (error) {
		console.error("Error generating PDF:", error);
	}
};
