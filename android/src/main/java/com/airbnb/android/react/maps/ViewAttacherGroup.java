package com.airbnb.android.react.maps;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Rect;
import android.os.Build;

import com.facebook.react.uimanager.ViewProps;
import com.facebook.react.views.view.ReactViewGroup;

public class ViewAttacherGroup extends ReactViewGroup {

  public ViewAttacherGroup(Context context) {
    super(context);

    this.setWillNotDraw(true);
    this.setVisibility(VISIBLE);
    this.setAlpha(0.0f);
    this.setRemoveClippedSubviews(false);
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR2) {
      this.setClipBounds(new Rect(0, 0, 0, 0));
    }
    this.setOverflow("hidden"); // Change to ViewProps.HIDDEN until RN 0.57 is base
  }

  // This should make it more performant, avoid trying to hard to overlap layers with opacity.
  @Override
  public boolean hasOverlappingRendering() {
    return false;
  }
}
