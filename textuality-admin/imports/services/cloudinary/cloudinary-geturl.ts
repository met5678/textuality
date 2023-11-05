import { Meteor } from 'meteor/meteor';
import { Cloudinary } from '@cloudinary/url-gen';
import { thumbnail } from '@cloudinary/url-gen/actions/resize';
import { focusOn } from '@cloudinary/url-gen/qualifiers/gravity';
import { FocusOn } from '@cloudinary/url-gen/qualifiers/focusOn';

const cloudName: string = Meteor.settings.public.cloudinaryCloudName;
const cloudinary = new Cloudinary({ cloud: { cloudName } });

interface CloudinaryTransformations {
  width: number;
  height: number;
  crop?: 'thumb' | 'fill' | 'fit' | 'lfill' | string;
  gravity?: 'none' | 'face' | 'faces' | string;
  zoom?: number;
}

function getImageUrl(
  cloudinaryId: string,
  transformations: CloudinaryTransformations,
): string {
  const image = cloudinary.image(cloudinaryId);

  const { width, height, crop, gravity, zoom = 1 } = transformations;

  image.resize(
    thumbnail(width, height).zoom(zoom).gravity(focusOn(FocusOn.faces())),
  );

  return image.toURL();
}

export { getImageUrl };
