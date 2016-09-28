package com.airbnb.android.react.maps;

import android.app.Activity;
import android.util.DisplayMetrics;
import android.util.Base64;
import android.graphics.Bitmap;
import android.net.Uri;
import android.view.View;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.NativeViewHierarchyManager;

import com.google.android.gms.maps.GoogleMap;


public class AirMapModule extends ReactContextBaseJavaModule {

    public AirMapModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "AirMapModule";
    }

    public Activity getActivity() {
        return getCurrentActivity();
    }

    @ReactMethod
    public void takeSnapshot(final int tag, final ReadableMap options, final Promise promise) {

        // Parse and verity options
        final ReactApplicationContext context = getReactApplicationContext();
        final String format = options.hasKey("format") ? options.getString("format") : "png";
        final Bitmap.CompressFormat compressFormat =
            format.equals("png") ? Bitmap.CompressFormat.PNG :
            format.equals("jpg") ? Bitmap.CompressFormat.JPEG : null;
        if (compressFormat == null) {
            promise.reject("AIRMap.takeSnapshot", "Unsupported image format: " + format + ". Try one of: png | jpg | jpeg");
            return;
        }
        final double quality = options.hasKey("quality") ? options.getDouble("quality") : 1.0;
        final DisplayMetrics displayMetrics = context.getResources().getDisplayMetrics();
        final Integer width = options.hasKey("width") ? (int)(displayMetrics.density * options.getDouble("width")) : 0;
        final Integer height = options.hasKey("height") ? (int)(displayMetrics.density * options.getDouble("height")) : 0;
        final String result = options.hasKey("result") ? options.getString("result") : "file";

        // Add UI-block so we can get a valid reference to the map-view
        UIManagerModule uiManager = context.getNativeModule(UIManagerModule.class);
        uiManager.addUIBlock(new UIBlock() {
            public void execute (NativeViewHierarchyManager nvhm) {
                AirMapView view = (AirMapView) nvhm.resolveView(tag);
                if (view == null) {
                    promise.reject("AirMapView not found");
                    return;
                }
                if (view.map == null) {
                    promise.reject("AirMapView.map is not valid");
                    return;
                }
                view.map.snapshot(new GoogleMap.SnapshotReadyCallback() {
                    public void onSnapshotReady(Bitmap snapshot) {

                        // Convert image to requested width/height if neccesary
                        if (snapshot != null && width != 0 && height != 0 && (width != snapshot.getWidth() || height != snapshot.getHeight())) {
                            snapshot = Bitmap.createScaledBitmap(snapshot, width, height, true);
                        }
                        if (snapshot == null) {
                            promise.reject("Failed to generate bitmap");
                            return;
                        }

                        // Save the snapshot to disk
                        OutputStream outputStream = null;
                        try {
                            if ("file".equals(result)) {
                                File tempFile = File.createTempFile("AirMapSnapshot", "." + format, context.getCacheDir());
                                outputStream = new FileOutputStream(tempFile);
                                snapshot.compress(compressFormat, (int)(100.0 * quality), outputStream);
                                outputStream.close();
                                outputStream = null;
                                String uri = Uri.fromFile(tempFile).toString();
                                promise.resolve(uri);
                            }
                            else if ("base64".equals(result)) {
                                outputStream = new ByteArrayOutputStream();
                                snapshot.compress(compressFormat, (int)(100.0 * quality), outputStream);
                                outputStream.close();
                                outputStream = null;
                                byte[] bytes = ((ByteArrayOutputStream) outputStream).toByteArray();
                                String data = Base64.encodeToString(bytes, Base64.NO_WRAP);
                                promise.resolve(data);
                            }
                        }
                        catch (Exception e) {
                            promise.reject(e);
                        }
                        finally {
                            if (outputStream != null) {
                                try {
                                    outputStream.close();
                                } catch (IOException e) {
                                    e.printStackTrace();
                                }
                            }
                        }
                    }
                });
            }
        });
    }
}
