import React from "react";
import Headerbox from "../../../components/shared/Headerbox";
import SupplyTransactions from "../../../components/SupplyTransactions";
import PageTransition from "../../../components/animations/PageTransition";

const SupplyTransactionsPage = () => {
	return (
		<section>
			<Headerbox
				title="Supply Transactions"
				subtext="View Distributed Supplies Here."
			/>
			<PageTransition>
				<div className="">
					<SupplyTransactions />
				</div>
			</PageTransition>
		</section>
	);
};

export default SupplyTransactionsPage;
