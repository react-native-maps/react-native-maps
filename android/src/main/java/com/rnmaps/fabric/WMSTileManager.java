package com.rnmaps.fabric;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.viewmanagers.RNMapsWMSTileManagerDelegate;
import com.facebook.react.viewmanagers.RNMapsWMSTileManagerInterface;
import com.rnmaps.maps.MapWMSTile;

import java.util.HashMap;
import java.util.Map;

@ReactModule(name = WMSTileManager.REACT_CLASS)
public class WMSTileManager extends ViewGroupManager<MapWMSTile> implements RNMapsWMSTileManagerInterface<MapWMSTile> {
    public static final String REACT_CLASS = "RNMapsWMSTile";

    public WMSTileManager(ReactApplicationContext context) {
        super(context);
    }

    private final RNMapsWMSTileManagerDelegate<MapWMSTile, WMSTileManager> delegate =
            new RNMapsWMSTileManagerDelegate<>(this);

    @Override
    public ViewManagerDelegate<MapWMSTile> getDelegate() {
        return delegate;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public MapWMSTile createViewInstance(ThemedReactContext context) {
        return new MapWMSTile(context);
    }


    @Nullable
    @Override
    public Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
        return new HashMap<>();
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return new HashMap<>();
    }

    @Override
    public void setMaximumNativeZ(MapWMSTile view, int value) {
        view.setMaximumNativeZ(value);
    }

    @Override
    public void setMaximumZ(MapWMSTile view, int value) {
        view.setMaximumZ(value);
    }

    @Override
    public void setMinimumZ(MapWMSTile view, int value) {
        view.setMinimumZ(value);
    }

    @Override
    public void setOfflineMode(MapWMSTile view, boolean value) {
        view.setOfflineMode(value);
    }

    @Override
    public void setShouldReplaceMapContent(MapWMSTile view, boolean value) {
        // not supported
    }

    @Override
    public void setZIndex(@NonNull MapWMSTile view, float zIndex) {
        super.setZIndex(view, zIndex);
        view.setZIndex(zIndex);
    }

    @Override
    public void setOpacity(@NonNull MapWMSTile view, float opacity) {
        super.setOpacity(view, opacity);
        view.setOpacity(opacity);
    }

    @Override
    public void setTileCacheMaxAge(MapWMSTile view, int value) {
        view.setTileCacheMaxAge(value);
    }

    @Override
    public void setTileCachePath(MapWMSTile view, @Nullable String value) {
        view.setTileCachePath(value);
    }

    @Override
    public void setTileSize(MapWMSTile view, int value) {
        view.setTileSize(value);
    }

    @Override
    public void setUrlTemplate(MapWMSTile view, @Nullable String value) {
        view.setUrlTemplate(value);
    }

}
