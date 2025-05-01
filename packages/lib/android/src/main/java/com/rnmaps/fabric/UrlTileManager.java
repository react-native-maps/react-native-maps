package com.rnmaps.fabric;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.viewmanagers.RNMapsUrlTileManagerDelegate;
import com.facebook.react.viewmanagers.RNMapsUrlTileManagerInterface;
import com.rnmaps.maps.MapPolyline;
import com.rnmaps.maps.MapUrlTile;

import java.util.HashMap;
import java.util.Map;

@ReactModule(name = UrlTileManager.REACT_CLASS)
public class UrlTileManager extends ViewGroupManager<MapUrlTile> implements RNMapsUrlTileManagerInterface<MapUrlTile> {
    public static final String REACT_CLASS = "RNMapsUrlTile";

    public UrlTileManager(ReactApplicationContext context) {
        super(context);
    }

    private final RNMapsUrlTileManagerDelegate<MapUrlTile, UrlTileManager> delegate =
            new RNMapsUrlTileManagerDelegate<>(this);

    @Override
    public ViewManagerDelegate<MapUrlTile> getDelegate() {
        return delegate;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public MapUrlTile createViewInstance(ThemedReactContext context) {
        return new MapUrlTile(context);
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
    public void setDoubleTileSize(MapUrlTile view, boolean value) {
        view.setDoubleTileSize(value);
    }

    @Override
    public void setFlipY(MapUrlTile view, boolean value) {
        view.setFlipY(value);
    }

    @Override
    public void setMaximumNativeZ(MapUrlTile view, int value) {
        view.setMaximumNativeZ(value);
    }

    @Override
    public void setMaximumZ(MapUrlTile view, int value) {
        view.setMaximumZ(value);
    }

    @Override
    public void setMinimumZ(MapUrlTile view, int value) {
        view.setMinimumZ(value);
    }

    @Override
    public void setOfflineMode(MapUrlTile view, boolean value) {
        view.setOfflineMode(value);
    }

    @Override
    public void setShouldReplaceMapContent(MapUrlTile view, boolean value) {
        // not supported

    }
    @Override
    public void setZIndex(@NonNull MapUrlTile view, float zIndex) {
       super.setZIndex(view, zIndex);
       view.setZIndex(zIndex);
    }

    @Override
    public void setOpacity(@NonNull MapUrlTile view, float opacity) {
        super.setOpacity(view, opacity);
        view.setOpacity(opacity);
    }

    @Override
    public void setTileCacheMaxAge(MapUrlTile view, int value) {
        view.setTileCacheMaxAge(value);
    }

    @Override
    public void setTileCachePath(MapUrlTile view, @Nullable String value) {
        view.setTileCachePath(value);
    }

    @Override
    public void setTileSize(MapUrlTile view, int value) {
        view.setTileSize(value);
    }

    @Override
    public void setUrlTemplate(MapUrlTile view, @Nullable String value) {
        view.setUrlTemplate(value);
    }
}
