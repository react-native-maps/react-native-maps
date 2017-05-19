package com.airbnb.android.react.maps;

import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.content.res.ColorStateList;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Point;
import android.graphics.PorterDuff;
import android.os.Build;
import android.os.Handler;
import android.support.v4.view.GestureDetectorCompat;
import android.support.v4.view.MotionEventCompat;
import android.util.Log;
import android.view.GestureDetector;
import android.view.MotionEvent;
import android.view.ScaleGestureDetector;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
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
import com.google.android.gms.maps.model.BitmapDescriptor;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.Polygon;
import com.google.android.gms.maps.model.Polyline;
import com.google.android.gms.maps.model.VisibleRegion;
import com.google.maps.android.clustering.Cluster;
import com.google.maps.android.clustering.ClusterManager;
import com.google.maps.android.clustering.view.DefaultClusterRenderer;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static android.support.v4.content.PermissionChecker.checkSelfPermission;

public class AirMapView extends MapView implements GoogleMap.InfoWindowAdapter,
        GoogleMap.OnMarkerDragListener, OnMapReadyCallback {
    private static final String TAG = AirMapView.class.getName();

    public GoogleMap map;
    private ProgressBar mapLoadingProgressBar;
    private RelativeLayout mapLoadingLayout;
    private ImageView cacheImageView;
    private Boolean isMapLoaded = false;
    private Integer loadingBackgroundColor = null;
    private Integer loadingIndicatorColor = null;
    private final int baseMapPadding = 50;

    private LatLngBounds boundsToMove;
    private boolean showUserLocation = false;
    private boolean isMonitoringRegion = false;
    private boolean isTouchDown = false;
    private boolean handlePanDrag = false;
    private boolean moveOnMarkerPress = true;
    private boolean cacheEnabled = false;

    private static final String[] PERMISSIONS = new String[] {
            "android.permission.ACCESS_FINE_LOCATION", "android.permission.ACCESS_COARSE_LOCATION"};

    private final List<AirMapFeature> features = new ArrayList<>();
    private final Map<Marker, AirMapMarker> markerMap = new HashMap<>();
    private final Map<Polyline, AirMapPolyline> polylineMap = new HashMap<>();
    private final Map<Polygon, AirMapPolygon> polygonMap = new HashMap<>();
    private final ScaleGestureDetector scaleDetector;
    private final GestureDetectorCompat gestureDetector;
    private final AirMapManager manager;
    private LifecycleEventListener lifecycleListener;
    private boolean paused = false;
    private boolean destroyed = false;
    private final ThemedReactContext context;
    private final EventDispatcher eventDispatcher;

    private ClusterManager<AirMapMarker> mClusterManager;
    private ClusterMarkerIconGenerator mClusterIconGenerator = null;

    private static boolean contextHasBug(Context context) {
        return context == null ||
            context.getResources() == null ||
            context.getResources().getConfiguration() == null;
    }

    // We do this to fix this bug:
    // https://github.com/airbnb/react-native-maps/issues/271
    //
    // which conflicts with another bug regarding the passed in context:
    // https://github.com/airbnb/react-native-maps/issues/1147
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
            } else {
                // ¯\_(ツ)_/¯
            }
        }
        return superContext;
    }

    public AirMapView(ThemedReactContext reactContext, ReactApplicationContext appContext, AirMapManager manager,
                      GoogleMapOptions googleMapOptions) {
        super(getNonBuggyContext(reactContext, appContext), googleMapOptions);

        this.manager = manager;
        this.context = reactContext;

        super.onCreate(null);
        // TODO(lmr): what about onStart????
        super.onResume();
        super.getMapAsync(this);

        final AirMapView view = this;
        scaleDetector =
                new ScaleGestureDetector(reactContext, new ScaleGestureDetector.SimpleOnScaleGestureListener() {
                    @Override
                    public boolean onScaleBegin(ScaleGestureDetector detector) {
                        view.startMonitoringRegion();
                        return true; // stop recording this gesture. let mapview handle it.
                    }
        });

        gestureDetector =
                new GestureDetectorCompat(reactContext, new GestureDetector.SimpleOnGestureListener() {
                    @Override
                    public boolean onDoubleTap(MotionEvent e) {
                        view.startMonitoringRegion();
                        return false;
                    }

                    @Override
                    public boolean onScroll(MotionEvent e1, MotionEvent e2, float distanceX,
                                            float distanceY) {
                        if (handlePanDrag) {
                            onPanDrag(e2);
                        }
                        view.startMonitoringRegion();
                        return false;
                    }
                });

        this.addOnLayoutChangeListener(new OnLayoutChangeListener() {
            @Override public void onLayoutChange(View v, int left, int top, int right, int bottom,
                int oldLeft, int oldTop, int oldRight, int oldBottom) {
                if (!paused) {
                    AirMapView.this.cacheView();
                }
            }
        });

        eventDispatcher = reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();

        mClusterIconGenerator = new ClusterMarkerIconGenerator(reactContext);

    }

    private class MarkerRenderer extends DefaultClusterRenderer<AirMapMarker> {

        public MarkerRenderer(ThemedReactContext reactContext) {
            super(reactContext.getApplicationContext(), map, mClusterManager);
        }

        @Override
        protected void onBeforeClusterItemRendered(AirMapMarker post, MarkerOptions markerOptions) {
            markerOptions.icon(post.getIcon());
        }

        @Override
        protected void onBeforeClusterRendered(Cluster<AirMapMarker> cluster, MarkerOptions markerOptions) {

            // Check if cluster icon with number has been cached
            String bubbleKey = "bubble"+cluster.getSize();
            BitmapDescriptorContainer cachedBitmap = LruCacheManager.getInstance().getBitmapFromMemCache(bubbleKey);
            BitmapDescriptor iconBitmapDescriptor;
            if(cachedBitmap == null) {
                AirMapMarker first = cluster.getItems().iterator().next();
                if(first.getBitmapIcon() != null) {
                    Log.v(TAG, "Loading clusterIcon Bitmap with number " + cluster.getSize());
                    Bitmap textBubbleBitmap = mClusterIconGenerator.makeIcon(String.valueOf(cluster.getSize()));
                    Bitmap icon = overlay(first.getBitmapIcon(), textBubbleBitmap, 21, -12);
                    iconBitmapDescriptor = LruCacheManager.getInstance().addBitmapToMemoryCache(bubbleKey, icon);
                } else {
                    // Default to default marker
                    iconBitmapDescriptor = BitmapDescriptorFactory.defaultMarker();
                }
            } else {
                Log.v(TAG, "Reusing clusterIcon Bitmap with number " + cluster.getSize());
                iconBitmapDescriptor = cachedBitmap.mBitmapDescriptor;
            }

            markerOptions.icon(iconBitmapDescriptor);
        }

        @Override
        protected boolean shouldRenderAsCluster(Cluster cluster) {
            // Always render clusters.
            return cluster.getSize() > 1;
        }
    }

    private Bitmap overlay(Bitmap bmp1, Bitmap bmp2, float offsetX, float offsetY) {

        float dp = Resources.getSystem().getDisplayMetrics().density;
        float offsetXdp = offsetX * dp;
        float offsetYdp = offsetY * dp;

        float width = bmp1.getWidth() + 2 * ((bmp2.getWidth() + offsetXdp) - bmp1.getWidth());
        float height = bmp1.getHeight() - offsetYdp;

        Bitmap bmOverlay = Bitmap.createBitmap((int)width, (int)height, bmp1.getConfig());
        Canvas canvas = new Canvas(bmOverlay);
        canvas.drawBitmap(bmp1, (int)((bmp2.getWidth() + offsetXdp) - bmp1.getWidth()), -offsetYdp, null);
        canvas.drawBitmap(bmp2, offsetXdp + ((bmp2.getWidth() + offsetXdp) - bmp1.getWidth()), 0, null);
        return bmOverlay;
    }

    @Override
    public void onMapReady(final GoogleMap map) {
        if (destroyed) {
            return;
        }
        this.map = map;
        this.map.setInfoWindowAdapter(this);
        this.map.setOnMarkerDragListener(this);
        mClusterManager = new ClusterManager<AirMapMarker>(this.getContext(), map);
        mClusterManager.setRenderer(new MarkerRenderer(this.context));

        manager.pushEvent(context, this, "onMapReady", new WritableNativeMap());

        final AirMapView view = this;
        map.setOnMarkerClickListener(mClusterManager);
        map.setOnCameraIdleListener(mClusterManager);
        mClusterManager.cluster();

        mClusterManager.setOnClusterItemClickListener(new ClusterManager.OnClusterItemClickListener<AirMapMarker>(){
            @Override
            public boolean onClusterItemClick(AirMapMarker marker) {
                WritableMap event;
                if(marker == null) {
                    return false;
                }
                event = makeClickEventData(marker.getPosition());
                event.putString("action", "marker-press");
                event.putString("id", marker.getIdentifier());
                event.putInt("count", 1);
                event.putDouble("zoom", map.getCameraPosition().zoom);
                manager.pushEvent(context, view, "onPress", event);
                return true;
            }
        });

        mClusterManager.setOnClusterClickListener(new ClusterManager.OnClusterClickListener<AirMapMarker>(){
            @Override
            public boolean onClusterClick(Cluster<AirMapMarker> cluster) {
                WritableMap event;
                event = makeClickEventData(cluster.getPosition());
                event.putString("action", "marker-press");
                event.putInt("count", cluster.getItems().size());
                event.putDouble("zoom", map.getCameraPosition().zoom);
                map.animateCamera(CameraUpdateFactory.newLatLngZoom(cluster.getPosition(), map.getCameraPosition().zoom+2f));
                manager.pushEvent(context, view, "onPress", event);
                return true;
            }
        });

//        mClusterManager.getMarkerCollection().setOnMarkerClickListener(new GoogleMap.OnMarkerClickListener() {
//            @Override
//            public boolean onMarkerClick(Marker marker) {
//                AirMapMarker airMapMarker = markerMap.get(marker);
//                if(airMapMarker == null) {
//                    // Maker is a cluster
//                    WritableMap event;
//                    event = makeClickEventData(marker.getPosition());
//                    event.putString("action", "marker-press");
//                    manager.pushEvent(context, view, "onPress", event);
//                    return true;
//                } else {
//                    WritableMap event;
//                    event = makeClickEventData(marker.getPosition());
//                    event.putString("action", "marker-press");
//                    event.putString("id", airMapMarker.getIdentifier());
//                    event.putInt("count", 1);
//                    event.putDouble("zoom", map.getCameraPosition().zoom);
//                    manager.pushEvent(context, view, "onPress", event);
//                    return true;
//                }
//            }
//        });

        map.setOnPolygonClickListener(new GoogleMap.OnPolygonClickListener() {
            @Override
            public void onPolygonClick(Polygon polygon) {
                WritableMap event = makeClickEventData(polygon.getPoints().get(0));
                event.putString("action", "polygon-press");
                manager.pushEvent(context, polygonMap.get(polygon), "onPress", event);
            }
        });

        map.setOnPolylineClickListener(new GoogleMap.OnPolylineClickListener() {
            @Override
            public void onPolylineClick(Polyline polyline) {
                WritableMap event = makeClickEventData(polyline.getPoints().get(0));
                event.putString("action", "polyline-press");
                manager.pushEvent(context, polylineMap.get(polyline), "onPress", event);
            }
        });

        map.setOnInfoWindowClickListener(new GoogleMap.OnInfoWindowClickListener() {
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

        map.setOnMapClickListener(new GoogleMap.OnMapClickListener() {
            @Override
            public void onMapClick(LatLng point) {
                WritableMap event = makeClickEventData(point);
                event.putString("action", "press");
                manager.pushEvent(context, view, "onPress", event);
            }
        });

        map.setOnMapLongClickListener(new GoogleMap.OnMapLongClickListener() {
            @Override
            public void onMapLongClick(LatLng point) {
                WritableMap event = makeClickEventData(point);
                event.putString("action", "long-press");
                manager.pushEvent(context, view, "onLongPress", makeClickEventData(point));
            }
        });

        map.setOnCameraChangeListener(new GoogleMap.OnCameraChangeListener() {
            @Override
            public void onCameraChange(CameraPosition position) {
                LatLngBounds bounds = map.getProjection().getVisibleRegion().latLngBounds;
                LatLng center = position.target;
                lastBoundsEmitted = bounds;
                eventDispatcher.dispatchEvent(new RegionChangeEvent(getId(), bounds, center, isTouchDown));
                view.stopMonitoringRegion();
            }
        });

        map.setOnMapLoadedCallback(new GoogleMap.OnMapLoadedCallback() {
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
        @Override
        public void onHostResume() {
          if (hasPermissions()) {
            //noinspection MissingPermission
            map.setMyLocationEnabled(showUserLocation);
          }
          synchronized (AirMapView.this) {
            AirMapView.this.onResume();
            paused = false;
          }
        }

        @Override
        public void onHostPause() {
          if (hasPermissions()) {
            //noinspection MissingPermission
            map.setMyLocationEnabled(false);
          }
            synchronized (AirMapView.this) {
                AirMapView.this.onPause();
                paused = true;
            }
        }

        @Override
        public void onHostDestroy() {
            AirMapView.this.doDestroy();
        }
      };

        context.addLifecycleEventListener(lifecycleListener);
    }

    private boolean hasPermissions() {
        return checkSelfPermission(getContext(), PERMISSIONS[0]) == PackageManager.PERMISSION_GRANTED ||
                checkSelfPermission(getContext(), PERMISSIONS[1]) == PackageManager.PERMISSION_GRANTED;
    }



    /*
    onDestroy is final method so I can't override it.
     */
    public synchronized  void doDestroy() {
        if (destroyed) {
            return;
        }
        destroyed = true;

        if (lifecycleListener != null && context != null) {
            context.removeLifecycleEventListener(lifecycleListener);
            lifecycleListener = null;
        }
        if (!paused) {
            onPause();
            paused = true;
        }
        onDestroy();
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

    public void setShowsUserLocation(boolean showUserLocation) {
        this.showUserLocation = showUserLocation; // hold onto this for lifecycle handling
        if (hasPermissions()) {
            //noinspection MissingPermission
            map.setMyLocationEnabled(showUserLocation);
        }
    }

    public void setShowsMyLocationButton(boolean showMyLocationButton) {
        if (hasPermissions()) {
            map.getUiSettings().setMyLocationButtonEnabled(showMyLocationButton);
        }
    }

    public void setToolbarEnabled(boolean toolbarEnabled) {
        if (hasPermissions()) {
            map.getUiSettings().setMapToolbarEnabled(toolbarEnabled);
        }
    }

    public void setCacheEnabled(boolean cacheEnabled) {
        this.cacheEnabled = cacheEnabled;
        this.cacheView();
    }

    public void enableMapLoading(boolean loadingEnabled) {
        if (loadingEnabled && !this.isMapLoaded) {
            this.getMapLoadingLayoutView().setVisibility(View.VISIBLE);
        }
    }

    public void setMoveOnMarkerPress(boolean moveOnPress) {
        this.moveOnMarkerPress = moveOnPress;
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

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                ColorStateList progressTintList = ColorStateList.valueOf(loadingIndicatorColor);
                ColorStateList secondaryProgressTintList = ColorStateList.valueOf(loadingIndicatorColor);
                ColorStateList indeterminateTintList = ColorStateList.valueOf(loadingIndicatorColor);

                this.mapLoadingProgressBar.setProgressTintList(progressTintList);
                this.mapLoadingProgressBar.setSecondaryProgressTintList(secondaryProgressTintList);
                this.mapLoadingProgressBar.setIndeterminateTintList(indeterminateTintList);
            } else {
                PorterDuff.Mode mode = PorterDuff.Mode.SRC_IN;
                if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.GINGERBREAD_MR1) {
                    mode = PorterDuff.Mode.MULTIPLY;
                }
                if (this.mapLoadingProgressBar.getIndeterminateDrawable() != null)
                    this.mapLoadingProgressBar.getIndeterminateDrawable().setColorFilter(color, mode);
                if (this.mapLoadingProgressBar.getProgressDrawable() != null)
                    this.mapLoadingProgressBar.getProgressDrawable().setColorFilter(color, mode);
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
            if(annotation.getCluster()) {
                mClusterManager.addItem(annotation);
            } else {
                // Add marker to MarkerCollection directly. This makes markers not cluster.
                Marker marker = mClusterManager.getMarkerCollection().addMarker(annotation.getMarkerOptions());
                annotation.setFeature(marker);
                markerMap.put(marker, annotation);
            }
            features.add(index, annotation);

        } else if (child instanceof AirMapPolyline) {
            AirMapPolyline polylineView = (AirMapPolyline) child;
            polylineView.addToMap(map);
            features.add(index, polylineView);
            Polyline polyline = (Polyline) polylineView.getFeature();
            polylineMap.put(polyline, polylineView);
        } else if (child instanceof AirMapPolygon) {
            AirMapPolygon polygonView = (AirMapPolygon) child;
            polygonView.addToMap(map);
            features.add(index, polygonView);
            Polygon polygon = (Polygon) polygonView.getFeature();
            polygonMap.put(polygon, polygonView);
        } else if (child instanceof AirMapCircle) {
            AirMapCircle circleView = (AirMapCircle) child;
            circleView.addToMap(map);
            features.add(index, circleView);
        } else if (child instanceof AirMapUrlTile) {
            AirMapUrlTile urlTileView = (AirMapUrlTile) child;
            urlTileView.addToMap(map);
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
            AirMapMarker annotation = (AirMapMarker) feature;
            if(annotation.getCluster()) {
                mClusterManager.removeItem(annotation);
            } else {
                mClusterManager.getMarkerCollection().remove((Marker)annotation.getFeature());
                markerMap.remove(annotation.getFeature());
            }
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
        // if boundsToMove is not null, we now have the MapView's width/height, so we can apply
        // a proper camera move
        if (boundsToMove != null) {
            HashMap<String, Float> data = (HashMap<String, Float>) extraData;
            float width = data.get("width");
            float height = data.get("height");
            map.moveCamera(
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
        if (map != null) {
            startMonitoringRegion();
            map.animateCamera(CameraUpdateFactory.newLatLngBounds(bounds, 0), duration, null);
        }
    }

    public void animateToCoordinate(LatLng coordinate, int duration) {
        if (map != null) {
            startMonitoringRegion();
            map.animateCamera(CameraUpdateFactory.newLatLng(coordinate), duration, null);
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
                map.animateCamera(cu);
            } else {
                map.moveCamera(cu);
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
                String identifier = ((AirMapMarker)feature).getIdentifier();
                Marker marker = (Marker)feature.getFeature();
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
                map.animateCamera(cu);
            } else {
                map.moveCamera(cu);
            }
        }
    }

    public void fitToCoordinates(ReadableArray coordinatesArray, ReadableMap edgePadding, boolean animated) {
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
            map.setPadding(edgePadding.getInt("left"), edgePadding.getInt("top"), edgePadding.getInt("right"), edgePadding.getInt("bottom"));
        }

        if (animated) {
            startMonitoringRegion();
            map.animateCamera(cu);
        } else {
            map.moveCamera(cu);
        }
        map.setPadding(0, 0, 0, 0); // Without this, the Google logo is moved up by the value of edgePadding.bottom
    }

    // InfoWindowAdapter interface

    @Override
    public View getInfoWindow(Marker marker) {
        AirMapMarker markerView = markerMap.get(marker);
        if(markerView != null) {
            return markerView.getCallout();
        } else {
            return null;
        }
    }

    @Override
    public View getInfoContents(Marker marker) {
        AirMapMarker markerView = markerMap.get(marker);
        if(markerView != null) {
            return markerView.getInfoContents();
        } else {
            return null;
        }
    }

    @Override
    public boolean dispatchTouchEvent(MotionEvent ev) {
        scaleDetector.onTouchEvent(ev);
        gestureDetector.onTouchEvent(ev);

        int action = MotionEventCompat.getActionMasked(ev);

        switch (action) {
            case (MotionEvent.ACTION_DOWN):
                this.getParent().requestDisallowInterceptTouchEvent(
                        map != null && map.getUiSettings().isScrollGesturesEnabled());
                isTouchDown = true;
                break;
            case (MotionEvent.ACTION_MOVE):
                startMonitoringRegion();
                break;
            case (MotionEvent.ACTION_UP):
                // Clear this regardless, since isScrollGesturesEnabled() may have been updated
                this.getParent().requestDisallowInterceptTouchEvent(false);
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

            Projection projection = map.getProjection();
            VisibleRegion region = (projection != null) ? projection.getVisibleRegion() : null;
            LatLngBounds bounds = (region != null) ? region.latLngBounds : null;

            if ((bounds != null) &&
                (lastBoundsEmitted == null || LatLngBoundsUtils.BoundsAreDifferent(bounds, lastBoundsEmitted))) {
                LatLng center = map.getCameraPosition().target;
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
                new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
            this.cacheImageView.setVisibility(View.INVISIBLE);
        }
        return this.cacheImageView;
    }

    private void removeCacheImageView() {
        if (this.cacheImageView != null) {
            ((ViewGroup)this.cacheImageView.getParent()).removeView(this.cacheImageView);
            this.cacheImageView = null;
        }
    }

    private void removeMapLoadingProgressBar() {
        if (this.mapLoadingProgressBar != null) {
            ((ViewGroup)this.mapLoadingProgressBar.getParent()).removeView(this.mapLoadingProgressBar);
            this.mapLoadingProgressBar = null;
        }
    }

    private void removeMapLoadingLayoutView() {
        this.removeMapLoadingProgressBar();
        if (this.mapLoadingLayout != null) {
            ((ViewGroup)this.mapLoadingLayout.getParent()).removeView(this.mapLoadingLayout);
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
                    @Override public void onSnapshotReady(Bitmap bitmap) {
                        cacheImageView.setImageBitmap(bitmap);
                        cacheImageView.setVisibility(View.VISIBLE);
                        mapLoadingLayout.setVisibility(View.INVISIBLE);
                    }
                });
            }
        }
        else {
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
        manager.pushEvent(context, this, "onPanDrag", event);
    }
}
