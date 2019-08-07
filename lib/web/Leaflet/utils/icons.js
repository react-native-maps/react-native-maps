import { icon as createLeafletIcon } from 'leaflet';

export function parseIconProps({
  icon,
  image,
  pinColor,
  anchor: iconAnchor,
  calloutAnchor: popupAnchor,
  ...props
}) {
  const imageSource = icon || image;
  if (imageSource) {
    if (typeof imageSource === 'string') {
      return createIcon({ iconUrl: imageSource, iconAnchor, popupAnchor, ...props });
    } else if (imageSource.iconUrl) {
      return createIcon({ iconAnchor, popupAnchor, ...imageSource });
    }
  }

  return undefined;
}

export function createIcon(props) {
  if (props == null || !Object.values(props).filter(Boolean).length) return undefined;
  return createLeafletIcon(props);
}
