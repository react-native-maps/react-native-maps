import React from 'react';
import { View, Animated, PanResponder } from 'react-native';
import PropTypes from 'prop-types';
import {
  compose,
  defaultProps,
  setPropTypes,
  withHandlers,
  withPropsOnChange,
  withState,
} from 'recompose';
import momentumCenter from './momentumCenter';
import velocityAtBounds from './velocityAtBounds';

const ModePropType = PropTypes.oneOf(['decay', 'snap', 'spring-origin']);
const OvershootPropType = PropTypes.oneOf(['spring', 'clamp']);
const AnimatedPropType = PropTypes.any;

const handleResponderGrant = (anim, mode) => {
  switch (mode) {
    case 'spring-origin':
      anim.setValue(0);
      break;
    case 'snap':
    case 'decay':
      anim.setOffset(anim._value + anim._offset);
      anim.setValue(0);
      break;
  }
};

const handleResponderMove = (
  anim,
  delta,
  min,
  max,
  overshoot,
  overshootReductionFactor
) => {
  let val = anim._offset + delta;
  if (val > max) {
    switch (overshoot) {
      case 'spring':
        val = max + (val - max) / overshootReductionFactor;
        break;
      case 'clamp':
        val = max;
        break;
    }
  }
  if (val < min) {
    switch (overshoot) {
      case 'spring':
        val = min - (min - val) / overshootReductionFactor;
        break;
      case 'clamp':
        val = min;
        break;
    }
  }
  val = val - anim._offset;
  anim.setValue(val);
};

const handleSnappedScroll = (
  anim,
  min,
  max,
  velocity,
  spacing,
  deceleration
) => {
  let endX = momentumCenter(anim._value, velocity, spacing, deceleration);
  endX = Math.max(endX, min);
  endX = Math.min(endX, max);
  const bounds = [endX - spacing / 2, endX + spacing / 2];
  const endV = velocityAtBounds(anim._value, velocity, bounds, deceleration);
  const listener = anim.addListener(({ value }) => {
    if (value > bounds[0] && value < bounds[1]) {
      Animated.spring(anim, {
        toValue: endX,
        velocity: endV,
      }).start();
    }
  });
  Animated.decay(anim, {
    deceleration,
    velocity,
  }).start(() => {
    anim.removeListener(listener);
  });
};

const handleMomentumScroll = (
  anim,
  min,
  max,
  velocity,
  overshoot,
  deceleration,
  onOvershoot,
  overshootSpringConfig
) => {
  const listener = anim.addListener(({ value }) => {
    if (value < min) {
      anim.removeListener(listener);
      if (onOvershoot) {
        onOvershoot(); // TODO: what args should we pass to this
      }
      switch (overshoot) {
        case 'spring':
          Animated.spring(anim, {
            ...overshootSpringConfig,
            toValue: min,
            velocity,
          }).start();
          break;
        case 'clamp':
          anim.setValue(min);
          break;
      }
    } else if (value > max) {
      anim.removeListener(listener);
      if (onOvershoot) {
        onOvershoot(); // TODO: what args should we pass to this
      }
      switch (overshoot) {
        case 'spring':
          Animated.spring(anim, {
            ...overshootSpringConfig,
            toValue: max,
            velocity,
          }).start();
          break;
        case 'clamp':
          anim.setValue(min);
          break;
      }
    }
  });
  Animated.decay(anim, {
    deceleration,
    velocity,
  }).start(() => {
    anim.removeListener(listener);
  });
};

