package com.rnmaps.maps;

import static androidx.core.content.PermissionChecker.checkSelfPermission;

import android.app.Activity;
import android.content.Context;
import android.content.res.ColorStateList;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.Point;
import android.location.Location;

import androidx.lifecycle.DefaultLifecycleObserver;
import androidx.lifecycle.LifecycleOwner;

import android.os.Bundle;
import android.view.GestureDetector;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.PermissionChecker;

import com.facebook.react.common.MapBuilder;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.GoogleMapOptions;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.Projection;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.GroundOverlay;
import com.google.android.gms.maps.model.IndoorBuilding;
import com.google.android.gms.maps.model.IndoorLevel;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;
import com.google.android.gms.maps.model.MapStyleOptions;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.PointOfInterest;
import com.google.android.gms.maps.model.Polygon;
import com.google.android.gms.maps.model.Polyline;
import com.google.android.gms.maps.model.TileOverlay;
import com.google.maps.android.collections.CircleManager;
import com.google.maps.android.collections.GroundOverlayManager;
import com.google.maps.android.collections.MarkerManager;
import com.google.maps.android.collections.PolygonManager;
import com.google.maps.android.collections.PolylineManager;
import com.google.maps.android.data.kml.KmlContainer;
import com.google.maps.android.data.kml.KmlLayer;
import com.google.maps.android.data.kml.KmlPlacemark;

import org.json.JSONException;
import org.json.JSONObject;
import org.xmlpull.v1.XmlPullParserException;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import com.rnmaps.fabric.event.*;

