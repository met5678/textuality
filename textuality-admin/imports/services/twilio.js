import { WebApp } from 'meteor/webapp';
import { HTTP } from 'meteor/http';
import bodyParser from 'body-parser';

const accountSid = Meteor.settings.private.twilioSid;
const authToken = Meteor.settings.private.twilioToken;
const twilioSendEndpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

let onReceiveText = () => {};

function onReceive(callback) {
  if (typeof callback === 'function') onReceiveText = callback;
}

function init() {
  WebApp.connectHandlers.use(
    '/text-handler',
    bodyParser.urlencoded({ extended: false }),
  );
  WebApp.connectHandlers.use('/text-handler', (req, res, next) => {
    const twMessage = req.body;
    const message = {
      to: twMessage.To.substring(1),
      from: twMessage.From.substring(1),
      text: twMessage.Body.trim(),
      geo: {
        state: twMessage.FromState,
        city: twMessage.FromCity,
        zip: twMessage.FromZip,
        country: twMessage.FromCountry,
      },
    };

    try {
      const numMedia = Number.parseInt(twMessage.NumMedia);
      if (numMedia > 0) {
        message.media = {
          url: twMessage.MediaUrl0,
          contentType: twMessage.MediaContentType0,
        };
      }
    } catch (e) {}

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end();

    onReceiveText(message);
  });
}

function send(message) {
  // Uncomment to temporarily block
  // return;

  const { body, from, to, mediaUrl } = message;
  const twMessage = {
    To: '+' + to,
    From: '+' + from,
  };

  body && (twMessage.Body = body);
  mediaUrl && (twMessage.MediaUrl = mediaUrl);

  HTTP.call('POST', twilioSendEndpoint, {
    params: twMessage,
    auth: `${accountSid}:${authToken}`,
  });
}

init();

export { onReceive, send };
