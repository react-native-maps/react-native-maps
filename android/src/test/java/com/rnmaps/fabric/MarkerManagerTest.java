package com.rnmaps.fabric;

import android.view.View;
import android.view.ViewParent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.UiThreadUtil;
import com.rnmaps.maps.MapMarker;

import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.MockedStatic;

import static org.mockito.ArgumentMatchers.same;
import static org.mockito.Mockito.clearInvocations;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class MarkerManagerTest {

    @Test
    public void layoutListenerIgnoresRecycledChildWithNonMarkerParent() {
        MarkerManager manager = new MarkerManager(mock(ReactApplicationContext.class));
        MapMarker marker = mock(MapMarker.class);
        View child = mock(View.class);
        manager.addView(marker, child, 0);

        ArgumentCaptor<View.OnLayoutChangeListener> listenerCaptor =
                ArgumentCaptor.forClass(View.OnLayoutChangeListener.class);
        verify(child).addOnLayoutChangeListener(listenerCaptor.capture());
        when(child.getParent()).thenReturn(mock(ViewParent.class));

        listenerCaptor.getValue().onLayoutChange(child, 0, 0, 20, 30, 0, 0, 0, 0);
    }

    @Test
    public void layoutListenerUpdatesItsCurrentMarkerParent() {
        MarkerManager manager = new MarkerManager(mock(ReactApplicationContext.class));
        MapMarker marker = mock(MapMarker.class);
        View child = mock(View.class);
        manager.addView(marker, child, 0);

        ArgumentCaptor<View.OnLayoutChangeListener> listenerCaptor =
                ArgumentCaptor.forClass(View.OnLayoutChangeListener.class);
        verify(child).addOnLayoutChangeListener(listenerCaptor.capture());
        when(child.getParent()).thenReturn(marker);

        listenerCaptor.getValue().onLayoutChange(child, 5, 10, 25, 40, 0, 0, 0, 0);

        verify(marker).update(20, 30);
    }

    @Test
    public void removeViewAtDetachesTheMarkersLayoutListener() {
        MarkerManager manager = new MarkerManager(mock(ReactApplicationContext.class));
        MapMarker marker = mock(MapMarker.class);
        View child = mock(View.class);
        manager.addView(marker, child, 0);

        ArgumentCaptor<View.OnLayoutChangeListener> listenerCaptor =
                ArgumentCaptor.forClass(View.OnLayoutChangeListener.class);
        verify(child).addOnLayoutChangeListener(listenerCaptor.capture());
        when(marker.getChildAt(0)).thenReturn(child);
        clearInvocations(child, marker);

        try (MockedStatic<UiThreadUtil> uiThread = mockStatic(UiThreadUtil.class)) {
            manager.removeViewAt(marker, 0);
        }

        verify(child).removeOnLayoutChangeListener(same(listenerCaptor.getValue()));
        verify(marker).update(true);
    }
}
