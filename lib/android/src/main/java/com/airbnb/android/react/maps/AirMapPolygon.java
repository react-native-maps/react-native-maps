package com.airbnb.android.react.maps;

import android.content.Context;
import android.util.Log;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Polygon;
import com.google.android.gms.maps.model.PolygonOptions;

import java.util.ArrayList;
import java.util.List;

public class AirMapPolygon extends AirMapFeature {
    private static final String TAG = AirMapPolygon.class.getName();

    private PolygonOptions polygonOptions;
    private Polygon polygon;

    private List<LatLng> coordinates;
    private List<List<LatLng>> holes;
    private int strokeColor;
    private int fillColor;
    private float strokeWidth;
    private boolean geodesic;
    private float zIndex;

    public AirMapPolygon(Context context) {
        super(context);
    }

    public void setCoordinates(ReadableArray coordinates) {
        // it's kind of a bummer that we can't run map() or anything on the ReadableArray
        this.coordinates = new ArrayList<>(coordinates.size());
        for (int i = 0; i < coordinates.size(); i++) {
            ReadableMap coordinate = coordinates.getMap(i);
            this.coordinates.add(i,
                    new LatLng(coordinate.getDouble("latitude"), coordinate.getDouble("longitude")));
        }
        if (polygon != null) {
            polygon.setPoints(this.coordinates);
        }
    }

    public void setHoles(ReadableArray holes) {
        // Convert ReadableArray<ReadableArray<ReadableMap>> into List<List<LatLng>>
        int holesSize = holes.size();
        this.holes = new ArrayList(holesSize);
        for (int i = 0; i < holesSize; i++) {
            ReadableArray hole = holes.getArray(i);
            if(hole.size() > 3) {
                List<LatLng> iterableHole = new ArrayList(hole.size());
                this.holes.add(iterableHole);

                if(BuildConfig.DEBUG){
                    ReadableMap coordinate0 = hole.getMap(0);
                    double lat0 = coordinate0.getDouble("latitude");
                    double lon0 = coordinate0.getDouble("longitude");

                    ReadableMap coordinate1 = hole.getMap(hole.size()-1);
                    double lat1 = coordinate1.getDouble("latitude");
                    double lon1 = coordinate1.getDouble("longitude");

                    if(lat0 != lat1 || lon0 != lon1) {
                        Log.e(TAG, "First and Last coordinates of the holes must be same");
                    }
                }

                for (int j = 0; j < hole.size(); j++) {
                    ReadableMap coordinate = hole.getMap(j);
                    iterableHole.add(new LatLng(coordinate.getDouble("latitude"), coordinate.getDouble("longitude")));
                }
            }
        }
        if (polygon != null) {
            polygon.setHoles(this.holes);
        }
    }

    public void setFillColor(int color) {
        this.fillColor = color;
        if (polygon != null) {
            polygon.setFillColor(color);
        }
    }

    public void setStrokeColor(int color) {
        this.strokeColor = color;
        if (polygon != null) {
            polygon.setStrokeColor(color);
        }
    }

    public void setStrokeWidth(float width) {
        this.strokeWidth = width;
        if (polygon != null) {
            polygon.setStrokeWidth(width);
        }
    }

    public void setGeodesic(boolean geodesic) {
        this.geodesic = geodesic;
        if (polygon != null) {
            polygon.setGeodesic(geodesic);
        }
    }

    public void setZIndex(float zIndex) {
        this.zIndex = zIndex;
        if (polygon != null) {
            polygon.setZIndex(zIndex);
        }
    }

    public PolygonOptions getPolygonOptions() {
        if (polygonOptions == null) {
            polygonOptions = createPolygonOptions();
        }
        return polygonOptions;
    }

    private PolygonOptions createPolygonOptions() {
        PolygonOptions options = new PolygonOptions();
        options.addAll(coordinates);
        if(holes != null && holes.size() > 0) {
            for(List<LatLng> hole : holes) {
                options.addHole(hole);
            }
        }
        options.fillColor(fillColor);
        options.strokeColor(strokeColor);
        options.strokeWidth(strokeWidth);
        options.geodesic(geodesic);
        options.zIndex(zIndex);
        return options;
    }

    @Override
    public Object getFeature() {
        return polygon;
    }

    @Override
    public void addToMap(GoogleMap map) {
        polygon = map.addPolygon(getPolygonOptions());
        polygon.setClickable(true);
    }

    @Override
    public void removeFromMap(GoogleMap map) {
        polygon.remove();
    }
}
