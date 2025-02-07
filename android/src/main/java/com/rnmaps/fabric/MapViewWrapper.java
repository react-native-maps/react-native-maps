package com.rnmaps.fabric;

import static com.rnmaps.maps.MapManager.MY_LOCATION_PRIORITY;

import android.annotation.SuppressLint;
import android.content.Context;
import android.view.View;
import android.widget.FrameLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.google.android.gms.maps.GoogleMapOptions;
import com.rnmaps.maps.MapView;

@SuppressLint("ViewConstructor")
public class MapViewWrapper extends FrameLayout {
    private MapView mapView;
    private Boolean cacheEnabled;
    private Boolean initialCameraSet;

    private Boolean showsBuildings;
    private Boolean poiClickEnabled;
    private Boolean moveOnMarkerPress;
    private Boolean handlePanDrag;
    private Boolean showsIndoorLevelPicker;
    private Boolean showIndoors;
    private Boolean showsMyLocationButton;
    private Boolean showsUserLocation;
    private Boolean loadingEnabled;

    private ReadableMap camera;

    private ReadableMap initialRegion;

    private String kmlSrc;
    private ReadableMap region;
    private ReadableMap mapPadding;

    private Integer userLocationPriority;
    private Integer userLocationFastestInterval;
    private Integer userLocationUpdateInterval;
    private Integer loadingIndicatorColor;


    public MapViewWrapper(@NonNull Context context) {
        super(context);
        setLayoutParams(new LayoutParams(
                LayoutParams.MATCH_PARENT,
                LayoutParams.MATCH_PARENT
        ));
    }


