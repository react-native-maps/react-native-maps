package com.rnmaps.maps;

import android.content.Context;
import android.hardware.GeomagneticField;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.location.Location;
import android.view.Choreographer;
import android.view.Surface;
import android.view.WindowManager;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.LatLng;

/**
 * UI-thread camera controller. Position comes from the map's existing LocationSource;
 * only heading mode registers a compass. One frame callback coalesces both streams.
 */
final class UserTrackingController implements SensorEventListener, Choreographer.FrameCallback {
    private final MapView view;
    private final SensorManager sensors;
    private final Sensor rotationSensor;
    private final float[] rotation = new float[9];
    private final float[] displayRotation = new float[9];
    private final float[] orientation = new float[3];
    private String requestedMode = "";
    private String mode = "none";
    private boolean legacyFollow;
    private boolean active;
    private boolean sensorRegistered;
    private boolean framePending;
    private boolean firstFrame = true;
    private boolean hasHeading;
    private double heading;
    private Location location;
    private double declination;
    private long previousFrame;
    private CameraPosition previousCamera;
    private int unchangedFrames;
    private boolean cameraAnimation;
    private long cameraAnimationGeneration;
    private int sensorAccuracy = SensorManager.SENSOR_STATUS_ACCURACY_MEDIUM;

    UserTrackingController(MapView view) {
        this.view = view;
        sensors = (SensorManager) view.getContext().getSystemService(Context.SENSOR_SERVICE);
        rotationSensor = sensors == null ? null : sensors.getDefaultSensor(Sensor.TYPE_ROTATION_VECTOR);
    }

    void setMode(String value) {
        requestedMode = value == null ? "" : value;
        updateMode();
    }

    void setLegacyFollow(boolean value) {
        legacyFollow = value;
        updateMode();
    }

    private void updateMode() {
        String next = requestedMode.isEmpty() ? (legacyFollow ? "follow" : "none") : requestedMode;
        if (!next.equals("follow") && !next.equals("followWithHeading")) next = "none";
        changeMode(next, "programmatic");
    }

    private void changeMode(String next, String reason) {
        if (mode.equals(next)) return;
        mode = next;
        firstFrame = true;
        previousFrame = 0;
        updateSensor();
        if (mode.equals("none")) stopFrames(); else requestFrame();
        view.onUserTrackingModeChange(mode, reason);
    }

    void onGesture() {
        if (!mode.equals("none")) changeMode("none", "userInteraction");
    }

    void setActive(boolean value) {
        if (active == value) return;
        active = value;
        if (!active) { cameraAnimation = false; cameraAnimationGeneration++; }
        firstFrame = true;
        previousFrame = 0;
        updateSensor();
        if (active) requestFrame(); else stopFrames();
    }

    private void updateSensor() {
        boolean needed = active && mode.equals("followWithHeading") && rotationSensor != null;
        if (needed && !sensorRegistered) {
            sensorRegistered = sensors.registerListener(this, rotationSensor, SensorManager.SENSOR_DELAY_GAME);
            hasHeading = false;
        } else if (!needed && sensorRegistered) {
            sensors.unregisterListener(this);
            sensorRegistered = false;
            hasHeading = false;
        }
    }

