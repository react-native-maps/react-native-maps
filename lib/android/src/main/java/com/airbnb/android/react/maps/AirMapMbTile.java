package com.airbnb.android.react.maps;

import android.content.Context;

import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.model.Tile;
import com.google.android.gms.maps.model.TileOverlay;
import com.google.android.gms.maps.model.TileOverlayOptions;
import com.google.android.gms.maps.model.TileProvider;

import java.io.File;

import android.os.Environment;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteCantOpenDatabaseException;
import android.database.sqlite.SQLiteDatabaseCorruptException;
import android.database.sqlite.SQLiteDatabaseLockedException;
import android.database.Cursor;

/**
 * Created by Christoph Lambio on 30/03/2018.
 * Based on AirMapLocalTileManager.java
 * Copyright (c) zavadpe
 */

public class AirMapMbTile extends AirMapFeature {

    class AIRMapMbTileProvider implements TileProvider {
        private static final int BUFFER_SIZE = 16 * 1024;
        private int tileSize;
        private String pathTemplate;


        public AIRMapMbTileProvider(int tileSizet, String pathTemplate) {
            this.tileSize = tileSizet;
            this.pathTemplate = pathTemplate;
        }

        @Override
        public Tile getTile(int x, int y, int zoom) {
            byte[] image = readTileImage(x, y, zoom);
            return image == null ? TileProvider.NO_TILE : new Tile(this.tileSize, this.tileSize, image);
        }

        public void setPathTemplate(String pathTemplate) {
            this.pathTemplate = pathTemplate;
        }

        public void setTileSize(int tileSize) {
            this.tileSize = tileSize;
        }

        private byte[] readTileImage(int x, int y, int zoom) {
            String rawQuery = "SELECT * FROM map INNER JOIN images ON map.tile_id = images.tile_id WHERE map.zoom_level = {z} AND map.tile_column = {x} AND map.tile_row = {y}";
            byte[] tile = null;
            try {
                SQLiteDatabase offlineDataDatabase = SQLiteDatabase.openDatabase(this.pathTemplate, null, SQLiteDatabase.OPEN_READONLY);
                String query = rawQuery.replace("{x}", Integer.toString(x))
                        .replace("{y}", Integer.toString(y))
                        .replace("{z}", Integer.toString(zoom));
                Cursor cursor = offlineDataDatabase.rawQuery(query, null);
                if (cursor.moveToFirst()) {
                    tile = cursor.getBlob(5);
                }
                cursor.close();
                offlineDataDatabase.close();
            } catch (SQLiteCantOpenDatabaseException e) {
                e.printStackTrace();
                throw e;
            } catch (SQLiteDatabaseCorruptException e) {
                e.printStackTrace();
                throw e;
            } catch (SQLiteDatabaseLockedException e) {
                e.printStackTrace();
                throw e;
            } catch (Exception e) {
                e.printStackTrace();
                throw e;
            } finally {
                return tile;
            }
        }
    }

    private TileOverlayOptions tileOverlayOptions;
    private TileOverlay tileOverlay;
    private AirMapMbTile.AIRMapMbTileProvider tileProvider;

    private String pathTemplate;
    private float tileSize;
    private float zIndex;

    public AirMapMbTile(Context context) {
        super(context);
    }

    public void setPathTemplate(String pathTemplate) {
        this.pathTemplate = pathTemplate;
        if (tileProvider != null) {
            tileProvider.setPathTemplate(pathTemplate);
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

    public void setTileSize(float tileSize) {
        this.tileSize = tileSize;
        if (tileProvider != null) {
            tileProvider.setTileSize((int)tileSize);
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
        this.tileProvider = new AirMapMbTile.AIRMapMbTileProvider((int)this.tileSize, this.pathTemplate);
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
