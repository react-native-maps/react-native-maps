package com.rnmaps.maps;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertSame;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doCallRealMethod;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

@RunWith(Parameterized.class)
public class MapViewFeatureRemovalTest {
    @Parameterized.Parameters(name = "{0}, detached={2}")
    public static Collection<Object[]> cases() {
        ArrayList<Object[]> cases = new ArrayList<>();
        for (boolean detached : new boolean[]{false, true}) {
            cases.add(new Object[]{"markerMap", MapMarker.class, detached});
            cases.add(new Object[]{"heatmapMap", MapHeatmap.class, detached});
            cases.add(new Object[]{"polygonMap", MapPolygon.class, detached});
            cases.add(new Object[]{"polylineMap", MapPolyline.class, detached});
            cases.add(new Object[]{"overlayMap", MapOverlay.class, detached});
            cases.add(new Object[]{"gradientPolylineMap", MapGradientPolyline.class, detached});
        }
        return cases;
    }

    private final String lookupField;
    private final Class<? extends MapFeature> featureClass;
    private final boolean detached;

    public MapViewFeatureRemovalTest(String lookupField,
                                     Class<? extends MapFeature> featureClass,
                                     boolean detached) {
        this.lookupField = lookupField;
        this.featureClass = featureClass;
        this.detached = detached;
    }

    @Test
    public void removesOnlyTheUnmountedFeatureFromLookupBeforeNativeRemoval() throws Exception {
        // Bypass Android/Google renderer construction; execute the production removal method.
        MapView view = mock(MapView.class);
        doCallRealMethod().when(view).removeFeatureAt(0);
        MapFeature removed = mock(featureClass);
        MapFeature retained = mock(featureClass);
        Object removedHandle = new Object();
        Object retainedHandle = new Object();
        AtomicReference<Object> nativeHandle = new AtomicReference<>(removedHandle);
        when(removed.getFeature()).thenAnswer(invocation -> nativeHandle.get());

        Map<Object, MapFeature> lookup = new HashMap<>();
        lookup.put(removedHandle, removed);
        lookup.put(retainedHandle, retained);
        setField(view, lookupField, lookup);
        ArrayList<MapFeature> children = new ArrayList<>(Arrays.asList(removed, retained));
        setField(view, "features", detached ? new ArrayList<>() : children);
        setField(view, "savedFeatures", detached ? children : null);

        doAnswer(invocation -> {
            assertFalse("Lookup must release the feature before native removal",
                    lookup.containsKey(removedHandle));
            nativeHandle.set(null);
            return null;
        }).when(removed).removeFromMap(any());

        view.removeFeatureAt(0);

        assertEquals(1, children.size());
        assertSame(retained, children.get(0));
        assertEquals(1, lookup.size());
        assertFalse(lookup.containsValue(removed));
        assertSame(retained, lookup.get(retainedHandle));
        verify(removed).removeFromMap(any());
    }

    private static void setField(MapView view, String name, Object value) throws Exception {
        Field field = MapView.class.getDeclaredField(name);
        field.setAccessible(true);
        field.set(view, value);
    }
}
