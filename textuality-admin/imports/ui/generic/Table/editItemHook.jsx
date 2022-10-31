import React from 'react';
import { Button } from 'reactstrap';

const editItemHook = columns => {
  const [editItem, setEditItem] = React.useState(null);

  columns &&
    columns.push({
      dataField: 'editColumn',
      isDummyField: true,
      text: '',
      headerStyle: { width: '55px' },
      formatter: (cell, row) => (
        <Button size="sm" color="warning" onClick={() => setEditItem(row)}>
          <i className="fas fa-edit" />
        </Button>
      )
    });

  return [editItem, setEditItem];
};

export default editItemHook;
