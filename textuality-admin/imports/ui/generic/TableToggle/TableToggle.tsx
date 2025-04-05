import React from 'react';

import {
  GridRenderCellParams,
  GridRenderEditCellParams,
  useGridApiContext,
} from '@mui/x-data-grid';
import Toggle from '../Toggle';

export const TableToggle = (props: GridRenderCellParams) => {
  const checked = !!props.value;

  return (
    <Toggle
      value={checked}
      onClick={() => {
        // apiRef.current.setEditCellValue({
        //   id: props.id,
        //   field: props.field,
        //   value: !checked,
        // });
        props.api.startCellEditMode({ id: props.id, field: props.field });
        setTimeout(() => {
          props.api.setEditCellValue({
            id: props.id,
            field: props.field,
            value: !checked,
          });
          props.api.stopCellEditMode({ id: props.id, field: props.field });
        });
      }}
    />
  );
};
