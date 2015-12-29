package com.rn_mapview;

import android.graphics.Point;
import android.view.View;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.ReactProp;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.GoogleMap.InfoWindowAdapter;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.maps.MapsInitializer;
import com.google.android.gms.maps.Projection;
import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.Circle;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.Polygon;
import com.google.android.gms.maps.model.Polyline;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;


public class AirMapManager
        extends ViewGroupManager<MapView>
        implements InfoWindowAdapter {

    public static final String REACT_CLASS = "AIRMap";

    public static final int ANIMATE_TO_REGION = 1;
    public static final int ANIMATE_TO_COORDINATE = 2;
    public static final int FIT_TO_ELEMENTS = 3;

    private Map<String, Integer> MAP_TYPES = MapBuilder.of(
        "standard", GoogleMap.MAP_TYPE_NORMAL,
        "satellite", GoogleMap.MAP_TYPE_SATELLITE,
        "hybrid", GoogleMap.MAP_TYPE_HYBRID
    );

    // TODO(lmr): this is a bit of a hacky solution, and should be refactored. Under this
    // implementation, basically only one <MapView /> can be shown at a time. This was done
    // initially due to some annoyances with the fact that the GoogleMap class is different from the
    // MapView class, and we really actually want the GoogleMap class. Ideally, we abstract this out
    // into a `ReactMapView` class or something that has all of the APIs that the GoogleMap class has.
    private MapView mView;
    private GoogleMap map;

    private ReactContext reactContext;
    private LatLngBounds boundsToMove;

    private ArrayList<AirMapFeature> features = new ArrayList<>();
    private HashMap<Marker, AirMapMarker> markerMap = new HashMap<>();
    private HashMap<Polyline, AirMapPolyline> polylineMap = new HashMap<>();
    private HashMap<Polygon, AirMapPolygon> polygonMap = new HashMap<>();
    private HashMap<Circle, AirMapCircle> circleMap = new HashMap<>();

    private AirMapMarkerManager annotationManager;
    private AirMapPolylineManager polylineManager;
    private AirMapPolygonManager polygonManager;
    private AirMapCircleManager circleManager;
    private boolean showUserLocation = false;

    public AirMapManager(
        AirMapMarkerManager annotationManager,
        AirMapPolylineManager polylineManager,
        AirMapPolygonManager polygonManager,
        AirMapCircleManager circleManager
    ) {
        super();
        this.annotationManager = annotationManager;
        this.polylineManager = polylineManager;
        this.polygonManager = polygonManager;
        this.circleManager = circleManager;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    public GoogleMap getMap() {
        return map;
    }

    @Override
    protected MapView createViewInstance(ThemedReactContext context) {
        reactContext = context;
        mView = new MapView(context);
        mView.onCreate(null);
        mView.onResume();
        map = mView.getMap();

        if (map == null) {
            emitMapError("Map is null", "map_null");
        } else {

            try {
                MapsInitializer.initialize(context.getApplicationContext());
            } catch (Exception e) {
                e.printStackTrace();
                emitMapError("Map initialize error", "map_init_error");
            }
        }

        map.setInfoWindowAdapter(this);

        // We need to be sure to disable location-tracking when app enters background, in-case some other module
        // has acquired a wake-lock and is controlling location-updates, otherwise, location-manager will be left
        // updating location constantly, killing the battery, even though some other location-mgmt module may
        // desire to shut-down location-services.
        LifecycleEventListener listener = new LifecycleEventListener() {
            @Override
            public void onHostResume() {
                map.setMyLocationEnabled(showUserLocation);
            }

            @Override
            public void onHostPause() {
                map.setMyLocationEnabled(false);
            }

            @Override
            public void onHostDestroy() {

            }
        };

        context.addLifecycleEventListener(listener);

        return mView;
    }

    private void emitMapError (String message, String type) {
        WritableMap error = Arguments.createMap();
        error.putString("message", message);
        error.putString("type", type);

        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("onError", error);
    }

    @ReactProp(name="region")
    public void setRegion(MapView view, ReadableMap region) {
        Double lng = region.getDouble("longitude");
        Double lat = region.getDouble("latitude");
        Double lngDelta = region.getDouble("longitudeDelta");
        Double latDelta = region.getDouble("latitudeDelta");
        LatLngBounds bounds = new LatLngBounds(
                new LatLng(lat - latDelta / 2, lng - lngDelta / 2), // southwest
                new LatLng(lat + latDelta / 2, lng + lngDelta / 2)  // northeast
        );
        if (view.getHeight() <= 0 || view.getWidth() <= 0) {
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

    @ReactProp(name="mapType")
    public void setMapType(MapView view, @Nullable String mapType) {
        int typeId = MAP_TYPES.get(mapType);
        map.setMapType(typeId);
    }

    @ReactProp(name="showsUserLocation", defaultBoolean = false)
    public void setShowsUserLocation(MapView view, boolean showUserLocation) {
        this.showUserLocation = showUserLocation; // hold onto this for lifecycle handling
        map.setMyLocationEnabled(showUserLocation);
    }

    @ReactProp(name="showsTraffic", defaultBoolean = false)
    public void setShowTraffic(MapView view, boolean showTraffic) {
        map.setTrafficEnabled(showTraffic);
    }

    @ReactProp(name="showsBuildings", defaultBoolean = false)
    public void setShowBuildings(MapView view, boolean showBuildings) {
        map.setBuildingsEnabled(showBuildings);
    }

    @ReactProp(name="showsIndoors", defaultBoolean = false)
    public void setShowIndoors(MapView view, boolean showIndoors) {
        map.setIndoorEnabled(showIndoors);
    }

    @ReactProp(name="showsCompass", defaultBoolean = false)
    public void setShowsCompass(MapView view, boolean showsCompass) {
        map.getUiSettings().setCompassEnabled(showsCompass);
    }

    @ReactProp(name="scrollEnabled", defaultBoolean = false)
    public void setScrollEnabled(MapView view, boolean scrollEnabled) {
        map.getUiSettings().setScrollGesturesEnabled(scrollEnabled);
    }

    @ReactProp(name="zoomEnabled", defaultBoolean = false)
    public void setZoomEnabled(MapView view, boolean zoomEnabled) {
        map.getUiSettings().setZoomGesturesEnabled(zoomEnabled);
    }

    @Override
    public void addView(MapView parent, View child, int index) {
        // Our desired API is to pass up annotations/overlays as children to the mapview component.
        // This is where we intercept them and do the appropriate underlying mapview action.
        if (child instanceof AirMapMarker) {
            AirMapMarker annotation = (AirMapMarker) child;
            annotation.addToMap(map);
            features.add(index, annotation);
            Marker marker = (Marker)annotation.getFeature();
            markerMap.put(marker, annotation);
        } else if (child instanceof AirMapPolyline) {
            AirMapPolyline polylineView = (AirMapPolyline) child;
            polylineView.addToMap(map);
            features.add(index, polylineView);
            Polyline polyline = (Polyline)polylineView.getFeature();
            polylineMap.put(polyline, polylineView);
        } else if (child instanceof AirMapPolygon) {
            AirMapPolygon polygonView = (AirMapPolygon) child;
            polygonView.addToMap(map);
            features.add(index, polygonView);
            Polygon polygon = (Polygon)polygonView.getFeature();
            polygonMap.put(polygon, polygonView);
        } else if (child instanceof AirMapCircle) {
            AirMapCircle circleView = (AirMapCircle) child;
            circleView.addToMap(map);
            features.add(index, circleView);
            Circle circle = (Circle)circleView.getFeature();
            circleMap.put(circle, circleView);
        } else {
            parent.addView(child, index);
        }
    }

    @Override
    public int getChildCount(MapView parent) {
        return features.size();
    }

    @Override
    public View getChildAt(MapView parent, int index) {
        return features.get(index);
    }

    @Override
    public void removeViewAt(MapView parent, int index) {
        AirMapFeature feature = features.remove(index);
        feature.removeFromMap(map);

        if (feature instanceof AirMapMarker) {
            markerMap.remove(feature.getFeature());
        } else if (feature instanceof AirMapPolyline) {
            polylineMap.remove(feature.getFeature());
        } else if (feature instanceof AirMapPolygon) {
            polygonMap.remove(feature.getFeature());
        } else if (feature instanceof AirMapCircle) {
            circleMap.remove(feature.getFeature());
        }
    }

    @Override
    public void receiveCommand(MapView view, int commandId, @Nullable ReadableArray args) {
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
                map.animateCamera(CameraUpdateFactory.newLatLngBounds(bounds, 0), duration, null);
                break;

            case ANIMATE_TO_COORDINATE:
                region = args.getMap(0);
                duration = args.getInt(1);
                lng = region.getDouble("longitude");
                lat = region.getDouble("latitude");
                map.animateCamera(CameraUpdateFactory.newLatLng(new LatLng(lat, lng)), duration, null);
                break;

            case FIT_TO_ELEMENTS:
                fitToElements(args.getBoolean(0));
                break;
        }
    }


    private void fitToElements(boolean animated) {
        LatLngBounds.Builder builder = new LatLngBounds.Builder();
        for (AirMapFeature feature : features) {
            if (feature instanceof AirMapMarker) {
                Marker marker = (Marker)feature.getFeature();
                builder.include(marker.getPosition());
            }
            // TODO(lmr): may want to include shapes / etc.
        }
        LatLngBounds bounds = builder.build();
        CameraUpdate cu = CameraUpdateFactory.newLatLngBounds(bounds, 50);
        if (animated) {
            map.animateCamera(cu);
        } else {
            map.moveCamera(cu);
        }
    }

    @Override
    public @Nullable Map getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.of(
            "onPress", MapBuilder.of("registrationName", "onPress"),
            "onLongPress", MapBuilder.of("registrationName", "onLongPress"),
            "onMarkerPress", MapBuilder.of("registrationName", "onMarkerPress"),
            "onMarkerSelect", MapBuilder.of("registrationName", "onMarkerSelect"),
            "onMarkerDeselect", MapBuilder.of("registrationName", "onMarkerDeselect"),
            "onCalloutPress", MapBuilder.of("registrationName", "onCalloutPress")
        );
    }

    @Override
    public @Nullable Map<String, Integer> getCommandsMap() {
        return MapBuilder.of(
            "animateToRegion", ANIMATE_TO_REGION,
            "animateToCoordinate", ANIMATE_TO_COORDINATE,
            "fitToElements", FIT_TO_ELEMENTS
        );
    }

    @Override
    protected void addEventEmitters(ThemedReactContext reactContext, final MapView view) {
        final EventDispatcher eventDispatcher =
                reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();

        map.setOnMarkerClickListener(new GoogleMap.OnMarkerClickListener() {
            @Override
            public boolean onMarkerClick(Marker marker) {
                WritableMap event;

                event = makeClickEventData(marker.getPosition());
                event.putString("action", "marker-press");
                pushEvent(view, "onMarkerPress", event);

                event = makeClickEventData(marker.getPosition());
                event.putString("action", "marker-press");
                pushEvent(markerMap.get(marker), "onPress", event);

                return false; // returning false opens the callout window, if possible
            }
        });

        map.setOnInfoWindowClickListener(new GoogleMap.OnInfoWindowClickListener() {
            @Override
            public void onInfoWindowClick(Marker marker) {
                WritableMap event;

                event = makeClickEventData(marker.getPosition());
                event.putString("action", "callout-press");
                pushEvent(view, "onCalloutPress", event);

                event = makeClickEventData(marker.getPosition());
                event.putString("action", "callout-press");
                AirMapMarker markerView = markerMap.get(marker);
                pushEvent(markerView, "onCalloutPress", event);

                event = makeClickEventData(marker.getPosition());
                event.putString("action", "callout-press");
                AirMapCallout infoWindow = markerView.getCalloutView();
                if (infoWindow != null) pushEvent(infoWindow, "onPress", event);
            }
        });

        map.setOnMapClickListener(new GoogleMap.OnMapClickListener() {
            @Override
            public void onMapClick(LatLng point) {
                WritableMap event = makeClickEventData(point);
                event.putString("action", "press");
                pushEvent(view, "onPress", event);
            }
        });

        map.setOnMapLongClickListener(new GoogleMap.OnMapLongClickListener() {
            @Override
            public void onMapLongClick(LatLng point) {
                WritableMap event = makeClickEventData(point);
                event.putString("action", "long-press");
                pushEvent(view, "onLongPress", makeClickEventData(point));
            }
        });

        map.setOnCameraChangeListener(new GoogleMap.OnCameraChangeListener() {
            @Override
            public void onCameraChange(CameraPosition position) {
            LatLngBounds bounds = map.getProjection().getVisibleRegion().latLngBounds;
            eventDispatcher.dispatchEvent(new RegionChangeEvent(view.getId(), bounds));
            }
        });
    }

    @Override
    public LayoutShadowNode createShadowNodeInstance() {
        // A custom shadow node is needed in order to pass back the width/height of the map to the
        // view manager so that it can start applying camera moves with bounds.
        return new AirMapShadowNode();
    }

    @Override
    public void updateExtraData(MapView view, Object extraData) {
        // if boundsToMove is not null, we now have the MapView's width/height, so we can apply
        // a proper camera move
        if (boundsToMove != null) {
            HashMap<String, Float> data = (HashMap<String, Float>)extraData;
            float width = data.get("width");
            float height = data.get("height");
            map.moveCamera(
                CameraUpdateFactory.newLatLngBounds(
                    boundsToMove,
                    (int)width,
                    (int)height,
                    0
                )
            );
            boundsToMove = null;
        }
    }

    // InfoWindowAdapter interface

    @Override
    public View getInfoWindow(Marker marker) {
        AirMapMarker annotation = markerMap.get(marker);
        return annotation.getCallout();
    }

    @Override
    public View getInfoContents(Marker marker) {
        AirMapMarker annotation = markerMap.get(marker);
        return annotation.getInfoContents();
    }


    private void pushEvent(View view, String name, WritableMap data) {
        ReactContext reactContext = (ReactContext) view.getContext();
        reactContext.getJSModule(RCTEventEmitter.class)
                .receiveEvent(view.getId(), name, data);
    }

    private WritableMap makeClickEventData(LatLng point) {
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

}
