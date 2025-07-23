package com.rnmaps.maps;

import android.content.Context;
import android.graphics.Color;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
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
import com.google.android.gms.maps.model.StrokeStyle;
import com.google.android.gms.maps.model.StyleSpan;
import com.google.maps.android.collections.PolylineManager;
import com.rnmaps.fabric.event.OnPressEvent;

import java.util.Arrays;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class MapPolyline extends MapFeature {

  private PolylineManager.Collection polylineCollection;
  private List<Polyline> polylineArray;
  private List<PolylineOptions> polylineOptions;
  private Polyline polyline;

  private List<LatLng> coordinates;
  private List<String> strokeColors;
  private Integer lineDashPatternDash;
  private Integer lineDashPatternGap;
  private int color;
  private float width;
  private boolean geodesic;
  private float zIndex;
  private String type;

    public MapPolyline(Context context) {
        super(context);
    }

  public void setType(String type) {
    this.type = type;
  }

  public void setSyncedCoordsColors(ReadableArray syncedCoordsColors) {
    this.coordinates = new ArrayList<>(syncedCoordsColors.getArray(0).size());
    for (int i = 0; i < syncedCoordsColors.getArray(0).size(); i++) {
      ReadableMap coordinate = syncedCoordsColors.getArray(0).getMap(i);
      this.coordinates.add(i,
        new LatLng(coordinate.getDouble("latitude"), coordinate.getDouble("longitude")));
    }

    if(syncedCoordsColors.getArray(1) != null){
        this.strokeColors = new ArrayList<>(syncedCoordsColors.getArray(1).size());
        for (int i = 0; i < syncedCoordsColors.getArray(1).size(); i++) {
          String strokeColor = syncedCoordsColors.getArray(1).getString(i);
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

  public void setColor(int color) {
         this.color = color;
        if (polyline != null) {
            polyline.setColor(color);
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

  public void setLineDashPattern(ReadableArray lineDashPattern) {
    if(lineDashPattern != null && lineDashPattern.size() > 0){
      this.lineDashPatternDash = lineDashPattern.getInt(0);
      this.lineDashPatternGap = lineDashPattern.getInt(1);
    }
  }

  private void createPolyline() {
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
    this.polylineCollection = (PolylineManager.Collection) collection;
    createPolyline();
    this.polylineArray = new ArrayList<>(this.polylineOptions.size());
    for (int i = 0; i < this.polylineOptions.size(); i++) {
      Polyline segment = this.polylineCollection.addPolyline(this.polylineOptions.get(i));
      segment.setClickable(false);
      polyline = segment;
      this.polylineArray.add(i, segment);
    }
  }

  @Override
  public void removeFromMap(Object collection) {
    PolylineManager.Collection polylineCollection = (PolylineManager.Collection) collection;
    for (int i = 0; i < this.polylineArray.size(); i++) {
      Polyline segment = this.polylineArray.get(i);
      segment.remove();
      polylineCollection.remove(segment);
    }
    this.polylineArray.clear();
    this.polylineOptions.clear();
  }
}
