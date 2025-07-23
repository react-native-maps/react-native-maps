package com.rnmaps.fabric;


import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.viewmanagers.RNMapsCalloutManagerDelegate;
import com.facebook.react.viewmanagers.RNMapsCalloutManagerInterface;
import com.rnmaps.maps.MapCallout;
import com.rnmaps.maps.SizeReportingShadowNode;

import java.util.HashMap;
import java.util.Map;

@ReactModule(name = CalloutManager.REACT_CLASS)
public class CalloutManager extends ViewGroupManager<MapCallout> implements RNMapsCalloutManagerInterface<MapCallout> {

    public CalloutManager(ReactApplicationContext context){
        super(context);
    }
    private final RNMapsCalloutManagerDelegate<MapCallout, CalloutManager> delegate =
            new RNMapsCalloutManagerDelegate<>(this);

    @Override
    public ViewManagerDelegate<MapCallout> getDelegate() {
        return delegate;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public MapCallout createViewInstance(ThemedReactContext context) {
        return new MapCallout(context);
    }


    public static final String REACT_CLASS = "RNMapsCallout";

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
        return MapCallout.getExportedCustomBubblingEventTypeConstants();
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return new HashMap<>();
    }


    @Override
    public void setAlphaHitTest(MapCallout view, boolean value) {
    /// do nothing
    }

    @Override
    public void setTooltip(MapCallout view, boolean value) {
            view.setTooltip(value);
    }
    @Override
    public LayoutShadowNode createShadowNodeInstance() {
        // we use a custom shadow node that emits the width/height of the view
        // after layout with the updateExtraData method. Without this, we can't generate
        // a bitmap of the appropriate width/height of the rendered view.
        return new SizeReportingShadowNode();
    }

}