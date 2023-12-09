import { Meteor } from 'meteor/meteor';
import { UploadApiResponse, UploadApiOptions } from 'cloudinary';
// import { getWaImageBase64 } from '../whatsapp/wa-downloadmedia';

const cloudinary = require('cloudinary');

const waToken: string = Meteor.settings.private.waSystemToken;

interface MediaProps {
  cloudinaryId: string;
  faces?: any;
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
    headers: `Authorization: Bearer ${waToken}`,
  };

  try {
    const mediaProps: UploadApiResponse = await cloudinary.v2.uploader.upload(
      imageUrl,
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

async function uploadVideo(videoUrl: string): Promise<MediaProps> {
  const options: UploadApiOptions = {
    resource_type: 'video',
    headers: `Authorization: Bearer ${waToken}`,
  };

  console.log('Uploading video', videoUrl);

  try {
    const mediaProps: UploadApiResponse = await cloudinary.v2.uploader.upload(
      videoUrl,
      options,
    );

    return {
      cloudinaryId: mediaProps.public_id,
      url: mediaProps.url,
      width: mediaProps.width,
      height: mediaProps.height,
    };
  } catch (e) {
    console.warn('Upload error', e);
    throw 'Error';
  }
}

export { uploadImage, uploadVideo };
