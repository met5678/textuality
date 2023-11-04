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

async function getWaImageBase64(url: string): Promise<string> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${waToken}`,
    },
  });

  if (response.status !== 200) {
    console.warn(
      'Error when downloading image as base64',
      await response.json(),
    );
    throw 'Error when downloading image as base64';
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const dataUri = `data:image/jpeg;base64,${buffer.toString('base64')}`;
  return dataUri;
}

export { getWaImageBase64 };
