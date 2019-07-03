import * as React from 'react';
import { Marker } from 'react-leaflet';

import { convertCoordinate } from './utils/coordinates';
import { parseIconProps } from './utils/icons';

export default class extends React.Component {
  setNativeProps(props) {
    console.warn('TODO: Marker.setNativeProps', props);
  }

  render() {
    const {
      identifier,
      reuseIdentifier,
      title,
      description,
      testID,
      image,
      icon,
      opacity,
      onPress,
      coordinate,
      draggable,

      flat,
      tracksViewChanges,
      tracksInfoWindowChanges,
      stopPropagation,
      onSelect,
      onDeselect,
      onCalloutPress,
      onDragStart,
      onDrag,
      onDragEnd,
      ...props
    } = this.props;
    const markerTitle = description ? `${title}\n${description}` : title;
    const position = convertCoordinate(coordinate);
    const leafletIcon = parseIconProps({ icon, image, ...props }); // TODO:

    const markerProps = {
      ...props,
      opacity,
      draggable,
      title: markerTitle,
      position,
    };

    if (leafletIcon) {
      markerProps.icon = leafletIcon;
    }

    return <Marker {...markerProps} />;
  }
}

// Missing:
// zIndexOffset
// attribution
