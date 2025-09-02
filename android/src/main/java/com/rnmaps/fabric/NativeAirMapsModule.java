package com.rnmaps.fabric;

import static com.rnmaps.maps.MapModule.SNAPSHOT_FORMAT_JPG;
import static com.rnmaps.maps.MapModule.SNAPSHOT_FORMAT_PNG;
import static com.rnmaps.maps.MapModule.SNAPSHOT_RESULT_BASE64;
import static com.rnmaps.maps.MapModule.SNAPSHOT_RESULT_FILE;
import static com.rnmaps.maps.MapModule.closeQuietly;

import android.graphics.Bitmap;
import android.graphics.Point;
import android.location.Address;
import android.location.Geocoder;
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
import com.google.android.gms.maps.model.LatLng;
import com.rnmaps.maps.MapUIBlock;
import com.rnmaps.maps.MapView;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;

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
                if (view == null || view.map == null) {
                    promise.reject("E_MAP_CAMERA", "Cannot get camera position because map view is null");
                    return;
                }
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
            if (view == null) {
                promise.reject("E_MAP_MARKERS", "Cannot get markers frames because map view is null");
                return;
            }
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
            if (view == null) {
                promise.reject("E_MAP_BOUNDARIES", "Cannot get map boundaries because map view is null");
                return;
            }
            double[][] boundaries = view.getMapBoundaries();
            if (boundaries == null) {
                promise.reject("E_MAP_BOUNDARIES", "Map boundaries are null");
                return;
            }
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
                        if (view == null || view.map == null) {
                            promise.reject("E_SNAPSHOT", "Cannot take snapshot because map view or map is null");
                            return;
                        }
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
        final ReactApplicationContext context = getReactApplicationContext();

        if (coordinate == null ||
                !coordinate.hasKey("latitude") ||
                !coordinate.hasKey("longitude")) {
            promise.reject("Invalid coordinate format");
            return;
        }
        Geocoder geocoder = new Geocoder(context);
        try {
            List<Address> list =
                    geocoder.getFromLocation(coordinate.getDouble("latitude"), coordinate.getDouble("longitude"), 1);
            if (list.isEmpty()) {
                promise.reject("Can not get address location");
                return;
            }
            Address address = list.get(0);

            WritableMap addressJson = new WritableNativeMap();
            addressJson.putString("name", address.getFeatureName());
            addressJson.putString("locality", address.getLocality());
            addressJson.putString("thoroughfare", address.getThoroughfare());
            addressJson.putString("subThoroughfare", address.getSubThoroughfare());
            addressJson.putString("subLocality", address.getSubLocality());
            addressJson.putString("administrativeArea", address.getAdminArea());
            addressJson.putString("subAdministrativeArea", address.getSubAdminArea());
            addressJson.putString("postalCode", address.getPostalCode());
            addressJson.putString("countryCode", address.getCountryCode());
            addressJson.putString("country", address.getCountryName());

            promise.resolve(addressJson);
        } catch (IOException e) {
            promise.reject("Can not get address location");
        }


    }

    @Override
    public void getPointForCoordinate(double tag, ReadableMap coordinate, Promise promise) {
        final ReactApplicationContext context = getReactApplicationContext();
        final double density = (double) context.getResources().getDisplayMetrics().density;

        final LatLng coord = new LatLng(
                coordinate.hasKey("latitude") ? coordinate.getDouble("latitude") : 0.0,
                coordinate.hasKey("longitude") ? coordinate.getDouble("longitude") : 0.0
        );

        MapUIBlock uiBlock = new MapUIBlock((int) tag, promise, context, view -> {
            Point pt = view.map.getProjection().toScreenLocation(coord);

            WritableMap ptJson = new WritableNativeMap();
            ptJson.putDouble("x", (double) pt.x / density);
            ptJson.putDouble("y", (double) pt.y / density);

            promise.resolve(ptJson);

            return null;
        });

        uiBlock.addToUIManager();
    }

    @Override
    public void getCoordinateForPoint(double tag, ReadableMap point, Promise promise) {
        final ReactApplicationContext context = getReactApplicationContext();
        final double density = (double) context.getResources().getDisplayMetrics().density;

        final Point pt = new Point(
                point.hasKey("x") ? (int) (point.getDouble("x") * density) : 0,
                point.hasKey("y") ? (int) (point.getDouble("y") * density) : 0
        );

        MapUIBlock uiBlock = new MapUIBlock((int)tag, promise, context, view -> {
            LatLng coord = view.map.getProjection().fromScreenLocation(pt);

            WritableMap coordJson = new WritableNativeMap();
            coordJson.putDouble("latitude", coord.latitude);
            coordJson.putDouble("longitude", coord.longitude);

            promise.resolve(coordJson);

            return null;
        });

        uiBlock.addToUIManager();
    }
}
