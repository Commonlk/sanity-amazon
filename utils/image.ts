import ImageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

import client from './client';

const urlForThumbnail = (source: SanityImageSource) => {
  return ImageUrlBuilder(client).image(source).width(800).height(600).url();
};
const urlFor = (source: SanityImageSource) => {
  return ImageUrlBuilder(client).image(source).width(980).url();
};

export { urlForThumbnail, urlFor };
