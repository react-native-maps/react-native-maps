package com.airbnb.android.react.maps;

import android.content.Context;
import android.location.Location;
import android.os.Looper;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.maps.LocationSource;
import com.google.android.gms.tasks.OnSuccessListener;

public class FusedLocationSource implements LocationSource {

    private FusedLocationProviderClient fusedLocationClientProviderClient;
    private LocationRequest locationRequest;
    private LocationCallback locationCallback;
    private Context context;

    public FusedLocationSource(Context context){
        fusedLocationClientProviderClient =
                LocationServices.getFusedLocationProviderClient(context);
        locationRequest = LocationRequest.create();
        locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
        locationRequest.setInterval(500);
    }

    @Override
    public void activate(final OnLocationChangedListener onLocationChangedListener) {
        fusedLocationClientProviderClient.getLastLocation().addOnSuccessListener(new OnSuccessListener<Location>() {
            @Override
            public void onSuccess(Location location) {
                System.out.println("getLatitude(): " + location.getLatitude());
                onLocationChangedListener.onLocationChanged(location);
            }
        });

        locationCallback = new LocationCallback() {
            @Override
            public void onLocationResult(LocationResult locationResult) {
                for (Location location : locationResult.getLocations()) {
                    System.out.println("getLatitude(): " + location.getLatitude());
                    onLocationChangedListener.onLocationChanged(location);
                }
            }
        };

        fusedLocationClientProviderClient.requestLocationUpdates(locationRequest, locationCallback, Looper.myLooper());
    }

    @Override
    public void deactivate() {
        fusedLocationClientProviderClient.removeLocationUpdates(locationCallback);
    }
}
