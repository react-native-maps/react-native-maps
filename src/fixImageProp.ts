import {Image, type ImageSourcePropType} from 'react-native';

export function fixImageProp(
  image: ImageSourcePropType,
): {uri: string} | ImageSourcePropType {
  if (typeof image === 'string') {
    return {uri: image};
  }

  if (typeof image === 'number') {
    // Handle local image asset (require('./image.png'))
    const resolvedImage = Image.resolveAssetSource(image);
    return resolvedImage?.uri ? {uri: resolvedImage.uri} : image;
  }

  return image;
}
