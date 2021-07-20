import * as React from 'react';
import { View, Image as RNImage, PixelRatio, StyleSheet, Text } from 'react-native';
import { convertCoordinate } from './utils/coordinates';
import { parseIconProps } from './utils/icons';
import createLogger from '../utils/createLogger';
import { transformPathEvents } from './utils/events';
// Missing:
// zIndexOffset
// attribution

import { createPortal } from 'react-dom';
import { DivIcon, marker, Marker as LeafletMarker } from 'leaflet';

import * as RL from 'react-leaflet';
import { MapLayer, Marker, Popup } from 'react-leaflet';
import { difference } from 'lodash';

const logger = createLogger('Leaflet', 'Marker');

export default class ExpoMarker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      position: convertCoordinate(props.coordinate),
    };
  }
  // Shows the callout for this marker
  showCallout() {
    this.ref.leafletElement.openPopup();
  }
  // Hides the callout for this marker
  hideCallout() {
    this.ref.leafletElement.closePopup();
  }
  // // Causes a redraw of the marker's callout. Useful for Google Maps on iOS.
  // // Note: iOS only.
  // redrawCallout() {
  //   logger.warn('redrawCallout() is unsupported');
  // }
  // // Animates marker movement.
  // // Note: Android only
  // animateMarkerToCoordinate(coordinate, duration) {
  //   logger.warn('animateMarkerToCoordinate(coordinate, duration) is unsupported');
  // }
  // // Causes a redraw of the marker. Useful when there are updates to the marker and tracksViewChanges comes with a cost that is too high.
  // redraw() {
  //   logger.warn('redraw() is unsupported');
  // }

  setNativeProps({ coordinate, ...props }) {
    if (coordinate) {
      this.setState({ position: convertCoordinate(coordinate) });
    }
    logger.unsupported(props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.coordinate !== this.props.coordinate) {
      this.setState({ position: convertCoordinate(nextProps.coordinate) });
    }
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
      coordinate,
      draggable,
      flat,
      tracksViewChanges,
      tracksInfoWindowChanges,
      stopPropagation,
      onSelect,
      onDeselect,
      onCalloutPress,
      pinColor,
      ...props
    } = this.props;
    const markerTitle = description ? `${title}\n${description}` : title;
    const { position } = this.state;
    let leafletIcon = parseIconProps({ icon, image, ...props }); // TODO:

    const markerProps = {
      ...props,
      ...transformPathEvents(props),
      id: identifier,
      opacity,
      draggable,
      title: markerTitle,
      position,
    };

    let isCustom = false;

    if (leafletIcon) {
      isCustom = true;
      markerProps.icon = leafletIcon;
    }

    if (!isCustom && props.children) {
      React.Children.forEach(props.children, (child, index) => {
        if (!isCustom && child.type.name !== 'MapCallout') {
          isCustom = true;
        }
      });
    }

    if (isCustom) {
      return <ExpoDivIcon ref={ref => (this.ref = ref)} {...markerProps} />;
    } else if (pinColor) {
      return (
        <ExpoDivIcon ref={ref => (this.ref = ref)} {...markerProps}>
          <View
            style={{
              backgroundColor: pinColor,
              width: '3rem',
              height: '3rem',
              display: 'block',
              position: 'relative',
              borderRadius: '3rem',
              borderBottomEndRadius: 0,
              transform: [{ rotate: '45deg' }],
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: '#fff',
            }}
          />
          {markerProps.children}
          <StandardCallout title={title} description={description} />
        </ExpoDivIcon>
      );
    }

    return (
      <ExpoStandardIcon ref={ref => (this.ref = ref)} {...markerProps}>
        {markerProps.children}
        {(title || description) && <StandardCallout title={title} description={description} />}
      </ExpoStandardIcon>
    );
  }
}

class FullSizeImage extends React.Component {
  state = {
    size: {},
  };

  componentDidMount() {
    const img = new Image();
    img.src = this.props.source.uri ? this.props.source.uri : this.props.source;
    img.onload = () => {
      this.setState({
        size: {
          width: img.width / PixelRatio.get(),
          height: img.height / PixelRatio.get(),
        },
      });
    };
  }
  render() {
    return (
      <RNImage
        testID="expo-maps-marker-full-size-image"
        {...this.props}
        style={[this.props.style, this.state.size]}
      />
    );
  }
}

