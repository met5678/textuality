import React from 'react';
import autobind from 'autobind-decorator';
import Select from 'react-select';
import connectField from 'uniforms/connectField';
import { FormGroup, Label, Button, ButtonGroup } from 'reactstrap';

const NullableBooleanField = ({
  name,
  label,
  value,
  grid,
  disabled,
  onChange,
  field
}) => {
  return (
    <FormGroup required={!field.optional} row={!!grid}>
      <Label className={grid && 'col-' + grid + ' col-form-label'}>
        {label}
      </Label>
      <ButtonGroup
        size="sm"
        className={'mb-1' + grid ? 'col-' + (12 - grid) : ''}
      >
        <Button
          onClick={() => onChange(false)}
          color={value === false ? 'danger' : 'secondary'}
        >
          No
        </Button>
        <Button
          onClick={() => onChange(undefined)}
          color={
            typeof value === 'undefined' || value === null
              ? 'info'
              : 'secondary'
          }
        >
          Meh
        </Button>
        <Button
          onClick={() => onChange(true)}
          color={value === true ? 'success' : 'secondary'}
        >
          Yes
        </Button>
      </ButtonGroup>
    </FormGroup>
  );
};

export default connectField(NullableBooleanField);
