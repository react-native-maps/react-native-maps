function transformMouseEvents({
  onPress,
  onDoubleTap,
  onPressIn,
  onPressOut,
  onHover,
  onMouseOut,
  onMouseMove,
  onContextMenu,
  onPreClick,
}) {
  return {
    onclick: transformMouseEvent(onPress),
    ondblclick: transformMouseEvent(onDoubleTap),
    onmousedown: transformMouseEvent(onPressIn),
    onmouseup: transformMouseEvent(onPressOut),
    onmouseover: transformMouseEvent(onHover),
    onmouseout: transformMouseEvent(onMouseOut),
    onmousemove: transformMouseEvent(onMouseMove),
    oncontextmenu: transformMouseEvent(onContextMenu),
    onpreclick: transformMouseEvent(onPreClick),
  };
}

export function transformMapEvents({
  onPress,
  onDoubleTap,
  onPressIn,
  onPressOut,
  onHover,
  onMouseOut,
  onMouseMove,
  onContextMenu,
  onFocus,
  onBlur,
  onPreClick,
  onLoad,
  onUnload,
  onViewReset,
  onMove,
  onMoveStart,
  onMoveEnd,
  onDragStart,
  onDrag,
  onDragEnd,
  onZoomStart,
  onZoomEnd,
  onZoomLevelsChange,
  onResize,
  onAutoPanStart,
  onOverlayAdd,
  onOverlayRemove,
  onBaseLayerChange,
  onLayerAdd,
  onLayerRemove,
  onLocationFound,
  onLocationError,
  onCalloutOpen,
  onCalloutClose,
}) {
  return {
    onclick: transformMouseEvent(onPress),
    ondblclick: transformMouseEvent(onDoubleTap),
    onmousedown: transformMouseEvent(onPressIn),
    onmouseup: transformMouseEvent(onPressOut),
    onmouseover: transformMouseEvent(onHover),
    onmouseout: transformMouseEvent(onMouseOut),
    onmousemove: transformMouseEvent(onMouseMove),
    oncontextmenu: transformMouseEvent(onContextMenu),
    onfocus: transformEvent(onFocus),
    onblur: transformEvent(onBlur),
    onpreclick: transformMouseEvent(onPreClick),
    onload: transformEvent(onLoad),
    onunload: transformEvent(onUnload),
    onviewreset: transformEvent(onViewReset),
    onmove: transformEvent(onMove),
    onmovestart: transformEvent(onMoveStart),
    onmoveend: transformEvent(onMoveEnd),
    ondragstart: transformEvent(onDragStart),
    ondrag: transformEvent(onDrag),
    ondragend: transformEvent(onDragEnd),
    onzoomstart: transformEvent(onZoomStart),
    onzoomend: transformEvent(onZoomEnd),
    onzoomlevelschange: transformEvent(onZoomLevelsChange),
    onresize: transformEvent(onResize),
    onautopanstart: transformEvent(onAutoPanStart),
    onoverlayadd: transformEvent(onOverlayAdd),
    onoverlayremove: transformEvent(onOverlayRemove),
    onbaselayerchange: transformEvent(onBaseLayerChange),
    onlayeradd: transformEvent(onLayerAdd),
    onlayerremove: transformEvent(onLayerRemove),
    onlocationfound: transformEvent(onLocationFound),
    onlocationerror: transformEvent(onLocationError),
    onpopupopen: transformEvent(onCalloutOpen),
    onpopupclose: transformEvent(onCalloutClose),
  };
}

export function transformTileLayerEvents({
  onLoading,
  onLoad,
  onTileLoadStart,
  onTileLoad,
  onTileUnload,
  onTileError,
}) {
  return {
    // Tile Layer Events
    onloading: transformEvent(onLoading),
    onload: transformEvent(onLoad),
    ontileloadstart: transformEvent(onTileLoadStart),
    ontileload: transformEvent(onTileLoad),
    ontileunload: transformEvent(onTileUnload),
    ontileerror: transformEvent(onTileError),
  };
}

export function transformLayersControlEvents({ onBaseLayerChange, onOverlayAdd, onOverlayRemove }) {
  return {
    // Layers Control Events
    onbaselayerchange: transformEvent(onBaseLayerChange),
    onoverlayadd: transformEvent(onOverlayAdd),
    onoverlayremove: transformEvent(onOverlayRemove),
  };
}

export function transformPathEvents({
  onPress,
  onDoubleTap,
  onPressIn,
  onHover,
  onMouseOut,
  onContextMenu,
  onAdd,
  onRemove,
  onCalloutOpen,
  onCalloutClose,
  onLayerAdd,
  onLayerRemove,
  onDragStart,
  onDrag,
  onDragEnd,
  onMove,
  ...props
}) {
  return {
    // Marker Events
    ondragstart: transformEvent(onDragStart),
    ondrag: transformEvent(onDrag),
    ondragend: transformEvent(onDragEnd),
    onmove: transformEvent(onMove),

    // Path Events
    onclick: transformMouseEvent(onPress),
    ondblclick: transformMouseEvent(onDoubleTap),
    onmousedown: transformMouseEvent(onPressIn),
    onmouseover: transformMouseEvent(onHover),
    onmouseout: transformMouseEvent(onMouseOut),
    oncontextmenu: transformMouseEvent(onContextMenu),
    onadd: transformEvent(onAdd),
    onremove: transformEvent(onRemove),
    onpopupopen: transformEvent(onCalloutOpen),
    onpopupclose: transformEvent(onCalloutClose),
    // Layer Events
    onlayeradd: transformEvent(onLayerAdd),
    onlayerremove: transformEvent(onLayerRemove),

    ...transformTileLayerEvents(props),
    ...transformLayersControlEvents(props),
  };
}

export function transformEvent(onEvent) {
  if (onEvent)
    return nativeEvent => {
      return onEvent({ nativeEvent });
    };
}

function transformMouseEvent(onEvent) {
  if (onEvent)
    return ({ latlng, ...nativeEvent }) => {
      return onEvent({
        nativeEvent: {
          ...nativeEvent,
          coordinate: {
            latitude: latlng.lat,
            longitude: latlng.lng,
          },
        },
      });
    };
}
