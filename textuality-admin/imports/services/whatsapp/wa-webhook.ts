import { ServerResponse, IncomingMessage } from 'http';
import { URL } from 'url';
import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import bodyParser from 'body-parser';
import { MessageRaw, processWaMessage } from './wa-handlemessage';
import { WaStatusRaw, processWaStatus } from './wa-handlestatus';

// const waPhoneNumberId: number = Meteor.settings.private.waPhoneNumberId;
const waWebhookToken: string = Meteor.settings.private.waWebhookToken;

interface WaWebhookBody {
  object: 'whatsapp_business_account';
  entry: WaWebhookEntry[];
}

interface WaWebhookEntry {
  id: string;
  changes: WaWebhookChange[];
}

interface WaWebhookChange {
  value: WaWebhookChangeValue;
  field: 'messages';
}

interface WaWebhookChangeValue {
  errors: WaWebhookError[];
  messaging_product: 'whatsapp';
  messages?: MessageRaw[];
  statuses?: WaStatusRaw[];
  metadata: WaChangeValueMetadata;
}

interface WaChangeValueMetadata {
  display_phone_number: string;
  phone_number_id: string;
}

interface WaWebhookError {
  code: number;
  title: string;
  message: string;
  error_data: object;
}

function waVerify(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
  if (req.url == null) return;
  const url = new URL(req.url, `http://${req.headers.host}`);
  const params = url.searchParams;

  if (
    params.get('hub.mode') == 'subscribe' &&
    params.get('hub.verify_token') == waWebhookToken
  ) {
    res.write(params.get('hub.challenge'));
    res.end();
  } else {
    console.log('Error, params', params);
    res.statusCode = 400;
    res.write('Challenge failed');
    res.end();
  }
}

function waProcessPost(
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
) {
  // @ts-ignore
  const body: WaWebhookBody = req.body;

  const changes = body.entry.flatMap((entry) => entry.changes);

  changes
    .map((change) => change.value)
    .forEach((changeValue) => {
      if (changeValue.errors && changeValue.errors.length) {
        changeValue.errors.forEach((error) => {
          console.warn('WA Webhook Error', error);
        });
        return;
      }

      const phoneNumber = changeValue.metadata.display_phone_number;

      if (changeValue.messages && changeValue.messages.length) {
        changeValue.messages.forEach((message) => {
          processWaMessage(message, phoneNumber);
        });
      }

      if (changeValue.statuses && changeValue.statuses.length) {
        changeValue.statuses.forEach((status) => {
          processWaStatus(status, phoneNumber);
        });
      }
    });

  res.statusCode = 200;
  res.end();
}

function init() {
  WebApp.connectHandlers.use('/whatsapp-handler', bodyParser.json());
  WebApp.connectHandlers.use('/whatsapp-handler', (req, res) => {
    if (req.method == 'GET') {
      waVerify(req, res);
    }

    if (req.method == 'POST') {
      waProcessPost(req, res);
    }
  });
}

init();
