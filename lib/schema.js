import * as Yup from "yup";

export const addItemFormSchema = Yup.object({
	itemName: Yup.string().required("Item name is required"),
	quantity: Yup.number().required("Item quantity is required."),
	category: Yup.number().required("Category is required"),
	unit: Yup.string().required("Unit is required."),
	itemCondition: Yup.string().required("Item condition is required."),
	file: Yup.mixed(),
});

export const BorrowItemSchema = Yup.object({
	fullName: Yup.string().required("This is a required field."),
	email: Yup.string().required("This is a required field."),
	age: Yup.number()
		.required("This is a required field.")
		.min(18, "Borrower must be above 18 y/o"),
	fullAddress: Yup.string().required("This is a required field."),
	contactNumber: Yup.string().required("This is a required field."),
	department: Yup.string(),
	itemBarcode: Yup.string().required("Item barcode is required."),
});
