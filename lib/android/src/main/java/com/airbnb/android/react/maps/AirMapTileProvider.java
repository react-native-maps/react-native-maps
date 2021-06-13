package com.airbnb.android.react.maps;

import android.content.Context;

import android.util.Log;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Rect;

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

public class AirMapTileProvider implements TileProvider {
	protected static final int BUFFER_SIZE = 16 * 1024;
  protected static final int TARGET_TILE_SIZE = 512;
	protected String urlTemplate;
	protected int tileSize;
  protected boolean doubleTileSize;
	protected int maximumZ;
  protected int maximumNativeZ;
  protected int minimumZ;
  protected boolean flipY;
	protected String tileCachePath;
	protected int tileCacheMaxAge;
  protected boolean offlineMode;
	protected Context context;

	public AirMapTileProvider(int tileSizet, boolean doubleTileSize, String urlTemplate, 
    int maximumZ, int maximumNativeZ, int minimumZ, boolean flipY, String tileCachePath, 
    int tileCacheMaxAge, boolean offlineMode, Context context) {
		this.tileSize = tileSizet;
    this.doubleTileSize = doubleTileSize;
		this.urlTemplate = urlTemplate;
		this.maximumZ = maximumZ;
    this.maximumNativeZ = maximumNativeZ;
		this.minimumZ = minimumZ;
		this.flipY = flipY;
		this.tileCachePath = tileCachePath;
		this.tileCacheMaxAge = tileCacheMaxAge;
    this.offlineMode = offlineMode;
		this.context = context;
	}

	@Override
	public Tile getTile(int x, int y, int zoom) {
		byte[] image = null;
		
		if (this.tileSize == 256 && this.doubleTileSize && zoom + 1 <= this.maximumNativeZ && zoom + 1 <= this.maximumZ) {
      Log.d("urlTile", "pullTilesFromHigherZoom");
			image = pullTilesFromHigherZoom(x, y, zoom);      
		} 

    if (zoom > this.maximumNativeZ) {
      Log.d("urlTile", "scaleLowerZoomTile");
			image = scaleLowerZoomTile(x, y, zoom, this.maximumNativeZ);
		}
    
    if (image == null && zoom <= this.maximumZ) {
      Log.d("urlTile", "getTileImage");
			image = getTileImage(x, y, zoom);
		}

    if (image == null && this.tileCachePath != null && this.offlineMode) {
      Log.d("urlTile", "findLowerZoomTileForScaling");
      int zoomLevelToStart = (zoom > this.maximumNativeZ) ? this.maximumNativeZ - 1 : zoom - 1; 
      for (int tryZoom = zoomLevelToStart; tryZoom >= this.minimumZ; tryZoom--) {
  			image = scaleLowerZoomTile(x, y, zoom, tryZoom);
	  		if (image != null) {
		  		break;
			  }
      }
		}

		return image == null ? null : new Tile(this.tileSize, this.tileSize, image);
	}
	
	byte[] getTileImage(int x, int y, int zoom) {
		byte[] image = null;
		
		if (this.tileCachePath != null) {
			image = readTileImage(x, y, zoom);
			if (image != null && !this.offlineMode) {
        Log.d("urlTile", "Refreshing");
				checkForRefresh(x, y, zoom);
			}
		}

		if (image == null && !this.offlineMode) {
			image = fetchTile(x, y, zoom);
			if (this.tileCachePath != null && image != null) {
				boolean success = writeTileImage(image, x, y, zoom);
			}
		}

		return image;
	}

	byte[] pullTilesFromHigherZoom(int x, int y, int zoom) {
    byte[] data;
    Bitmap image = getNewBitmap();
    Canvas canvas = new Canvas(image);
    Paint paint = new Paint();

    x = x * 2;
    y = y * 2;
    byte[] leftTop = getTileImage(x, y, zoom + 1);
    byte[] leftBottom = getTileImage(x, y + 1, zoom + 1);
    byte[] rightTop = getTileImage(x + 1, y, zoom + 1);
    byte[] rightBottom = getTileImage(x + 1, y + 1, zoom + 1);

    if (leftTop == null || leftBottom == null || rightTop == null || rightBottom == null) {
      return null;
    }

    Bitmap bitmap;

    bitmap = BitmapFactory.decodeByteArray(leftTop, 0, leftTop.length);
    canvas.drawBitmap(bitmap, 0, 0, paint);
    bitmap.recycle();
    
    bitmap = BitmapFactory.decodeByteArray(leftBottom, 0, leftBottom.length);
    canvas.drawBitmap(bitmap, 0, 256, paint);
    bitmap.recycle();
    
    bitmap = BitmapFactory.decodeByteArray(rightTop, 0, rightTop.length);
    canvas.drawBitmap(bitmap, 256, 0, paint);
    bitmap.recycle();
  
    bitmap = BitmapFactory.decodeByteArray(rightBottom, 0, rightBottom.length);
    canvas.drawBitmap(bitmap, 256, 256, paint);
    bitmap.recycle();
    
    data = bitmapToByteArray(image);
    image.recycle();
    return data;
  }

