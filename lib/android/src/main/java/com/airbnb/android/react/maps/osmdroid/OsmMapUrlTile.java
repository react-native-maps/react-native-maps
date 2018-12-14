package com.airbnb.android.react.maps.osmdroid;

import android.content.Context;
import android.util.Log;


import org.osmdroid.tileprovider.tilesource.ITileSource;
import org.osmdroid.tileprovider.tilesource.OnlineTileSourceBase;
import org.osmdroid.tileprovider.tilesource.TileSourceFactory;
import org.osmdroid.tileprovider.tilesource.XYTileSource;
import org.osmdroid.util.MapTileIndex;
import org.osmdroid.views.MapView;

import java.net.MalformedURLException;
import java.net.URL;

public class OsmMapUrlTile extends OsmMapFeature {

  private ITileSource tileSource;

  private String urlTemplate;
  private float maximumZ = 100.f;
  private float minimumZ = 0;

  public class OsmMapTileSource extends OnlineTileSourceBase {

    public OsmMapTileSource(final String aName, final int aZoomMinLevel,
                        final int aZoomMaxLevel, final int aTileSizePixels,
                        final String urlTemplate) {
      super(aName, aZoomMinLevel, aZoomMaxLevel, aTileSizePixels,
              null, new String[] { urlTemplate },null);
    }

    @Override
    public String toString(){
      return name();
    }
    @Override
    public String getTileURLString(final long pMapTileIndex) {
      String url = getBaseUrl()
              .replace("{x}", Integer.toString(MapTileIndex.getX(pMapTileIndex)))
              .replace("{y}", Integer.toString(MapTileIndex.getY(pMapTileIndex)))
              .replace("{z}", Integer.toString(MapTileIndex.getZoom(pMapTileIndex)));

      Log.e("OsmMapTileSource", url);
      return url;
    }

    @Override
    public String getTileRelativeFilenameString(long pMapTileIndex) {
      return pathBase()
              .replace("{x}", Integer.toString(MapTileIndex.getX(pMapTileIndex)))
              .replace("{y}", Integer.toString(MapTileIndex.getY(pMapTileIndex)))
              .replace("{z}",  Integer.toString(MapTileIndex.getZoom(pMapTileIndex)));
    }
  }

  public OsmMapUrlTile(Context context) {
    super(context);
  }

  public void setUrlTemplate(String urlTemplate) {
    this.urlTemplate = urlTemplate;
  }

  public void setMaximumZ(float maximumZ) {
    this.maximumZ = maximumZ;
  }

  public void setMinimumZ(float minimumZ) {
    this.minimumZ = minimumZ;
  }

  @Override
  public Object getFeature() {
    return this;
  }

  @Override
  public void addToMap(MapView map) {
    final ITileSource tileSource = new OsmMapTileSource( "OsmMapTileSource", (int)minimumZ, (int)maximumZ, 256, urlTemplate);
    map.setTileSource(tileSource);
    map.setTilesScaledToDpi(true);
  }

  @Override
  public void removeFromMap(MapView map) {
    map.setTileSource(TileSourceFactory.DEFAULT_TILE_SOURCE);
    map.setTilesScaledToDpi(true);
  }
}
