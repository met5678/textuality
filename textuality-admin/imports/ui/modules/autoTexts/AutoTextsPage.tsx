import React, { useCallback, useState } from 'react';

import AutoTextsTable from './AutoTextsTable';
import AutoTextsInventory from './AutoTextsInventory';
import { Box, Paper, Typography } from '@mui/material';
import { AutoText, AutoTextSchema } from '/imports/schemas/autoText';
import AutoTextFormDialog from './AutoTextFormDialog';

const AutoTextsPage = () => {
  const [autoTextToEdit, setAutoTextToEdit] =
    useState<Partial<AutoText> | null>(null);

  return (
    <Box display="flex" flexDirection="row">
      <Box flexGrow={1}>
        <Box mb={2}>
          <Typography variant="h5">AutoTexts</Typography>
        </Box>
        <AutoTextsTable onEdit={setAutoTextToEdit} />
      </Box>
      <Box minWidth={200} ml={2}>
        <Box mb={2}>
          <Typography variant="h6">Unfilled AutoTexts</Typography>
        </Box>
        <Paper>
          <AutoTextsInventory createAutoText={setAutoTextToEdit} />
        </Paper>
      </Box>
      <AutoTextFormDialog
        model={autoTextToEdit}
        onClose={() => setAutoTextToEdit(null)}
      />
    </Box>
  );
};

export default AutoTextsPage;
