package com.rnmaps.maps;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.drawable.Animatable;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.view.View;
import android.widget.LinearLayout;
import android.animation.ObjectAnimator;
import android.util.Property;
import android.animation.TypeEvaluator;

import androidx.annotation.Nullable;

import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.AdvancedMarkerOptions;
import com.rnmaps.maps.MapMarker;

public class AdvancedMapMarker extends MapMarker {
  private String collisionBehavior = "required";

  public AdvancedMapMarker(Context context, MapMarkerManager markerManager) {
    super(context, markerManager);
  }

  public AdvancedMapMarker(Context context, MarkerOptions options, MapMarkerManager markerManager) {
    super(context, options, markerManager);
  }

  public String getCollisionBehavior() {
    return collisionBehavior;
  }

  public void setCollisionBehavior(String collisionBehavior) {
    this.collisionBehavior = collisionBehavior;
    update(false);
  }

  @Override
  public MarkerOptions getMarkerOptions() {
    if (markerOptions == null) {
      int markerCollisionBehavior = translateCollisionBehavior();

      markerOptions = new AdvancedMarkerOptions().collisionBehavior(markerCollisionBehavior);
    }

    fillMarkerOptions(markerOptions);
    return markerOptions;
  }

  private int translateCollisionBehavior() {
    int translatedCollisionBehavior = AdvancedMarkerOptions.CollisionBehavior.REQUIRED;

    switch (collisionBehavior) {
      case "required":
        translatedCollisionBehavior = AdvancedMarkerOptions.CollisionBehavior.REQUIRED;
        break;
      case "optionalAndHidesLowerPriority":
        translatedCollisionBehavior = AdvancedMarkerOptions.CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY;
        break;
      case "requiredAndHidesOptional":
        translatedCollisionBehavior = AdvancedMarkerOptions.CollisionBehavior.REQUIRED_AND_HIDES_OPTIONAL;
        break;
    }

    return translatedCollisionBehavior;
  }

}
