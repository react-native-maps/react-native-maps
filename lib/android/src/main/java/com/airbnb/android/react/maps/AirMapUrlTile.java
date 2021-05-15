package com.airbnb.android.react.maps;

import android.content.Context;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkManager;
import androidx.work.WorkRequest;
import androidx.work.Worker;
import androidx.work.WorkerParameters;
import androidx.work.Data;
import androidx.work.Constraints;
import androidx.work.NetworkType;

import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.model.Tile;
import com.google.android.gms.maps.model.TileOverlay;
import com.google.android.gms.maps.model.TileOverlayOptions;
import com.google.android.gms.maps.model.TileProvider;

import java.lang.System;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.IOException;

import java.net.MalformedURLException;
import java.net.URL;

public class AirMapUrlTile extends AirMapFeature {
  class AIRMapUrlTileProvider implements TileProvider {
    private static final int BUFFER_SIZE = 16 * 1024;
    private String urlTemplate;
    private int tileSize;
    private String tileCachePath;
    private int tileCacheMaxAge;
    private Context context;

    public AIRMapUrlTileProvider(int tileSizet, String urlTemplate, String tileCachePath, int tileCacheMaxAge, Context context) {
      this.tileSize = tileSizet;
      this.urlTemplate = urlTemplate;
      this.tileCachePath = tileCachePath;
      this.tileCacheMaxAge = tileCacheMaxAge;
      this.context = context;
    }

    @Override
    public Tile getTile(int x, int y, int zoom) {
      byte[] image = null;
      
      if (this.tileCachePath != null) {
        image = readTileImage(x, y, zoom);
        if (image != null) {
          Log.d("tileCachePath: tile cache HIT for ", Integer.toString(zoom) + 
        "/" + Integer.toString(x) + "/" + Integer.toString(y));
          checkForRefresh(x, y, zoom);
        } else {
          Log.d("tileCachePath: tile cache MISS for ", Integer.toString(zoom) + 
        "/" + Integer.toString(x) + "/" + Integer.toString(y));
        }
      }

      if (image == null) {
        image = fetchTile(x, y, zoom);
        if (this.tileCachePath != null && image != null) {
          boolean success = writeTileImage(image, x, y, zoom);
          if (!success) {
            Log.d("tileCachePath: Saving to cache ", "failed");
          }
        }
      }

      return image == null ? null : new Tile(this.tileSize, this.tileSize, image);
    }

    void checkForRefresh(int x, int y, int zoom) {
      String fileName =  getTileFilename(x, y, zoom);
      File file = new File(fileName);
      long lastModified = file.lastModified();
      long now = System.currentTimeMillis();

      if ((now - lastModified) / 1000 > this.tileCacheMaxAge) {
        Constraints constraints = new Constraints.Builder()
          .setRequiredNetworkType(NetworkType.CONNECTED)
          .build();
        WorkRequest tileRefreshWorkRequest = new OneTimeWorkRequest.Builder(AirMapUrlTileWorker.class)
          .setConstraints(constraints)
          .setInputData(
            new Data.Builder()
              .putString("url", getTileUrl(x, y, zoom).toString())
              .putString("filename", fileName)
              .build()
            )
          .build();
          if (tileRefreshWorkRequest != null) {
            WorkManager.getInstance(this.context.getApplicationContext()).enqueue(tileRefreshWorkRequest);
          } else {
            Log.d("tileCachePath: ", "WorkRequest null");
          }
      } else {
        Log.d("tileCachePath: ", "Tile checked, no need to refresh");
      }
    }

    private byte[] fetchTile(int x, int y, int zoom) {
      URL url = getTileUrl(x, y, zoom);
      ByteArrayOutputStream buffer = null;
      InputStream in = null;

      //Log.d("tileCachePath: fetchTile: ", '/' + Integer.toString(zoom) + 
      //  "/" + Integer.toString(x) + "/" + Integer.toString(y));

      try {
        in = url.openStream();
        buffer = new ByteArrayOutputStream();

        int nRead;
        byte[] data = new byte[BUFFER_SIZE];

        while ((nRead = in.read(data, 0, BUFFER_SIZE)) != -1) {
          buffer.write(data, 0, nRead);
        }
        buffer.flush();

        return buffer.toByteArray();
      } catch (IOException e) {
        e.printStackTrace();
        return null;
      } catch (OutOfMemoryError e) {
        e.printStackTrace();
        return null;
      } finally {
        if (in != null) try { in.close(); } catch (Exception ignored) {}
        if (buffer != null) try { buffer.close(); } catch (Exception ignored) {}
      }
    }
    
