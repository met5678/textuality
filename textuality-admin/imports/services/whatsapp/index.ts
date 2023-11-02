import { sendMessage, OutgoingMessageData } from './wa-sendmessage';
import { markAsRead } from './wa-markread';
import { onReceive, IncomingMessageData } from './wa-handlemessage';
import './wa-webhook';

export {
  onReceive,
  markAsRead,
  sendMessage,
  IncomingMessageData,
  OutgoingMessageData,
};
