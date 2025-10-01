package com.rnmaps.maps;

import android.content.Context;
import android.graphics.Color;
import android.util.Log;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.google.android.gms.maps.model.ButtCap;
import com.google.android.gms.maps.model.Cap;
import com.google.android.gms.maps.model.Dash;
import com.google.android.gms.maps.model.Dot;
import com.google.android.gms.maps.model.Gap;
import com.google.android.gms.maps.model.JointType;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.PatternItem;
import com.google.android.gms.maps.model.Polyline;
import com.google.android.gms.maps.model.PolylineOptions;
import com.google.android.gms.maps.model.RoundCap;
import com.google.android.gms.maps.model.SquareCap;
import com.google.android.gms.maps.model.StyleSpan;
import com.google.maps.android.collections.PolylineManager;
import com.rnmaps.fabric.event.OnPressEvent;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

public class MapPolyline extends MapFeature {

    private List<Polyline> polylineArray;
    private List<PolylineOptions> polylineOptions;
    private Polyline polyline;
    private Integer lineDashPatternDash;
    private Integer lineDashPatternGap;

    private List<LatLng> coordinates;
    private List<String> strokeColors;
    private int color;
    private float width;
    private boolean tappable;
    private boolean geodesic;
    private float zIndex;
    private Cap lineCap = new RoundCap();
    private ReadableArray patternValues;
    private List<PatternItem> pattern;

    private PolylineManager.Collection polylineCollection;

    public MapPolyline(Context context) {
        super(context);
    }

    public void setCoordinates(ReadableArray coordinates) {
        /*
        this.coordinates = new ArrayList<>(coordinates.size());
        for (int i = 0; i < coordinates.size(); i++) {
            ReadableMap coordinate = coordinates.getMap(i);
            this.coordinates.add(i,
                    new LatLng(coordinate.getDouble("latitude"), coordinate.getDouble("longitude")));
        }
        if (polyline != null) {
            polyline.setPoints(this.coordinates);
        }
         */
    }

    public void setColor(int color) {
        this.color = color;
        if (polyline != null) {
            polyline.setColor(color);
        }
    }

    public void setStrokeColors(ReadableArray strokeColors) {
        /*
        List<StyleSpan> spans = new ArrayList<>();
        for (int i = 0; i < strokeColors.size(); i++) {
            StrokeStyle stroke;

            if (i == 0) {
                stroke = StrokeStyle.colorBuilder(strokeColors.getInt(i)).build();
            } else {
                stroke = StrokeStyle.gradientBuilder(strokeColors.getInt(i - 1), strokeColors.getInt(i)).build();
            }
            spans.add(new StyleSpan(stroke));
        }
        this.spans = spans;
        if (polyline != null){
            polyline.setSpans(spans);
        }
        */
    }

    public void setSyncedCoordsColors(ReadableMap polylineData) {
        if (polylineData == null) {
            return;
        }

        // Get data by key from the ReadableMap
        String type = polylineData.getString("type");
        ReadableArray coordinatesArray = polylineData.getArray("coordinates");
        ReadableArray colorsArray = polylineData.getArray("colors");

        this.coordinates = new ArrayList<>(coordinatesArray.size());
        for (int i = 0; i < coordinatesArray.size(); i++) {
            ReadableMap coordinate = coordinatesArray.getMap(i);
            this.coordinates.add(i,
                    new LatLng(coordinate.getDouble("latitude"), coordinate.getDouble("longitude")));
        }

        if(colorsArray != null){
            this.strokeColors = new ArrayList<>(colorsArray.size());
            for (int i = 0; i < colorsArray.size(); i++) {
                String strokeColor;
                if (colorsArray.getType(i) == com.facebook.react.bridge.ReadableType.String) {
                    strokeColor = colorsArray.getString(i);
                } else {
                    strokeColor = "#000000";
                }
                this.strokeColors.add(i, strokeColor);
            }
        }

        if (polyline != null && (type.equals("fake") || type.equals("single"))) {
            polyline.setPoints(this.coordinates);
        } else if (polyline != null && type.equals("actual")){
            removeFromMap(this.polylineCollection);
            addToMap(this.polylineCollection);
        }
    }

    public void setWidth(float width) {
        this.width = width;
        if (polyline != null) {
            polyline.setWidth(width);
        }
    }

    public void setZIndex(float zIndex) {
        this.zIndex = zIndex;
        if (polyline != null) {
            polyline.setZIndex(zIndex);
        }
    }

    public void setTappable(boolean tapabble) {
        this.tappable = tapabble;
        if (polyline != null) {
            polyline.setClickable(tappable);
        }
    }

    public void setGeodesic(boolean geodesic) {
        this.geodesic = geodesic;
        if (polyline != null) {
            polyline.setGeodesic(geodesic);
        }
    }

