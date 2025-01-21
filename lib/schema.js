import * as Yup from "yup";

export const signInSchema = Yup.object({
	email: Yup.string().email().required("Email is required!"),
	password: Yup.string().min(3).required("Password is required!"),
}).required();

export const addItemFormSchema = Yup.object({
	itemName: Yup.string().required("Item name is required"),
	// quantity: Yup.number().required("Item quantity is required."),
	category: Yup.number().required("Category is required"),
	itemCondition: Yup.string(),
	// unit: Yup.string().required("Unit is required."),
	file: Yup.mixed(),
}).required();

export const BorrowItemSchema = Yup.object().shape({
	fullName: Yup.string().required("Full name is required"),
	email: Yup.string().email("Invalid email").required("Email is required"),
	age: Yup.number()
		.required("Age is required")
		.min(18, "Must be at least 18 years old"),
	contactNumber: Yup.string().required("Contact number is required"),
	fullAddress: Yup.string().required("Address is required"),
	department: Yup.string().required("Department is required"),
	returnDate: Yup.string().required("Return date is required"),
	testedBy: Yup.string().required("Tested by is required"),
});

export const addSupplyFormSchema = Yup.object({
	item_name: Yup.string().required("Supply name is required"),
	description: Yup.string().required("Description is required"),
	quantity_available: Yup.number()
		.min(0)
		.required("Quantity available is required"),
	quantity_distributed: Yup.number()
		.min(0)
		.required("Quantity distributed is required"),
	unit: Yup.string().required("Unit is required"),
	category: Yup.number().required("Category is required"),
	remarks: Yup.string(),
	file: Yup.mixed(),
	expiration_date: Yup.date().required("Expiration date is required"),
	purchase_date: Yup.date().required("Expiration date is required"),
}).required();

export const transactionSchema = Yup.object()
	.shape({
		fullName: Yup.string().required("Full name is required"),
		email: Yup.string().email("Invalid email").required("Email is required"),
		age: Yup.number()
			.min(18, "Must be at least 18 years old")
			.required("Age is required"),
		contactNumber: Yup.string().required("Contact number is required"),
		fullAddress: Yup.string().required("Full address is required"),
		department: Yup.string(),
		distribution_date: Yup.date().required("Distribution date is required"),
		released_by: Yup.string().required("Released by is required"),
		remarks: Yup.string(),
		supply_quantities: Yup.array().of(
			Yup.object().shape({
				id: Yup.string().required(),
				quantity: Yup.number().positive().required("Quantity is required"),
			})
		),
	})
	.required();
