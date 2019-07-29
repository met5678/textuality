import { WebApp } from 'meteor/webapp';
import { HTTP } from 'meteor/http';
import twilio from 'twilio';
import bodyParser from 'body-parser';

const accountSid = Meteor.settings.private.twilioSid;
const authToken = Meteor.settings.private.twilioToken;
const twilioSendEndpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

let onReceiveText = () => {};

function onReceive(callback) {
  if (typeof callback === 'function') onReceiveText = callback;
}

function init() {
  WebApp.connectHandlers.use(bodyParser.urlencoded({ extended: false }));
  WebApp.connectHandlers.use('/text-handler', (req, res, next) => {
    const twMessage = req.body;
    const message = {
      to: twMessage.To.substring(1),
      from: twMessage.From.substring(1),
      body: twMessage.Body,
      geo: {
        state: twMessage.FromState,
        city: twMessage.FromCity,
        zip: twMessage.FromZip,
        country: twMessage.FromCountry
      }
    };

    try {
      const numMedia = Number.parseInt(twMessage.NumMedia);
      for (let i = 0; i < numMedia; i++) {
        message.media = message.media || [];
        message.media[i] = {
          type: twMessage[`MediaContentType${i}`],
          url: twMessage[`MediaUrl${i}`]
        };
      }
    } catch (e) {}

    onReceiveText(message);

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end();
  });
}

function send(message) {
  const { body, from, to, media } = message;
  const twMessage = {
    to: '+' + to,
    from: '+' + from,
    accountSid
  };

  body && (twMessage.body = body);
  imageUrls && (twMessage.mediaUrl = imageUrls);

  HTTP.call('POST', twilioSendEndpoint, { data: twMessage });
}

init();

export { onReceive, send };
