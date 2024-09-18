import React from "react";
import Headerbox from "../../../components/shared/Headerbox";
import BorrowItemForm from "../../../components/BorrowItemForm";
import BorrowTable from "../../../components/BorrowTable";

const BorrowPage = () => {
	return (
		<section>
			<div className="flex items-center justify-between">
				<Headerbox
					title="Borrow"
					subtext="Manage and view borrowed items data here."
				/>
				<div>
					<BorrowItemForm />
				</div>
			</div>
			<div>
				<BorrowTable />
			</div>
		</section>
	);
};

export default BorrowPage;