    public void setLineCap(Cap cap) {
        this.lineCap = cap;
        if (polyline != null) {
            polyline.setStartCap(cap);
            polyline.setEndCap(cap);
        }
        this.applyPattern();
    }

    public void setLineDashPattern(ReadableArray patternValues) {
        if(patternValues != null && patternValues.size() > 0){
            this.lineDashPatternDash = patternValues.getInt(0);
            this.lineDashPatternGap = patternValues.getInt(1);
        }
        this.patternValues = patternValues;
        this.applyPattern();
    }

    private void applyPattern() {
        if (patternValues == null) {
            return;
        }
        this.pattern = new ArrayList<>(patternValues.size());
        for (int i = 0; i < patternValues.size(); i++) {
            float patternValue = (float) patternValues.getDouble(i);
            boolean isGap = i % 2 != 0;
            if (isGap) {
                this.pattern.add(new Gap(patternValue));
            } else {
                PatternItem patternItem;
                boolean isLineCapRound = this.lineCap instanceof RoundCap;
                if (isLineCapRound) {
                    patternItem = new Dot();
                } else {
                    patternItem = new Dash(patternValue);
                }
                this.pattern.add(patternItem);
            }
        }
        if (polyline != null) {
            polyline.setPattern(this.pattern);
        }
    }

    private void createPolyline() {
        if (coordinates == null) {
            return;
        }
        this.polylineOptions = new ArrayList<>(coordinates.size());
        for (int i = 0; i < coordinates.size()-1; i++) {
            PolylineOptions options = new PolylineOptions();

            LatLng coordinate = coordinates.get(i);
            options.add(coordinate);

            LatLng coordinate2 = coordinates.get(i+1);
            options.add(coordinate2);

            Integer colorToUse;

            if((strokeColors != null) && (strokeColors.size() > 0) && (strokeColors.size() == coordinates.size()) && (!"undefined".equals(strokeColors.get(i))) && (strokeColors.get(i) != null)){
                colorToUse = Color.parseColor(strokeColors.get(i));
            } else {
                colorToUse = color;
            }

            options.color(colorToUse);
            options.width(width);
            options.geodesic(geodesic);
            options.zIndex(zIndex);

            if(lineDashPatternDash != null){
                List<PatternItem> pattern = Arrays.<PatternItem>asList(new Dash(this.lineDashPatternDash), new Gap(this.lineDashPatternGap));
                options.pattern(pattern);
            }

            this.polylineOptions.add(i, options);
        }
    }

    @Override
    public Object getFeature() {
        return polyline;
    }

    @Override
    public void addToMap(Object collection) {
        PolylineManager.Collection polylineCollection = (PolylineManager.Collection) collection;
        createPolyline();
        if(this.polylineOptions == null) {
            return;
        }
        this.polylineArray = new ArrayList<>(this.polylineOptions.size());
        for (int i = 0; i < this.polylineOptions.size(); i++) {
            Polyline segment = polylineCollection.addPolyline(this.polylineOptions.get(i));
            segment.setClickable(false);
            polyline = segment;
            this.polylineArray.add(i, segment);
        }
        this.polylineCollection = polylineCollection;
    }

    public void doDestroy() {
        this.removeFromMap(this.polylineCollection);
    }

    @Override
    public void removeFromMap(Object collection) {
        PolylineManager.Collection polylineCollection = (PolylineManager.Collection) collection;
        if(this.polylineArray != null){
            for (int i = 0; i < this.polylineArray.size(); i++) {
                Polyline segment = this.polylineArray.get(i);
                segment.remove();
                polylineCollection.remove(segment);
            }
            this.polylineArray.clear();
            this.polylineOptions.clear();
        }
    }

    public void setLineCap(String lineCap) {
        Cap cap;
        switch (lineCap) {
            case "round":
                cap = new RoundCap();
                break;
            case "square":
                cap = new SquareCap();
                break;
            case "butt":
            default:
                cap = new ButtCap();
                break;
        }
        setLineCap(cap);
    }

    public static Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
        MapBuilder.Builder<String, Object> builder = MapBuilder.builder();
        builder.put(OnPressEvent.EVENT_NAME, MapBuilder.of("registrationName", OnPressEvent.EVENT_NAME));
        return builder.build();
    }

    public void setLineJoin(String lineJoin) {
        int type;
        switch (lineJoin) {
            case "round":
                type = JointType.ROUND;
                break;
            case "bevel":
                type = JointType.BEVEL;
                break;
            case "miter":
            default:
                type = JointType.DEFAULT;
                break;
        }
        if (polyline != null) {
            polyline.setJointType(type);
        }
    }
}