package com.rn_mapview;

import android.content.Context;
import android.view.ViewGroup;

import com.facebook.react.views.view.ReactViewGroup;

public class AirMapCallout extends ReactViewGroup {
    private boolean tooltip = false;
    public int width;
    public int height;

    public AirMapCallout(Context context) {
        super(context);
    }

    public void setTooltip(boolean tooltip) {
        this.tooltip = tooltip;
    }

    public boolean getTooltip() {
        return this.tooltip;
    }

}
