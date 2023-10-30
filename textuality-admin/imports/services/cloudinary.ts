import { Meteor } from 'meteor/meteor';
import { UploadApiResponse, UploadApiOptions, TransformationOptions } from 'cloudinary';

const cloudinary = require('cloudinary');

interface MediaProps {
    cloudinaryId: string;
    faces: any;
    url: string;
    width: number;
    height: number;
}

const cloudName: string = Meteor.settings.public.cloudinaryCloudName;

if (Meteor.isServer) {
    const apiKey: string = Meteor.settings.private.cloudinaryKey;
    const apiSecret: string = Meteor.settings.private.cloudinarySecret;

    cloudinary.v2.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret
    });
} else {
    cloudinary.v2.config({
        cloud_name: cloudName
    });
}

async function uploadImage(imageUrl: string): Promise<MediaProps> {
    const options: UploadApiOptions = {
        faces: true
    };

    const mediaProps: UploadApiResponse = await cloudinary.v2.uploader.upload(imageUrl, options);

    return {
        cloudinaryId: mediaProps.public_id,
        faces: mediaProps.faces,
        url: mediaProps.url,
        width: mediaProps.width,
        height: mediaProps.height
    };
}

function getImageUrl(cloudinaryId: string, transform: TransformationOptions = {}): string {
    return cloudinary.v2.url(cloudinaryId, transform);
}

export { uploadImage, getImageUrl };
