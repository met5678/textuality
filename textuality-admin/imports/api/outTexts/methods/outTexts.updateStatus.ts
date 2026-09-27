import {
  OUT_TEXT_STATUS,
  OutTextId,
  OutTextStatus,
} from '/imports/schemas/outText';
import OutTexts from '/imports/api/outTexts';

export const outTextUpdateStatus = async (
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
};
