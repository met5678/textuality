import React from 'react';
import AutoField from 'uniforms-bootstrap4/AutoField'; // Choose your theme package.
import connectField from 'uniforms/connectField';

import DateField from './DateField'; // Choose your theme package.
import SelectField from './SelectField';
import NullableBooleanField from './NullableBooleanField';
import StringListField from './StringListField';

const CustomAuto = props => {
  const { field } = props;

  let FieldComponent = AutoField;
  if (field.type === Date) {
    FieldComponent = DateField;
  }
  if (field.type === Boolean && field.optional) {
    FieldComponent = NullableBooleanField;
  }
  if (
    field.type === String &&
    (Array.isArray(field.allowedValues) ||
      typeof field.allowedValues === 'function')
  ) {
    FieldComponent = SelectField;
  }
  if (
    field.type === Array &&
    props.findField(props.name + '.$').type === String
  ) {
    FieldComponent = StringListField;
  }

  return <FieldComponent {...props} />;
};

const CustomAutoField = connectField(CustomAuto, {
  ensureValue: false,
  includeInChain: false,
  initialValue: false
});

// export default CustomAuto;
// export default connectField(CustomAuto);
export default CustomAutoField;
