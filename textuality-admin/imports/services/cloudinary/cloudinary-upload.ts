import { Meteor } from 'meteor/meteor';
import {
  UploadApiResponse,
  UploadApiOptions,
  TransformationOptions,
} from 'cloudinary';
import { getWaImageBase64 } from '../whatsapp/wa-downloadmedia';

const cloudinary = require('cloudinary');

interface MediaProps {
  cloudinaryId: string;
  faces: any;
  url: string;
  width: number;
  height: number;
}

if (Meteor.isServer) {
  const cloudName: string = Meteor.settings.public.cloudinaryCloudName;
  const apiKey: string = Meteor.settings.private.cloudinaryKey;
  const apiSecret: string = Meteor.settings.private.cloudinarySecret;

  cloudinary.v2.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

async function uploadImage(imageUrl: string): Promise<MediaProps> {
  const options: UploadApiOptions = {
    faces: true,
  };

  try {
    const base64Image = await getWaImageBase64(imageUrl);

    const mediaProps: UploadApiResponse = await cloudinary.v2.uploader.upload(
      base64Image,
      options,
    );

    return {
      cloudinaryId: mediaProps.public_id,
      faces: mediaProps.faces,
      url: mediaProps.url,
      width: mediaProps.width,
      height: mediaProps.height,
    };
  } catch (e) {
    console.warn('Upload error', e);
    throw 'Error';
  }
}

export { uploadImage };
