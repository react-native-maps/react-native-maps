import * as React from 'react';

import { convertCoordinate } from './utils/coordinates';
import { parseIconProps } from './utils/icons';
import createLogger from '../utils/createLogger';

// Missing:
// zIndexOffset
// attribution

import { createPortal } from 'react-dom';
import { DivIcon, marker } from 'leaflet';
import * as RL from 'react-leaflet';
import { MapLayer, Marker } from 'react-leaflet';
import { difference } from 'lodash';

const logger = createLogger('Leaflet', 'Marker');

export default class ExpoMarker extends React.Component {
  setNativeProps(props) {
    logger.unsupported(props);
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

ExpoMarker.defaultProps = {
  centerOffset: /** Unused: use `anchor` instead */ [0, 0],
  calloutOffset: /** Unused: use `calloutAnchor` instead */ [0, 0],
  anchor: /** Leeaflet: `iconAnchor` */ [0.5, 1],
  calloutAnchor: /** Leaflet: `popupAnchor` */ [0.5, 0],
  // flat: /** Unsupported */ false,
  // rotation: /** Unsupported */ 0,
  // tracksViewChanges: /** Unused */ true,
  // tracksInfoWindowChanges: /** Unused */ false,
  stopPropagation: /** Unimplemented */ false,
  draggable: false,
  opacity: 1.0,
};

// TODO(Bacon): Update the anchor when the layout changes
// https://stackoverflow.com/questions/47018368/implementing-a-dynamic-jsx-element-within-a-marker-using-react-leaflet/54504646#54504646
const CustomMarker = RL.withLeaflet(
  class extends MapLayer {
    leafletElement;
    contextValue;

    createLeafletElement(props) {
      const { map, layerContainer, position, anchor, ...rest } = props;

      const icon = new DivIcon({
        ...rest,
        className: '',
        iconSize: undefined,
      });

      const popupContainer = marker(position, { icon, ...rest });
      this.contextValue = { ...props.leaflet, popupContainer };
      return popupContainer;
    }

    getRelativePoint(point) {
      if (!point) return null;
      const { x, y } = ofPoint(point);
      const { width, height } = this.rect;
      return { x: x * width, y: y * height };
    }

    get icon() {
      if (!this.leafletElement.options.icon) throw new Error('Leaflet.Marker: icon not loaded yet');

      return this.leafletElement.options.icon;
    }

    get rect() {
      return this.leafletElement.getElement().getBoundingClientRect();
    }

    updateLeafletElement(fromProps, toProps) {
      const {
        position: fromPosition,
        zIndexOffset: fromZIndexOffset,
        opacity: fromOpacity,
        draggable: fromDraggable,
        className: fromClassName,
        anchor: fromAnchor,
        calloutAnchor: fromCalloutAnchor,
      } = fromProps;
      const {
        position: toPosition,
        zIndexOffset: toZIndexOffset,
        toOpacity,
        draggable: toDraggable,
        className: toClassName,
        anchor: toAnchor,
        calloutAnchor: toCalloutAnchor,
      } = toProps;

      // this.icon.options.iconSize = [this.rect.width, this.rect.height];

      if (toAnchor !== fromAnchor) {
        // Convert to a unified format
        const iconAnchor = this.getRelativePoint(toAnchor);
        // Update the option for internal usage
        this.icon.options.iconAnchor = iconAnchor;
        // Manually redefine the styles
        this.leafletElement.getElement().style.marginLeft = -iconAnchor.x + 'px';
        this.leafletElement.getElement().style.marginTop = -iconAnchor.y + 'px';
      }

      if (toCalloutAnchor !== fromCalloutAnchor) {
        // Convert to a unified format
        const popupAnchor = this.getRelativePoint(toCalloutAnchor);
        // Update the option for internal usage
        this.icon.options.popupAnchor = popupAnchor;
        // TODO(Bacon): Manually redefine the styles
        // this.leafletElement.getElement().style.marginLeft = -popupAnchor.x + 'px';
        // this.leafletElement.getElement().style.marginTop = -popupAnchor.y + 'px';
      }

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
        this.leafletElement.getElement().classList.remove(...difference(fromClasses, toClasses));
        this.leafletElement.getElement().classList.add(...difference(toClasses, fromClasses));
      }
    }

    componentWillMount() {
      if (super.componentWillMount) {
        super.componentWillMount();
      }
      this.leafletElement = this.createLeafletElement(this.props);
      this.leafletElement.on('add', () => {
        this.forceUpdate(() => {
          // Wait until the React elements have rendered before setting things like anchor which require the bounding rect.
          this.updateLeafletElement({}, this.props);
        });
      });
    }

    componentDidUpdate(fromProps) {
      this.updateLeafletElement(fromProps, this.props);
    }

    render() {
      const { children } = this.props;
      const container = this.leafletElement.getElement();

      if (!container) {
        return null;
      }

      this.portal = createPortal(children, container);

      const { LeafletProvider } = RL;

      return children == null || this.portal == null || this.contextValue == null ? null : (
        <LeafletProvider value={this.contextValue}>{this.portal}</LeafletProvider>
      );
    }
  }
);

function ofPoint(point) {
  if (!point) return;

  if (Array.isArray(point) && point.length === 2) {
    return { x: point[0], y: point[1] };
  }
  if (point.x !== undefined && point.y !== undefined) {
    return { x: point.x, y: point.y };
  }
  throw new Error('Leaflet.Marker: Point is unexpected type: ' + point);
}
