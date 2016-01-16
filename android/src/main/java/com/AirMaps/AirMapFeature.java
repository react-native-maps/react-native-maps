package com.AirMaps;

import com.facebook.react.views.view.ReactViewGroup;
import com.google.android.gms.maps.GoogleMap;
import android.content.Context;

public abstract class AirMapFeature extends ReactViewGroup {
    public AirMapFeature(Context context) { super(context); }
    public abstract void addToMap(GoogleMap map);
    public abstract void removeFromMap(GoogleMap map);
    public abstract Object getFeature();
}