public class MapView extends com.google.android.gms.maps.MapView implements GoogleMap.InfoWindowAdapter,
        GoogleMap.OnMarkerDragListener, OnMapReadyCallback, GoogleMap.OnPoiClickListener, GoogleMap.OnIndoorStateChangeListener, DefaultLifecycleObserver {
    public GoogleMap map;
    private Bundle savedMapState;
    private Map<Integer, MapFeature> savedFeatures = new HashMap<>();

    private MarkerManager markerManager;
    private MarkerManager.Collection markerCollection;
    private PolylineManager polylineManager;
    private PolylineManager.Collection polylineCollection;
    private PolygonManager polygonManager;
    private PolygonManager.Collection polygonCollection;
    private CircleManager.Collection circleCollection;
    private GroundOverlayManager groundOverlayManager;
    private GroundOverlayManager.Collection groundOverlayCollection;
    private ProgressBar mapLoadingProgressBar;
    private RelativeLayout mapLoadingLayout;
    private ImageView cacheImageView;
    private Boolean isMapLoaded = false;

    private Boolean isMapReady = false;

    private Integer loadingBackgroundColor = null;
    private Integer loadingIndicatorColor = null;

    private LatLngBounds boundsToMove;
    private CameraUpdate cameraToSet;
    private boolean setPaddingDeferred = false;
    private boolean showUserLocation = false;

    private boolean showsTraffic = false;

    private boolean handlePanDrag = false;
    private boolean moveOnMarkerPress = true;
    private boolean cacheEnabled = false;
    private boolean poiClickEnabled = true;

    private ReadableMap initialRegion;
    private ReadableMap region;
    private ReadableMap initialCamera;
    private ReadableMap camera;
    private String customMapStyleString;
    private boolean initialRegionSet = false;
    private boolean initialCameraSet = false;
    private int cameraMoveReason = -1;
    private MapMarker selectedMarker;

    private LifecycleOwner currentLifecycleOwner;
    private boolean isLifecycleObserverAttached = false;

    private static final String[] PERMISSIONS = new String[]{
            "android.permission.ACCESS_FINE_LOCATION", "android.permission.ACCESS_COARSE_LOCATION"};

    private final Map<Integer, MapFeature> features = new HashMap<>();
    private final Map<Marker, MapMarker> markerMap = new HashMap<>();
    private final Map<Polyline, MapPolyline> polylineMap = new HashMap<>();
    private final Map<Polygon, MapPolygon> polygonMap = new HashMap<>();
    private final Map<GroundOverlay, MapOverlay> overlayMap = new HashMap<>();
    private final Map<TileOverlay, MapHeatmap> heatmapMap = new HashMap<>();
    private final Map<TileOverlay, MapGradientPolyline> gradientPolylineMap = new HashMap<>();
    private final GestureDetector gestureDetector;
    private boolean paused = false;
    private boolean destroyed = false;
    private final ThemedReactContext context;
    private final FusedLocationSource fusedLocationSource;

    private ViewAttacherGroup attacherGroup;
    private LatLng tapLocation;
    private Float maxZoomLevel;
    private Float minZoomLevel;
    private Boolean pitchEnabled;
    private Boolean showsCompass;
    private Boolean rotateEnabled;
    private Boolean zoomEnabled;
    private Boolean zoomControlEnabled;
    private Boolean setShowBuildings;
    private Boolean showsIndoorLevelPicker;
    private Boolean showIndoors;
    private Boolean scrollEnabled;
    private Boolean scrollDuringRotateOrZoomEnabled;
    private String kmlSrc = null;

    private static boolean contextHasBug(Context context) {
        return context == null ||
                context.getResources() == null ||
                context.getResources().getConfiguration() == null;
    }

    // We do this to fix this bug:
    // https://github.com/react-native-maps/react-native-maps/issues/271
    //
    // which conflicts with another bug regarding the passed in context:
    // https://github.com/react-native-maps/react-native-maps/issues/1147
    //
    // Doing this allows us to avoid both bugs.
    private static Context getNonBuggyContext(ThemedReactContext reactContext,
                                              ReactApplicationContext appContext) {
        Context superContext = reactContext;
        if (!contextHasBug(appContext.getCurrentActivity())) {
            superContext = appContext.getCurrentActivity();
        } else if (contextHasBug(superContext)) {
            // we have the bug! let's try to find a better context to use
            if (!contextHasBug(reactContext.getCurrentActivity())) {
                superContext = reactContext.getCurrentActivity();
            } else if (!contextHasBug(reactContext.getApplicationContext())) {
                superContext = reactContext.getApplicationContext();
            }

        }
        return superContext;
    }


    @Override
    public void onCreate(LifecycleOwner owner) {
        super.onCreate(null);
    }

    @Override
    public void onStart(LifecycleOwner owner) {
        super.onStart();
    }

    @Override
    public void onResume(LifecycleOwner owner) {
        if (hasPermissions() && map != null) {
            //noinspection MissingPermission
            map.setMyLocationEnabled(showUserLocation);
            map.setLocationSource(fusedLocationSource);
        }
        synchronized (MapView.this) {
            if (!destroyed) {
                MapView.this.onResume();
            }
            paused = false;
        }
    }


    @Override
    public void onPause(LifecycleOwner owner) {
        super.onPause();
        if (hasPermissions() && map != null) {
            //noinspection MissingPermission
            map.setMyLocationEnabled(false);
        }
        synchronized (MapView.this) {
            if (!destroyed) {
                MapView.this.onPause();
            }
            paused = true;
        }
    }

    @Override
    public void onStop(LifecycleOwner owner) {
        super.onStop();
    }

    @Override
    public void onDestroy(LifecycleOwner owner) {
        MapView.this.doDestroy();
    }

    public MapView(ThemedReactContext context,
                   GoogleMapOptions googleMapOptions) {
        super(context, googleMapOptions);
        this.context = context;
        super.getMapAsync(this);

        final MapView view = this;

        fusedLocationSource = new FusedLocationSource(context);

        gestureDetector =
                new GestureDetector(context, new GestureDetector.SimpleOnGestureListener() {

                    @Override
                    public boolean onScroll(MotionEvent e1, MotionEvent e2, float distanceX,
                                            float distanceY) {
                        if (handlePanDrag) {
                            onPanDrag(e2);
                        }
                        return false;
                    }

                    @Override
                    public boolean onDoubleTap(MotionEvent ev) {
                        onDoublePress(ev);
                        return false;
                    }
                });

        this.addOnLayoutChangeListener(new OnLayoutChangeListener() {
            @Override
            public void onLayoutChange(View v, int left, int top, int right, int bottom,
                                       int oldLeft, int oldTop, int oldRight, int oldBottom) {
                if (!paused) {
                    MapView.this.cacheView();
                }
            }
        });


        // Set up a parent view for triggering visibility in subviews that depend on it.
        // Mainly ReactImageView depends on Fresco which depends on onVisibilityChanged() event
       prepareAttacherView();
    }

    private void prepareAttacherView(){
        attacherGroup = new ViewAttacherGroup(context);
        LayoutParams attacherLayoutParams = new LayoutParams(0, 0);
        attacherLayoutParams.width = 0;
        attacherLayoutParams.height = 0;
        attacherLayoutParams.leftMargin = 99999999;
        attacherLayoutParams.topMargin = 99999999;
        attacherGroup.setLayoutParams(attacherLayoutParams);
        addView(attacherGroup);
    }

    public MapView(ThemedReactContext reactContext, ReactApplicationContext appContext,
                   MapManager manager,
                   GoogleMapOptions googleMapOptions) {
        this(null, googleMapOptions);

    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        attachLifecycleObserver();
        if (savedMapState != null) {
            super.onCreate(savedMapState);
            super.onStart();
            super.onResume();
            prepareAttacherView();
            getMapAsync((map)->{
                onMapReady(map);
                savedFeatures.forEach((index, feature) -> {
                    addFeature(feature, index);
                });
            });
        }
    }

    // Override onDetachedFromWindow to detach lifecycle observer
    @Override
    protected void onDetachedFromWindow() {
        if (savedMapState == null) {
            savedMapState = new Bundle();
        }
        super.onSaveInstanceState(savedMapState);
        super.onPause();
        super.onStop();
        savedFeatures = new HashMap<>(features);
        savedFeatures.keySet().forEach(this::removeFeatureAt);
        removeView(attacherGroup);
        attacherGroup = null;
        detachLifecycleObserver();
        super.onDetachedFromWindow();
    }

    // Method to attach lifecycle observer
    private void attachLifecycleObserver() {
        Activity activity = context.getCurrentActivity();
        if (activity instanceof LifecycleOwner && !isLifecycleObserverAttached) {
            currentLifecycleOwner = (LifecycleOwner) activity;
            currentLifecycleOwner.getLifecycle().addObserver(this);
            isLifecycleObserverAttached = true;
        }
    }

    // Method to detach lifecycle observer
    private void detachLifecycleObserver() {
        if (currentLifecycleOwner != null && isLifecycleObserverAttached) {
            currentLifecycleOwner.getLifecycle().removeObserver(this);
            isLifecycleObserverAttached = false;
            currentLifecycleOwner = null;
        }
    }

    public double[][] getMarkersFrames(boolean onlyVisible) {

        LatLngBounds.Builder builder = new LatLngBounds.Builder();
        boolean addedPosition = false;
        LatLngBounds mapBounds = map.getProjection().getVisibleRegion().latLngBounds;
        for (MapFeature feature : features.values()) {
            if (feature instanceof MapMarker) {
                Marker marker = (Marker) feature.getFeature();
                if (!onlyVisible ||
                        mapBounds.contains(marker.getPosition())) {
                    builder.include(marker.getPosition());
                    addedPosition = true;
                }
            }
        }
        if (addedPosition) {

            LatLngBounds bounds = builder.build();
            LatLng northEast = bounds.northeast;
            LatLng southWest = bounds.southwest;

            return new double[][]{
                    {northEast.longitude, northEast.latitude},
                    {southWest.longitude, southWest.latitude}
            };
        }
        return null;
    }

    public void setShowsTraffic(boolean value) {
        showsTraffic = value;
        if (map != null) {
            map.setTrafficEnabled(value);
        }
    }


    @FunctionalInterface
    public interface EventCreator<T extends Event> {
        T create(int surfaceId, int viewId, WritableMap payload);
    }

    private <T extends Event> void dispatchEvent(WritableMap payload, EventCreator<T> creator) {
        dispatchEvent(payload, creator, getId(), context);
    }

    public static <T extends Event> void dispatchEvent(WritableMap payload, EventCreator<T> creator, int viewId, ReactContext context) {
        // Cast context to ReactContext
        ReactContext reactContext = context;

        // Get the event dispatcher
        EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, viewId);

        // If there is a dispatcher, create and dispatch the event
        if (eventDispatcher != null) {
            int surfaceId = UIManagerHelper.getSurfaceId(reactContext);
            T event = creator.create(surfaceId, viewId, payload);
            eventDispatcher.dispatchEvent(event);
        }
    }

    @Override
    public void onMapReady(@NonNull final GoogleMap map) {
        if (destroyed) {
            return;
        }
        this.map = map;
        if (maxZoomLevel != null) {
            setMaxZoomLevel(maxZoomLevel);
        }
        if (minZoomLevel != null) {
            setMinZoomLevel(minZoomLevel);
        }
        if (pitchEnabled != null) {
            setPitchEnabled(pitchEnabled);
        }
        if (showsCompass != null) {
            setShowsCompass(showsCompass);
        }
        if (rotateEnabled != null) {
            setRotateEnabled(rotateEnabled);
        }
        if (zoomEnabled != null) {
            setZoomEnabled(zoomEnabled);
        }
        if (zoomControlEnabled != null) {
            setZoomControlEnabled(zoomControlEnabled);
        }
        if (setShowBuildings != null) {
            setShowBuildings(setShowBuildings);
        }
        if (showsIndoorLevelPicker != null) {
            setShowsIndoorLevelPicker(showsIndoorLevelPicker);
        }
        if (showIndoors != null) {
            setShowIndoors(showIndoors);
        }
        if (scrollEnabled != null) {
            setScrollEnabled(scrollEnabled);
        }
        if (scrollDuringRotateOrZoomEnabled != null) {
            setScrollDuringRotateOrZoomEnabled(scrollDuringRotateOrZoomEnabled);
        }

        markerManager = new MarkerManager(map);
        markerCollection = markerManager.newCollection();
        polylineManager = new PolylineManager(map);
        polylineCollection = polylineManager.newCollection();
        polygonManager = new PolygonManager(map);
        polygonCollection = polygonManager.newCollection();
        CircleManager circleManager = new CircleManager(map);
        circleCollection = circleManager.newCollection();
        groundOverlayManager = new GroundOverlayManager(map);
        groundOverlayCollection = groundOverlayManager.newCollection();

        markerCollection.setInfoWindowAdapter(this);
        markerCollection.setOnMarkerDragListener(this);
        this.map.setOnIndoorStateChangeListener(this);

        applyBridgedProps();
        dispatchEvent(new WritableNativeMap(), OnMapReadyEvent::new);

        final MapView view = this;

        map.setOnMyLocationChangeListener(new GoogleMap.OnMyLocationChangeListener() {
            @Override
            public void onMyLocationChange(Location location) {
                WritableMap event = new WritableNativeMap();

                WritableMap coordinate = new WritableNativeMap();
                coordinate.putDouble("latitude", location.getLatitude());
                coordinate.putDouble("longitude", location.getLongitude());
                coordinate.putDouble("altitude", location.getAltitude());
                coordinate.putDouble("timestamp", location.getTime());
                coordinate.putDouble("accuracy", location.getAccuracy());
                coordinate.putDouble("speed", location.getSpeed());
                coordinate.putDouble("heading", location.getBearing());
                coordinate.putBoolean("isFromMockProvider", location.isFromMockProvider());

                event.putMap("coordinate", coordinate);
                dispatchEvent(event, OnUserLocationChangeEvent::new);
            }
        });

        markerCollection.setOnMarkerClickListener(new GoogleMap.OnMarkerClickListener() {
            @Override
            public boolean onMarkerClick(@NonNull Marker marker) {
                MapMarker airMapMarker = getMarkerMap(marker);

                WritableMap eventData = makeClickEventData(marker.getPosition());
                eventData.putString("action", "marker-press");
                eventData.putString("id", airMapMarker.getIdentifier());
                airMapMarker.dispatchEvent(eventData, OnPressEvent::new);

                WritableMap mapEventData = makeClickEventData(marker.getPosition());
                mapEventData.putString("action", "marker-press");
                mapEventData.putString("id", airMapMarker.getIdentifier());

                dispatchEvent(mapEventData, OnMarkerPressEvent::new);


                handleMarkerSelection(airMapMarker);

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

        polygonCollection.setOnPolygonClickListener(new GoogleMap.OnPolygonClickListener() {
            @Override
            public void onPolygonClick(@NonNull Polygon polygon) {
                WritableMap event = makeClickEventData(tapLocation);
                event.putString("action", "polygon-press");
                MapPolygon mapPolygon = polygonMap.get(polygon);
                mapPolygon.dispatchEvent(event, OnPressEvent::new, context);
                event = makeClickEventData(tapLocation);
                event.putString("action", "polygon-press");
                event.putString("id", String.valueOf(mapPolygon.getId()));
                dispatchEvent(event, OnPressEvent::new);
            }
        });

        polylineCollection.setOnPolylineClickListener(new GoogleMap.OnPolylineClickListener() {
            @Override
            public void onPolylineClick(@NonNull Polyline polyline) {
                WritableMap event = makeClickEventData(tapLocation);
                event.putString("action", "polyline-press");
                dispatchEvent(event, OnPressEvent::new);
                event = makeClickEventData(tapLocation);
                dispatchEvent(event, OnPressEvent::new, polylineMap.get(polyline).getId(), context);

            }
        });

        markerCollection.setOnInfoWindowClickListener(marker -> {
            WritableMap event = makeClickEventData(marker.getPosition());
            event.putString("action", "callout-press");
            dispatchEvent(event, OnCalloutPressEvent::new);


            event = makeClickEventData(marker.getPosition());
            event.putString("action", "callout-press");
            MapMarker markerView = getMarkerMap(marker);
            dispatchEvent(event, OnCalloutPressEvent::new, markerView.getId(), context);

            MapCallout infoWindow = markerView.getCalloutView();
            if (infoWindow != null) {
                event = makeClickEventData(marker.getPosition());
                event.putString("action", "callout-press");
                dispatchEvent(event, OnPressEvent::new, infoWindow.getId(), context);
            }
        });

        map.setOnMapClickListener(new GoogleMap.OnMapClickListener() {
            @Override
            public void onMapClick(@NonNull LatLng point) {
                WritableMap event = makeClickEventData(point);
                event.putString("action", "press");
                dispatchEvent(event, OnPressEvent::new);

                handleMarkerSelection(null);
            }
        });

        map.setOnMapLongClickListener(new GoogleMap.OnMapLongClickListener() {
            @Override
            public void onMapLongClick(@NonNull LatLng point) {
                WritableMap event = makeClickEventData(point);
                event.putString("action", "long-press");
                dispatchEvent(event, OnLongPressEvent::new);
            }
        });

        groundOverlayCollection.setOnGroundOverlayClickListener(new GoogleMap.OnGroundOverlayClickListener() {
            @Override
            public void onGroundOverlayClick(@NonNull GroundOverlay groundOverlay) {
                WritableMap event = makeClickEventData(groundOverlay.getPosition());
                event.putString("action", "overlay-press");

                dispatchEvent(event, OnPressEvent::new);
                event = makeClickEventData(groundOverlay.getPosition());
                dispatchEvent(event, OnPressEvent::new, overlayMap.get(groundOverlay).getId(), context);
            }
        });

        map.setOnCameraMoveStartedListener(reason -> {
            cameraMoveReason = reason;
            LatLngBounds bounds = map.getProjection().getVisibleRegion().latLngBounds;
            boolean isGesture = GoogleMap.OnCameraMoveStartedListener.REASON_GESTURE == reason;
            WritableMap payload = OnRegionChangeEvent.payLoadFor(bounds, isGesture);
            dispatchEvent(payload, OnRegionChangeStartEvent::new);
        });

        map.setOnCameraMoveListener(() -> {
            boolean isGesture = GoogleMap.OnCameraMoveStartedListener.REASON_GESTURE == cameraMoveReason;
            LatLngBounds bounds = map.getProjection().getVisibleRegion().latLngBounds;
            WritableMap payload = OnRegionChangeEvent.payLoadFor(bounds, isGesture);
            dispatchEvent(payload, OnRegionChangeEvent::new);
        });

        map.setOnCameraIdleListener(() -> {
            boolean isGesture = GoogleMap.OnCameraMoveStartedListener.REASON_GESTURE == cameraMoveReason;
            cameraMoveReason = -1;
            LatLngBounds bounds = map.getProjection().getVisibleRegion().latLngBounds;
            WritableMap payload = OnRegionChangeEvent.payLoadFor(bounds, isGesture);
            dispatchEvent(payload, OnRegionChangeCompleteEvent::new);
        });

        map.setOnMapLoadedCallback(() -> {
            isMapLoaded = true;
            dispatchEvent(new WritableNativeMap(), OnMapLoadedEvent::new);
            MapView.this.cacheView();
        });


        map.setTrafficEnabled(showsTraffic);


        isMapReady = true;
        if (kmlSrc != null) {
            setKmlSrc(kmlSrc);
            kmlSrc = null;
        }
    }

    private synchronized void handleMarkerSelection(MapMarker target) {
        if (selectedMarker == target) {
            return;
        }

        WritableMap event;

        if (selectedMarker != null) {
            event = makeClickEventData(selectedMarker.getPosition());
            event.putString("action", "marker-deselect");
            event.putString("id", selectedMarker.getIdentifier());
            selectedMarker.dispatchEvent(event, OnDeselectEvent::new);

            event = makeClickEventData(selectedMarker.getPosition());
            event.putString("action", "marker-deselect");
            event.putString("id", selectedMarker.getIdentifier());
            dispatchEvent(event, OnMarkerDeselectEvent::new);
        }

        if (target != null) {
            event = makeClickEventData(target.getPosition());
            event.putString("action", "marker-select");
            event.putString("id", target.getIdentifier());
            target.dispatchEvent(event, OnSelectEvent::new);

            event = makeClickEventData(target.getPosition());
            event.putString("action", "marker-select");
            event.putString("id", target.getIdentifier());
            dispatchEvent(event, OnMarkerSelectEvent::new);
        }

        selectedMarker = target;
    }

    private boolean hasPermissions() {
        return checkSelfPermission(getContext(), PERMISSIONS[0]) == PermissionChecker.PERMISSION_GRANTED ||
                checkSelfPermission(getContext(), PERMISSIONS[1]) == PermissionChecker.PERMISSION_GRANTED;
    }


    public static Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
        MapBuilder.Builder<String, Object> builder = MapBuilder.builder();
        builder.put(OnPressEvent.EVENT_NAME, MapBuilder.of("registrationName", OnPressEvent.EVENT_NAME));
        builder.put(OnLongPressEvent.EVENT_NAME, MapBuilder.of("registrationName", OnLongPressEvent.EVENT_NAME));
        return builder.build();
    }

    //                 , ,
    public static Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        MapBuilder.Builder<String, Object> builder = MapBuilder.builder();
        builder.put(OnMarkerPressEvent.EVENT_NAME, MapBuilder.of("registrationName", OnMarkerPressEvent.EVENT_NAME));
        builder.put(OnCalloutPressEvent.EVENT_NAME, MapBuilder.of("registrationName", OnCalloutPressEvent.EVENT_NAME));
        builder.put(OnMarkerDragEvent.EVENT_NAME, MapBuilder.of("registrationName", OnMarkerDragEvent.EVENT_NAME));
        builder.put(OnMarkerDragStartEvent.EVENT_NAME, MapBuilder.of("registrationName", OnMarkerDragStartEvent.EVENT_NAME));
        builder.put(OnMarkerDragEndEvent.EVENT_NAME, MapBuilder.of("registrationName", OnMarkerDragEndEvent.EVENT_NAME));
        builder.put(OnPoiClickEvent.EVENT_NAME, MapBuilder.of("registrationName", OnPoiClickEvent.EVENT_NAME));
        builder.put(OnDoublePressEvent.EVENT_NAME, MapBuilder.of("registrationName", OnDoublePressEvent.EVENT_NAME));
        builder.put(OnPanDragEvent.EVENT_NAME, MapBuilder.of("registrationName", OnPanDragEvent.EVENT_NAME));
        builder.put(OnMarkerSelectEvent.EVENT_NAME, MapBuilder.of("registrationName", OnMarkerSelectEvent.EVENT_NAME));
        builder.put(OnMarkerDeselectEvent.EVENT_NAME, MapBuilder.of("registrationName", OnMarkerDeselectEvent.EVENT_NAME));
        builder.put(OnMapLoadedEvent.EVENT_NAME, MapBuilder.of("registrationName", OnMapLoadedEvent.EVENT_NAME));
        builder.put(OnMapReadyEvent.EVENT_NAME, MapBuilder.of("registrationName", OnMapReadyEvent.EVENT_NAME));
        builder.put(OnUserLocationChangeEvent.EVENT_NAME, MapBuilder.of("registrationName", OnUserLocationChangeEvent.EVENT_NAME));
        builder.put(OnRegionChangeEvent.EVENT_NAME, MapBuilder.of("registrationName", OnRegionChangeEvent.EVENT_NAME));
        builder.put(OnRegionChangeStartEvent.EVENT_NAME, MapBuilder.of("registrationName", OnRegionChangeStartEvent.EVENT_NAME));
        builder.put(OnRegionChangeCompleteEvent.EVENT_NAME, MapBuilder.of("registrationName", OnRegionChangeCompleteEvent.EVENT_NAME));
        builder.put(OnIndoorBuildingFocusedEvent.EVENT_NAME, MapBuilder.of("registrationName", OnIndoorBuildingFocusedEvent.EVENT_NAME));
        builder.put(OnIndoorLevelActivatedEvent.EVENT_NAME, MapBuilder.of("registrationName", OnIndoorLevelActivatedEvent.EVENT_NAME));
        builder.put(OnKmlReadyEvent.EVENT_NAME, MapBuilder.of("registrationName", OnKmlReadyEvent.EVENT_NAME));
        return builder.build();
    }


    /*
    onDestroy is final method so I can't override it.
     */
    public synchronized void doDestroy() {
        if (destroyed) {
            return;
        }
        destroyed = true;

        // Detach lifecycle observer before destroying
        detachLifecycleObserver();
        savedMapState = null;
        savedFeatures = null;

        if (!paused) {
            onPause();
            paused = true;
        }
        onDestroy();
    }

    public void setInitialCameraSet(boolean initialCameraSet) {
        this.initialCameraSet = initialCameraSet;
    }

    public void setInitialRegion(ReadableMap initialRegion) {
        this.initialRegion = initialRegion;
        // Theoretically onMapReady might be called before setInitialRegion
        // In that case, trigger moveToRegion manually
        if (!initialRegionSet && map != null) {
            moveToRegion(initialRegion);
            initialRegionSet = true;
        }
    }

    public void setInitialCamera(ReadableMap initialCamera) {
        this.initialCamera = initialCamera;
        if (!initialCameraSet && map != null) {
            moveToCamera(initialCamera);
            initialCameraSet = true;
        }
    }

    private void applyBridgedProps() {
        if (initialRegion != null) {
            moveToRegion(initialRegion);
            initialRegionSet = true;
        } else if (region != null) {
            moveToRegion(region);
        } else if (initialCamera != null) {
            moveToCamera(initialCamera);
            initialCameraSet = true;
        } else if (camera != null) {
            moveToCamera(camera);
        }
        if (customMapStyleString != null) {
            map.setMapStyle(new MapStyleOptions(customMapStyleString));
        }
        this.setPoiClickEnabled(poiClickEnabled);
        if (setPaddingDeferred &&
                (baseLeftMapPadding != 0 ||
                        baseTopMapPadding != 0 ||
                        baseRightMapPadding != 0 ||
                        baseBottomMapPadding != 0)) {
            applyBaseMapPadding(baseLeftMapPadding, baseTopMapPadding, baseRightMapPadding, baseBottomMapPadding);
        }
    }

    public static LatLngBounds latLngBoundsFromRegion(ReadableMap region) {
        if (region == null) return null;

        double lng = region.getDouble("longitude");
        double lat = region.getDouble("latitude");
        double lngDelta = region.getDouble("longitudeDelta");
        double latDelta = region.getDouble("latitudeDelta");
        return new LatLngBounds(
                new LatLng(lat - latDelta / 2, lng - lngDelta / 2), // southwest
                new LatLng(lat + latDelta / 2, lng + lngDelta / 2)  // northeast
        );
    }

    private void moveToRegion(ReadableMap region) {
        LatLngBounds bounds = latLngBoundsFromRegion(region);
        if (bounds == null) return;
        double lng = region.getDouble("longitude");
        double lat = region.getDouble("latitude");
        if (super.getHeight() <= 0 || super.getWidth() <= 0) {
            // in this case, our map has not been laid out yet, so we save the bounds in a local
            // variable, and make a guess of zoomLevel 10. Not to worry, though: as soon as layout
            // occurs, we will move the camera to the saved bounds. Note that if we tried to move
            // to the bounds now, it would trigger an exception.
            map.moveCamera(CameraUpdateFactory.newLatLngZoom(new LatLng(lat, lng), 10));
            boundsToMove = bounds;
        } else {
            map.moveCamera(CameraUpdateFactory.newLatLngBounds(bounds, 0));
            boundsToMove = null;
        }
    }

    public void setRegion(ReadableMap region) {
        this.region = region;
        if (region != null && map != null) {
            moveToRegion(region);
        }
    }

    public void setCamera(ReadableMap camera) {
        this.camera = camera;
        if (camera != null && map != null) {
            moveToCamera(camera);
        }
    }

    public static CameraPosition cameraPositionFromMap(ReadableMap camera) {
        if (camera == null) return null;

        CameraPosition.Builder builder = new CameraPosition.Builder();

        ReadableMap center = camera.getMap("center");
        if (center != null) {
            double lng = center.getDouble("longitude");
            double lat = center.getDouble("latitude");
            builder.target(new LatLng(lat, lng));
        }

        builder.tilt((float) camera.getDouble("pitch"));
        builder.bearing((float) camera.getDouble("heading"));
        builder.zoom((float) camera.getDouble("zoom"));

        return builder.build();
    }

    public CameraPosition cameraPositionFromJSON(JSONObject camera) throws JSONException {
        if (camera == null) return null;
        if (map == null) return null;

        CameraPosition.Builder builder = new CameraPosition.Builder();

        if (camera.has("center")) {
            JSONObject center = camera.getJSONObject("center");
            if (center != null) {
                double lng = center.getDouble("longitude");
                double lat = center.getDouble("latitude");
                builder.target(new LatLng(lat, lng));
            }
        } else {
            builder.target(map.getCameraPosition().target);
        }

        if (camera.has("pitch")) {
            builder.tilt((float) camera.getDouble("pitch"));
        } else {
            builder.tilt(map.getCameraPosition().tilt);
        }
        if (camera.has("heading")) {
            builder.bearing((float) camera.getDouble("heading"));
        } else {
            builder.bearing(map.getCameraPosition().bearing);
        }
        if (camera.has("zoom")) {
            builder.zoom((float) camera.getDouble("zoom"));
        } else {
            builder.zoom(map.getCameraPosition().zoom);
        }

        return builder.build();
    }

    public void moveToCamera(ReadableMap cameraMap) {
        moveToCamera(cameraPositionFromMap(cameraMap));
    }

    public void moveToCamera(CameraPosition camera) {
        if (camera == null) return;
        CameraUpdate update = CameraUpdateFactory.newCameraPosition(camera);

        if (super.getHeight() <= 0 || super.getWidth() <= 0) {
            // in this case, our map has not been laid out yet, so we save the camera update in a
            // local variable. As soon as layout occurs, we will move the camera to the saved update.
            // Note that if we tried to move to the camera now, it would trigger an exception.
            cameraToSet = update;
        } else {
            map.moveCamera(update);
            cameraToSet = null;
        }
    }

    public void setMapStyle(@Nullable String customMapStyleString) {
        this.customMapStyleString = customMapStyleString;
        if (map != null && customMapStyleString != null) {
            map.setMapStyle(new MapStyleOptions(customMapStyleString));
        }
    }

    public void setShowsUserLocation(boolean showUserLocation) {
        this.showUserLocation = showUserLocation; // hold onto this for lifecycle handling
        if (hasPermissions() && map != null) {
            map.setLocationSource(fusedLocationSource);
            //noinspection MissingPermission
            map.setMyLocationEnabled(showUserLocation);
        }
    }

    public void setUserLocationPriority(int priority) {
        fusedLocationSource.setPriority(priority);
    }

    public void setUserLocationUpdateInterval(int interval) {
        fusedLocationSource.setInterval(interval);
    }

    public void setUserLocationFastestInterval(int interval) {
        fusedLocationSource.setFastestInterval(interval);
    }

    public void setShowsMyLocationButton(boolean showMyLocationButton) {
        if (map != null) {
            if (hasPermissions() || !showMyLocationButton) {
                map.getUiSettings().setMyLocationButtonEnabled(showMyLocationButton);
            }
        }
    }

    public void setToolbarEnabled(boolean toolbarEnabled) {
        if (map != null) {
            if (hasPermissions() || !toolbarEnabled) {
                map.getUiSettings().setMapToolbarEnabled(toolbarEnabled);
            }
        }
    }

    public void setMapType(int mapType) {
        if (map != null) {
            map.setMapType(mapType);
        }
    }

    public void setCacheEnabled(boolean cacheEnabled) {
        this.cacheEnabled = cacheEnabled;
        this.cacheView();
    }

    public void setPoiClickEnabled(boolean poiClickEnabled) {
        this.poiClickEnabled = poiClickEnabled;
        if (map != null) {
            map.setOnPoiClickListener(poiClickEnabled ? this : null);
        }
    }

    public void setLoadingEnabled(boolean loadingEnabled) {
        if (loadingEnabled && !this.isMapLoaded) {
            this.getMapLoadingLayoutView().setVisibility(View.VISIBLE);
        }
    }

    public void setMoveOnMarkerPress(boolean moveOnPress) {
        this.moveOnMarkerPress = moveOnPress;
    }

    public void setMaxZoomLevel(float maxZoomLevel) {
        this.maxZoomLevel = maxZoomLevel;
        if (map != null) {
            map.setMaxZoomPreference(maxZoomLevel);
        }
    }

    public void setMinZoomLevel(float minZoomLevel) {
        this.minZoomLevel = minZoomLevel;
        if (map != null) {
            map.setMinZoomPreference(minZoomLevel);
        }
    }

    public void setPitchEnabled(boolean pitchEnabled) {
        this.pitchEnabled = pitchEnabled;
        if (map != null) {
            map.getUiSettings().setTiltGesturesEnabled(pitchEnabled);
        }
    }

    public void setShowsCompass(boolean showsCompass) {
        this.showsCompass = showsCompass;
        if (map != null) {
            map.getUiSettings().setCompassEnabled(showsCompass);
        }
    }

    public void setRotateEnabled(boolean rotateEnabled) {
        this.rotateEnabled = rotateEnabled;
        if (map != null) {
            map.getUiSettings().setRotateGesturesEnabled(rotateEnabled);
        }
    }

    public void setZoomEnabled(boolean zoomEnabled) {
        this.zoomEnabled = zoomEnabled;
        if (map != null) {
            map.getUiSettings().setZoomGesturesEnabled(zoomEnabled);
        }
    }

    public void setZoomControlEnabled(boolean zoomControlEnabled) {
        this.zoomControlEnabled = zoomControlEnabled;
        if (map != null) {
            map.getUiSettings().setZoomControlsEnabled(zoomControlEnabled);
        }
    }

    public void setScrollDuringRotateOrZoomEnabled(boolean scrollDuringRotateOrZoomEnabled) {
        this.scrollDuringRotateOrZoomEnabled = scrollDuringRotateOrZoomEnabled;
        if (map != null) {
            map.getUiSettings().setScrollGesturesEnabledDuringRotateOrZoom(scrollDuringRotateOrZoomEnabled);
        }
    }

    public void setScrollEnabled(boolean scrollEnabled) {
        this.scrollEnabled = scrollEnabled;
        if (map != null) {
            map.getUiSettings().setScrollGesturesEnabled(scrollEnabled);
        }
    }

    public void setShowIndoors(boolean showIndoors) {
        this.showIndoors = showIndoors;
        if (map != null) {
            map.setIndoorEnabled(showIndoors);
        }
    }

    public void setShowsIndoorLevelPicker(boolean showsIndoorLevelPicker) {
        this.showsIndoorLevelPicker = showsIndoorLevelPicker;
        if (map != null) {
            map.getUiSettings().setIndoorLevelPickerEnabled(showsIndoorLevelPicker);
        }
    }

    public void setShowBuildings(boolean showBuildings) {
        this.setShowBuildings = showBuildings;
        if (map != null) {
            map.setBuildingsEnabled(showBuildings);
        }
    }


    public void setLoadingBackgroundColor(Integer loadingBackgroundColor) {
        this.loadingBackgroundColor = loadingBackgroundColor;

        if (this.mapLoadingLayout != null) {
            if (loadingBackgroundColor == null) {
                this.mapLoadingLayout.setBackgroundColor(Color.WHITE);
            } else {
                this.mapLoadingLayout.setBackgroundColor(this.loadingBackgroundColor);
            }
        }
    }

    public void setLoadingIndicatorColor(Integer loadingIndicatorColor) {
        this.loadingIndicatorColor = loadingIndicatorColor;
        if (this.mapLoadingProgressBar != null) {
            Integer color = loadingIndicatorColor;
            if (color == null) {
                color = Color.parseColor("#606060");
            }

            ColorStateList progressTintList = ColorStateList.valueOf(loadingIndicatorColor);
            ColorStateList secondaryProgressTintList = ColorStateList.valueOf(loadingIndicatorColor);
            ColorStateList indeterminateTintList = ColorStateList.valueOf(loadingIndicatorColor);

            this.mapLoadingProgressBar.setProgressTintList(progressTintList);
            this.mapLoadingProgressBar.setSecondaryProgressTintList(secondaryProgressTintList);
            this.mapLoadingProgressBar.setIndeterminateTintList(indeterminateTintList);
        }
    }

    public void setHandlePanDrag(boolean handlePanDrag) {
        this.handlePanDrag = handlePanDrag;
    }

    public void addFeature(View child, int index) {
        // Our desired API is to pass up annotations/overlays as children to the mapview component.
        // This is where we intercept them and do the appropriate underlying mapview action.
        if (child instanceof MapMarker) {
            MapMarker annotation = (MapMarker) child;
            annotation.addToMap(markerCollection);
            features.put(index, annotation);

            // Allow visibility event to be triggered later
            int visibility = annotation.getVisibility();
            annotation.setVisibility(INVISIBLE);

            // Remove from a view group if already present, prevent "specified child
            // already had a parent" error.
            ViewGroup annotationParent = (ViewGroup) annotation.getParent();
            if (annotationParent != null) {
                annotationParent.removeView(annotation);
            }

            // Add to the parent group
            attacherGroup.addView(annotation);

            // Trigger visibility event if necessary.
            // With some testing, seems like it is not always
            //   triggered just by being added to a parent view.
            annotation.setVisibility(visibility);

            Marker marker = (Marker) annotation.getFeature();
            markerMap.put(marker, annotation);
        } else if (child instanceof MapPolyline) {
            MapPolyline polylineView = (MapPolyline) child;
            polylineView.addToMap(polylineCollection);
            features.put(index, polylineView);
            Polyline polyline = (Polyline) polylineView.getFeature();
            polylineMap.put(polyline, polylineView);
        } else if (child instanceof MapGradientPolyline) {
            MapGradientPolyline polylineView = (MapGradientPolyline) child;
            polylineView.addToMap(map);
            features.put(index, polylineView);
            TileOverlay tileOverlay = (TileOverlay) polylineView.getFeature();
            gradientPolylineMap.put(tileOverlay, polylineView);
        } else if (child instanceof MapPolygon) {
            MapPolygon polygonView = (MapPolygon) child;
            polygonView.addToMap(polygonCollection);
            features.put(index, polygonView);
            Polygon polygon = (Polygon) polygonView.getFeature();
            polygonMap.put(polygon, polygonView);
        } else if (child instanceof MapCircle) {
            MapCircle circleView = (MapCircle) child;
            circleView.addToMap(circleCollection);
            features.put(index, circleView);
        } else if (child instanceof MapUrlTile) {
            MapUrlTile urlTileView = (MapUrlTile) child;
            urlTileView.addToMap(map);
            features.put(index, urlTileView);
        } else if (child instanceof MapWMSTile) {
            MapWMSTile urlTileView = (MapWMSTile) child;
            urlTileView.addToMap(map);
            features.put(index, urlTileView);
        } else if (child instanceof MapLocalTile) {
            MapLocalTile localTileView = (MapLocalTile) child;
            localTileView.addToMap(map);
            features.put(index, localTileView);
        } else if (child instanceof MapOverlay) {
            MapOverlay overlayView = (MapOverlay) child;
            overlayView.addToMap(groundOverlayCollection);
            features.put(index, overlayView);
            GroundOverlay overlay = (GroundOverlay) overlayView.getFeature();
            overlayMap.put(overlay, overlayView);
        } else if (child instanceof MapHeatmap) {
            MapHeatmap heatmapView = (MapHeatmap) child;
            heatmapView.addToMap(map);
            features.put(index, heatmapView);
            TileOverlay heatmap = (TileOverlay) heatmapView.getFeature();
            heatmapMap.put(heatmap, heatmapView);
        } else if (child instanceof ViewGroup) {
            ViewGroup children = (ViewGroup) child;
            for (int i = 0; i < children.getChildCount(); i++) {
                addFeature(children.getChildAt(i), index);
            }
        } else {
            addView(child, index);
        }
    }

    public int getFeatureCount() {
        return features.size();
    }

    public View getFeatureAt(int index) {
        return features.get(index);
    }

    public void removeFeatureAt(int index) {
        MapFeature feature = features.remove(index);
        if (feature instanceof MapMarker) {
            markerMap.remove(feature.getFeature());
            feature.removeFromMap(markerCollection);
            attacherGroup.removeView(feature);
        } else if (feature instanceof MapHeatmap) {
            heatmapMap.remove(feature.getFeature());
            feature.removeFromMap(map);
        } else if (feature instanceof MapCircle) {
            feature.removeFromMap(circleCollection);
        } else if (feature instanceof MapOverlay) {
            feature.removeFromMap(groundOverlayCollection);
        } else if (feature instanceof MapPolygon) {
            feature.removeFromMap(polygonCollection);
        } else if (feature instanceof MapPolyline) {
            feature.removeFromMap(polylineCollection);
        } else {
            feature.removeFromMap(map);
        }
    }

    public WritableMap makeClickEventData(LatLng point) {
        WritableMap event = new WritableNativeMap();

        WritableMap coordinate = new WritableNativeMap();
        coordinate.putDouble("latitude", point.latitude);
        coordinate.putDouble("longitude", point.longitude);
        event.putMap("coordinate", coordinate);

        Projection projection = map.getProjection();
        Point screenPoint = projection.toScreenLocation(point);

        WritableMap position = new WritableNativeMap();
        position.putDouble("x", screenPoint.x);
        position.putDouble("y", screenPoint.y);
        event.putMap("position", position);

        return event;
    }

    public void updateExtraData(Object extraData) {
        if (setPaddingDeferred && super.getHeight() > 0 && super.getWidth() > 0) {
            CameraUpdate cu = CameraUpdateFactory.newCameraPosition(map.getCameraPosition());

            map.setPadding(edgeLeftPadding + baseLeftMapPadding,
                    edgeTopPadding + baseTopMapPadding,
                    edgeRightPadding + baseRightMapPadding,
                    edgeBottomPadding + baseBottomMapPadding);
            map.moveCamera(cu);

            // Move the google logo to the default base padding value.
            map.setPadding(baseLeftMapPadding, baseTopMapPadding, baseRightMapPadding, baseBottomMapPadding);

            setPaddingDeferred = false;
        }

        // if boundsToMove is not null, we now have the MapView's width/height, so we can apply
        // a proper camera move
        if (boundsToMove != null) {
            HashMap<String, Float> data = (HashMap<String, Float>) extraData;
            int width = data.get("width") == null ? 0 : data.get("width").intValue();
            int height = data.get("height") == null ? 0 : data.get("height").intValue();

            //fix for https://github.com/react-native-maps/react-native-maps/issues/245,
            //it's not guaranteed the passed-in height and width would be greater than 0.
            if (width <= 0 || height <= 0) {
                map.moveCamera(CameraUpdateFactory.newLatLngBounds(boundsToMove, 0));
            } else {
                map.moveCamera(CameraUpdateFactory.newLatLngBounds(boundsToMove, width, height, 0));
            }

            boundsToMove = null;
            cameraToSet = null;
        } else if (cameraToSet != null) {
            map.moveCamera(cameraToSet);
            cameraToSet = null;
        }
    }

    public void animateToCamera(CameraPosition position, int duration) {
        if (map == null) return;
        CameraUpdate update = CameraUpdateFactory.newCameraPosition(position);
        if (duration <= 0) {
            map.moveCamera(update);
        } else {
            map.animateCamera(update, duration, null);
        }
    }

    public void animateToCamera(ReadableMap camera, int duration) {
        if (map == null) return;
        CameraPosition.Builder builder = new CameraPosition.Builder(map.getCameraPosition());
        if (camera.hasKey("zoom")) {
            builder.zoom((float) camera.getDouble("zoom"));
        }
        if (camera.hasKey("heading")) {
            builder.bearing((float) camera.getDouble("heading"));
        }
        if (camera.hasKey("pitch")) {
            builder.tilt((float) camera.getDouble("pitch"));
        }
        if (camera.hasKey("center")) {
            ReadableMap center = camera.getMap("center");
            builder.target(new LatLng(center.getDouble("latitude"), center.getDouble("longitude")));
        }
        animateToCamera(builder.build(), duration);
    }

    public void animateToRegion(LatLngBounds bounds, int duration) {
        if (map == null) return;
        if (duration <= 0) {
            map.moveCamera(CameraUpdateFactory.newLatLngBounds(bounds, 0));
        } else {
            map.animateCamera(CameraUpdateFactory.newLatLngBounds(bounds, 0), duration, null);
        }
    }

    public void fitToElements(ReadableMap edgePadding, boolean animated) {
        if (map == null) return;

        LatLngBounds.Builder builder = new LatLngBounds.Builder();

        boolean addedPosition = false;
        if (!features.isEmpty()) {
            for (MapFeature feature : features.values()) {
                if (feature instanceof MapMarker) {
                    Marker marker = (Marker) feature.getFeature();
                    builder.include(marker.getPosition());
                    addedPosition = true;
                }
                // TODO(lmr): may want to include shapes / etc.
            }
        }
        if (addedPosition) {
            LatLngBounds bounds = builder.build();
            CameraUpdate cu = CameraUpdateFactory.newLatLngBounds(bounds, 0);

            if (edgePadding != null) {
                appendMapPadding(edgePadding.getInt("left"), edgePadding.getInt("top"),
                        edgePadding.getInt("right"), edgePadding.getInt("bottom"));
            }

            if (animated) {
                map.animateCamera(cu);
            } else {
                map.moveCamera(cu);
            }
            // Move the google logo to the default base padding value.
            map.setPadding(baseLeftMapPadding, baseTopMapPadding, baseRightMapPadding, baseBottomMapPadding);
        }
    }

    public void fitToSuppliedMarkers(ReadableArray markerIDsArray, ReadableMap edgePadding, boolean animated) {
        if (map == null) return;

        LatLngBounds.Builder builder = new LatLngBounds.Builder();

        String[] markerIDs = new String[markerIDsArray.size()];
        for (int i = 0; i < markerIDsArray.size(); i++) {
            markerIDs[i] = markerIDsArray.getString(i);
        }

        boolean addedPosition = false;

        List<String> markerIDList = Arrays.asList(markerIDs);

        for (MapFeature feature : features.values()) {
            if (feature instanceof MapMarker) {
                String identifier = ((MapMarker) feature).getIdentifier();
                Marker marker = (Marker) feature.getFeature();
                if (markerIDList.contains(identifier)) {
                    builder.include(marker.getPosition());
                    addedPosition = true;
                }
            }
        }

        if (addedPosition) {
            LatLngBounds bounds = builder.build();
            CameraUpdate cu = CameraUpdateFactory.newLatLngBounds(bounds, 0);

            if (edgePadding != null) {
                appendMapPadding(edgePadding.getInt("left"), edgePadding.getInt("top"),
                        edgePadding.getInt("right"), edgePadding.getInt("bottom"));
            }

            if (animated) {
                map.animateCamera(cu);
            } else {
                map.moveCamera(cu);
            }
            // Move the google logo to the default base padding value.
            map.setPadding(baseLeftMapPadding, baseTopMapPadding, baseRightMapPadding, baseBottomMapPadding);
        }
    }

    // padding configured by 'mapPadding' property
    int baseLeftMapPadding;
    int baseRightMapPadding;
    int baseTopMapPadding;
    int baseBottomMapPadding;
    // extra padding specified by 'edgePadding' option of fitToElements/fitToSuppliedMarkers/fitToCoordinates
    int edgeLeftPadding;
    int edgeRightPadding;
    int edgeTopPadding;
    int edgeBottomPadding;

    public void applyBaseMapPadding(int left, int top, int right, int bottom) {
        if (super.getHeight() <= 0 || super.getWidth() <= 0) {
            // the map is not laid out yet and calling setPadding() now has no effect
            baseLeftMapPadding = left;
            baseRightMapPadding = right;
            baseTopMapPadding = top;
            baseBottomMapPadding = bottom;
            setPaddingDeferred = true;
            return;
        }

        // retrieve current camera with current edge paddings configured
        map.setPadding(edgeLeftPadding + baseLeftMapPadding,
                edgeTopPadding + baseTopMapPadding,
                edgeRightPadding + baseRightMapPadding,
                edgeBottomPadding + baseBottomMapPadding);
        CameraUpdate cu = CameraUpdateFactory.newCameraPosition(map.getCameraPosition());

        baseLeftMapPadding = left;
        baseRightMapPadding = right;
        baseTopMapPadding = top;
        baseBottomMapPadding = bottom;

        // apply base paddings and restore center position of the map
        map.setPadding(edgeLeftPadding + left,
                edgeTopPadding + top,
                edgeRightPadding + right,
                edgeBottomPadding + bottom);
        map.moveCamera(cu);

        // Move the google logo to the default base padding value.
        map.setPadding(left, top, right, bottom);
        setPaddingDeferred = false;
    }

    public void fitToCoordinates(ReadableArray coordinatesArray, ReadableMap edgePadding,
                                 boolean animated) {
        if (map == null) return;

        LatLngBounds.Builder builder = new LatLngBounds.Builder();

        for (int i = 0; i < coordinatesArray.size(); i++) {
            ReadableMap latLng = coordinatesArray.getMap(i);
            double lat = latLng.getDouble("latitude");
            double lng = latLng.getDouble("longitude");
            builder.include(new LatLng(lat, lng));
        }

        LatLngBounds bounds = builder.build();
        CameraUpdate cu = CameraUpdateFactory.newLatLngBounds(bounds, 0);

        if (edgePadding != null) {
            appendMapPadding(edgePadding.getInt("left"), edgePadding.getInt("top"), edgePadding.getInt("right"), edgePadding.getInt("bottom"));
        }

        if (animated) {
            map.animateCamera(cu);
        } else {
            map.moveCamera(cu);
        }
        // Move the google logo to the default base padding value.
        map.setPadding(baseLeftMapPadding, baseTopMapPadding, baseRightMapPadding, baseBottomMapPadding);
    }

    private void appendMapPadding(int iLeft, int iTop, int iRight, int iBottom) {
        double density = getResources().getDisplayMetrics().density;

        edgeLeftPadding = (int) (iLeft * density);
        edgeTopPadding = (int) (iTop * density);
        edgeRightPadding = (int) (iRight * density);
        edgeBottomPadding = (int) (iBottom * density);

        map.setPadding(edgeLeftPadding + baseLeftMapPadding,
                edgeTopPadding + baseTopMapPadding,
                edgeRightPadding + baseRightMapPadding,
                edgeBottomPadding + baseBottomMapPadding);
    }

    public double[][] getMapBoundaries() {
        LatLngBounds bounds = map.getProjection().getVisibleRegion().latLngBounds;
        LatLng northEast = bounds.northeast;
        LatLng southWest = bounds.southwest;

        return new double[][]{
                {northEast.longitude, northEast.latitude},
                {southWest.longitude, southWest.latitude}
        };
    }

    public void setMapBoundaries(ReadableMap northEast, ReadableMap southWest) {
        if (map == null) return;

        LatLngBounds.Builder builder = new LatLngBounds.Builder();

        double latNE = northEast.getDouble("latitude");
        double lngNE = northEast.getDouble("longitude");
        builder.include(new LatLng(latNE, lngNE));

        double latSW = southWest.getDouble("latitude");
        double lngSW = southWest.getDouble("longitude");
        builder.include(new LatLng(latSW, lngSW));

        LatLngBounds bounds = builder.build();

        map.setLatLngBoundsForCameraTarget(bounds);
    }

    // InfoWindowAdapter interface

    @Override
    public View getInfoWindow(Marker marker) {
        MapMarker markerView = getMarkerMap(marker);
        return markerView.getCallout();
    }

    @Override
    public View getInfoContents(Marker marker) {
        MapMarker markerView = getMarkerMap(marker);
        return markerView.getInfoContents();
    }

    @Override
    public boolean dispatchTouchEvent(MotionEvent ev) {
        gestureDetector.onTouchEvent(ev);

        int X = (int) ev.getX();
        int Y = (int) ev.getY();
        if (map != null) {
            tapLocation = map.getProjection().fromScreenLocation(new Point(X, Y));
        }

        int action = ev.getActionMasked();

        switch (action) {
            case (MotionEvent.ACTION_DOWN):
                this.getParent().requestDisallowInterceptTouchEvent(
                        map != null && map.getUiSettings().isScrollGesturesEnabled());
                break;
            case (MotionEvent.ACTION_UP):
                // Clear this regardless, since isScrollGesturesEnabled() may have been updated
                this.getParent().requestDisallowInterceptTouchEvent(false);
                break;
        }
        super.dispatchTouchEvent(ev);
        return true;
    }

    @Override
    public void onMarkerDragStart(Marker marker) {
        WritableMap event = makeClickEventData(marker.getPosition());
        dispatchEvent(event, OnMarkerDragStartEvent::new);

        MapMarker markerView = getMarkerMap(marker);
        event = makeClickEventData(marker.getPosition());
        markerView.dispatchEvent(event, OnDragStartEvent::new);
    }

    @Override
    public void onMarkerDrag(Marker marker) {
        WritableMap event = makeClickEventData(marker.getPosition());
        dispatchEvent(event, OnMarkerDragEvent::new);

        MapMarker markerView = getMarkerMap(marker);
        event = makeClickEventData(marker.getPosition());
        markerView.dispatchEvent(event, OnDragEvent::new);
    }

    @Override
    public void onMarkerDragEnd(Marker marker) {
        WritableMap event = makeClickEventData(marker.getPosition());
        dispatchEvent(event, OnMarkerDragEndEvent::new);
        MapMarker markerView = getMarkerMap(marker);
        event = makeClickEventData(marker.getPosition());
        markerView.dispatchEvent(event, OnDragEndEvent::new);
    }

    @Override
    public void onPoiClick(PointOfInterest poi) {
        WritableMap event = makeClickEventData(poi.latLng);

        event.putString("placeId", poi.placeId);
        event.putString("name", poi.name);
        dispatchEvent(event, OnPoiClickEvent::new);
    }

    private ProgressBar getMapLoadingProgressBar() {
        if (this.mapLoadingProgressBar == null) {
            this.mapLoadingProgressBar = new ProgressBar(getContext());
            this.mapLoadingProgressBar.setIndeterminate(true);
        }
        if (this.loadingIndicatorColor != null) {
            this.setLoadingIndicatorColor(this.loadingIndicatorColor);
        }
        return this.mapLoadingProgressBar;
    }

    private RelativeLayout getMapLoadingLayoutView() {
        if (this.mapLoadingLayout == null) {
            this.mapLoadingLayout = new RelativeLayout(getContext());
            this.mapLoadingLayout.setBackgroundColor(Color.LTGRAY);
            this.addView(this.mapLoadingLayout,
                    new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.MATCH_PARENT));

            RelativeLayout.LayoutParams params = new RelativeLayout.LayoutParams(
                    RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
            params.addRule(RelativeLayout.CENTER_IN_PARENT);
            this.mapLoadingLayout.addView(this.getMapLoadingProgressBar(), params);

            this.mapLoadingLayout.setVisibility(View.INVISIBLE);
        }
        this.setLoadingBackgroundColor(this.loadingBackgroundColor);
        return this.mapLoadingLayout;
    }

    private ImageView getCacheImageView() {
        if (this.cacheImageView == null) {
            this.cacheImageView = new ImageView(getContext());
            this.addView(this.cacheImageView,
                    new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.MATCH_PARENT));
            this.cacheImageView.setVisibility(View.INVISIBLE);
        }
        return this.cacheImageView;
    }

    private void removeCacheImageView() {
        if (this.cacheImageView != null) {
            ((ViewGroup) this.cacheImageView.getParent()).removeView(this.cacheImageView);
            this.cacheImageView = null;
        }
    }

    private void removeMapLoadingProgressBar() {
        if (this.mapLoadingProgressBar != null) {
            ((ViewGroup) this.mapLoadingProgressBar.getParent()).removeView(this.mapLoadingProgressBar);
            this.mapLoadingProgressBar = null;
        }
    }

    private void removeMapLoadingLayoutView() {
        this.removeMapLoadingProgressBar();
        if (this.mapLoadingLayout != null) {
            ((ViewGroup) this.mapLoadingLayout.getParent()).removeView(this.mapLoadingLayout);
            this.mapLoadingLayout = null;
        }
    }

    private void cacheView() {
        if (this.cacheEnabled) {
            final ImageView cacheImageView = this.getCacheImageView();
            final RelativeLayout mapLoadingLayout = this.getMapLoadingLayoutView();
            cacheImageView.setVisibility(View.INVISIBLE);
            mapLoadingLayout.setVisibility(View.VISIBLE);
            if (this.isMapLoaded) {
                this.map.snapshot(new GoogleMap.SnapshotReadyCallback() {
                    @Override
                    public void onSnapshotReady(Bitmap bitmap) {
                        cacheImageView.setImageBitmap(bitmap);
                        cacheImageView.setVisibility(View.VISIBLE);
                        mapLoadingLayout.setVisibility(View.INVISIBLE);
                    }
                });
            }
        } else {
            this.removeCacheImageView();
            if (this.isMapLoaded) {
                this.removeMapLoadingLayoutView();
            }
        }
    }

    public void onPanDrag(MotionEvent ev) {
        Point point = new Point((int) ev.getX(), (int) ev.getY());
        LatLng coords = this.map.getProjection().fromScreenLocation(point);
        WritableMap event = makeClickEventData(coords);
        dispatchEvent(event, OnPanDragEvent::new);
    }

    public void onDoublePress(MotionEvent ev) {
        if (this.map == null) return;
        Point point = new Point((int) ev.getX(), (int) ev.getY());
        LatLng coords = this.map.getProjection().fromScreenLocation(point);
        WritableMap event = makeClickEventData(coords);
        dispatchEvent(event, OnDoublePressEvent::new);

    }

    public void setKmlSrc(String kmlSrc) {
        if (isMapReady) {
            try {
                InputStream kmlStream = new FileUtil(context).execute(kmlSrc).get();

                if (kmlStream == null) {
                    return;
                }

                KmlLayer kmlLayer = new KmlLayer(map, kmlStream, context, markerManager, polygonManager, polylineManager, groundOverlayManager, null);

                kmlLayer.addLayerToMap();

                WritableMap pointers = new WritableNativeMap();
                WritableArray markers = new WritableNativeArray();

                if (kmlLayer.getContainers() == null) {
                    dispatchEvent(pointers, OnKmlReadyEvent::new);
                    return;
                }

                //Retrieve a nested container within the first container
                KmlContainer container = kmlLayer.getContainers().iterator().next();
                if (container == null || container.getContainers() == null) {
                    dispatchEvent(pointers, OnKmlReadyEvent::new);
                    return;
                }


                if (container.getContainers().iterator().hasNext()) {
                    container = container.getContainers().iterator().next();
                }

                int index = 0;
                for (KmlPlacemark placemark : container.getPlacemarks()) {
                    MarkerOptions options = new MarkerOptions();

                    if (placemark.getInlineStyle() != null) {
                        options = placemark.getMarkerOptions();
                    } else {
                        options.icon(BitmapDescriptorFactory.defaultMarker());
                    }

                    LatLng latLng = ((LatLng) placemark.getGeometry().getGeometryObject());
                    String title = "";
                    String snippet = "";

                    if (placemark.hasProperty("name")) {
                        title = placemark.getProperty("name");
                    }

                    if (placemark.hasProperty("description")) {
                        snippet = placemark.getProperty("description");
                    }

                    options.position(latLng);
                    options.title(title);
                    options.snippet(snippet);
                    // FIXME: get markerManager from somewhere
        /*
        MapMarker marker = new MapMarker(context, options, this.manager.getMarkerManager());

        if (placemark.getInlineStyle() != null
            && placemark.getInlineStyle().getIconUrl() != null) {
          marker.setImage(placemark.getInlineStyle().getIconUrl());
        } else if (container.getStyle(placemark.getStyleId()) != null) {
          KmlStyle style = container.getStyle(placemark.getStyleId());
          marker.setImage(style.getIconUrl());
        }

        String identifier = title + " - " + index;

        marker.setIdentifier(identifier);

        addFeature(marker, index++);


        WritableMap loadedMarker = makeClickEventData(latLng);
        loadedMarker.putString("id", identifier);
        loadedMarker.putString("title", title);
        loadedMarker.putString("description", snippet);

        markers.pushMap(loadedMarker);
         */
                }

                pointers.putArray("markers", markers);
                dispatchEvent(new WritableNativeMap(), OnKmlReadyEvent::new);

            } catch (XmlPullParserException | IOException | InterruptedException |
                     ExecutionException e) {
                e.printStackTrace();
            }
        } else {
            this.kmlSrc = kmlSrc;
        }
    }

    @Override
    public void onIndoorBuildingFocused() {
        IndoorBuilding building = this.map.getFocusedBuilding();
        if (building != null) {
            List<IndoorLevel> levels = building.getLevels();
            int index = 0;
            WritableArray levelsArray = Arguments.createArray();
            for (IndoorLevel level : levels) {
                WritableMap levelMap = Arguments.createMap();
                levelMap.putInt("index", index);
                levelMap.putString("name", level.getName());
                levelMap.putString("shortName", level.getShortName());
                levelsArray.pushMap(levelMap);
                index++;
            }
            WritableMap indoorBuilding = Arguments.createMap();
            indoorBuilding.putArray("levels", levelsArray);
            indoorBuilding.putInt("activeLevelIndex", building.getActiveLevelIndex());
            indoorBuilding.putBoolean("underground", building.isUnderground());

            dispatchEvent(indoorBuilding, OnIndoorBuildingFocusedEvent::new);
        } else {
            WritableArray levelsArray = Arguments.createArray();
            WritableMap indoorBuilding = Arguments.createMap();
            indoorBuilding.putArray("levels", levelsArray);
            indoorBuilding.putInt("activeLevelIndex", 0);
            indoorBuilding.putBoolean("underground", false);

            dispatchEvent(indoorBuilding, OnIndoorBuildingFocusedEvent::new);
        }
    }

    @Override
    public void onIndoorLevelActivated(IndoorBuilding building) {
        if (building == null) {
            return;
        }
        int activeLevelIndex = building.getActiveLevelIndex();
        if (activeLevelIndex < 0 || activeLevelIndex >= building.getLevels().size()) {
            return;
        }
        IndoorLevel level = building.getLevels().get(activeLevelIndex);

        WritableMap indoorlevel = Arguments.createMap();

        indoorlevel.putInt("activeLevelIndex", activeLevelIndex);
        indoorlevel.putString("name", level.getName());
        indoorlevel.putString("shortName", level.getShortName());

        dispatchEvent(indoorlevel, OnIndoorLevelActivatedEvent::new);
    }

    public void setIndoorActiveLevelIndex(int activeLevelIndex) {
        IndoorBuilding building = this.map.getFocusedBuilding();
        if (building != null) {
            if (activeLevelIndex >= 0 && activeLevelIndex < building.getLevels().size()) {
                IndoorLevel level = building.getLevels().get(activeLevelIndex);
                if (level != null) {
                    level.activate();
                }
            }
        }
    }

    private MapMarker getMarkerMap(Marker marker) {
        MapMarker airMarker = markerMap.get(marker);

        if (airMarker != null) {
            return airMarker;
        }

        for (Map.Entry<Marker, MapMarker> entryMarker : markerMap.entrySet()) {
            if (entryMarker.getKey().getPosition().equals(marker.getPosition())
                    && entryMarker.getKey().getTitle().equals(marker.getTitle())) {
                airMarker = entryMarker.getValue();
                break;
            }
        }

        return airMarker;
    }

    @Override
    public void requestLayout() {
        super.requestLayout();
        post(measureAndLayout);
    }

    private final Runnable measureAndLayout = new Runnable() {
        @Override
        public void run() {
            measure(MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
                    MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
            layout(getLeft(), getTop(), getRight(), getBottom());
        }
    };

}
