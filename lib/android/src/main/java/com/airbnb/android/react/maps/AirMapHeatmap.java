package com.airbnb.android.react.maps;

import android.content.Context;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.model.TileOverlay;
import com.google.android.gms.maps.model.TileOverlayOptions;
import com.google.android.gms.maps.model.LatLng;
import com.google.maps.android.heatmaps.HeatmapTileProvider;
import com.google.maps.android.heatmaps.WeightedLatLng;

import java.util.ArrayList;
import java.util.List;

public class AirMapHeatmap extends AirMapFeature {

    private TileOverlayOptions heatmapOptions;
    private TileOverlay heatmap;
    private HeatmapTileProvider heatmapTileProvider;

    private List<WeightedLatLng> points;

    public AirMapHeatmap(Context context) {
        super(context);
    }

    public void setPoints(ReadableArray points) {
        // it's kind of a bummer that we can't run map() or anything on the ReadableArray
        this.points = new ArrayList<WeightedLatLng>(points.size());
        for (int i = 0; i < points.size(); i++) {
            ReadableMap point = points.getMap(i);
            WeightedLatLng weightedLatLng;
            LatLng latLng = new LatLng(point.getDouble("latitude"), point.getDouble("longitude"));
            if (point.getDouble("weight") != 0) {
                weightedLatLng = new WeightedLatLng(latLng, point.getDouble("weight"));
            } else {
                weightedLatLng = new WeightedLatLng(latLng);
            }
            this.points.add(i, weightedLatLng);
        }
        if (heatmapTileProvider != null) {
            heatmapTileProvider.setWeightedData(this.points);
        }
        if (heatmap != null) {
            heatmap.clearTileCache();
        }
    }

    public TileOverlayOptions getHeatmapOptions() {
        if (heatmapOptions == null) {
            heatmapOptions = createHeatmapOptions();
        }
        return heatmapOptions;
    }

    private TileOverlayOptions createHeatmapOptions() {
        TileOverlayOptions options = new TileOverlayOptions();
        if (heatmapTileProvider == null) {
            heatmapTileProvider = new HeatmapTileProvider.Builder().weightedData(this.points).build();
        }
        options.tileProvider(heatmapTileProvider);
        return options;
    }

    @Override
    public Object getFeature() {
        return heatmap;
    }

    @Override
    public void addToMap(GoogleMap map) {
        heatmap = map.addTileOverlay(getHeatmapOptions());
    }

    @Override
    public void removeFromMap(GoogleMap map) {
        heatmap.remove();
    }

}
