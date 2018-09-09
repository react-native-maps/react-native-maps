package com.airbnb.android.react.maps;

import android.content.Context;

import com.facebook.react.views.view.ReactViewGroup;

public class ViewAttacherGroup extends ReactViewGroup {

  public ViewAttacherGroup(Context context) {
    super(context);
  }

  // This should make it more performant, avoid trying to hard to overlap layers with opacity.
  @Override
  public boolean hasOverlappingRendering() {
    return false;
  }
}
