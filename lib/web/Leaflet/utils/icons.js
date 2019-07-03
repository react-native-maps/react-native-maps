import { icon as createLeafletIcon } from 'leaflet';

export function parseIconProps({
  icon,
  image,
  pinColor,
  anchor: iconAnchor,
  calloutAnchor: popupAnchor,
  ...props
}) {
  if (icon) {
    if (typeof icon === 'string') {
      return createIcon({ iconUrl: icon, iconAnchor, popupAnchor, ...props });
    } else if (icon.iconUrl) {
      return createIcon({ iconAnchor, popupAnchor, ...icon });
    }
  }

  return undefined;
}

export function createIcon(props) {
  if (props == null || !Object.values(props).filter(Boolean).length) return undefined;
  return createLeafletIcon(props);
}
