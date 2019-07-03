import * as React from 'react';
import { Marker, Layer, Feature } from 'react-mapbox-gl';

import { convertCoordinate } from './utils/coordinates';
import { parseIconProps } from './utils/icons';

import createLogger from '../utils/createLogger';

const logger = createLogger('Mapbox', 'Marker');

export default class NativeMarker extends React.Component {
  setNativeProps(props) {
    logger.warn('TODO: Marker.setNativeProps', props);
  }

  componentDidCatch(error, info) {
    logger.error(error, info);
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
      style,
      ...props
    } = this.props;
    // const markerTitle = description ? `${title}\n${description}` : title;
    const coordinates = convertCoordinate(coordinate);
    // const leafletIcon = parseIconProps({ icon, image, ...props }); // TODO:

    const markerProps = {
      // ...props,
      // opacity,
      // draggable,
      // title: markerTitle,

      /* (required): `[number, number]` Display the marker at the given position. */
      coordinates,
      /* `string` Same as Popup's anchor property. */
      // anchor: ,
      /* `string` Same as Popup's offset property. */
      // offset:
      /* `function` Triggered whenever user click on the marker */
      // onClick:
      /* `object` Apply style to the marker container */
      style,
      /* `string` Apply the className to the container of the Marker */
      // className:
      /* `number` define the tab index value of the top container tag */
      // tabIndex :
    };

    // if (leafletIcon) {
    //   markerProps.icon = leafletIcon;
    // }

    return <Marker {...markerProps} />;
  }
}
