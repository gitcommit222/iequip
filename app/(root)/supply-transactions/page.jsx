import React from "react";
import Headerbox from "../../../components/shared/Headerbox";
import SupplyTransactions from "../../../components/SupplyTransactions";

const SupplyTransactionsPage = () => {
	return (
		<section>
			<Headerbox
				title="Supply Transactions"
				subtext="View Distributed Supplies Here."
			/>
			<div className="border">
				<SupplyTransactions />
			</div>
		</section>
	);
};

export default SupplyTransactionsPage;
