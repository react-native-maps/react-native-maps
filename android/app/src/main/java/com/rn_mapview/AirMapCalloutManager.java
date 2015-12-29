package com.rn_mapview;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ReactProp;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.Map;

import javax.annotation.Nullable;

public class AirMapCalloutManager extends ViewGroupManager<AirMapCallout> {

    @Override
    public String getName() {
        return "AIRMapCallout";
    }

    @Override
    public AirMapCallout createViewInstance(ThemedReactContext context) {
        return new AirMapCallout(context);
    }

    @ReactProp(name = "tooltip", defaultBoolean = false)
    public void setTooltip(AirMapCallout view, boolean tooltip) {
        view.setTooltip(tooltip);
    }

    @Override
    public @Nullable Map getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.of(
            "onPress", MapBuilder.of("registrationName", "onPress")
        );
    }

}
