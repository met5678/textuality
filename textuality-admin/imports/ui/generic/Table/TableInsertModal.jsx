import React from 'react';
import { Random } from 'meteor/random';

import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const TableInsertModal = props => {
  let { onClose, onSave, columns, form: Form, location, model, isEdit } = props;

  return (
    <Modal isOpen={true} toggle={onClose} backdrop={true} fade={false}>
      <ModalHeader toggle={onClose}>{isEdit ? 'Edit' : 'New'}</ModalHeader>
      <ModalBody>
        {Form && (
          <Form
            isTableModal={true}
            model={model}
            onSubmit={doc => {
              onSave(doc);
              onClose();
            }}
          />
        )}
      </ModalBody>
    </Modal>
  );
};

export default TableInsertModal;
