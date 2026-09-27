import { Meteor } from 'meteor/meteor';

import OutTexts from './outTexts';

import { OutTextStatus } from '/imports/schemas/outText';

Meteor.methods({
  'outTexts.updateStatusByExternalId': async (
    external_id: string,
    status: OutTextStatus,
  ) => {
    const changedTexts = await OutTexts.updateAsync(
      { external_id },
      { $set: { status } },
    );
    if (changedTexts === 0)
      console.warn('Trying to update status for nonexistent id', {
        external_id,
        status,
      });
  },

  'outTexts.setExternalId': async (message_id: string, external_id: string) => {
    await OutTexts.updateAsync(message_id, { $set: { external_id } });
  },
});
