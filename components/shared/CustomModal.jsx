"use client";
import { Button, Modal } from "flowbite-react";
import { useState } from "react";

const CustomModal = ({
	mainContent,
	cancelText,
	saveText,
	headerTitle,
	btnTitle,
	btnSize = "md",
	btnColor = "success",
}) => {
	const [openModal, setOpenModal] = useState(false);
	return (
		<>
			<Button
				color={btnColor}
				size={btnSize}
				onClick={() => setOpenModal(true)}
			>
				{btnTitle}
			</Button>
			<Modal show={openModal} onClose={() => setOpenModal(false)}>
				{headerTitle && <Modal.Header>{headerTitle}</Modal.Header>}
				<Modal.Body>{mainContent}</Modal.Body>
				{saveText && (
					<Modal.Footer>
						<Button type="submit" onClick={() => setOpenModal(false)}>
							{saveText}
						</Button>
						<Button color="gray" onClick={() => setOpenModal(false)}>
							{cancelText}
						</Button>
					</Modal.Footer>
				)}
			</Modal>
		</>
	);
};

export default CustomModal;
