package com.rnmaps.fabric;

import static com.rnmaps.maps.MapModule.SNAPSHOT_FORMAT_JPG;
import static com.rnmaps.maps.MapModule.SNAPSHOT_FORMAT_PNG;
import static com.rnmaps.maps.MapModule.SNAPSHOT_RESULT_BASE64;
import static com.rnmaps.maps.MapModule.SNAPSHOT_RESULT_FILE;
import static com.rnmaps.maps.MapModule.closeQuietly;

import android.graphics.Bitmap;
import android.net.Uri;
import android.util.Base64;
import android.util.DisplayMetrics;

import androidx.annotation.Nullable;

import com.facebook.fbreact.specs.NativeAirMapsModuleSpec;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.UIManager;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.uimanager.UIManagerHelper;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.model.CameraPosition;
import com.rnmaps.maps.MapUIBlock;
import com.rnmaps.maps.MapView;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;

public class NativeAirMapsModule extends NativeAirMapsModuleSpec {
    public NativeAirMapsModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public void getCamera(double tag, Promise promise) {
        UIManager uiManager = UIManagerHelper.getUIManagerForReactTag(getReactApplicationContext(), (int) tag);
        getReactApplicationContext().runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                MapView view = (MapView) uiManager.resolveView((int) tag);
                CameraPosition position = view.map.getCameraPosition();
                WritableMap map = Arguments.createMap();
                WritableMap center = Arguments.createMap();
                center.putDouble("latitude", position.target.latitude);
                center.putDouble("longitude", position.target.longitude);
                map.putMap("center", center);
                map.putDouble("heading", position.bearing);
                map.putDouble("pitch", position.tilt);
                map.putDouble("zoom", position.zoom);
                promise.resolve(map);
            }
        });
    }

    @Override
    public void getMarkersFrames(double tag, boolean onlyVisible, Promise promise) {

        UIManager uiManager = UIManagerHelper.getUIManagerForReactTag(getReactApplicationContext(), (int) tag);
        getReactApplicationContext().runOnUiQueueThread(() -> {
            MapView view = (MapView) uiManager.resolveView((int) tag);
            double[][] boundaries = view.getMarkersFrames(onlyVisible);
            if (boundaries != null) {
                WritableMap coordinates = new WritableNativeMap();
                WritableMap northEastHash = new WritableNativeMap();
                WritableMap southWestHash = new WritableNativeMap();

                northEastHash.putDouble("longitude", boundaries[0][0]);
                northEastHash.putDouble("latitude", boundaries[0][1]);
                southWestHash.putDouble("longitude", boundaries[1][0]);
                southWestHash.putDouble("latitude", boundaries[1][1]);

                coordinates.putMap("northEast", northEastHash);
                coordinates.putMap("southWest", southWestHash);

                promise.resolve(coordinates);
            } else {
                promise.resolve(null);
            }
        });
    }

    @Override
    public void getMapBoundaries(double tag, Promise promise) {
        UIManager uiManager = UIManagerHelper.getUIManagerForReactTag(getReactApplicationContext(), (int) tag);
        getReactApplicationContext().runOnUiQueueThread(() -> {
            MapView view = (MapView) uiManager.resolveView((int) tag);
            double[][] boundaries = view.getMapBoundaries();
            WritableMap coordinates = new WritableNativeMap();
            WritableMap northEastHash = new WritableNativeMap();
            WritableMap southWestHash = new WritableNativeMap();

            northEastHash.putDouble("longitude", boundaries[0][0]);
            northEastHash.putDouble("latitude", boundaries[0][1]);
            southWestHash.putDouble("longitude", boundaries[1][0]);
            southWestHash.putDouble("latitude", boundaries[1][1]);

            coordinates.putMap("northEast", northEastHash);
            coordinates.putMap("southWest", southWestHash);

            promise.resolve(coordinates);
        });
    }

    @Override
    public void takeSnapshot(double tag, String config, Promise promise) {
        WritableMap options = null;
        try {
            if (config != null) {
                JSONObject jsonObject = new JSONObject(config);
                options = JSONUtil.convertJsonToWritable(jsonObject);
                WritableMap finalOptions = options;

                final ReactApplicationContext context = getReactApplicationContext();
                final String format = finalOptions.hasKey("format") ? finalOptions.getString("format") : "png";
                final Bitmap.CompressFormat compressFormat =
                        format.equals(SNAPSHOT_FORMAT_PNG) ? Bitmap.CompressFormat.PNG :
                                format.equals(SNAPSHOT_FORMAT_JPG) ? Bitmap.CompressFormat.JPEG : null;
                final double quality = finalOptions.hasKey("quality") ? finalOptions.getDouble("quality") : 1.0;
                final DisplayMetrics displayMetrics = context.getResources().getDisplayMetrics();
                final Integer width =
                        finalOptions.hasKey("width") ? (int) (displayMetrics.density * finalOptions.getDouble("width")) : 0;
                final Integer height =
                        finalOptions.hasKey("height") ? (int) (displayMetrics.density * finalOptions.getDouble("height")) : 0;
                final String result = finalOptions.hasKey("result") ? finalOptions.getString("result") : "file";

                UIManager uiManager = UIManagerHelper.getUIManagerForReactTag(getReactApplicationContext(), (int) tag);
                getReactApplicationContext().runOnUiQueueThread(new Runnable() {
                    @Override
                    public void run() {
                        MapView view = (MapView) uiManager.resolveView((int) tag);
                        view.map.snapshot(snapshot -> {

                            // Convert image to requested width/height if necessary
                            if (snapshot == null) {
                                promise.reject("Failed to generate bitmap, snapshot = null");
                                return;
                            }
                            if ((width != 0) && (height != 0) &&
                                    (width != snapshot.getWidth() || height != snapshot.getHeight())) {
                                snapshot = Bitmap.createScaledBitmap(snapshot, width, height, true);
                            }
                            // Save the snapshot to disk
                            if (result.equals(SNAPSHOT_RESULT_FILE)) {
                                File tempFile;
                                FileOutputStream outputStream;
                                try {
                                    tempFile =
                                            File.createTempFile("AirMapSnapshot", "." + format, context.getCacheDir());
                                    outputStream = new FileOutputStream(tempFile);
                                } catch (Exception e) {
                                    promise.reject(e);
                                    return;
                                }
                                snapshot.compress(compressFormat, (int) (100.0 * quality), outputStream);
                                closeQuietly(outputStream);
                                String uri = Uri.fromFile(tempFile).toString();
                                promise.resolve(uri);
                            } else if (result.equals(SNAPSHOT_RESULT_BASE64)) {
                                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                                snapshot.compress(compressFormat, (int) (100.0 * quality), outputStream);
                                closeQuietly(outputStream);
                                byte[] bytes = outputStream.toByteArray();
                                String data = Base64.encodeToString(bytes, Base64.NO_WRAP);
                                promise.resolve(data);
                            }
                        });
                    }
                });
            }
        } catch (JSONException e) {
            promise.reject("Failed to parse config ", config);

        }
    }

    @Override
    public void getAddressFromCoordinates(double tag, ReadableMap coordinate, Promise promise) {

    }

    @Override
    public void getPointForCoordinate(double tag, ReadableMap coordinate, Promise promise) {

    }

    @Override
    public void getCoordinateForPoint(double tag, ReadableMap point, Promise promise) {

    }
}
