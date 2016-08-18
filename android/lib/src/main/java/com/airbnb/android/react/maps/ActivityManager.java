package com.airbnb.android.react.maps;

import android.app.Activity;

public class ActivityManager {

  public static Activity reactActivity;

  private static ActivityManager instance = new ActivityManager();

  public static ActivityManager getInstance() {
    return instance;
  }

  public ActivityManager() {

  }

  public void setActivity(Activity activity) {
    instance.reactActivity = activity;
  }

  public Activity getActivity() {
    return instance.reactActivity;
  }
}
