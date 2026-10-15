package com.rnmaps.maps;

import org.junit.Test;
import static org.junit.Assert.*;

public class UserTrackingMathTest {
    @Test public void headingCrossesNorthAlongShortestArc() {
        assertEquals(2, UserTrackingMath.wrappedDelta(359, 1), 1e-9);
        assertEquals(-2, UserTrackingMath.wrappedDelta(1, 359), 1e-9);
        assertEquals(0, UserTrackingMath.normalize(360), 1e-9);
        assertEquals(359, UserTrackingMath.normalize(-1), 1e-9);
    }

    @Test public void longitudeCrossesAntimeridianAlongShortestArc() {
        assertEquals(0.2, UserTrackingMath.wrappedDelta(179.9, -179.9), 1e-9);
        assertEquals(-0.2, UserTrackingMath.wrappedDelta(-179.9, 179.9), 1e-9);
    }

    @Test public void smoothingHasSameResponseAtDifferentRefreshRates() {
        double at60Hz = Math.pow(1 - UserTrackingMath.smoothingFactor(1.0 / 60), 60);
        double at120Hz = Math.pow(1 - UserTrackingMath.smoothingFactor(1.0 / 120), 120);
        assertEquals(at60Hz, at120Hz, 1e-9);
        assertTrue(at60Hz < 0.001);
    }

    @Test public void stalledFrameCannotOvershootTarget() {
        assertEquals(0, UserTrackingMath.smoothingFactor(-1), 1e-9);
        double alpha = UserTrackingMath.smoothingFactor(5);
        assertTrue(alpha > 0 && alpha < 1);
        assertEquals(UserTrackingMath.smoothingFactor(0.1), alpha, 1e-9);
    }
}