    public MapView getMapView() {
        return mapView;
    }
    public void initializeMapView(GoogleMapOptions options) {
        if (mapView == null) {
            mapView = new MapView((ThemedReactContext) getContext(), options);
            mapView.setLayoutParams(new LayoutParams(
                    LayoutParams.MATCH_PARENT,
                    LayoutParams.MATCH_PARENT
            ));
            addView(mapView);
            if (cacheEnabled != null){
                setCacheEnabled(cacheEnabled);
            }
            if (showsBuildings != null){
                setShowsBuildings(showsBuildings);
            }
            if (poiClickEnabled != null){
                setPoiClickEnabled(poiClickEnabled);
            }
            if (moveOnMarkerPress != null){
                setMoveOnMarkerPress(moveOnMarkerPress);
            }
            if (handlePanDrag != null){
                setHandlePanDrag(handlePanDrag);
            }
            if (showsIndoorLevelPicker != null){
                setShowsIndoorLevelPicker(showsIndoorLevelPicker);
            }
            if (showIndoors != null){
                setShowsIndoors(showIndoors);
            }

            if (showsMyLocationButton != null){
                setShowsMyLocationButton(showsMyLocationButton);
            }
            if (showsUserLocation != null) {
                setShowsUserLocation(showsUserLocation);
            }
            if (loadingEnabled != null) {
                setLoadingEnabled(loadingEnabled);
            }
            if (camera != null){
                setCamera(camera);
            }
            if (kmlSrc != null){
                setKmlSrc(kmlSrc);
            }
            if (region != null){
                setRegion(region);
            }
            if (mapPadding != null){
                setMapPadding(mapPadding);
            }
            if (userLocationPriority != null) {
                mapView.setUserLocationPriority(userLocationPriority);
            }
            if (userLocationFastestInterval != null) {
                setUserLocationFastestInterval(userLocationFastestInterval);
            }
            if (userLocationUpdateInterval != null) {
                setUserLocationUpdateInterval(userLocationUpdateInterval);
            }
            if (loadingIndicatorColor != null) {
                setLoadingIndicatorColor(loadingIndicatorColor);
            }
            if (initialRegion != null){
                mapView.setInitialRegion(initialRegion);
            }
            if (initialCameraSet != null){
                mapView.setInitialCameraSet(initialCameraSet);
            }
        }
    }

    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        if (mapView != null) {
            mapView.onDestroy();
            removeView(mapView);
            mapView = null;
        }
    }

    public void setInitialCameraSet(boolean initialCameraSet) {
        this.initialCameraSet = initialCameraSet;
    }

    public void setInitialRegion(ReadableMap initialRegion) {
        this.initialRegion = initialRegion;
        if (getMapView() != null){
            getMapView().setInitialRegion(initialRegion);
        }
    }

    public void setCacheEnabled(boolean value) {
        if (getMapView() != null) {
            getMapView().setCacheEnabled(value);
        } else {
            cacheEnabled = value;
        }
    }


    public void setCamera(@Nullable ReadableMap value) {
        if (getMapView() != null) {
            getMapView().setCamera(value);
        } else {
            camera = value;
        }
    }


    public void setPoiClickEnabled(boolean value) {
        if (getMapView() != null) {
            getMapView().setPoiClickEnabled(value);
        } else {
            poiClickEnabled = value;
        }
    }
   
    public void prepareToRecycleView(){
        mapView = null;
        cacheEnabled = null;
        initialCameraSet = null;
        showsBuildings = null;
        poiClickEnabled = null;
        moveOnMarkerPress = null;
        handlePanDrag = null;
        showsIndoorLevelPicker = null;
        showIndoors = null;
        showsMyLocationButton = null;
        showsUserLocation = null;
        loadingEnabled = null;
        camera = null;
        initialRegion = null;
        userLocationPriority = null;
        userLocationFastestInterval = null;
        userLocationUpdateInterval = null;
        loadingIndicatorColor = null;
        if (getMapView() != null) {
            getMapView().onDestroy();
        }
        mapView = null;
    }



    public void setKmlSrc(@Nullable String value) {
        if (getMapView() != null) {
            getMapView().setKmlSrc(value);
        }
        kmlSrc = value;
    }


    public void setLoadingBackgroundColor(@Nullable Integer value) {
        getMapView().setLoadingBackgroundColor(value);
    }


    public void setLoadingEnabled(boolean value) {
        if (getMapView() != null) {
            getMapView().setLoadingEnabled(value);
        }
        loadingEnabled = value;
    }


    public void setLoadingIndicatorColor(@Nullable Integer value) {
        if (getMapView() != null) {
            getMapView().setLoadingIndicatorColor(value);
        }
        loadingIndicatorColor = value;
    }


    public void setMapPadding(@Nullable ReadableMap padding) {
        if (getMapView() != null) {
            int left = 0;
            int top = 0;
            int right = 0;
            int bottom = 0;
            double density = (double) getMapView().getResources().getDisplayMetrics().density;

            if (padding != null) {
                if (padding.hasKey("left")) {
                    left = (int) (padding.getDouble("left") * density);
                }

                if (padding.hasKey("top")) {
                    top = (int) (padding.getDouble("top") * density);
                }

                if (padding.hasKey("right")) {
                    right = (int) (padding.getDouble("right") * density);
                }

                if (padding.hasKey("bottom")) {
                    bottom = (int) (padding.getDouble("bottom") * density);
                }
            }

            getMapView().applyBaseMapPadding(left, top, right, bottom);
            getMapView().map.setPadding(left, top, right, bottom);
        }
        this.mapPadding = padding;
    }

    public void setMoveOnMarkerPress(boolean value) {
        if (getMapView() != null){
            getMapView().setMoveOnMarkerPress(value);
        }
        moveOnMarkerPress = value;
    }


    public void setHandlePanDrag(boolean value) {
        if (getMapView() != null) {
            getMapView().setHandlePanDrag(value);
        }
        handlePanDrag = value;
    }

    public void setRegion(@Nullable ReadableMap value) {
        if (getMapView() != null) {
            getMapView().setRegion(value);
        }
        region = value;
    }


    public void setShowsBuildings(boolean value) {
        showsBuildings = value;
        if (getMapView() != null){
            getMapView().setShowBuildings(value);
        }
    }


    public void setShowsCompass(boolean value) {
        if (getMapView() != null) {
            getMapView().setShowsCompass(value);
        }
    }


    public void setShowsIndoorLevelPicker(boolean value) {
        if (getMapView() != null) {
            getMapView().setShowsIndoorLevelPicker(value);
        }
        showsIndoorLevelPicker = value;
    }


    public void setShowsIndoors(boolean value) {
        if (getMapView() != null){
            getMapView().setShowIndoors(value);
        }

        showIndoors = value;
    }


    public void setShowsMyLocationButton(boolean value) {
        if (getMapView() != null) {
            getMapView().setShowsMyLocationButton(value);
        }
        showsMyLocationButton = value;
    }

    public void setShowsUserLocation(boolean value) {
        if (getMapView() != null) {
            getMapView().setShowsUserLocation(value);
        }
        showsUserLocation = value;
    }

    public void setUserLocationFastestInterval(int value) {
        if (getMapView() != null) {
            getMapView().setUserLocationFastestInterval(value);
        }
        userLocationFastestInterval = value;
    }


    public void setUserLocationPriority(@Nullable String value) {
        if (mapView != null) {
            mapView.setUserLocationPriority(MY_LOCATION_PRIORITY.get(value));
        } else {
            userLocationPriority = MY_LOCATION_PRIORITY.get(value);
        }
    }


    public void setUserLocationUpdateInterval(int value) {
        if (getMapView() != null) {
            getMapView().setUserLocationUpdateInterval(value);
        }
        userLocationUpdateInterval = value;
    }


    public void setZoomControlEnabled(boolean value) {
        getMapView().setZoomControlEnabled(value);
    }


    public void setZoomEnabled(boolean value) {
        getMapView().setZoomEnabled(value);
    }

}
