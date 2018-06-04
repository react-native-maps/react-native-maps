package com.airbnb.android.react.maps.osmdroid.utils;

import org.osmdroid.util.BoundingBox;
import org.osmdroid.util.GeoPoint;

public class LatLngBoundsUtils {
    public static boolean BoundsAreDifferent(BoundingBox a, BoundingBox b) {
        GeoPoint centerA = a.getCenter();
        double latA = centerA.getLatitude();
        double lngA = centerA.getLongitude();
        double latDeltaA = a.getLatitudeSpan();
        double lngDeltaA = a.getLongitudeSpan();

        GeoPoint centerB = b.getCenter();
        double latB = centerB.getLatitude();
        double lngB = centerB.getLongitude();
        double latDeltaB = b.getLatitudeSpan();
        double lngDeltaB = b.getLongitudeSpan();

        double latEps = LatitudeEpsilon(a, b);
        double lngEps = LongitudeEpsilon(a, b);

        return
                different(latA, latB, latEps) ||
                        different(lngA, lngB, lngEps) ||
                        different(latDeltaA, latDeltaB, latEps) ||
                        different(lngDeltaA, lngDeltaB, lngEps);
    }

    private static boolean different(double a, double b, double epsilon) {
        return Math.abs(a - b) > epsilon;
    }

    private static double LatitudeEpsilon(BoundingBox a, BoundingBox b) {
        double sizeA = a.getLatitudeSpan(); // something mod 180?
        double sizeB = b.getLatitudeSpan(); // something mod 180?
        double size = Math.min(Math.abs(sizeA), Math.abs(sizeB));
        return size / 2560;
    }

    private static double LongitudeEpsilon(BoundingBox a, BoundingBox b) {
        double sizeA = a.getLongitudeSpan();
        double sizeB = b.getLongitudeSpan();
        double size = Math.min(Math.abs(sizeA), Math.abs(sizeB));
        return size / 2560;
    }
}