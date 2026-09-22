import { onReceive } from '/imports/services/twilio';

import { receiveInText } from '/imports/api/inTexts/methods/inTexts.receive';

onReceive((message) => {
  receiveInText(message);
});