const handleResponderRelease = (
  anim,
  min,
  max,
  velocity,
  overshoot,
  mode,
  snapSpacing,
  deceleration,
  onOvershoot,
  overshootSpringConfig,
  springOriginConfig
) => {
  anim.flattenOffset();

  if (anim._value < min) {
    if (onOvershoot) {
      onOvershoot(); // TODO: what args should we pass to this
    }
    switch (overshoot) {
      case 'spring':
        Animated.spring(anim, {
          ...overshootSpringConfig,
          toValue: min,
          velocity,
        }).start();
        break;
      case 'clamp':
        anim.setValue(min);
        break;
    }
  } else if (anim._value > max) {
    if (onOvershoot) {
      onOvershoot(); // TODO: what args should we pass to this
    }
    switch (overshoot) {
      case 'spring':
        Animated.spring(anim, {
          ...overshootSpringConfig,
          toValue: max,
          velocity,
        }).start();
        break;
      case 'clamp':
        anim.setValue(min);
        break;
    }
  } else {
    switch (mode) {
      case 'snap':
        handleSnappedScroll(
          anim,
          min,
          max,
          velocity,
          snapSpacing,
          deceleration
          // overshoot,
          // deceleration
        );
        break;

      case 'decay':
        handleMomentumScroll(
          anim,
          min,
          max,
          velocity,
          overshoot,
          deceleration,
          onOvershoot,
          overshootSpringConfig
        );
        break;

      case 'spring-origin':
        Animated.spring(anim, {
          ...springOriginConfig,
          toValue: 0,
          velocity,
        }).start();
        break;
    }
  }
};

