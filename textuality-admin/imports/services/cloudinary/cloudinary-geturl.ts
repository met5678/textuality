import { Meteor } from 'meteor/meteor';
import { Cloudinary } from '@cloudinary/url-gen';
import { thumbnail } from '@cloudinary/url-gen/actions/resize';
import { focusOn } from '@cloudinary/url-gen/qualifiers/gravity';
import { face } from '@cloudinary/url-gen/qualifiers/focusOn';

const cloudName: string = Meteor.settings.public.cloudinaryCloudName;
const cloud = new Cloudinary({
  cloud: {
    cloudName,
  },
});

function getImageUrl(cloudinaryId: string, transformations: any): string {
  const cldImage = cloud.image(cloudinaryId);

  cldImage.resize(
    thumbnail().width(150).height(150).gravity(focusOn(face())).zoom(0.8),
  );

  return cldImage.toURL();
}

export { getImageUrl };
