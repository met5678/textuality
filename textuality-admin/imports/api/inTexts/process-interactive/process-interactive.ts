import OutTexts from '../../outTexts';
import { IncomingMessageData } from '/imports/services/whatsapp';
import { InTextInteractive } from '/imports/schemas/inText';

export const processInteractive = async function (
  incomingMessage: IncomingMessageData,
): Promise<InTextInteractive | undefined> {
  const interactiveData = incomingMessage.interactive;
  if (!interactiveData) {
    return;
  }

  const originalOutText = await OutTexts.findOneAsync({
    external_id: interactiveData.original_external_id,
  });

  return {
    response_to: originalOutText?._id,
    value: interactiveData.value,
  };
};
