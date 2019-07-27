import React from 'react';
import { Random } from 'meteor/random';

import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const TableInsertModal = props => {
	let { onClose, onSave, columns, form: Form } = props;

	return (
		<Modal isOpen={true} toggle={onClose} backdrop={false}>
			<ModalHeader toggle={onClose}>New item</ModalHeader>
			<ModalBody>{Form && <Form onSubmit={doc => onSave(doc)} />}</ModalBody>
		</Modal>
	);
};

export default TableInsertModal;