const enhance = compose(
  setPropTypes({
    // Component Config
    locked: PropTypes.bool,
    lockDirection: PropTypes.bool,
    horizontal: PropTypes.bool,
    vertical: PropTypes.bool,
    overshootX: OvershootPropType,
    overshootY: OvershootPropType,
    xBounds: PropTypes.arrayOf(PropTypes.number),
    yBounds: PropTypes.arrayOf(PropTypes.number),
    xMode: ModePropType,
    yMode: ModePropType,
    snapSpacingX: PropTypes.number, // TODO: also allow an array of values?
    snapSpacingY: PropTypes.number,

    // Animated Values
    panX: AnimatedPropType,
    panY: AnimatedPropType,

    // Animation Config
    overshootSpringConfig: PropTypes.any,
    momentumDecayConfig: PropTypes.any,
    springOriginConfig: PropTypes.any,
    directionLockDistance: PropTypes.number,
    overshootReductionFactor: PropTypes.number,

    // Events
    onOvershoot: PropTypes.func,
    onDirectionChange: PropTypes.func,
    onReleaseX: PropTypes.func,
    onReleaseY: PropTypes.func,
    onRelease: PropTypes.func,
  }),
  defaultProps({
    locked: false,
    horizontal: false,
    vertical: false,
    lockDirection: true,
    overshootX: 'spring',
    overshootY: 'spring',
    xBounds: [-Infinity, Infinity],
    yBounds: [-Infinity, Infinity],
    yMode: 'decay',
    xMode: 'decay',
    overshootSpringConfig: { friction: 7, tension: 40 },
    momentumDecayConfig: { deceleration: 0.993 },
    springOriginConfig: { friction: 7, tension: 40 },
    overshootReductionFactor: 3,
    directionLockDistance: 10,
  }),
  withPropsOnChange(
    () => false,
    ({ panX, panY }) => ({
      panX: panX || new Animated.Value(0),
      panY: panY || new Animated.Value(0),
    })
  ),
  withState('direction', 'setDirection', null),
  withHandlers({
    onStartShouldSetPanResponder: ({ locked }) => () => !locked,
    onMoveShouldSetPanResponder: () => () => false,
    onMoveShouldSetPanResponderCapture: () => () => false,
    onMoveShouldSetResponderCapture: () => () => false,
    onPanResponderTerminationRequest: () => () => true,
    onPanResponderEnd: () => () => true,
    onPanResponderGrant: ({
      horizontal,
      panX,
      panY,
      setDirection,
      vertical,
      xMode,
      yMode,
    }) => () => {
      handleResponderGrant(panX, xMode);
      handleResponderGrant(panY, yMode);
      setDirection(
        horizontal && !vertical ? 'x' : vertical && !horizontal ? 'y' : null
      );
    },
    onPanResponderMove: ({
      direction,
      panX,
      panY,
      xBounds,
      yBounds,
      overshootX,
      overshootY,
      horizontal,
      vertical,
      lockDirection,
      directionLockDistance,
      overshootReductionFactor,
      onDirectionChange,
      setDirection,
    }) => (_, { dx, dy, x0, y0 }) => {
      if (!direction) {
        const dx2 = dx * dx;
        const dy2 = dy * dy;
        if (dx2 + dy2 > directionLockDistance) {
          const _direction = dx2 > dy2 ? 'x' : 'y';
          setDirection(_direction);
          if (onDirectionChange) {
            onDirectionChange(_direction, { dx, dy, x0, y0 });
          }
        }
      }

      if (horizontal && (!lockDirection || direction === 'x')) {
        const [xMin, xMax] = xBounds;
        handleResponderMove(
          panX,
          dx,
          xMin,
          xMax,
          overshootX,
          overshootReductionFactor
        );
      }

      if (vertical && (!lockDirection || direction === 'y')) {
        const [yMin, yMax] = yBounds;
        handleResponderMove(
          panY,
          dy,
          yMin,
          yMax,
          overshootY,
          overshootReductionFactor
        );
      }
    },
    onPanResponderRelease: ({
      direction,
      panX,
      panY,
      xBounds,
      yBounds,
      overshootX,
      overshootY,
      horizontal,
      vertical,
      lockDirection,
      xMode,
      yMode,
      snapSpacingX,
      snapSpacingY,
      onRelease,
      onReleaseX,
      onReleaseY,
      onOvershoot,
      overshootSpringConfig,
      springOriginConfig,
      momentumDecayConfig,
      setDirection,
    }) => (_, { vx, vy, dx, dy }) => {
      let cancel = false;

      if (onRelease) {
        cancel = false === onRelease({ vx, vy, dx, dy });
      }

      if (!cancel && horizontal && (!lockDirection || direction === 'x')) {
        const [xMin, xMax] = xBounds;
        if (onReleaseX) {
          cancel = false === onReleaseX({ vx, vy, dx, dy });
        }
        !cancel &&
          handleResponderRelease(
            panX,
            xMin,
            xMax,
            vx,
            overshootX,
            xMode,
            snapSpacingX,
            momentumDecayConfig.deceleration,
            onOvershoot,
            overshootSpringConfig,
            springOriginConfig
          );
      }

      if (!cancel && vertical && (!lockDirection || direction === 'y')) {
        const [yMin, yMax] = yBounds;
        if (onReleaseY) {
          cancel = false === onReleaseY({ vx, vy, dx, dy });
        }
        !cancel &&
          handleResponderRelease(
            panY,
            yMin,
            yMax,
            vy,
            overshootY,
            yMode,
            snapSpacingY,
            momentumDecayConfig.deceleration,
            onOvershoot,
            overshootSpringConfig,
            springOriginConfig
          );
      }

      setDirection(
        horizontal && !vertical ? 'x' : vertical && !horizontal ? 'y' : null
      );
      return cancel;
    },
  }),
  withPropsOnChange(
    [
      'onDirectionChange',
      'onMoveShouldSetPanResponder',
      'onMoveShouldSetResponderCapture',
      'onMoveShouldSetPanResponderCapture',
      'onPanResponderEnd',
      'onPanResponderGrant',
      'onPanResponderMove',
      'onPanResponderRelease',
      'onPanResponderTerminationRequest',
      'onStartShouldSetPanResponder',
    ],
    ({
      onMoveShouldSetPanResponder,
      onMoveShouldSetPanResponderCapture,
      onMoveShouldSetResponderCapture,
      onPanResponderEnd,
      onPanResponderGrant,
      onPanResponderMove,
      onPanResponderRelease,
      onPanResponderTerminationRequest,
      onStartShouldSetPanResponder,
    }) => ({
      responder: PanResponder.create({
        onMoveShouldSetPanResponder,
        onMoveShouldSetPanResponderCapture,
        onMoveShouldSetResponderCapture,
        onPanResponderEnd,
        onPanResponderGrant,
        onPanResponderMove,
        onPanResponderRelease,
        onPanResponderTerminationRequest,
        onStartShouldSetPanResponder,
      }),
    })
  )
);

const PanController = enhance(({ children, style, responder }) => (
  <View
    children={children}
    style={style}
    removeClippedSubviews={true}
    {...responder.panHandlers}
  />
));

export default PanController;
