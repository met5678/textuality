import React from 'react';
// import CreatableSelect from 'react-select/creatable';
import connectField from 'uniforms/connectField';
import { FormGroup, Label, Button } from 'reactstrap';

const StringListField = ({
  name,
  label,
  value,
  grid,
  disabled,
  field,
  onChange
}) => {
  const changeCallback = React.useCallback(values => {
    onChange(values.map(val => val.value));
  });

  return (
    <FormGroup required={!field.optional} row={!!grid}>
      <Label className={grid && 'col-' + grid + ' col-form-label'}>
        {label}
      </Label>
      {/*      <CreatableSelect
        name={name}
        value={value.map(val => {
          return { value: val, label: val };
        })}
        onChange={changeCallback}
        isMulti={true}
        isClearable={true}
        isDisabled={disabled}
        components={{ DropdownIndicator: null }}
        className={'mb-1' + grid ? 'col-' + (12 - grid) : ''}
      />*/}
    </FormGroup>
  );
};

export default connectField(StringListField);
