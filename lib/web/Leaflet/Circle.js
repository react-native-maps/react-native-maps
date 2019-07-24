import * as React from 'react';
import { Circle } from 'react-leaflet';

import { convertCoordinate } from './utils/coordinates';

export default class ExpoCircle extends React.Component {
  setNativeProps({
    radius,
    strokeColor,
    fillColor,
    lineCap,
    lineJoin,
    lineDashPhase,
    lineDashPattern,
    tappable,
    onPress,
  }) {
    this.ref.setStyleIfChanged(this.props, {
      radius: radius,
      color: strokeColor,
      fillColor: fillColor,
      lineCap: lineCap,
      lineJoin: lineJoin,
      dashOffset: lineDashPhase,
      dashArray: lineDashPattern,
      interactive: tappable,
      click: onPress,
    });
  }

  render() {
    const {
      center,
      radius,
      strokeWidth,
      strokeColor,
      fillColor,
      lineCap,
      lineJoin,
      miterLimit,
      geodesic,
      lineDashPhase,
      lineDashPattern,
      tappable,
      onPress,
    } = this.props;
    return (
      <Circle
        ref={ref => (this.ref = ref)}
        center={convertCoordinate(center)}
        radius={radius}
        color={strokeColor}
        fillColor={fillColor}
        lineCap={lineCap}
        lineJoin={lineJoin}
        dashOffset={lineDashPhase}
        dashArray={lineDashPattern}
        interactive={tappable}
        click={onPress}
      />
    );
  }
}
