package com.rnmaps.maps;

import android.annotation.SuppressLint;
import android.content.Context;
import android.location.Location;
import android.os.Build;
import android.os.Looper;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.Priority;
import com.google.android.gms.maps.LocationSource;
import com.google.android.gms.tasks.OnSuccessListener;

public class FusedLocationSource implements LocationSource {

    private final @NonNull FusedLocationProviderClient fusedLocationClientProviderClient;
    private @Nullable OnLocationChangedListener listener;
    private @NonNull LocationRequest locationRequest;
    private @Nullable LocationCallback locationCallback;
    private int priority = Priority.PRIORITY_HIGH_ACCURACY;
    private long interval = 5000;
    private long minUpdateInterval = 5000;

    public FusedLocationSource(Context context) {
        fusedLocationClientProviderClient =
                LocationServices.getFusedLocationProviderClient(context);
        buildLocationRequest();
    }

    @SuppressWarnings("deprecation")
    private void buildLocationRequest() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            locationRequest = new LocationRequest.Builder(priority, interval)
                    .setMinUpdateIntervalMillis(minUpdateInterval)
                    .build();
        } else {
            locationRequest = LocationRequest.create()
                    .setPriority(priority)
                    .setInterval(interval)
                    .setFastestInterval(minUpdateInterval);
        }
        restartLocationUpdates();
    }

    public void setPriority(int priority) {
        this.priority = priority;
        buildLocationRequest();
    }

    public void setInterval(int interval) {
        this.interval = interval;
        buildLocationRequest();
    }

    public void setFastestInterval(int fastestInterval) {
        this.minUpdateInterval = fastestInterval;
        buildLocationRequest();
    }

    private void restartLocationUpdates() {
        deactivate();
        if (listener != null) {
            activate(listener);
        }
    }

    @SuppressLint("MissingPermission")
    @Override
    public void activate(@NonNull final OnLocationChangedListener onLocationChangedListener) {
        this.listener = onLocationChangedListener;
        try {
            fusedLocationClientProviderClient.getLastLocation().addOnSuccessListener(new OnSuccessListener<Location>() {
                @Override
                public void onSuccess(Location location) {
                    if (location != null) {
                        onLocationChangedListener.onLocationChanged(location);
                    }
                }
            });
            locationCallback = new LocationCallback() {
                @Override
                public void onLocationResult(@NonNull LocationResult locationResult) {
                    for (Location location : locationResult.getLocations()) {
                        onLocationChangedListener.onLocationChanged(location);
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
        if (locationCallback != null) {
            fusedLocationClientProviderClient.removeLocationUpdates(locationCallback);
            locationCallback = null;
        }
    }
}