  protected Bitmap getNewBitmap() {
    Bitmap image = Bitmap.createBitmap(TARGET_TILE_SIZE, TARGET_TILE_SIZE, Bitmap.Config.ARGB_8888);
    image.eraseColor(Color.TRANSPARENT);
    return image;
  }

  protected byte[] bitmapToByteArray(Bitmap bm) {
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

	byte[] scaleLowerZoomTile(int x, int y, int zoom, int maximumZoom) {
    int overZoomLevel = zoom - maximumZoom;
    int zoomFactor = 1 << overZoomLevel;
    
    int[] parentTile = getTileParent(x, y, zoom, overZoomLevel);
    int xParent = parentTile[0];
    int yParent = parentTile[1];
    int zoomParent = parentTile[2];
    
    int[] offsetInParent = getOffsetInParent(x, y, zoomFactor);
    int xOffset = offsetInParent[0];
    int yOffset = offsetInParent[1];

    byte[] data;
    Bitmap image = getNewBitmap();
    Canvas canvas = new Canvas(image);
    Paint paint = new Paint();

		data = getTileImage(xParent, yParent, zoomParent);
    if (data == null) return null;
    
    Bitmap sourceImage;
    sourceImage = BitmapFactory.decodeByteArray(data, 0, data.length);

    int subTileSize = this.tileSize / zoomFactor;
    Rect sourceRect = new Rect(xOffset * subTileSize, yOffset * subTileSize, xOffset * subTileSize + subTileSize , yOffset * subTileSize + subTileSize);
    Rect targetRect = new Rect(0,0,TARGET_TILE_SIZE, TARGET_TILE_SIZE);
    canvas.drawBitmap(sourceImage, sourceRect, targetRect, paint);
    sourceImage.recycle();

    data = bitmapToByteArray(image);
    image.recycle();
    return data;
	} 

  protected int[] getTileParent(int x, int y, int zoom, int overZoomLevel) {
    int[] tileParent = new int[3];
    tileParent[0] = x >> overZoomLevel;
    tileParent[1] = y >> overZoomLevel;
    tileParent[2] = zoom - overZoomLevel;
	  return tileParent;
  }

  protected int[] getOffsetInParent(int x, int y, int zoomFactor) {
    int[] offsetInParent = new int[2];
    offsetInParent[0] = x % zoomFactor;
    offsetInParent[1] = y % zoomFactor;
	  return offsetInParent;
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
			} 
		} 
	}

	protected byte[] fetchTile(int x, int y, int zoom) {
		URL url = getTileUrl(x, y, zoom);
		ByteArrayOutputStream buffer = null;
		InputStream in = null;

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
	
	protected byte[] readTileImage(int x, int y, int zoom) {
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

	protected boolean writeTileImage(byte[] image, int x, int y, int zoom) {
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

	protected String getTileFilename(int x, int y, int zoom) {
		if (this.tileCachePath == null) {
			return null;
		}
		String s = this.tileCachePath + '/' + Integer.toString(zoom) + 
			"/" + Integer.toString(x) + "/" + Integer.toString(y);
		return s;
	}
	
	protected URL getTileUrl(int x, int y, int zoom) {
		if (this.flipY == true) {
			y = (1 << zoom) - y - 1;
		}

		String s = this.urlTemplate
				.replace("{x}", Integer.toString(x))
				.replace("{y}", Integer.toString(y))
				.replace("{z}", Integer.toString(zoom));
		URL url = null;

		if(this.maximumZ > 0 && zoom > maximumZ) {
			return url;
		}

		if(this.minimumZ > 0 && zoom < minimumZ) {
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

  public void setDoubleTileSize(Boolean doubleTileSize) {
		this.doubleTileSize = doubleTileSize;
	}

	public void setMaximumZ(int maximumZ) {
		this.maximumZ = maximumZ;
	}

  public void setMaximumNativeZ(int maximumNativeZ) {
		this.maximumNativeZ = maximumNativeZ;
	}

	public void setMinimumZ(int minimumZ) {
		this.minimumZ = minimumZ;
	}

	public void setFlipY(Boolean flipY) {
		this.flipY = flipY;
	}

	public void setTileCachePath(String tileCachePath) {
		this.tileCachePath = tileCachePath;
	}

	public void setTileCacheMaxAge(int tileCacheMaxAge) {
		this.tileCacheMaxAge = tileCacheMaxAge;
	}

  public void setOfflineMode(Boolean offlineMode) {
		this.offlineMode = offlineMode;
	}
}