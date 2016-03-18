package com.AirMaps;

import android.content.Context;

import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.model.TileOverlay;
import com.google.android.gms.maps.model.TileOverlayOptions;
import com.google.android.gms.maps.model.UrlTileProvider;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.Locale;

public class AirMapUrlTile extends AirMapFeature {

    class AIRMapUrlTileProvider extends UrlTileProvider
    {
        private String url;
        public AIRMapUrlTileProvider(int width, int height, String url) {
            super(width, height);
            this.url = url;
        }
        @Override
        public synchronized URL getTileUrl(int x, int y, int zoom) {

            String s = String.format(Locale.US, this.url, zoom, x, y);
            URL url = null;
            try {
                url = new URL(s);
            } catch (MalformedURLException e) {
                throw new AssertionError(e);
            }
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }
    }

    private TileOverlayOptions tileOverlayOptions;
    private TileOverlay tileOverlay;
    private AIRMapUrlTileProvider tileProvider;

    private String url;
    private float zIndex;

    public AirMapUrlTile(Context context) {
        super(context);
    }

    public void setUrl(String url) {
        this.url = url;
        if (tileProvider != null) {
            tileProvider.setUrl(url);
        }
        if (tileOverlay != null) {
            tileOverlay.clearTileCache();
        }
    }

    public void setZIndex(float zIndex) {
        this.zIndex = zIndex;
        if (tileOverlay != null) {
            tileOverlay.setZIndex(zIndex);
        }
    }

    public TileOverlayOptions getTileOverlayOptions() {
        if (tileOverlayOptions == null) {
            tileOverlayOptions = createTileOverlayOptions();
        }
        return tileOverlayOptions;
    }
// http://a.tile.openstreetmap.org/${z}/${x}/${y}.png
    private TileOverlayOptions createTileOverlayOptions() {
        TileOverlayOptions options = new TileOverlayOptions();
        options.zIndex(zIndex);
        this.tileProvider = new AIRMapUrlTileProvider(256, 256, this.url);
        options.tileProvider(this.tileProvider);
        return options;
    }

    @Override
    public Object getFeature() {
        return tileOverlay;
    }

    @Override
    public void addToMap(GoogleMap map) {
        this.tileOverlay = map.addTileOverlay(getTileOverlayOptions());
    }

    @Override
    public void removeFromMap(GoogleMap map) {
        tileOverlay.remove();
    }
}
