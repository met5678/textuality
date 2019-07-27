import React from 'react';
import { Button } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import autobind from 'autobind-decorator';
import mergeOptions from 'merge-options';
// import cellEditFactory from 'react-bootstrap-table2-editor';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';

import TableInsertModal from './TableInsertModal';
import editItemHook from './editItemHook';

const defaultArgs = {
  hover: true
};

const deleteArgs = ({ selection, setSelection, keyField }) => {
  return {
    selectRow: {
      classes: 'table-primary',
      mode: 'checkbox',
      headerStyle: { width: '20px' },
      style: { background: 'red' },
      onSelect: (row, isSelect) => {
        const id = row[keyField];

        if (isSelect && !selection.includes(row._id)) {
          setTimeout(() => setSelection(selection.concat([id])), 0);
        } else if (!isSelect && selection.includes(id)) {
          setTimeout(
            () => setSelection(selection.filter(itemId => itemId !== id)),
            0
          );
        }
      },
      onSelectAll: (isSelect, rows) => {
        if (isSelect) {
          setTimeout(() => setSelection(rows.map(row => row[keyField])), 0);
        } else {
          setTimeout(() => setSelection([]), 0);
        }
      }
    }
  };
};

const Table = props => {
  let { columns } = props;
  columns = [...columns];

  const {
    data,
    keyField = '_id',
    canInsert,
    onInsert,
    insertModel,
    canEdit,
    onEdit,
    canDelete,
    onDelete,
    tableArgs,

    history,
    location,
    match
  } = props;

  const [insertModalOpen, setInsertModalOpen] = React.useState(false);
  const [selection, setSelection] = React.useState([]);
  const [editItem, setEditItem] = editItemHook(canEdit && columns);

  let argsArray = [defaultArgs];

  if (canDelete) {
    argsArray.push(deleteArgs({ selection, setSelection, keyField }));
  }

  argsArray.push(tableArgs);

  let mergedArgs = mergeOptions(...argsArray);

  // Insertion code
  React.useEffect(() => {
    if (location.state && location.state.insertModalOpen) {
      setInsertModalOpen(true);
      history.replace({
        pathname: location.pathname,
        state: Object.assign({}, location.state, { insertModalOpen: false })
      });
    }
  });

  // Deletion code
  const deleteHandler = React.useCallback(() => {
    if (
      selection.length &&
      confirm('Are you sure you want to delete these items?')
    ) {
      selection.forEach(itemId => onDelete(itemId));
    }
  }, [selection]);

  return (
    <>
      {(canInsert || canDelete) && (
        <div className="mb-1">
          {canInsert && (
            <Button color="primary" onClick={() => setInsertModalOpen(true)}>
              New...
            </Button>
          )}{' '}
          {canDelete && (
            <Button
              color="danger"
              onClick={deleteHandler}
              disabled={!selection.length}
            >
              Delete
            </Button>
          )}
        </div>
      )}
      <BootstrapTable
        {...mergedArgs}
        keyField={keyField}
        data={data}
        columns={columns}
        bootstrap4={true}
      />
      {insertModalOpen && (
        <TableInsertModal
          {...props}
          location={location}
          onSave={onInsert}
          model={insertModel || (location.state && location.state.model)}
          onClose={() => {
            setInsertModalOpen(false);
            history.replace({
              pathname: location.pathname,
              state: {}
            });
          }}
        />
      )}
      {editItem && (
        <TableInsertModal
          {...props}
          location={location}
          onSave={onEdit}
          model={editItem}
          isEdit={true}
          onClose={() => setEditItem(null)}
        />
      )}{' '}
    </>
  );
};

export default withRouter(Table);
