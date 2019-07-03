import { circle } from 'mapbox-gl';
import * as React from 'react';
import { withMap } from 'react-mapbox-gl/lib-esm/context';

class Circle extends React.Component {
  layer;

  componentWillMount() {
    this.create(this.props);
  }

  componentWillUnmount() {
    this.props.map.removeLayer(this.layer);
  }

  componentWillReceiveProps(nextProps) {
    const { id } = this.props;

    if (nextProps.map !== this.props.map) {
      // Remove image from old map
      this.props.map.removeLayer(this.layer);
    }

    if (nextProps.map && !nextProps.map.hasImage(id)) {
      // Add missing image to map
      this.create(nextProps);
    }
  }

  render() {
    return null;
  }

  create(props) {
    if (!this.layer) {
      this.layer = circle([props.latitude, props.longitude], props.radius, props.options);
      props.map.addLayer(this.layer);
      this.loaded();
    } else {
      // TODO: Bacon: Update
      // this.layer
    }
  }
}

export default withMap(Circle);