    private byte[] readTileImage(int x, int y, int zoom) {
      InputStream in = null;
      ByteArrayOutputStream buffer = null;
      String fileName = getTileFilename(x, y, zoom);
      if (fileName == null) {
        return null;
      }

      File file = new File(fileName);

      try {
        in = new FileInputStream(file);
        buffer = new ByteArrayOutputStream();

        int nRead;
        byte[] data = new byte[BUFFER_SIZE];

        while ((nRead = in.read(data, 0, BUFFER_SIZE)) != -1) {
          buffer.write(data, 0, nRead);
        }
        buffer.flush();

        if (this.tileCacheMaxAge == 0) {
          file.setLastModified(System.currentTimeMillis());
        }

        return buffer.toByteArray();
      } catch (IOException e) {
        e.printStackTrace();
        return null;
      } catch (OutOfMemoryError e) {
        e.printStackTrace();
        return null;
      } finally {
        if (in != null) try { in.close(); } catch (Exception ignored) {}
        if (buffer != null) try { buffer.close(); } catch (Exception ignored) {}
      }
    }

    private boolean writeTileImage(byte[] image, int x, int y, int zoom) {
      OutputStream out = null;
      String fileName = getTileFilename(x, y, zoom);
      if (fileName == null) {
        return false;
      }

      try {
        File file = new File(fileName);
        file.getParentFile().mkdirs();
        out = new FileOutputStream(file);
        out.write(image);

        return true;
      } catch (IOException e) {
        e.printStackTrace();
        return false;
      } catch (OutOfMemoryError e) {
        e.printStackTrace();
        return false;
      } finally {
        if (out != null) try { out.close(); } catch (Exception ignored) {}
      }
    }

    private String getTileFilename(int x, int y, int zoom) {
      if (this.tileCachePath == null) {
        return null;
      }
      String s = this.tileCachePath + '/' + Integer.toString(zoom) + 
        "/" + Integer.toString(x) + "/" + Integer.toString(y);
      //Log.d("tileCachePath: getTileFilename: ", s);
      return s;
    }
    
    private URL getTileUrl(int x, int y, int zoom) {
      if (AirMapUrlTile.this.flipY == true) {
        y = (1 << zoom) - y - 1;
      }

      String s = this.urlTemplate
          .replace("{x}", Integer.toString(x))
          .replace("{y}", Integer.toString(y))
          .replace("{z}", Integer.toString(zoom));
      URL url = null;

      if(AirMapUrlTile.this.maximumZ > 0 && zoom > maximumZ) {
        return url;
      }

      if(AirMapUrlTile.this.minimumZ > 0 && zoom < minimumZ) {
        return url;
      }

      try {
        url = new URL(s);
      } catch (MalformedURLException e) {
        throw new AssertionError(e);
      }
      return url;
    }
    
    public void setUrlTemplate(String urlTemplate) {
      this.urlTemplate = urlTemplate;
    }

    public void setTileSize(int tileSize) {
      this.tileSize = tileSize;
    }

    public void setTileCachePath(String tileCachePath) {
      this.tileCachePath = tileCachePath;
      Log.d("tileCachePath: tile cache directory set ", tileCachePath);
    }

    public void setTileCacheMaxAge(int tileCacheMaxAge) {
      this.tileCacheMaxAge = tileCacheMaxAge;
      Log.d("tileCachePath: tile cache max age set ", Integer.toString(tileCacheMaxAge));
    }
  }

  private TileOverlayOptions tileOverlayOptions;
  private TileOverlay tileOverlay;
  private AIRMapUrlTileProvider tileProvider;

  private String urlTemplate;
  private float zIndex;
  private float maximumZ;
  private float minimumZ;
  private boolean flipY;
  private float tileSize = 256;
  private String tileCachePath;
  private float tileCacheMaxAge;
  private Context context;

  public AirMapUrlTile(Context context) {
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

  public void setFlipY(boolean flipY) {
    this.flipY = flipY;
    if (tileOverlay != null) {
      tileOverlay.clearTileCache();
    }
  }

  public void setTileSize(float tileSize) {
    this.tileSize = tileSize;
    if (tileProvider != null) {
      tileProvider.setTileSize((int)tileSize);
    }
    if (tileOverlay != null) {
      tileOverlay.clearTileCache();
    }
  }

  public void setTileCachePath(String tileCachePath) {
    if (!tileCachePath) return;
    
    try {
      Log.d("tileCachePath: tile cache directory property ", tileCachePath);
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
    if (tileOverlay != null) {
      tileOverlay.clearTileCache();
    }
    Log.d("tileCachePath: setTileCachePath as ", tileCachePath);
  }

  public void setTileCacheMaxAge(float tileCacheMaxAge) {
    Log.d("tileCachePath: tile cache max age property ", Float.toString(tileCacheMaxAge));
    this.tileCacheMaxAge = tileCacheMaxAge;
    if (tileProvider != null) {
      tileProvider.setTileCacheMaxAge((int)tileCacheMaxAge);
    }
    if (tileOverlay != null) {
      tileOverlay.clearTileCache();
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
    this.tileProvider = new AIRMapUrlTileProvider((int)this.tileSize, this.urlTemplate, this.tileCachePath, (int)this.tileCacheMaxAge, this.context);
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
