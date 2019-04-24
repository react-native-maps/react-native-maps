package com.airbnb.android.react.maps;

import com.facebook.react.bridge.ReadableMap;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;

public class AirMapCity {

    private final String id;
    private final LatLngBounds bounds;
    private final LatLng pinPosition;
    private final String iconSrc;

    private AirMapMarker marker;

    public AirMapCity(ReadableMap city) {
        this.id = city.getString("id");
        ReadableMap cityBounds = city.getMap("bounds");
        ReadableMap topLeft = cityBounds.getMap("topLeft");
        ReadableMap bottomRight = cityBounds.getMap("bottomRight");
        this.bounds = new LatLngBounds(
                new LatLng(bottomRight.getDouble("lat"), topLeft.getDouble("lon")), // southwest
                new LatLng(topLeft.getDouble("lat"), bottomRight.getDouble("lon"))  // northeast
        );
        ReadableMap position = city.getMap("pos");
        this.pinPosition = new LatLng(position.getDouble("latitude"), position.getDouble("longitude"));
        this.iconSrc = city.getString("image");
    }

    public LatLngBounds getBounds() {
        return bounds;
    }

    public LatLng getPinPosition() {
        return pinPosition;
    }

    public String getIconSrc() {
        return iconSrc;
    }

    public AirMapMarker getMarker() {
        return marker;
    }

    public AirMapCity setMarker(AirMapMarker marker) {
        this.marker = marker;
        return this;
    }

    public String getId() {
        return id;
    }
}
