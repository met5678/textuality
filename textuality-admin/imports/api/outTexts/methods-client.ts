import { Meteor } from 'meteor/meteor';

import OutTexts from './outTexts';

import {
  OUT_TEXT_STATUS,
  OutTextId,
  OutTextStatus,
} from '/imports/schemas/outText';

Meteor.methods({
  'outTexts.updateStatus': async (
    message_id: OutTextId,
    status: OutTextStatus,
  ) => {
    const outText = await OutTexts.findOneAsync(message_id);
    if (!outText) {
      console.warn('Trying to update status for nonexistent id', {
        message_id,
      });
      return;
    }
    if (
      OUT_TEXT_STATUS.indexOf(status) > OUT_TEXT_STATUS.indexOf(outText.status)
    ) {
      await OutTexts.updateAsync(outText._id, { $set: { status } });
    }
  },

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
