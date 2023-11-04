import { OutTextStatus } from '/imports/schemas/outText';

interface WaStatusRaw {
  id: string;
  conversation: WaStatusConversation;
  recipient_id: string;
  status: 'delivered' | 'read' | 'sent';
  timestamp: number;
}

interface WaStatusConversation {
  id: string;
}

interface WaStatusCallbackData {
  message_id: string;
  status: OutTextStatus;
}

let onReceiveMessageStatus: (
  statusData: WaStatusCallbackData,
) => void = () => {};

function onMessageStatus(callback: (statusData: WaStatusCallbackData) => void) {
  if (typeof callback === 'function') onReceiveMessageStatus = callback;
}

function processWaStatus(statusRaw: WaStatusRaw, sentTo: string) {
  const message_id = statusRaw.id;
  const status = statusRaw.status;

  if (status === 'delivered' || status === 'read' || status === 'sent') {
    onReceiveMessageStatus({
      message_id,
      status,
    });
  } else {
    console.warn('Received unexpected status update', statusRaw);
  }
}

export { processWaStatus, onMessageStatus, WaStatusRaw };
