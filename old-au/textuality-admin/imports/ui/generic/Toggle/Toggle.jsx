import React from 'react';
import { Button } from 'reactstrap';

const Toggle = ({ value, onClick, text }) => (
  <Button size="sm" color={value ? 'success' : 'danger'} onClick={onClick}>
    {text ? text : value ? 'True' : 'False'}
  </Button>
);

export default Toggle;
