import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';

import { useDebounceCallback } from '@react-hook/debounce';

const TableSearch = ({
  title,
  setSearch,
  debounceTime = 250,
  customActions = [],
}) => {
  const handleSearch = useDebounceCallback(setSearch, debounceTime);
  const [searchValue, setSearchValue] = useState('');

  return (
    <Box mb={1} display="flex" flexDirection="row" alignItems="center">
      <Box flexGrow={1}>
        <Typography variant="h6">{title}</Typography>
      </Box>
      <TextField
        label="Search"
        type="search"
        variant="outlined"
        size="small"
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
          handleSearch(e.target.value);
        }}
      />
      {customActions.map((action, i) => (
        <Box mx={1} key={i}>
          <IconButton onClick={action.onClick} size="large">
            <action.icon />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
};

export default TableSearch;
