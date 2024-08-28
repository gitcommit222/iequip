import React from "react";

const Headerbox = ({ type = "title", title, user, subtext }) => {
	return (
		<div className="header-box">
			<h1 className="header-box-title">
				{title}
				{type === "greeting" && <span>&nbsp;{user}</span>}
			</h1>
			<p>{subtext}</p>
		</div>
	);
};

export default Headerbox;
