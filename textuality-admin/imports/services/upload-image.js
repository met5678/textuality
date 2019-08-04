import { HTTP } from 'meteor/http';
import cloudinary from 'cloudinary';

if (Meteor.isServer) {
  const cloudName = Meteor.settings.public.cloudinaryCloudName;
  const apiKey = Meteor.settings.private.cloudinaryKey;
  const apiSecret = Meteor.settings.private.cloudinarySecret;

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
  });
}

function uploadImage(imageUrl, callback) {
  const options = {
    faces: true
  };

  const mediaProps = uploadMedia(imageUrl, options);

  return {
    cloudinaryId: mediaProps.public_id,
    faces: mediaProps.faces,
    url: mediaProps.url,
    width: mediaProps.width,
    height: mediaProps.height
  };
}

const uploadMedia = Meteor.wrapAsync(function uploadMedia(
  mediaUrl,
  options,
  cb
) {
  cloudinary.v2.uploader.upload(mediaUrl, options, cb);
});

export default uploadImage;