// function FullSizeImage({ source, ...props }) {
//   const [size, setSize] = React.useState({});

//   React.useEffect(() => {
//     const img = new HTMLImageElement();
//     img.src = source.uri ? source.uri : source;
//     img.onload = () => {
//       setSize({
//         width: img.width,
//         height: img.height,
//       });
//     };
//     return () => (img = null);
//   }, [source]);

//   return <Image {...props} style={[props.style, size]} />;
// }

function StandardCallout({ title, description }) {
  return (
    <Popup>
      <View>
        {title && <Text style={{ fontWeight: 'bold' }}>{title}</Text>}
        {description && <Text>{description}</Text>}
      </View>
    </Popup>
  );
}

ExpoMarker.defaultProps = {
  centerOffset: /** Unused: use `anchor` instead */ null,
  calloutOffset: /** Unused: use `calloutAnchor` instead */ null,
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
class ExpoCustomMarker extends MapLayer {
  createLeafletElement(props) {
    throw new Error('createLeafletElement should be overwritten');
  }

  getRelativePoint(point) {
    if (!point) return null;
    const { x, y } = ofPoint(point);
    const { width, height } = this.rect;
    return { x: x * width, y: y * height };
  }

  getRelativePointFromRect(point, element) {
    if (!point) return null;
    const { x, y } = ofPoint(point);
    const { width, height } = element;
    return { x: x * width, y: y * height };
  }

  getPopupRelativePointFromRect(point, element) {
    if (!point) return null;
    const { x, y } = ofPoint(point);
    const { width, height } = element;
    return { x: x * width - width / 2, y: y * height - height };
  }

  get icon() {
    if (!this.leafletElement.options.icon) throw new Error('Leaflet.Marker: icon not loaded yet');

    return this.leafletElement.options.icon;
  }

  get rect() {
    const element = this.leafletElement.getElement();
    if (!element) return {};
    return element.getBoundingClientRect();
  }

  tryUpdatePopupAnchor(anchor) {
    if (!anchor) return;

    const element = this.leafletElement._popup;

    clearTimeout(this._popupAnchorTimeout);
    logger.log('Element', element._container);
    if (!element._container) {
      this._popupAnchorTimeout = setTimeout(() => this.tryUpdatePopupAnchor(anchor), 300);
    } else {
      this.updatePopupAnchor(anchor, element._container);
    }
  }

  updatePopupAnchor(anchor, element) {
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const { x, y } = ofPoint(anchor);
    const containerRect = this.rect;
    const { height } = rect;

    const computedStyle = window.getComputedStyle(element);
    let outerHeight = 0;
    outerHeight += parseInt(computedStyle.marginTop, 10);
    outerHeight += parseInt(computedStyle.marginBottom, 10);
    outerHeight += parseInt(computedStyle.borderTopWidth, 10);
    outerHeight += parseInt(computedStyle.borderBottomWidth, 10);
    outerHeight *= 0.5;
    outerHeight += height;

    const popupAnchor = {
      x: containerRect.width * -0.5 + containerRect.width * x,
      y: (y - 1) * outerHeight,
    };

    // logger.log('RECT: ', rect, element, element.style, outerHeight, popupAnchor);
    // Update the option for internal usage
    this.icon.options.popupAnchor = popupAnchor;
  }

  updateAnchor = (anchor, element) => {
    if (!this.leafletElement.getElement()) return;
    // Convert to a unified format
    const iconAnchor = this.getRelativePointFromRect(
      anchor,
      element || this.leafletElement.getElement().getBoundingClientRect()
    );
    logger.log('toAnchor: ', iconAnchor, this.leafletElement.getElement().getBoundingClientRect());
    // Update the option for internal usage
    this.icon.options.iconAnchor = iconAnchor;
    // Manually redefine the styles
    this.leafletElement.getElement().style.marginLeft = -iconAnchor.x + 'px';
    this.leafletElement.getElement().style.marginTop = -iconAnchor.y + 'px';
  };

  updateCalloutAnchor = (anchor, element) => {
    if (!this.leafletElement.getElement()) return;
    // TODO(Bacon): Experimental: this feature requires the callout to be rendered before it can correctly position the element.
    // this.tryUpdatePopupAnchor(anchor);
    this.icon.options.popupAnchor = this.getPopupRelativePointFromRect(
      anchor,
      element || this.leafletElement.getElement().getBoundingClientRect()
    );
  };

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

    let rect;
    if (toAnchor !== fromAnchor) {
      if (!rect) rect = this.getRectWithIcon();
      this.updateAnchor(toAnchor, rect);
    }

    if (toCalloutAnchor !== fromCalloutAnchor) {
      if (!rect) rect = this.getRectWithIcon();
      this.updateCalloutAnchor(toCalloutAnchor, rect);
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
    if (toProps.icon !== fromProps.icon) {
      // this.leafletElement.setIcon(toProps.icon);
      this.observeLayout(this.leafletElement.getElement());
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
        this.observeLayout(this.leafletElement.getElement());
      });
    });
  }

  componentDidUpdate(fromProps) {
    this.updateLeafletElement(fromProps, this.props);
  }

  getIconElement = () => {
    const element = this.leafletElement.getElement();
    if (!element) return null;
    return element.querySelector('[data-testid="expo-maps-marker-full-size-image"]');
  };

  getRectWithIcon = () => {
    const container = this.rect;
    const iconElement = this.getIconElement();
    if (!iconElement) return this.rect;
    const icon = iconElement.getBoundingClientRect();

    const leftMost = Math.min(icon.x, container.x);
    const rightMost = Math.max(icon.x + icon.width, container.x + container.width);
    const topMost = Math.min(icon.y, container.y);
    const bottomMost = Math.max(icon.y + icon.height, container.y + container.height);
    return {
      width: rightMost - leftMost,
      height: bottomMost - topMost,
    };
  };

  onLayoutDidUpdate = () => {
    const rect = this.getRectWithIcon();
    this.updateAnchor(this.props.anchor, rect);
    this.updateCalloutAnchor(this.props.calloutAnchor, rect);
  };

  observeElementLayout = element => {
    const resizeObserver = new ResizeObserver(() => {
      this.onLayoutDidUpdate();
    }, element);
    resizeObserver.observe(element);
    return resizeObserver;
  };

  observeLayout = container => {
    if (!this.resizeObserver) {
      this.resizeObserver = this.observeElementLayout(container);
    }

    const image = container.querySelector('[data-testid="expo-maps-marker-full-size-image"]');
    if (image) {
      this.observeElementLayout(image);
    }
  };

  render() {
    throw new Error('render should be overwritten');
  }
}
class ReactDivIcon extends ExpoCustomMarker {
  createLeafletElement(props) {
    const { map, layerContainer, position, anchor, ...rest } = props;

    const icon = new DivIcon({
      ...rest,
      className: '',
      iconSize: undefined,
    });

    const options = this.getOptions(props);

    const popupContainer = marker(position, {
      ...options,
      icon,
    });
    this.contextValue = { ...props.leaflet, popupContainer };

    return popupContainer;
  }

