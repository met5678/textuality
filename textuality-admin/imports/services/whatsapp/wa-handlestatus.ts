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

function onMessageRead(messageReadHandler: (messageId: string) => any) {}

function processWaStatus(statusRaw: WaStatusRaw, sentTo: string) {
  console.log('Status update', statusRaw);
}

export { processWaStatus, onMessageRead, WaStatusRaw };
