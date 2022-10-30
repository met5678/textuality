import React from 'react';
import moment from 'moment-timezone';
import connectField from 'uniforms/connectField';
import { FormGroup, Label, Input, FormFeedback } from 'reactstrap';

const DateField = ({
  name,
  id,
  label,
  value,
  disabled,
  options,
  onChange,
  error
}) => {
  const momentDate = moment(value).tz('America/New_York');
  const dateString = value
    ? momentDate.format('Y-MM-DDTHH:mm:ss')
    : 'undefined';

  return (
    <FormGroup>
      <Label for={name}>{label}</Label>
      <Input
        type="datetime-local"
        name={name}
        value={dateString}
        id={id}
        onChange={e => onChange(new Date(e.target.value))}
        disabled={disabled}
        invalid={!!error}
      />
      {error && <FormFeedback>{error.message}</FormFeedback>}
    </FormGroup>
  );
};

export default connectField(DateField, {
  ensureValue: true
});