  render() {
    const { children, icon } = this.props;
    const container = this.leafletElement.getElement();
    if (!container) {
      return null;
    }

    this.portal = createPortal(
      <View>
        {icon && (
          <FullSizeImage
            style={[StyleSheet.absoluteFill, { zIndex: -1 }]}
            source={{ uri: icon.options.iconUrl }}
          />
        )}
        {children}
      </View>,
      container
    );

    const { LeafletProvider } = RL;

    // this.observeLayout(container);

    return this.portal == null || this.contextValue == null ? null : (
      <LeafletProvider value={this.contextValue}>{this.portal}</LeafletProvider>
    );
  }
}

class ReactMarker extends ExpoCustomMarker {
  createLeafletElement(props) {
    const el = new LeafletMarker(props.position, this.getOptions(props));
    this.contextValue = { ...props.leaflet, popupContainer: el };
    return el;
  }

  render() {
    const { children } = this.props;

    const { LeafletProvider } = RL;

    const container = this.leafletElement.getElement();
    if (!container) {
      return null;
    }
    // this.observeLayout(container);
    return children == null || this.contextValue == null ? null : (
      <LeafletProvider value={this.contextValue}>{children}</LeafletProvider>
    );
  }
}

const ExpoStandardIcon = RL.withLeaflet(ReactMarker);

const ExpoDivIcon = RL.withLeaflet(ReactDivIcon);

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
