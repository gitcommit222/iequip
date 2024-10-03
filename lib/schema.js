import * as Yup from "yup";

export const signInSchema = Yup.object({
	email: Yup.string().email().required("Email is required!"),
	password: Yup.string().min(3).required("Password is required!"),
}).required();

export const addItemFormSchema = Yup.object({
	itemName: Yup.string().required("Item name is required"),
	quantity: Yup.number().required("Item quantity is required."),
	category: Yup.number().required("Category is required"),
	unit: Yup.string().required("Unit is required."),
	itemCondition: Yup.string().required("Item condition is required."),
	file: Yup.mixed(),
}).required();

export const BorrowItemSchema = Yup.object({
	fullName: Yup.string().required("This is a required field."),
	email: Yup.string().required("This is a required field."),
	age: Yup.number()
		.required("This is a required field.")
		.min(18, "Borrower must be above 18 y/o"),
	fullAddress: Yup.string().required("This is a required field."),
	contactNumber: Yup.string().required("This is a required field."),
	department: Yup.string(),
	itemBarcode: Yup.string()
		.min(11, "Must be at least 11 characters")
		.required("Item barcode is required."),
	testedBy: Yup.string().required("This is a required field."),
	returnDate: Yup.date().required("Return date is required."),
}).required();
