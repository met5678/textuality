import React from 'react';
import autobind from 'autobind-decorator';
import Select from 'react-select';
import connectField from 'uniforms/connectField';
import AutoForm from './AutoForm';
import { FormGroup, Label, Button, Collapse } from 'reactstrap';

const OptionalSubForm = ({
  name,
  label,
  value,
  grid,
  disabled,
  field,
  onChange
}) => {
  const [added, setAdded] = React.useState(value && Object.keys(value).length);

  return (
    <FormGroup>
      <Button
        onClick={() => {
          added && onChange(undefined);
          setAdded(!added);
        }}
        block
        className="mb-2"
      >{`${added ? 'Remove' : 'Add'} ${label}`}</Button>

      <Collapse isOpen={added}>
        <AutoForm
          schema={field.type}
          grid={grid}
          noSubmit={true}
          model={value ? value : undefined}
          onChangeModel={newModel => {
            onChange(newModel);
          }}
        />
      </Collapse>
    </FormGroup>
  );
};

export default connectField(OptionalSubForm);
