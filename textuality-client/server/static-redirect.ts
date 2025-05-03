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
const S3_BASE_URL = 'https://textuality-static.s3.us-east-1.amazonaws.com';

if (Meteor.isProduction) {
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
      const redirectUrl = S3_BASE_URL + url;
      res.writeHead(301, { Location: redirectUrl });
      res.end();
      return;
    }

    next();
  }) as connect.NextHandleFunction);
}
