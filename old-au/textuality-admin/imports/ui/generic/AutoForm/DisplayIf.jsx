import React from 'react';
import BaseField from 'uniforms/BaseField';

// We have to ensure that there's only one child, because returning an array
// from a component is prohibited.
const DisplayIf = ({ children, condition }, { uniforms }) =>
  condition(uniforms) ? <>{children}</> : null;

DisplayIf.contextTypes = BaseField.contextTypes;

export default DisplayIf;
