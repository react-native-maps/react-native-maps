import * as React from 'react';

import { convertCoordinate } from './utils/coordinates';
import { parseIconProps } from './utils/icons';

// Missing:
// zIndexOffset
// attribution

import { createPortal } from 'react-dom';
import { DivIcon, marker } from 'leaflet';
import * as RL from 'react-leaflet';
import { MapLayer, Marker } from 'react-leaflet';
import { difference } from 'lodash';

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

    if (props.children) {
      return <CustomMarker {...markerProps} />;
    }
    return <Marker {...markerProps} />;
  }
}

// https://stackoverflow.com/questions/47018368/implementing-a-dynamic-jsx-element-within-a-marker-using-react-leaflet/54504646#54504646
const CustomMarker = RL.withLeaflet(
  class extends MapLayer {
    leafletElement;
    contextValue;

    createLeafletElement(props) {
      const { map, layerContainer, position, ...rest } = props;

      // when not providing className, the element's background is a white square
      // when not providing iconSize, the element will be 12x12 pixels
      const icon = new DivIcon({ ...rest, className: '', iconSize: undefined });

      const el = marker(position, { icon, ...rest });
      this.contextValue = { ...props.leaflet, popupContainer: el };
      return el;
    }

    updateLeafletElement(fromProps, toProps) {
      const {
        position: fromPosition,
        zIndexOffset: fromZIndexOffset,
        opacity: fromOpacity,
        draggable: fromDraggable,
        className: fromClassName,
      } = fromProps;
      const {
        position: toPosition,
        zIndexOffset: toZIndexOffset,
        toOpacity,
        draggable: toDraggable,
        className: toClassName,
      } = toProps;

      if (toPosition !== fromPosition) {
        this.leafletElement.setLatLng(toPosition);
      }
      if (toZIndexOffset !== fromZIndexOffset) {
        this.leafletElement.setZIndexOffset(toZIndexOffset);
      }
      if (toOpacity !== fromOpacity) {
        this.leafletElement.setOpacity(toOpacity);
      }
      if (toDraggable !== fromDraggable) {
        if (toDraggable) {
          this.leafletElement.dragging.enable();
        } else {
          this.leafletElement.dragging.disable();
        }
      }
      if (toClassName !== fromClassName) {
        const fromClasses = fromClassName.split(' ');
        const toClasses = toClassName.split(' ');
        this.leafletElement._icon.classList.remove(...difference(fromClasses, toClasses));
        this.leafletElement._icon.classList.add(...difference(toClasses, fromClasses));
      }
    }

    componentWillMount() {
      if (super.componentWillMount) {
        super.componentWillMount();
      }
      this.leafletElement = this.createLeafletElement(this.props);
      this.leafletElement.on('add', () => this.forceUpdate());
    }

    componentDidUpdate(fromProps) {
      this.updateLeafletElement(fromProps, this.props);
    }

    render() {
      const { children } = this.props;
      const container = this.leafletElement._icon;

      if (!container) {
        return null;
      }

      const portal = createPortal(children, container);

      const { LeafletProvider } = RL;

      return children == null || portal == null || this.contextValue == null ? null : (
        <LeafletProvider value={this.contextValue}>{portal}</LeafletProvider>
      );
    }
  }
);
