package com.rnmaps.maps;

/** Small, platform-independent helpers used by the native follow camera. */
final class UserTrackingMath {
    private UserTrackingMath() {}

    static double wrappedDelta(double from, double to) {
        double delta = (to - from) % 360.0;
        if (delta > 180.0) delta -= 360.0;
        if (delta < -180.0) delta += 360.0;
        return delta;
    }

    static double normalize(double angle) {
        return (angle % 360.0 + 360.0) % 360.0;
    }

    static double smoothingFactor(double seconds) {
        return 1.0 - Math.exp(-Math.min(0.1, Math.max(0.0, seconds)) / 0.12);
    }
}