    void onLocation(Location next) {
        if (next == null || !Double.isFinite(next.getLatitude()) || !Double.isFinite(next.getLongitude()) ||
                Math.abs(next.getLatitude()) > 90 || Math.abs(next.getLongitude()) > 180 ||
                (next.hasAccuracy() && next.getAccuracy() < 0) ||
                (location != null && next.getElapsedRealtimeNanos() < location.getElapsedRealtimeNanos())) return;
        boolean changed = location == null || location.getLatitude() != next.getLatitude() ||
                location.getLongitude() != next.getLongitude();
        location = new Location(next);
        declination = new GeomagneticField((float) next.getLatitude(), (float) next.getLongitude(),
                (float) next.getAltitude(), System.currentTimeMillis()).getDeclination();
        // Simulators and devices without a rotation sensor can use a valid moving course.
        if (!sensorRegistered && next.hasBearing() && Float.isFinite(next.getBearing()) &&
                next.hasSpeed() && Float.isFinite(next.getSpeed()) && next.getSpeed() > 0.5f) {
            double course = UserTrackingMath.normalize(next.getBearing());
            if (!hasHeading || Math.abs(UserTrackingMath.wrappedDelta(heading, course)) >= 0.5) changed = true;
            heading = course;
            hasHeading = true;
        }
        if (changed) requestFrame();
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (!active || !sensorRegistered || sensorAccuracy == SensorManager.SENSOR_STATUS_UNRELIABLE) return;
        SensorManager.getRotationMatrixFromVector(rotation, event.values);
        WindowManager windows = (WindowManager) view.getContext().getSystemService(Context.WINDOW_SERVICE);
        int screenRotation = windows == null ? Surface.ROTATION_0 : windows.getDefaultDisplay().getRotation();
        int x = SensorManager.AXIS_X;
        int y = SensorManager.AXIS_Y;
        if (screenRotation == Surface.ROTATION_90) { x = SensorManager.AXIS_Y; y = SensorManager.AXIS_MINUS_X; }
        else if (screenRotation == Surface.ROTATION_180) { x = SensorManager.AXIS_MINUS_X; y = SensorManager.AXIS_MINUS_Y; }
        else if (screenRotation == Surface.ROTATION_270) { x = SensorManager.AXIS_MINUS_Y; y = SensorManager.AXIS_X; }
        SensorManager.remapCoordinateSystem(rotation, x, y, displayRotation);
        SensorManager.getOrientation(displayRotation, orientation);
        double next = Math.toDegrees(orientation[0]);
        if (location != null) next += declination;
        if (!Double.isFinite(next)) return;
        if (!hasHeading || Math.abs(UserTrackingMath.wrappedDelta(heading, next)) >= 0.5) {
            heading = UserTrackingMath.normalize(next);
            hasHeading = true;
            requestFrame();
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) { sensorAccuracy = accuracy; }

    long beginCameraAnimation() {
        cameraAnimation = true;
        stopFrames();
        return ++cameraAnimationGeneration;
    }

    void endCameraAnimation(long generation) {
        if (generation != cameraAnimationGeneration) return;
        cameraAnimation = false;
        firstFrame = false;
        requestFrame();
    }

    private void requestFrame() {
        if (!active || cameraAnimation || mode.equals("none") || location == null || view.map == null || framePending) return;
        framePending = true;
        Choreographer.getInstance().postFrameCallback(this);
    }

    private void stopFrames() {
        Choreographer.getInstance().removeFrameCallback(this);
        framePending = false;
        previousFrame = 0;
        previousCamera = null;
        unchangedFrames = 0;
    }

    @Override
    public void doFrame(long frameTimeNanos) {
        framePending = false;
        if (!active || cameraAnimation || mode.equals("none") || location == null || view.map == null) return;
        CameraPosition current = view.map.getCameraPosition();
        boolean unchanged = previousCamera != null &&
                current.target.equals(previousCamera.target) && current.bearing == previousCamera.bearing;
        unchangedFrames = unchanged ? unchangedFrames + 1 : 0;
        previousCamera = current;
        // Camera target bounds can prevent progress. Wait for new input instead of spinning.
        if (unchangedFrames >= 8) { stopFrames(); return; }
        double latitude = Math.max(-85, Math.min(85, location.getLatitude()));
        double longitude = location.getLongitude();
        double latDelta = latitude - current.target.latitude;
        double lonDelta = UserTrackingMath.wrappedDelta(current.target.longitude, longitude);
        double bearingDelta = mode.equals("followWithHeading") && hasHeading ?
                UserTrackingMath.wrappedDelta(current.bearing, heading) : 0;
        double distance = Math.hypot(latDelta, lonDelta * Math.cos(Math.toRadians(latitude))) * 111320;
        if (distance < 0.01 && Math.abs(bearingDelta) < 0.01) {
            firstFrame = false;
            stopFrames();
            return;
        }
        boolean settled = distance < 0.15 && Math.abs(bearingDelta) < 0.1;
        double seconds = previousFrame == 0 ? 1.0 / 60 : (frameTimeNanos - previousFrame) / 1e9;
        double alpha = firstFrame || settled ? 1 : UserTrackingMath.smoothingFactor(seconds);
        firstFrame = false;
        previousFrame = frameTimeNanos;
        CameraPosition next = new CameraPosition.Builder(current)
                .target(new LatLng(current.target.latitude + latDelta * alpha,
                        current.target.longitude + lonDelta * alpha))
                .bearing((float) UserTrackingMath.normalize(current.bearing + bearingDelta * alpha)).build();
        view.map.moveCamera(CameraUpdateFactory.newCameraPosition(next));
        if (!settled) requestFrame(); else previousFrame = 0;
    }

    void dispose() {
        setActive(false);
        stopFrames();
    }
}
