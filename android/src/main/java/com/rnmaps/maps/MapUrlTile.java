package com.rnmaps.maps;

import android.util.Log;

import android.content.Context;

import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.model.TileOverlay;
import com.google.android.gms.maps.model.TileOverlayOptions;

import java.net.MalformedURLException;
import java.net.URL;

public class MapUrlTile extends MapFeature {
  protected TileOverlayOptions tileOverlayOptions;
  protected TileOverlay tileOverlay;
  protected MapTileProvider tileProvider;

  protected String urlTemplate;
  protected float zIndex;
  protected int maximumZ;
  protected int maximumNativeZ = 100;
  protected int minimumZ;
  protected boolean flipY = false;
  protected int tileSize = 256;
  protected boolean doubleTileSize = false;
  protected String tileCachePath;
  protected int tileCacheMaxAge;
  protected boolean offlineMode = false;
  protected float opacity = 1;
  protected Context context;
  protected boolean customTileProviderNeeded = false;

  public MapUrlTile(Context context) {
    super(context);
    this.context = context;
  }

  public void setUrlTemplate(String urlTemplate) {
    this.urlTemplate = urlTemplate;
    if (tileProvider != null) {
      tileProvider.setUrlTemplate(urlTemplate);
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

  public void setMaximumZ(int maximumZ) {
    this.maximumZ = maximumZ;
    if (tileProvider != null) {
      tileProvider.setMaximumZ(maximumZ);
    }
    if (tileOverlay != null) {
      tileOverlay.clearTileCache();
    }
  }

  public void setMaximumNativeZ(int maximumNativeZ) {
    this.maximumNativeZ = maximumNativeZ;
    if (tileProvider != null) {
      tileProvider.setMaximumNativeZ(maximumNativeZ);
    }
    setCustomTileProviderMode();
    if (tileOverlay != null) {
      tileOverlay.clearTileCache();
    }
  }

  public void setMinimumZ(int minimumZ) {
    this.minimumZ = minimumZ;
    if (tileProvider != null) {
      tileProvider.setMinimumZ(minimumZ);
    }
    if (tileOverlay != null) {
      tileOverlay.clearTileCache();
    }
  }

  public void setFlipY(boolean flipY) {
    this.flipY = flipY;
    if (tileProvider != null) {
      tileProvider.setFlipY(flipY);
    }
    if (tileOverlay != null) {
      tileOverlay.clearTileCache();
    }
  }

  public void setDoubleTileSize(boolean doubleTileSize) {
    this.doubleTileSize = doubleTileSize;
    if (tileProvider != null) {
      tileProvider.setDoubleTileSize(doubleTileSize);
    }
    setCustomTileProviderMode();
    if (tileOverlay != null) {
      tileOverlay.clearTileCache();
    }
  }

  public void setTileSize(int tileSize) {
    this.tileSize = tileSize;
    if (tileProvider != null) {
      tileProvider.setTileSize(tileSize);
    }
    if (tileOverlay != null) {
      tileOverlay.clearTileCache();
    }
  }

  public void setTileCachePath(String tileCachePath) {
    if (tileCachePath == null || tileCachePath.isEmpty()) return;
    
    try {
      URL url = new URL(tileCachePath);
      this.tileCachePath = url.getPath();
    } catch (MalformedURLException e) {
      this.tileCachePath = tileCachePath;
    } catch (Exception e) {
      return;
    }

    if (tileProvider != null) {
      tileProvider.setTileCachePath(tileCachePath);
    }
    setCustomTileProviderMode();
    if (tileOverlay != null) {
      tileOverlay.clearTileCache();
    }
  }

  public void setTileCacheMaxAge(int tileCacheMaxAge) {
    this.tileCacheMaxAge = tileCacheMaxAge;
    if (tileProvider != null) {
      tileProvider.setTileCacheMaxAge(tileCacheMaxAge);
    }
    if (tileOverlay != null) {
      tileOverlay.clearTileCache();
    }
  }

  public void setOfflineMode(boolean offlineMode) {
    this.offlineMode = offlineMode;
    if (tileProvider != null) {
      tileProvider.setOfflineMode(offlineMode);
    }
    if (tileOverlay != null) {
      tileOverlay.clearTileCache();
    }
  }

  public void setOpacity(float opacity) {
    this.opacity = opacity;
    if (tileOverlay != null) {
        tileOverlay.setTransparency(1 - opacity);
    }
  }

  public TileOverlayOptions getTileOverlayOptions() {
    if (tileOverlayOptions == null) {
      tileOverlayOptions = createTileOverlayOptions();
    }
    return tileOverlayOptions;
  }

  protected void setCustomTileProviderMode() {
    Log.d("urlTile ", "creating new mode TileProvider");
    this.customTileProviderNeeded = true;
    if (tileProvider != null) {
      tileProvider.setCustomMode();
    }
  }

  protected TileOverlayOptions createTileOverlayOptions() {
    Log.d("urlTile ", "creating TileProvider");
    TileOverlayOptions options = new TileOverlayOptions();
    options.zIndex(zIndex);
    options.transparency(1 - this.opacity);
    this.tileProvider = new MapTileProvider((int)this.tileSize, this.doubleTileSize, this.urlTemplate,
      this.maximumZ, this.maximumNativeZ, this.minimumZ, this.flipY, this.tileCachePath,
      this.tileCacheMaxAge, this.offlineMode, this.context, this.customTileProviderNeeded);
    options.tileProvider(this.tileProvider);
    return options;
  }

  @Override
  public Object getFeature() {
    return tileOverlay;
  }

  @Override
  public void addToMap(Object map) {
    this.tileOverlay = ((GoogleMap) map).addTileOverlay(getTileOverlayOptions());
  }

  @Override
  public void removeFromMap(Object map) {
    tileOverlay.remove();
  }
}
