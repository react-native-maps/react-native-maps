package com.airbnb.android.react.maps.osmdroid;

import com.airbnb.android.react.maps.SizeReportingShadowNode;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

import javax.annotation.Nullable;

public class OsmMapCalloutManager extends ViewGroupManager<OsmMapCallout> {

    @Override
    public String getName() {
        return "OsmMapCallout";
    }

    @Override
    public OsmMapCallout createViewInstance(ThemedReactContext context) {
        return new OsmMapCallout(context);
    }

    @ReactProp(name = "tooltip", defaultBoolean = false)
    public void setTooltip(OsmMapCallout view, boolean tooltip) {
        view.setTooltip(tooltip);
    }

    @Override
    @Nullable
    public Map getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.of("onPress", MapBuilder.of("registrationName", "onPress"));
    }

    @Override
    public LayoutShadowNode createShadowNodeInstance() {
        // we use a custom shadow node that emits the width/height of the view
        // after layout with the updateExtraData method. Without this, we can't generate
        // a bitmap of the appropriate width/height of the rendered view.
        return new SizeReportingShadowNode();
    }

    @Override
    public void updateExtraData(OsmMapCallout view, Object extraData) {
        // This method is called from the shadow node with the width/height of the rendered
        // marker view.
        //noinspection unchecked
        Map<String, Float> data = (Map<String, Float>) extraData;
        float width = data.get("width");
        float height = data.get("height");
        view.width = (int) width;
        view.height = (int) height;
    }

}
