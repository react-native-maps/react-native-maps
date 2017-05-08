package com.airbnb.android.react.maps;

import android.view.View;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.GoogleMapOptions;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;
import com.google.android.gms.maps.model.MapStyleOptions;

import java.util.Map;

import javax.annotation.Nullable;

public class AirMapManager extends ViewGroupManager<AirMapView> {
  private static final String REACT_CLASS = "AIRMap";
  private static final int ANIMATE_TO_REGION = 1;
  private static final int ANIMATE_TO_COORDINATE = 2;
  private static final int FIT_TO_ELEMENTS = 3;
  private static final int FIT_TO_SUPPLIED_MARKERS = 4;
  private static final int FIT_TO_COORDINATES = 5;

  private final Map<String, Integer> MAP_TYPES = MapBuilder.of(
      "standard", GoogleMap.MAP_TYPE_NORMAL,
      "satellite", GoogleMap.MAP_TYPE_SATELLITE,
      "hybrid", GoogleMap.MAP_TYPE_HYBRID,
      "terrain", GoogleMap.MAP_TYPE_TERRAIN,
      "none", GoogleMap.MAP_TYPE_NONE
  );

  GoogleMapOptions googleMapOptions;

  public AirMapManager() {
    this.googleMapOptions = new GoogleMapOptions();
  }

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  protected AirMapView createViewInstance(ThemedReactContext context) {
    return new AirMapView(context, this, googleMapOptions);
  }

  @SuppressWarnings("unused")
  @ReactProp(name = "region")
  public void setRegion(AirMapView view, ReadableMap region) {
    view.setRegion(region);
  }

  @SuppressWarnings("unused")
  @ReactProp(name = "mapType")
  public void setMapType(AirMapView view, @Nullable String mapType) {
    int typeId = MAP_TYPES.get(mapType);
    view.googleMap.setMapType(typeId);
  }

  @SuppressWarnings("unused")
  @ReactProp(name = "customMapStyleString")
  public void setMapStyle(AirMapView view, @Nullable String customMapStyleString) {
    view.googleMap.setMapStyle(new MapStyleOptions(customMapStyleString));
  }

  @SuppressWarnings("unused")
  @ReactProp(name = "showsUserLocation")
  public void setShowsUserLocation(AirMapView view, boolean showUserLocation) {
    view.setShowsUserLocation(showUserLocation);
  }

  @SuppressWarnings("unused")
  @ReactProp(name = "showsMyLocationButton", defaultBoolean = true)
  public void setShowsMyLocationButton(AirMapView view, boolean showMyLocationButton) {
    view.setShowsMyLocationButton(showMyLocationButton);
  }

  @SuppressWarnings("unused")
  @ReactProp(name = "toolbarEnabled", defaultBoolean = true)
  public void setToolbarEnabled(AirMapView view, boolean toolbarEnabled) {
    view.setToolbarEnabled(toolbarEnabled);
  }

  // This is a private prop to improve performance of panDrag by disabling it when the callback 
  // is not set
  @SuppressWarnings("unused")
  @ReactProp(name = "handlePanDrag")
  public void setHandlePanDrag(AirMapView view, boolean handlePanDrag) {
    view.setHandlePanDrag(handlePanDrag);
  }

  @SuppressWarnings("unused")
  @ReactProp(name = "showsTraffic")
  public void setShowTraffic(AirMapView view, boolean showTraffic) {
    view.googleMap.setTrafficEnabled(showTraffic);
  }

  @SuppressWarnings("unused")
  @ReactProp(name = "showsBuildings")
  public void setShowBuildings(AirMapView view, boolean showBuildings) {
    view.googleMap.setBuildingsEnabled(showBuildings);
  }

  @SuppressWarnings("unused")
  @ReactProp(name = "showsIndoors")
  public void setShowIndoors(AirMapView view, boolean showIndoors) {
    view.googleMap.setIndoorEnabled(showIndoors);
  }

  @SuppressWarnings("unused")
  @ReactProp(name = "showsIndoorLevelPicker")
  public void setShowsIndoorLevelPicker(AirMapView view, boolean showsIndoorLevelPicker) {
    view.googleMap.getUiSettings().setIndoorLevelPickerEnabled(showsIndoorLevelPicker);
  }

  @SuppressWarnings("unused")
  @ReactProp(name = "showsCompass")
  public void setShowsCompass(AirMapView view, boolean showsCompass) {
    view.googleMap.getUiSettings().setCompassEnabled(showsCompass);
  }

  @SuppressWarnings("unused")
  @ReactProp(name = "scrollEnabled")
  public void setScrollEnabled(AirMapView view, boolean scrollEnabled) {
    view.googleMap.getUiSettings().setScrollGesturesEnabled(scrollEnabled);
  }

  @SuppressWarnings("unused")
  @ReactProp(name = "zoomEnabled")
  public void setZoomEnabled(AirMapView view, boolean zoomEnabled) {
    view.googleMap.getUiSettings().setZoomGesturesEnabled(zoomEnabled);
  }

  @SuppressWarnings("unused")
  @ReactProp(name = "rotateEnabled")
  public void setRotateEnabled(AirMapView view, boolean rotateEnabled) {
    view.googleMap.getUiSettings().setRotateGesturesEnabled(rotateEnabled);
  }

  @SuppressWarnings("unused")
  @ReactProp(name = "cacheEnabled")
  public void setCacheEnabled(AirMapView view, boolean cacheEnabled) {
    view.setCacheEnabled(cacheEnabled);
  }

