package com.rnmaps.maps;

import android.content.Context;
import android.graphics.Color;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.google.android.gms.maps.model.Cap;
import com.google.android.gms.maps.model.Dash;
import com.google.android.gms.maps.model.Dot;
import com.google.android.gms.maps.model.Gap;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.PatternItem;
import com.google.android.gms.maps.model.Polyline;
import com.google.android.gms.maps.model.PolylineOptions;
import com.google.android.gms.maps.model.RoundCap;
import com.google.android.gms.maps.model.StrokeStyle;
import com.google.android.gms.maps.model.StyleSpan;
import com.google.maps.android.collections.PolylineManager;

import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;
import android.os.Handler;
import android.os.Looper;

public class MapPolyline extends MapFeature {

  private PolylineOptions polylineOptions;
  private Polyline polyline;
  private Polyline animatedPolyline;

  private List<LatLng> coordinates;
  private int color;
  private float width;
  private boolean tappable;
  private boolean geodesic;
  private float zIndex;
  private Cap lineCap = new RoundCap();
  private ReadableArray patternValues;
  private List<PatternItem> pattern;
  private StyleSpan styleSpan = null;
  private int animateColor = Color.parseColor("#FFFFFF");
  private Timer animationTimer;
  private TimerTask animationTask;
  private float drawDone = 0;

  public MapPolyline(Context context) {
    super(context);
  }

  public void startPolylineAnimation(final int animateColor, final int animationDuration, final int delay) {
    stopPolylineAnimation();
    this.animateColor = animateColor;

    new Handler(Looper.getMainLooper()).postDelayed(() -> {
      animationTimer = new Timer();
      drawDone = 0;

      animationTask = new TimerTask() {
        @Override
        public void run() {
          if (drawDone <= 28) {
            drawDone += 2;
          } else if (drawDone <= 66) {
            drawDone += 4;
          } else if (drawDone <= 98) {
            drawDone += 2;
          } else if (drawDone <= 200) {
            drawDone += 2;
          } else {
            drawDone = 0;
          }

          new Handler(Looper.getMainLooper()).post(() -> updatePolyline());
        }
      };

      animationTimer.schedule(animationTask, 200, animationDuration);
    }, delay);
  }

  public void stopPolylineAnimation() {
    if (animationTimer != null) {
      animationTimer.cancel();
      animationTimer = null;
    }
    if (animationTask != null) {
      animationTask.cancel();
      animationTask = null;
    }
  }

  private void updatePolyline() {
    if (animatedPolyline == null || polyline == null || coordinates == null || coordinates.isEmpty()) return;

    if (drawDone >= 0 && drawDone <= 100) {
      int pointCount = coordinates.size();
      int countToAdd = (int) (pointCount * (drawDone / 100.0f));

      List<LatLng> updatedPoints = new ArrayList<>(coordinates.subList(0, countToAdd));

      animatedPolyline.setPoints(updatedPoints);
      animatedPolyline.setColor(animateColor);
      animatedPolyline.setVisible(true);

      polyline.setVisible(true);
    }
    else if (drawDone > 100 && drawDone <= 200) {
      float alpha = (drawDone - 100.0f) / 100.0f;
      int newColor = fadeColorToStatic(animateColor, color, alpha);
      animatedPolyline.setColor(newColor);

      if (drawDone == 200) {
        polyline.setVisible(true);
        animatedPolyline.setVisible(false);
        drawDone = 0;
      }
    }
  }

  private int fadeColorToStatic(int animateColor, int staticColor, float fraction) {
    fraction = Math.max(0, Math.min(fraction, 1));
    int fromAlpha = (int) (255 * (1 - fraction));
    int fadedAnimateColor = Color.argb(fromAlpha, Color.red(animateColor), Color.green(animateColor), Color.blue(animateColor));
    if (fraction >= 1) {
      return staticColor;
    }
    return fadedAnimateColor;
  }

  public void setCoordinates(ReadableArray coordinates) {
    this.coordinates = new ArrayList<>(coordinates.size());
    for (int i = 0; i < coordinates.size(); i++) {
      ReadableMap coordinate = coordinates.getMap(i);
      this.coordinates.add(i,
          new LatLng(coordinate.getDouble("latitude"), coordinate.getDouble("longitude")));
    }
    if (polyline != null) {
      polyline.setPoints(this.coordinates);
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

  public void setLineCap(Cap cap) {
    this.lineCap = cap;
    if (polyline != null) {
      polyline.setStartCap(cap);
      polyline.setEndCap(cap);
    }
    this.applyPattern();
  }

  public void setLineDashPattern(ReadableArray patternValues) {
    this.patternValues = patternValues;
    this.applyPattern();
  }

  private void applyPattern() {
    if(patternValues == null) {
      return;
    }
    this.pattern = new ArrayList<>(patternValues.size());
    for (int i = 0; i < patternValues.size(); i++) {
      float patternValue = (float) patternValues.getDouble(i);
      boolean isGap = i % 2 != 0;
      if(isGap) {
        this.pattern.add(new Gap(patternValue));
      }else {
        PatternItem patternItem;
        boolean isLineCapRound = this.lineCap instanceof RoundCap;
        if(isLineCapRound) {
          patternItem = new Dot();
        }else {
          patternItem = new Dash(patternValue);
        }
        this.pattern.add(patternItem);
      }
    }
    if(polyline != null) {
      polyline.setPattern(this.pattern);
    }
  }

  public void setStrokeColors(ReadableArray colors){
    if(colors.size() < 1) return;
    int n = colors.size();
    int start = Color.parseColor(colors.getString(0));
    int end =  Color.parseColor(colors.getString(n-1));
    this.styleSpan = new StyleSpan(StrokeStyle.gradientBuilder(start, end).build());
  }

  public PolylineOptions getPolylineOptions() {
    if (polylineOptions == null) {
      polylineOptions = createPolylineOptions();
    }
    return polylineOptions;
  }

  private PolylineOptions createPolylineOptions() {
    PolylineOptions options = new PolylineOptions();
    options.addAll(coordinates);
    options.color(color);
    options.width(width);
    options.geodesic(geodesic);
    options.zIndex(zIndex);
    options.startCap(lineCap);
    options.endCap(lineCap);
    options.pattern(this.pattern);
    if(this.styleSpan != null) options.addSpan(styleSpan);
    return options;
  }

  @Override
  public Object getFeature() {
    return polyline;
  }

  @Override
  public void addToMap(Object collection) {
    PolylineManager.Collection polylineCollection = (PolylineManager.Collection) collection;
    polyline = polylineCollection.addPolyline(getPolylineOptions());
    animatedPolyline = polylineCollection.addPolyline(new PolylineOptions().color(animateColor).width(width));
    polyline.setClickable(this.tappable);
  }

  @Override
  public void removeFromMap(Object collection) {
    PolylineManager.Collection polylineCollection = (PolylineManager.Collection) collection;
    stopPolylineAnimation();
    polylineCollection.remove(animatedPolyline);
    polylineCollection.remove(polyline);
  }
}
