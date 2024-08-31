import { Button, Modal } from "flowbite-react";
import { useState } from "react";

const CustomModal = ({
	mainContent,
	cancelText,
	saveText,
	headerTitle,
	btnTitle,
}) => {
	const [openModal, setOpenModal] = useState(false);
	return (
		<>
			<Button size="md" onClick={() => setOpenModal(true)}>
				{btnTitle}
			</Button>
			<Modal show={openModal} onClose={() => setOpenModal(false)}>
				<Modal.Header>{headerTitle}</Modal.Header>
				<Modal.Body>{mainContent}</Modal.Body>
				<Modal.Footer>
					<Button onClick={() => setOpenModal(false)}>{saveText}</Button>
					<Button color="gray" onClick={() => setOpenModal(false)}>
						{cancelText}
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default CustomModal;
