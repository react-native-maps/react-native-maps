package com.rnmaps.maps;

import android.annotation.SuppressLint;
import android.content.Context;
import android.location.Location;
import android.os.Looper;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.Priority;
import com.google.android.gms.maps.LocationSource;
import com.google.android.gms.tasks.OnSuccessListener;

import java.lang.SecurityException;

public class FusedLocationSource implements LocationSource {

    private final FusedLocationProviderClient fusedLocationClientProviderClient;
    private final LocationRequest locationRequest;
    private LocationCallback locationCallback;
    private long activationGeneration;
    interface LocationObserver { void onLocation(Location location); }
    private LocationObserver locationObserver;

    void setLocationObserver(LocationObserver observer) { locationObserver = observer; }

    private void deliverLocation(OnLocationChangedListener listener, Location location) {
        listener.onLocationChanged(location);
        if (locationObserver != null) locationObserver.onLocation(location);
    }

    public FusedLocationSource(Context context){
        fusedLocationClientProviderClient =
                LocationServices.getFusedLocationProviderClient(context);
        locationRequest = LocationRequest.create();
        locationRequest.setPriority(Priority.PRIORITY_HIGH_ACCURACY);
        locationRequest.setInterval(5000);
    }

    public void setPriority(int priority){
        if (locationRequest.getPriority() == priority) return;
        locationRequest.setPriority(priority);
        refreshLocationRequest();
    }

    public void setInterval(int interval){
        if (locationRequest.getInterval() == interval) return;
        locationRequest.setInterval(interval);
        refreshLocationRequest();
    }

    public void setFastestInterval(int fastestInterval){
        if (locationRequest.getFastestInterval() == fastestInterval) return;
        locationRequest.setFastestInterval(fastestInterval);
        refreshLocationRequest();
    }

    @SuppressLint("MissingPermission")
    private void refreshLocationRequest() {
        if (locationCallback == null) return;
        try {
            // Updating the same callback replaces its request; it does not add a watcher.
            fusedLocationClientProviderClient.requestLocationUpdates(locationRequest, locationCallback, Looper.getMainLooper());
        } catch (SecurityException ignored) {
            // Permission can be revoked while the map is visible.
        }
    }

    @SuppressLint("MissingPermission")
    @Override
    public void activate(final OnLocationChangedListener onLocationChangedListener) {
        deactivate();
        final long generation = ++activationGeneration;
        try {
            fusedLocationClientProviderClient.getLastLocation().addOnSuccessListener(new OnSuccessListener<Location>() {
                @Override
                public void onSuccess(Location location) {
                    if (generation == activationGeneration && location != null) {
                        deliverLocation(onLocationChangedListener, location);
                    }
                }
            });
            locationCallback = new LocationCallback() {
                @Override
                public void onLocationResult(LocationResult locationResult) {
                    if (generation != activationGeneration) return;
                    for (Location location : locationResult.getLocations()) {
                        deliverLocation(onLocationChangedListener, location);
                    }
                }
            };
            fusedLocationClientProviderClient.requestLocationUpdates(locationRequest, locationCallback, Looper.myLooper());
        } catch (SecurityException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void deactivate() {
        activationGeneration++;
        if (locationCallback != null) {
            fusedLocationClientProviderClient.removeLocationUpdates(locationCallback);
            locationCallback = null;
        }
    }
}
