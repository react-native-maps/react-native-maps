package com.airbnb.android.react.maps;

import android.annotation.SuppressLint;
import android.content.pm.PackageManager;
import android.content.res.ColorStateList;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.Point;
import android.graphics.PorterDuff;
import android.os.Build;
import android.os.Handler;
import android.support.annotation.Nullable;
import android.support.v4.view.GestureDetectorCompat;
import android.support.v4.view.MotionEventCompat;
import android.view.GestureDetector;
import android.view.MotionEvent;
import android.view.ScaleGestureDetector;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.GoogleMapOptions;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.Projection;
import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.Polygon;
import com.google.android.gms.maps.model.Polyline;
import com.google.android.gms.maps.model.VisibleRegion;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static android.support.v4.content.PermissionChecker.checkSelfPermission;

public class AirMapView extends FrameLayout implements GoogleMap.InfoWindowAdapter,
    GoogleMap.OnMarkerDragListener, OnMapReadyCallback {
  private static final String[] PERMISSIONS = new String[] {
      "android.permission.ACCESS_FINE_LOCATION", "android.permission.ACCESS_COARSE_LOCATION" };

  private ProgressBar mapLoadingProgressBar;
  private RelativeLayout mapLoadingLayout;
  private ImageView cacheImageView;
  @Nullable GoogleMap googleMap;
  @Nullable private Integer loadingBackgroundColor;
  @Nullable private Integer loadingIndicatorColor;

  private LatLngBounds boundsToMove;
  private boolean isMapLoaded;
  private boolean showUserLocation;
  private boolean isMonitoringRegion;
  private boolean isTouchDown;
  private boolean handlePanDrag;
  private boolean moveOnMarkerPress = true;
  private boolean cacheEnabled;
  private boolean isDestroyed;
  private boolean isPaused;

  private final MapView mapView;
  private final int baseMapPadding = 50;
  private final List<AirMapFeature> features = new ArrayList<>();
  private final Map<Marker, AirMapMarker> markerMap = new HashMap<>();
  private final Map<Polyline, AirMapPolyline> polylineMap = new HashMap<>();
  private final Map<Polygon, AirMapPolygon> polygonMap = new HashMap<>();
  private final ScaleGestureDetector scaleDetector;
  private final GestureDetectorCompat gestureDetector;
  private final AirMapManager manager;
  private LifecycleEventListener lifecycleListener;
  private final ThemedReactContext context;
  private final EventDispatcher eventDispatcher;

  AirMapView(ThemedReactContext reactContext, AirMapManager manager,
      GoogleMapOptions googleMapOptions) {
    super(reactContext);
    this.manager = manager;
    this.context = reactContext;

    mapView = new MapView(reactContext, googleMapOptions);
    mapView.setLayoutParams(new FrameLayout.LayoutParams(
        LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT));
    addView(mapView);
    mapView.onCreate(null);
    mapView.getMapAsync(this);

    scaleDetector =
        new ScaleGestureDetector(reactContext,
            new ScaleGestureDetector.SimpleOnScaleGestureListener() {
              @Override public boolean onScaleBegin(ScaleGestureDetector detector) {
                startMonitoringRegion();
                return true; // stop recording this gesture. let mapview handle it.
              }
            });

    gestureDetector =
        new GestureDetectorCompat(reactContext, new GestureDetector.SimpleOnGestureListener() {
          @Override public boolean onDoubleTap(MotionEvent e) {
            startMonitoringRegion();
            return false;
          }

          @Override public boolean onScroll(MotionEvent e1, MotionEvent e2, float distanceX,
              float distanceY) {
            if (handlePanDrag) {
              onPanDrag(e2);
            }
            startMonitoringRegion();
            return false;
          }
        });

    addOnLayoutChangeListener(new View.OnLayoutChangeListener() {
      @Override public void onLayoutChange(View v, int left, int top, int right, int bottom,
          int oldLeft, int oldTop, int oldRight, int oldBottom) {
        if (!isPaused) {
          cacheView();
        }
      }
    });

    eventDispatcher = reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
  }

  @Override protected void onDetachedFromWindow() {
    super.onDetachedFromWindow();
    context.removeLifecycleEventListener(lifecycleListener);
    isDestroyed = true;
    mapView.onDestroy();
  }

  @Override
  public void onMapReady(final GoogleMap googleMap) {
    if (isDestroyed) {
      return;
    }
    this.googleMap = googleMap;
    this.googleMap.setInfoWindowAdapter(this);
    this.googleMap.setOnMarkerDragListener(this);

    manager.pushEvent(context, this, "onMapReady", new WritableNativeMap());

    final AirMapView view = this;

    googleMap.setOnMarkerClickListener(new GoogleMap.OnMarkerClickListener() {
      @Override
      public boolean onMarkerClick(Marker marker) {
        WritableMap event;
        AirMapMarker airMapMarker = markerMap.get(marker);

        event = makeClickEventData(marker.getPosition());
        event.putString("action", "marker-press");
        event.putString("id", airMapMarker.getIdentifier());
        manager.pushEvent(context, view, "onMarkerPress", event);

        event = makeClickEventData(marker.getPosition());
        event.putString("action", "marker-press");
        event.putString("id", airMapMarker.getIdentifier());
        manager.pushEvent(context, markerMap.get(marker), "onPress", event);

        // Return false to open the callout info window and center on the marker
        // https://developers.google.com/android/reference/com/google/android/gms/maps/GoogleMap
        // .OnMarkerClickListener
        if (view.moveOnMarkerPress) {
          return false;
        } else {
          marker.showInfoWindow();
          return true;
        }
      }
    });

    googleMap.setOnPolygonClickListener(new GoogleMap.OnPolygonClickListener() {
      @Override
      public void onPolygonClick(Polygon polygon) {
        WritableMap event = makeClickEventData(polygon.getPoints().get(0));
        event.putString("action", "polygon-press");
        manager.pushEvent(context, polygonMap.get(polygon), "onPress", event);
      }
    });

    googleMap.setOnPolylineClickListener(new GoogleMap.OnPolylineClickListener() {
      @Override
      public void onPolylineClick(Polyline polyline) {
        WritableMap event = makeClickEventData(polyline.getPoints().get(0));
        event.putString("action", "polyline-press");
        manager.pushEvent(context, polylineMap.get(polyline), "onPress", event);
      }
    });

    googleMap.setOnInfoWindowClickListener(new GoogleMap.OnInfoWindowClickListener() {
      @Override
      public void onInfoWindowClick(Marker marker) {
        WritableMap event;

        event = makeClickEventData(marker.getPosition());
        event.putString("action", "callout-press");
        manager.pushEvent(context, view, "onCalloutPress", event);

        event = makeClickEventData(marker.getPosition());
        event.putString("action", "callout-press");
        AirMapMarker markerView = markerMap.get(marker);
        manager.pushEvent(context, markerView, "onCalloutPress", event);

        event = makeClickEventData(marker.getPosition());
        event.putString("action", "callout-press");
        AirMapCallout infoWindow = markerView.getCalloutView();
        if (infoWindow != null) manager.pushEvent(context, infoWindow, "onPress", event);
      }
    });

    googleMap.setOnMapClickListener(new GoogleMap.OnMapClickListener() {
      @Override
      public void onMapClick(LatLng point) {
        WritableMap event = makeClickEventData(point);
        event.putString("action", "press");
        manager.pushEvent(context, view, "onPress", event);
      }
    });

    googleMap.setOnMapLongClickListener(new GoogleMap.OnMapLongClickListener() {
      @Override
      public void onMapLongClick(LatLng point) {
        WritableMap event = makeClickEventData(point);
        event.putString("action", "long-press");
        manager.pushEvent(context, view, "onLongPress", makeClickEventData(point));
      }
    });

    googleMap.setOnCameraChangeListener(new GoogleMap.OnCameraChangeListener() {
      @Override
      public void onCameraChange(CameraPosition position) {
        LatLngBounds bounds = googleMap.getProjection().getVisibleRegion().latLngBounds;
        LatLng center = position.target;
        lastBoundsEmitted = bounds;
        eventDispatcher.dispatchEvent(new RegionChangeEvent(getId(), bounds, center, isTouchDown));
        view.stopMonitoringRegion();
      }
    });

    googleMap.setOnMapLoadedCallback(new GoogleMap.OnMapLoadedCallback() {
      @Override public void onMapLoaded() {
        isMapLoaded = true;
        AirMapView.this.cacheView();
      }
    });

    // We need to be sure to disable location-tracking when app enters background, in-case some
    // other module
    // has acquired a wake-lock and is controlling location-updates, otherwise, location-manager
    // will be left
    // updating location constantly, killing the battery, even though some other location-mgmt
    // module may
    // desire to shut-down location-services.
    lifecycleListener = new LifecycleEventListener() {
      @SuppressLint("MissingPermission")
      @Override
      public void onHostResume() {
        if (hasPermissions()) {
          googleMap.setMyLocationEnabled(showUserLocation);
        }
        mapView.onResume();
        isPaused = false;
      }

      @SuppressLint("MissingPermission")
      @Override
      public void onHostPause() {
        if (hasPermissions()) {
          googleMap.setMyLocationEnabled(false);
        }
        mapView.onPause();
        isPaused = true;
      }

      @Override
      public void onHostDestroy() {
      }
    };

    context.addLifecycleEventListener(lifecycleListener);
  }

  private boolean hasPermissions() {
    return checkSelfPermission(getContext(), PERMISSIONS[0]) == PackageManager.PERMISSION_GRANTED ||
        checkSelfPermission(getContext(), PERMISSIONS[1]) == PackageManager.PERMISSION_GRANTED;
  }

  public void setRegion(ReadableMap region) {
    if (region == null) return;

    Double lng = region.getDouble("longitude");
    Double lat = region.getDouble("latitude");
    Double lngDelta = region.getDouble("longitudeDelta");
    Double latDelta = region.getDouble("latitudeDelta");
    LatLngBounds bounds = new LatLngBounds(
        new LatLng(lat - latDelta / 2, lng - lngDelta / 2), // southwest
        new LatLng(lat + latDelta / 2, lng + lngDelta / 2)  // northeast
    );
    if (super.getHeight() <= 0 || super.getWidth() <= 0) {
      // in this case, our googleMap has not been laid out yet, so we save the bounds in a local
      // variable, and make a guess of zoomLevel 10. Not to worry, though: as soon as layout
      // occurs, we will move the camera to the saved bounds. Note that if we tried to move
      // to the bounds now, it would trigger an exception.
      googleMap.moveCamera(CameraUpdateFactory.newLatLngZoom(new LatLng(lat, lng), 10));
      boundsToMove = bounds;
    } else {
      googleMap.moveCamera(CameraUpdateFactory.newLatLngBounds(bounds, 0));
      boundsToMove = null;
    }
  }

  @SuppressLint("MissingPermission")
  public void setShowsUserLocation(boolean showUserLocation) {
    this.showUserLocation = showUserLocation; // hold onto this for lifecycle handling
    if (hasPermissions()) {
      googleMap.setMyLocationEnabled(showUserLocation);
    }
  }

  public void setShowsMyLocationButton(boolean showMyLocationButton) {
    if (hasPermissions()) {
      googleMap.getUiSettings().setMyLocationButtonEnabled(showMyLocationButton);
    }
  }

  public void setToolbarEnabled(boolean toolbarEnabled) {
    if (hasPermissions()) {
      googleMap.getUiSettings().setMapToolbarEnabled(toolbarEnabled);
    }
  }

  public void setCacheEnabled(boolean cacheEnabled) {
    this.cacheEnabled = cacheEnabled;
    cacheView();
  }

  public void enableMapLoading(boolean loadingEnabled) {
    if (loadingEnabled && !isMapLoaded) {
      getMapLoadingLayoutView().setVisibility(View.VISIBLE);
    }
  }

  public void setMoveOnMarkerPress(boolean moveOnPress) {
    moveOnMarkerPress = moveOnPress;
  }

  public void setLoadingBackgroundColor(Integer loadingBackgroundColor) {
    this.loadingBackgroundColor = loadingBackgroundColor;

    if (mapLoadingLayout != null) {
      if (loadingBackgroundColor == null) {
        mapLoadingLayout.setBackgroundColor(Color.WHITE);
      } else {
        mapLoadingLayout.setBackgroundColor(loadingBackgroundColor);
      }
    }
  }

  public void setLoadingIndicatorColor(Integer loadingIndicatorColor) {
    this.loadingIndicatorColor = loadingIndicatorColor;
    if (mapLoadingProgressBar != null) {
      Integer color = loadingIndicatorColor;
      if (color == null) {
        color = Color.parseColor("#606060");
      }

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
        ColorStateList progressTintList = ColorStateList.valueOf(loadingIndicatorColor);
        ColorStateList secondaryProgressTintList = ColorStateList.valueOf(loadingIndicatorColor);
        ColorStateList indeterminateTintList = ColorStateList.valueOf(loadingIndicatorColor);

        mapLoadingProgressBar.setProgressTintList(progressTintList);
        mapLoadingProgressBar.setSecondaryProgressTintList(secondaryProgressTintList);
        mapLoadingProgressBar.setIndeterminateTintList(indeterminateTintList);
      } else {
        PorterDuff.Mode mode = PorterDuff.Mode.SRC_IN;
        if (mapLoadingProgressBar.getIndeterminateDrawable() != null)
          mapLoadingProgressBar.getIndeterminateDrawable().setColorFilter(color, mode);
        if (mapLoadingProgressBar.getProgressDrawable() != null)
          mapLoadingProgressBar.getProgressDrawable().setColorFilter(color, mode);
      }
    }
  }

  public void setHandlePanDrag(boolean handlePanDrag) {
    this.handlePanDrag = handlePanDrag;
  }

  public void addFeature(View child, int index) {
    // Our desired API is to pass up annotations/overlays as children to the mapview component.
    // This is where we intercept them and do the appropriate underlying mapview action.
    if (child instanceof AirMapMarker) {
      AirMapMarker annotation = (AirMapMarker) child;
      annotation.addToMap(googleMap);
      features.add(index, annotation);
      Marker marker = (Marker) annotation.getFeature();
      markerMap.put(marker, annotation);
    } else if (child instanceof AirMapPolyline) {
      AirMapPolyline polylineView = (AirMapPolyline) child;
      polylineView.addToMap(googleMap);
      features.add(index, polylineView);
      Polyline polyline = (Polyline) polylineView.getFeature();
      polylineMap.put(polyline, polylineView);
    } else if (child instanceof AirMapPolygon) {
      AirMapPolygon polygonView = (AirMapPolygon) child;
      polygonView.addToMap(googleMap);
      features.add(index, polygonView);
      Polygon polygon = (Polygon) polygonView.getFeature();
      polygonMap.put(polygon, polygonView);
    } else if (child instanceof AirMapCircle) {
      AirMapCircle circleView = (AirMapCircle) child;
      circleView.addToMap(googleMap);
      features.add(index, circleView);
    } else if (child instanceof AirMapUrlTile) {
      AirMapUrlTile urlTileView = (AirMapUrlTile) child;
      urlTileView.addToMap(googleMap);
      features.add(index, urlTileView);
    } else {
      ViewGroup children = (ViewGroup) child;
      for (int i = 0; i < children.getChildCount(); i++) {
        addFeature(children.getChildAt(i), index);
      }
    }
  }

  public int getFeatureCount() {
    return features.size();
  }

  public View getFeatureAt(int index) {
    return features.get(index);
  }

  public void removeFeatureAt(int index) {
    AirMapFeature feature = features.remove(index);
    if (feature instanceof AirMapMarker) {
      markerMap.remove(feature.getFeature());
    }
    feature.removeFromMap(googleMap);
  }

  public WritableMap makeClickEventData(LatLng point) {
    WritableMap event = new WritableNativeMap();

    WritableMap coordinate = new WritableNativeMap();
    coordinate.putDouble("latitude", point.latitude);
    coordinate.putDouble("longitude", point.longitude);
    event.putMap("coordinate", coordinate);

    Projection projection = googleMap.getProjection();
    Point screenPoint = projection.toScreenLocation(point);

    WritableMap position = new WritableNativeMap();
    position.putDouble("x", screenPoint.x);
    position.putDouble("y", screenPoint.y);
    event.putMap("position", position);

    return event;
  }

  public void updateExtraData(Object extraData) {
    // if boundsToMove is not null, we now have the MapView's width/height, so we can apply
    // a proper camera move
    if (boundsToMove != null) {
      HashMap<String, Float> data = (HashMap<String, Float>) extraData;
      float width = data.get("width");
      float height = data.get("height");
      googleMap.moveCamera(
          CameraUpdateFactory.newLatLngBounds(
              boundsToMove,
              (int) width,
              (int) height,
              0
          )
      );
      boundsToMove = null;
    }
  }

  public void animateToRegion(LatLngBounds bounds, int duration) {
    if (googleMap != null) {
      startMonitoringRegion();
      googleMap.animateCamera(CameraUpdateFactory.newLatLngBounds(bounds, 0), duration, null);
    }
  }

  public void animateToCoordinate(LatLng coordinate, int duration) {
    if (googleMap != null) {
      startMonitoringRegion();
      googleMap.animateCamera(CameraUpdateFactory.newLatLng(coordinate), duration, null);
    }
  }

  public void fitToElements(boolean animated) {
    LatLngBounds.Builder builder = new LatLngBounds.Builder();

    boolean addedPosition = false;

    for (AirMapFeature feature : features) {
      if (feature instanceof AirMapMarker) {
        Marker marker = (Marker) feature.getFeature();
        builder.include(marker.getPosition());
        addedPosition = true;
      }
      // TODO(lmr): may want to include shapes / etc.
    }
    if (addedPosition) {
      LatLngBounds bounds = builder.build();
      CameraUpdate cu = CameraUpdateFactory.newLatLngBounds(bounds, baseMapPadding);
      if (animated) {
        startMonitoringRegion();
        googleMap.animateCamera(cu);
      } else {
        googleMap.moveCamera(cu);
      }
    }
  }

  public void fitToSuppliedMarkers(ReadableArray markerIDsArray, boolean animated) {
    LatLngBounds.Builder builder = new LatLngBounds.Builder();

    String[] markerIDs = new String[markerIDsArray.size()];
    for (int i = 0; i < markerIDsArray.size(); i++) {
      markerIDs[i] = markerIDsArray.getString(i);
    }

    boolean addedPosition = false;

    List<String> markerIDList = Arrays.asList(markerIDs);

    for (AirMapFeature feature : features) {
      if (feature instanceof AirMapMarker) {
        String identifier = ((AirMapMarker) feature).getIdentifier();
        Marker marker = (Marker) feature.getFeature();
        if (markerIDList.contains(identifier)) {
          builder.include(marker.getPosition());
          addedPosition = true;
        }
      }
    }

    if (addedPosition) {
      LatLngBounds bounds = builder.build();
      CameraUpdate cu = CameraUpdateFactory.newLatLngBounds(bounds, baseMapPadding);
      if (animated) {
        startMonitoringRegion();
        googleMap.animateCamera(cu);
      } else {
        googleMap.moveCamera(cu);
      }
    }
  }

  public void fitToCoordinates(ReadableArray coordinatesArray, ReadableMap edgePadding,
      boolean animated) {
    LatLngBounds.Builder builder = new LatLngBounds.Builder();

    for (int i = 0; i < coordinatesArray.size(); i++) {
      ReadableMap latLng = coordinatesArray.getMap(i);
      Double lat = latLng.getDouble("latitude");
      Double lng = latLng.getDouble("longitude");
      builder.include(new LatLng(lat, lng));
    }

    LatLngBounds bounds = builder.build();
    CameraUpdate cu = CameraUpdateFactory.newLatLngBounds(bounds, baseMapPadding);

    if (edgePadding != null) {
      googleMap.setPadding(edgePadding.getInt("left"), edgePadding.getInt("top"),
          edgePadding.getInt("right"), edgePadding.getInt("bottom"));
    }

    if (animated) {
      startMonitoringRegion();
      googleMap.animateCamera(cu);
    } else {
      googleMap.moveCamera(cu);
    }
    googleMap.setPadding(0, 0, 0,
        0); // Without this, the Google logo is moved up by the value of edgePadding.bottom
  }

  // InfoWindowAdapter interface

  @Override
  public View getInfoWindow(Marker marker) {
    AirMapMarker markerView = markerMap.get(marker);
    return markerView.getCallout();
  }

  @Override
  public View getInfoContents(Marker marker) {
    AirMapMarker markerView = markerMap.get(marker);
    return markerView.getInfoContents();
  }

  @Override
  public boolean dispatchTouchEvent(MotionEvent ev) {
    scaleDetector.onTouchEvent(ev);
    gestureDetector.onTouchEvent(ev);

    int action = MotionEventCompat.getActionMasked(ev);

    switch (action) {
      case (MotionEvent.ACTION_DOWN):
        getParent().requestDisallowInterceptTouchEvent(
            googleMap != null && googleMap.getUiSettings().isScrollGesturesEnabled());
        isTouchDown = true;
        break;
      case (MotionEvent.ACTION_MOVE):
        startMonitoringRegion();
        break;
      case (MotionEvent.ACTION_UP):
        // Clear this regardless, since isScrollGesturesEnabled() may have been updated
        getParent().requestDisallowInterceptTouchEvent(false);
        isTouchDown = false;
        break;
    }
    super.dispatchTouchEvent(ev);
    return true;
  }

  // Timer Implementation

  public void startMonitoringRegion() {
    if (isMonitoringRegion) return;
    timerHandler.postDelayed(timerRunnable, 100);
    isMonitoringRegion = true;
  }

  public void stopMonitoringRegion() {
    if (!isMonitoringRegion) return;
    timerHandler.removeCallbacks(timerRunnable);
    isMonitoringRegion = false;
  }

  private LatLngBounds lastBoundsEmitted;

  Handler timerHandler = new Handler();
  Runnable timerRunnable = new Runnable() {

    @Override
    public void run() {

      Projection projection = googleMap.getProjection();
      VisibleRegion region = (projection != null) ? projection.getVisibleRegion() : null;
      LatLngBounds bounds = (region != null) ? region.latLngBounds : null;

      if ((bounds != null) &&
          (lastBoundsEmitted == null ||
              LatLngBoundsUtils.BoundsAreDifferent(bounds, lastBoundsEmitted))) {
        LatLng center = googleMap.getCameraPosition().target;
        lastBoundsEmitted = bounds;
        eventDispatcher.dispatchEvent(new RegionChangeEvent(getId(), bounds, center, true));
      }

      timerHandler.postDelayed(this, 100);
    }
  };

  @Override
  public void onMarkerDragStart(Marker marker) {
    WritableMap event = makeClickEventData(marker.getPosition());
    manager.pushEvent(context, this, "onMarkerDragStart", event);

    AirMapMarker markerView = markerMap.get(marker);
    event = makeClickEventData(marker.getPosition());
    manager.pushEvent(context, markerView, "onDragStart", event);
  }

  @Override
  public void onMarkerDrag(Marker marker) {
    WritableMap event = makeClickEventData(marker.getPosition());
    manager.pushEvent(context, this, "onMarkerDrag", event);

    AirMapMarker markerView = markerMap.get(marker);
    event = makeClickEventData(marker.getPosition());
    manager.pushEvent(context, markerView, "onDrag", event);
  }

  @Override
  public void onMarkerDragEnd(Marker marker) {
    WritableMap event = makeClickEventData(marker.getPosition());
    manager.pushEvent(context, this, "onMarkerDragEnd", event);

    AirMapMarker markerView = markerMap.get(marker);
    event = makeClickEventData(marker.getPosition());
    manager.pushEvent(context, markerView, "onDragEnd", event);
  }

  private ProgressBar getMapLoadingProgressBar() {
    if (mapLoadingProgressBar == null) {
      mapLoadingProgressBar = new ProgressBar(getContext());
      mapLoadingProgressBar.setIndeterminate(true);
    }
    if (loadingIndicatorColor != null) {
      setLoadingIndicatorColor(loadingIndicatorColor);
    }
    return mapLoadingProgressBar;
  }

  private RelativeLayout getMapLoadingLayoutView() {
    if (mapLoadingLayout == null) {
      mapLoadingLayout = new RelativeLayout(getContext());
      mapLoadingLayout.setBackgroundColor(Color.LTGRAY);
      addView(mapLoadingLayout,
          new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
              ViewGroup.LayoutParams.MATCH_PARENT));

      RelativeLayout.LayoutParams params = new RelativeLayout.LayoutParams(
          RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
      params.addRule(RelativeLayout.CENTER_IN_PARENT);
      mapLoadingLayout.addView(getMapLoadingProgressBar(), params);

      mapLoadingLayout.setVisibility(View.INVISIBLE);
    }
    setLoadingBackgroundColor(loadingBackgroundColor);
    return mapLoadingLayout;
  }

  private ImageView getCacheImageView() {
    if (cacheImageView == null) {
      cacheImageView = new ImageView(getContext());
      addView(cacheImageView,
          new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
              ViewGroup.LayoutParams.MATCH_PARENT));
      cacheImageView.setVisibility(View.INVISIBLE);
    }
    return cacheImageView;
  }

  private void removeCacheImageView() {
    if (cacheImageView != null) {
      ((ViewGroup) cacheImageView.getParent()).removeView(cacheImageView);
      cacheImageView = null;
    }
  }

  private void removeMapLoadingProgressBar() {
    if (mapLoadingProgressBar != null) {
      ((ViewGroup) mapLoadingProgressBar.getParent()).removeView(mapLoadingProgressBar);
      mapLoadingProgressBar = null;
    }
  }

  private void removeMapLoadingLayoutView() {
    removeMapLoadingProgressBar();
    if (mapLoadingLayout != null) {
      ((ViewGroup) mapLoadingLayout.getParent()).removeView(mapLoadingLayout);
      mapLoadingLayout = null;
    }
  }

  private void cacheView() {
    if (cacheEnabled) {
      final ImageView cacheImageView = getCacheImageView();
      final RelativeLayout mapLoadingLayout = getMapLoadingLayoutView();
      cacheImageView.setVisibility(View.INVISIBLE);
      mapLoadingLayout.setVisibility(View.VISIBLE);
      if (isMapLoaded) {
        googleMap.snapshot(new GoogleMap.SnapshotReadyCallback() {
          @Override public void onSnapshotReady(Bitmap bitmap) {
            cacheImageView.setImageBitmap(bitmap);
            cacheImageView.setVisibility(View.VISIBLE);
            mapLoadingLayout.setVisibility(View.INVISIBLE);
          }
        });
      }
    } else {
      removeCacheImageView();
      if (isMapLoaded) {
        removeMapLoadingLayoutView();
      }
    }
  }

  public void onPanDrag(MotionEvent ev) {
    Point point = new Point((int) ev.getX(), (int) ev.getY());
    LatLng coords = googleMap.getProjection().fromScreenLocation(point);
    WritableMap event = makeClickEventData(coords);
    manager.pushEvent(context, this, "onPanDrag", event);
  }
}
