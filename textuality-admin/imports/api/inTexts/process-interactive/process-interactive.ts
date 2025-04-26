import OutTexts from '../../outTexts';
import { PlayerWithHelpers } from '../../players/players';
import inText, { InText } from '/imports/schemas/inText';
import { IncomingMessageData } from '/imports/services/whatsapp';

const processInteractive = async function (
  incomingMessage: IncomingMessageData,
) {
  const interactiveData = incomingMessage.interactive;
  if (!interactiveData) {
    return;
  }

  const originalOutText = await OutTexts.findOneAsync({
    external_id: interactiveData.original_external_id,
  });

  if (!originalOutText) {
    return;
  }
};
