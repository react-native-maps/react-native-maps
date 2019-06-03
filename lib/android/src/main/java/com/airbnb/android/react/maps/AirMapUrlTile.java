package com.airbnb.android.react.maps;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;

import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.model.Tile;
import com.google.android.gms.maps.model.TileOverlay;
import com.google.android.gms.maps.model.TileOverlayOptions;
import com.google.android.gms.maps.model.TileProvider;
import com.google.android.gms.maps.model.UrlTileProvider;

import java.io.ByteArrayOutputStream;
import java.net.MalformedURLException;
import java.net.URL;

public class AirMapUrlTile extends AirMapFeature {
  class CanvasTileProvider implements TileProvider {
    static final int TILE_SIZE = 512;

    public AIRMapUrlTileProvider mTileProvider;

    public CanvasTileProvider(AIRMapUrlTileProvider tileProvider) {
      mTileProvider = tileProvider;
    }

    @Override
    public Tile getTile(int x, int y, int zoom) {
      byte[] data;
      Bitmap image = getNewBitmap();
      Canvas canvas = new Canvas(image);
      boolean isOk = onDraw(canvas, zoom, x, y);
      data = bitmapToByteArray(image);
      image.recycle();

      if (isOk) {
        Tile tile = new Tile(TILE_SIZE, TILE_SIZE, data);
        return tile;
      } else {
        return mTileProvider.getTile(x, y, zoom);
      }
    }

    Paint paint = new Paint();

    private boolean onDraw(Canvas canvas, int zoom, int x, int y) {
      x = x * 2;
      y = y * 2;
      Tile leftTop = mTileProvider.getTile(x, y, zoom + 1);
      Tile leftBottom = mTileProvider.getTile(x, y + 1, zoom + 1);
      Tile rightTop = mTileProvider.getTile(x + 1, y, zoom + 1);
      Tile rightBottom = mTileProvider.getTile(x + 1, y + 1, zoom + 1);

      if (leftTop == NO_TILE && leftBottom == NO_TILE && rightTop == NO_TILE && rightBottom == NO_TILE) {
        return false;
      }

      Bitmap bitmap;

      if (leftTop != NO_TILE) {
        bitmap = BitmapFactory.decodeByteArray(leftTop.data, 0, leftTop.data.length);
        canvas.drawBitmap(bitmap, 0, 0, paint);
        bitmap.recycle();
      }

      if (leftBottom != NO_TILE) {
        bitmap = BitmapFactory.decodeByteArray(leftBottom.data, 0, leftBottom.data.length);
        canvas.drawBitmap(bitmap, 0, 256, paint);
        bitmap.recycle();
      }
      if (rightTop != NO_TILE) {
        bitmap = BitmapFactory.decodeByteArray(rightTop.data, 0, rightTop.data.length);
        canvas.drawBitmap(bitmap, 256, 0, paint);
        bitmap.recycle();
      }
      if (rightBottom != NO_TILE) {
        bitmap = BitmapFactory.decodeByteArray(rightBottom.data, 0, rightBottom.data.length);
        canvas.drawBitmap(bitmap, 256, 256, paint);
        bitmap.recycle();
      }
      return true;
    }


    private Bitmap getNewBitmap() {
      Bitmap image = Bitmap.createBitmap(TILE_SIZE, TILE_SIZE,
              Bitmap.Config.ARGB_8888);
      image.eraseColor(Color.TRANSPARENT);
      return image;
    }

    private byte[] bitmapToByteArray(Bitmap bm) {
      ByteArrayOutputStream bos = new ByteArrayOutputStream();
      bm.compress(Bitmap.CompressFormat.PNG, 100, bos);

      byte[] data = bos.toByteArray();
      try {
        bos.close();
      } catch (Exception e) {
        e.printStackTrace();
      }
      return data;
    }
  }

  class AIRMapUrlTileProvider extends UrlTileProvider {
    private String urlTemplate;

    public AIRMapUrlTileProvider(int width, int height, String urlTemplate) {
      super(width, height);
      this.urlTemplate = urlTemplate;
    }

    @Override
    public synchronized URL getTileUrl(int x, int y, int zoom) {

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
  }

  private TileOverlayOptions tileOverlayOptions;
  private TileOverlay tileOverlay;
  private CanvasTileProvider tileProvider;

  private String urlTemplate;
  private float zIndex;
  private float maximumZ;
  private float minimumZ;
  private boolean flipY;

  public AirMapUrlTile(Context context) {
    super(context);
  }

  public void setUrlTemplate(String urlTemplate) {
    this.urlTemplate = urlTemplate;
    if (tileProvider != null) {
      tileProvider.mTileProvider.setUrlTemplate(urlTemplate);
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

  public TileOverlayOptions getTileOverlayOptions() {
    if (tileOverlayOptions == null) {
      tileOverlayOptions = createTileOverlayOptions();
    }
    return tileOverlayOptions;
  }

  private TileOverlayOptions createTileOverlayOptions() {
    TileOverlayOptions options = new TileOverlayOptions();
    options.zIndex(zIndex);
    this.tileProvider = new CanvasTileProvider(new AIRMapUrlTileProvider(256, 256, this.urlTemplate));
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
