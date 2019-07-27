import React from 'react';
import { Button } from 'reactstrap';

const Toggle = ({ value, onClick }) => (
  <Button size="sm" color={value ? 'success' : 'danger'} onClick={onClick}>
    {value ? 'True' : 'False'}
  </Button>
);

export default Toggle;
