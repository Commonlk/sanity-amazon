import ImageUrlBuilder from '@sanity/image-url';
import client from './client';

const urlForThumbnail = (source: any) => {
  return ImageUrlBuilder(client).image(source).width(800).height(600).url();
};
const urlFor = (source: any) => {
  return ImageUrlBuilder(client).image(source).width(980).url();
};

export { urlForThumbnail, urlFor };
