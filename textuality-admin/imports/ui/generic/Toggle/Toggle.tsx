import React from 'react';
import { Button } from '@mui/material';

interface ToggleProps {
  value: boolean;
  onClick: () => void;
  text?: string;
}

const Toggle: React.FC<ToggleProps> = ({ value, onClick, text }) => (
  <Button
    size="small"
    variant="contained"
    color={value ? 'success' : 'error'}
    onClick={onClick}
  >
    {text ?? (value ? 'True' : 'False')}
  </Button>
);

export default Toggle; 