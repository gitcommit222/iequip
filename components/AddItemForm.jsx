"use client";
import { Label, TextInput, Select, Datepicker } from "flowbite-react";

const AddItemForm = () => {
	return (
		<div>
			<form className="space-y-4">
				<div>
					<div className="mb-2 block">
						<Label htmlFor="itemName" value="Item Name" />
					</div>
					<TextInput id="itemName" type="text" />
				</div>
				<div className="flex gap-3">
					<div className="flex-1">
						<div className="mb-2 block">
							<Label htmlFor="categories" value="Category" />
						</div>
						<Select id="categories" required>
							<option>Flood & Typhoon</option>
							<option>Tsunami</option>
							<option>Covid 19</option>
						</Select>
					</div>
					<div className="max-w-[180px]">
						<div className="mb-2 block">
							<Label htmlFor="quantity" value="Quantity" />
						</div>
						<TextInput id="quantity" type="number" />
					</div>
				</div>
				<div className="flex gap-3">
					<div className="flex-1">
						<div className="mb-2 block">
							<Label htmlFor="issuedDate" value="Date Issued" />
						</div>
						<Datepicker
							minDate={new Date(2023, 0, 1)}
							maxDate={new Date(2023, 3, 30)}
							id="issuedDate"
						/>
					</div>
					<div className="max-w-[180px] w-[180px]">
						<div className="mb-2 block">
							<Label htmlFor="unit" value="Item Name" />
						</div>
						<Select id="unit" required>
							<option>Unit</option>
							<option>Set</option>
							<option>Pcs</option>
						</Select>
					</div>
				</div>
			</form>
		</div>
	);
};

export default AddItemForm;