  @SuppressWarnings("unused")
  @ReactProp(name = "loadingEnabled")
  public void setLoadingEnabled(AirMapView view, boolean loadingEnabled) {
    view.enableMapLoading(loadingEnabled);
  }

  @SuppressWarnings("unused")
  @ReactProp(name = "moveOnMarkerPress", defaultBoolean = true)
  public void setMoveOnMarkerPress(AirMapView view, boolean moveOnPress) {
    view.setMoveOnMarkerPress(moveOnPress);
  }

  @SuppressWarnings("unused")
  @ReactProp(name = "loadingBackgroundColor", customType = "Color")
  public void setLoadingBackgroundColor(AirMapView view, @Nullable Integer loadingBackgroundColor) {
    view.setLoadingBackgroundColor(loadingBackgroundColor);
  }

  @SuppressWarnings("unused")
  @ReactProp(name = "loadingIndicatorColor", customType = "Color")
  public void setLoadingIndicatorColor(AirMapView view, @Nullable Integer loadingIndicatorColor) {
    view.setLoadingIndicatorColor(loadingIndicatorColor);
  }

  @SuppressWarnings("unused")
  @ReactProp(name = "pitchEnabled")
  public void setPitchEnabled(AirMapView view, boolean pitchEnabled) {
    view.googleMap.getUiSettings().setTiltGesturesEnabled(pitchEnabled);
  }

  @Override
  public void receiveCommand(AirMapView view, int commandId, @Nullable ReadableArray args) {
    Integer duration;
    Double lat;
    Double lng;
    Double lngDelta;
    Double latDelta;
    ReadableMap region;

    switch (commandId) {
      case ANIMATE_TO_REGION:
        region = args.getMap(0);
        duration = args.getInt(1);
        lng = region.getDouble("longitude");
        lat = region.getDouble("latitude");
        lngDelta = region.getDouble("longitudeDelta");
        latDelta = region.getDouble("latitudeDelta");
        LatLngBounds bounds = new LatLngBounds(
            new LatLng(lat - latDelta / 2, lng - lngDelta / 2), // southwest
            new LatLng(lat + latDelta / 2, lng + lngDelta / 2)  // northeast
        );
        view.animateToRegion(bounds, duration);
        break;

      case ANIMATE_TO_COORDINATE:
        region = args.getMap(0);
        duration = args.getInt(1);
        lng = region.getDouble("longitude");
        lat = region.getDouble("latitude");
        view.animateToCoordinate(new LatLng(lat, lng), duration);
        break;

      case FIT_TO_ELEMENTS:
        view.fitToElements(args.getBoolean(0));
        break;

      case FIT_TO_SUPPLIED_MARKERS:
        view.fitToSuppliedMarkers(args.getArray(0), args.getBoolean(1));
        break;
      case FIT_TO_COORDINATES:
        view.fitToCoordinates(args.getArray(0), args.getMap(1), args.getBoolean(2));
        break;
    }
  }

  @Override
  @Nullable
  public Map getExportedCustomDirectEventTypeConstants() {
    Map<String, Map<String, String>> map = MapBuilder.of(
        "onMapReady", MapBuilder.of("registrationName", "onMapReady"),
        "onPress", MapBuilder.of("registrationName", "onPress"),
        "onLongPress", MapBuilder.of("registrationName", "onLongPress"),
        "onMarkerPress", MapBuilder.of("registrationName", "onMarkerPress"),
        "onMarkerSelect", MapBuilder.of("registrationName", "onMarkerSelect"),
        "onMarkerDeselect", MapBuilder.of("registrationName", "onMarkerDeselect"),
        "onCalloutPress", MapBuilder.of("registrationName", "onCalloutPress")
    );

    map.putAll(MapBuilder.of(
        "onMarkerDragStart", MapBuilder.of("registrationName", "onMarkerDragStart"),
        "onMarkerDrag", MapBuilder.of("registrationName", "onMarkerDrag"),
        "onMarkerDragEnd", MapBuilder.of("registrationName", "onMarkerDragEnd"),
        "onPanDrag", MapBuilder.of("registrationName", "onPanDrag")
    ));

    return map;
  }

  @Override
  @Nullable
  public Map<String, Integer> getCommandsMap() {
    return MapBuilder.of(
        "animateToRegion", ANIMATE_TO_REGION,
        "animateToCoordinate", ANIMATE_TO_COORDINATE,
        "fitToElements", FIT_TO_ELEMENTS,
        "fitToSuppliedMarkers", FIT_TO_SUPPLIED_MARKERS,
        "fitToCoordinates", FIT_TO_COORDINATES
    );
  }

  @Override public LayoutShadowNode createShadowNodeInstance() {
    // A custom shadow node is needed in order to pass back the width/height of the googleMap to the
    // view manager so that it can start applying camera moves with bounds.
    return new SizeReportingShadowNode();
  }

  @Override public void addView(AirMapView parent, View child, int index) {
    parent.addFeature(child, index);
  }

  @Override public int getChildCount(AirMapView view) {
    return view.getFeatureCount();
  }

  @Override public View getChildAt(AirMapView view, int index) {
    return view.getFeatureAt(index);
  }

  @Override public void removeViewAt(AirMapView parent, int index) {
    parent.removeFeatureAt(index);
  }

  @Override public void updateExtraData(AirMapView view, Object extraData) {
    view.updateExtraData(extraData);
  }

  void pushEvent(ThemedReactContext context, View view, String name, WritableMap data) {
    context.getJSModule(RCTEventEmitter.class)
        .receiveEvent(view.getId(), name, data);
  }
}
