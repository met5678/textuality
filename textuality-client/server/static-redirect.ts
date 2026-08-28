import { WebApp } from 'meteor/webapp';
import { IncomingMessage, ServerResponse } from 'http';
import connect from 'connect';
import { Meteor } from 'meteor/meteor';

const STATIC_PREFIXES = [
  '/images/',
  '/videos/',
  '/audio/',
  '/fonts/',
  '/derby/',
  '/casino/',
  '/clue-cards/',
]; // Adjust as needed
const STATIC_BASE_URL = String(
  Meteor.settings.public?.STATIC_ASSETS_BASE_URL || '',
).replace(/\/$/, '');

if (Meteor.isProduction && STATIC_BASE_URL) {
  WebApp.rawConnectHandlers.use(((
    req: IncomingMessage,
    res: ServerResponse,
    next: connect.NextFunction,
  ) => {
    const url = req.url || '';

    const matchingPrefix = STATIC_PREFIXES.find((prefix) =>
      url.startsWith(prefix),
    );
    if (matchingPrefix) {
      const redirectUrl = STATIC_BASE_URL + url;
      res.writeHead(301, { Location: redirectUrl });
      res.end();
      return;
    }

    next();
  }) as connect.NextHandleFunction);
}
