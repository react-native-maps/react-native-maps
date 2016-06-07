package com.airbnb.android.react.maps;

import com.google.android.gms.maps.GoogleMapOptions;

public class AirMapLiteManager extends AirMapManager {

    public static final String REACT_CLASS = "AIRMapLite";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    public AirMapLiteManager(AirMapMarkerManager markerManager, AirMapPolylineManager polylineManager, AirMapPolygonManager polygonManager, AirMapCircleManager circleManager) {
        super(markerManager, polylineManager, polygonManager, circleManager);
        this.googleMapOptions = new GoogleMapOptions().liteMode(true);
    }

}
