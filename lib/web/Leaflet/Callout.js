import * as React from 'react';
import { DivOverlay } from 'react-leaflet';

import { transformProps } from './utils/transformProps';

function localTransformProps(props) {
  return transformProps(props);
}

// export default class ExpoCallout extends React.Component {
//   setNativeProps(props) {
//     this.ref.setStyleIfChanged(this.props, localTransformProps(props));
//   }

//   render() {
//     const props = localTransformProps(this.props);
//     return <Popup ref={ref => (this.ref = ref)} {...props} />;
//   }
// }

import { withLeaflet } from 'react-leaflet';

import { Popup as LeafletPopup } from 'leaflet';

class Popup extends DivOverlay {
  static defaultProps = {
    pane: 'popupPane',
  };

  setNativeProps(props) {
    this.ref.setStyleIfChanged(this.props, localTransformProps(props));
  }

  getOptions(props) {
    return {
      ...super.getOptions(props),
      autoPan: false,
    };
  }

  createLeafletElement(props) {
    const options = this.getOptions(props);
    options.autoPan = props.autoPan !== false;
    return new LeafletPopup(options, props.leaflet.popupContainer);
  }

  updateLeafletElement(fromProps: Props, toProps: Props) {
    if (toProps.position !== fromProps.position) {
      this.leafletElement.setLatLng(toProps.position);
    }
  }

  componentDidMount() {
    const { position } = this.props;
    const { map, popupContainer } = this.props.leaflet;
    const el = this.leafletElement;

    if (map != null) {
      map.on({
        popupopen: this.onPopupOpen,
        popupclose: this.onPopupClose,
      });
    }

    if (popupContainer) {
      // Attach to container component
      popupContainer.bindPopup(el);
    } else {
      // Attach to a Map
      if (position) {
        el.setLatLng(position);
      }
      el.openOn(map);
    }
  }

  componentWillUnmount() {
    const { map } = this.props.leaflet;

    if (map != null) {
      map.off({
        popupopen: this.onPopupOpen,
        popupclose: this.onPopupClose,
      });
      map.removeLayer(this.leafletElement);
    }

    super.componentWillUnmount();
  }

  onPopupOpen = ({ popup }: { popup: LeafletElement }) => {
    if (popup === this.leafletElement) {
      this.onOpen();
    }
  };

  onPopupClose = ({ popup }: { popup: LeafletElement }) => {
    if (popup === this.leafletElement) {
      this.onClose();
    }
  };

  onRender = () => {
    if (this.props.autoPan !== false && this.leafletElement.isOpen()) {
      if (this.leafletElement._map && this.leafletElement._map._panAnim) {
        this.leafletElement._map._panAnim = undefined;
      }
      this.leafletElement._adjustPan();
    }
  };
}

export default withLeaflet(Popup);
