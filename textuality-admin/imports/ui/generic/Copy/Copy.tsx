import React, { useState } from 'react';
import { Button } from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';

interface CopyProps {
  value?: string;
}

const Copy: React.FC<CopyProps> = ({ value }) => {
  const [copied, setCopied] = useState(false);

  if (!value) return null;

  return (
    <React.Fragment>
      <CopyToClipboard text={value} onCopy={() => setCopied(true)}>
        <Button
          size="small"
          variant="contained"
          color={copied ? 'secondary' : 'primary'}
        >
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </CopyToClipboard>
      {' ' + value}
    </React.Fragment>
  );
};

export default Copy; 