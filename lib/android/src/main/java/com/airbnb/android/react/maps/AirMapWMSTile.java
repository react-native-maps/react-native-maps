package com.airbnb.android.react.maps;

import android.content.Context;

import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.model.TileOverlay;
import com.google.android.gms.maps.model.TileOverlayOptions;
import com.google.android.gms.maps.model.UrlTileProvider;
import net.maxters.epsgbox.EPSGBoundBoxBuilder;
import net.maxters.epsgbox.EPSGFactory;

import java.net.MalformedURLException;
import java.net.URL;

public class AirMapWMSTile extends AirMapFeature {

    class AIRMapGSUrlTileProvider extends UrlTileProvider {
    private String urlTemplate;
    private String epsgSpec;
    private int width;
    private int height;
    public AIRMapGSUrlTileProvider(int width, int height, String urlTemplate, String epsgSpec) {
      super(width, height);
      this.urlTemplate = urlTemplate;
      this.epsgSpec = epsgSpec;
      this.width = width;
      this.height = height;
    }

    @Override
    public synchronized URL getTileUrl(int x, int y, int zoom) {
      if(AirMapWMSTile.this.maximumZ > 0 && zoom > maximumZ) {
          return null;
      }
      if(AirMapWMSTile.this.minimumZ > 0 && zoom < minimumZ) {
          return null;
      }
      double[] bb = getBoundingBox(x, y, zoom);
      if(bb!=null){
        String s = this.urlTemplate
                .replace("{minX}", Double.toString(bb[0]))
                .replace("{minY}", Double.toString(bb[1]))
                .replace("{maxX}", Double.toString(bb[2]))
                .replace("{maxY}", Double.toString(bb[3]))
                .replace("{width}", Integer.toString(width))
                .replace("{height}", Integer.toString(height));
        URL url = null;
        try {
          url = new URL(s);
        } catch (MalformedURLException e) {
          throw new AssertionError(e);
        }
        return url;
      }
      return  null;
    }

    private double[] getBoundingBox(int x, int y, int zoom) {
      EPSGBoundBoxBuilder builder = EPSGFactory.get(this.epsgSpec);
      if(builder!=null)
        return builder.getBoundBoxFor(x,y,zoom);
      return null;
    }

    public void setUrlTemplate(String urlTemplate) {
      this.urlTemplate = urlTemplate;
    }

    public void setEpsgSpec(String epsgSpec) {
      this.epsgSpec = epsgSpec;
    }
  }

  private TileOverlayOptions tileOverlayOptions;
  private TileOverlay tileOverlay;
  private AIRMapGSUrlTileProvider tileProvider;

  private String urlTemplate;
  private String epsgSpec;
  private float zIndex;
  private float maximumZ;
  private float minimumZ;
  private int tileSize;
  private float opacity;

  public AirMapWMSTile(Context context) {
    super(context);
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

  public void setEpsgSpec(String epsgSpec) {
    this.epsgSpec = epsgSpec;
    if (tileProvider != null) {
      tileProvider.setEpsgSpec(urlTemplate);
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

  public void setMaximumZ(float maximumZ) {
    this.maximumZ = maximumZ;
    if (tileOverlay != null) {
      tileOverlay.clearTileCache();
    }
  }

  public void setMinimumZ(float minimumZ) {
    this.minimumZ = minimumZ;
    if (tileOverlay != null) {
      tileOverlay.clearTileCache();
    }
  }
  public void setTileSize(int tileSize) {
    this.tileSize = tileSize;
    if (tileOverlay != null) {
      tileOverlay.clearTileCache();
    }
  }
  public void setOpacity(float opacity) {
    this.opacity = opacity;
    if (tileOverlay != null) {
        tileOverlay.setTransparency(1-opacity);
    }
  }

  public TileOverlayOptions getTileOverlayOptions() {
    if (tileOverlayOptions == null) {
      tileOverlayOptions = createTileOverlayOptions();
    }
    return tileOverlayOptions;
  }

  private TileOverlayOptions createTileOverlayOptions() {
    TileOverlayOptions options = new TileOverlayOptions();
    options.zIndex(zIndex);
    options.transparency(1-opacity);
    this.tileProvider = new AIRMapGSUrlTileProvider(this.tileSize, this.tileSize, this.urlTemplate, this.epsgSpec);
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
