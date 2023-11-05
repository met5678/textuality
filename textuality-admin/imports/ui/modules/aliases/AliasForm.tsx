import React, {
  SyntheticEvent,
  KeyboardEvent,
  useCallback,
  useState,
} from 'react';
import { Meteor } from 'meteor/meteor';
import { TextField } from '@mui/material';

const AliasForm = () => {
  const [value, setValue] = useState('');

  const onChange = useCallback((e: SyntheticEvent) => {
    setValue((e.target as HTMLInputElement).value);
  }, []);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' && value.length > 0) {
        Meteor.call('aliases.new', value, () => {
          setValue('');
        });
      }
    },
    [value],
  );

  return (
    <TextField
      label="New Alias"
      value={value}
      helperText={value.length + ' '}
      onChange={onChange}
      onKeyDown={onKeyDown}
      fullWidth={true}
    />
  );
};

export default AliasForm;
