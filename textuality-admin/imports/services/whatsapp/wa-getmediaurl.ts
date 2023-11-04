import { Meteor } from 'meteor/meteor';
import { fetch } from 'meteor/fetch';

const waToken: string = Meteor.settings.private.waSystemToken;
const waAPIVersion = 'v18.0';

interface WaMediaResponse {
  messaging_product: 'whatsapp';
  url: string;
  mime_type: string;
  sha256: string;
  file_size: string;
  id: string;
}

async function getMediaUrl(mediaId: string): Promise<string> {
  const whatsappMediaEndpoint = `https://graph.facebook.com/${waAPIVersion}/${mediaId}`;

  const response = await fetch(whatsappMediaEndpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${waToken}`,
    },
  });

  if (response.status !== 200) {
    console.warn(
      'Unexpected response from getMediaUrl call',
      await response.json(),
    );
    throw 'Unexpected response from getMediaUrl call';
  }

  const responseBody: WaMediaResponse = await response.json();

  return responseBody.url;
}

export { getMediaUrl };
