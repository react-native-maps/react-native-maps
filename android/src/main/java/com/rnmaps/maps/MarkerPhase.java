package com.rnmaps.maps;

/**
 * Where a MapMarker is on its way onto or off the map.
 *
 * The point of phases is to change the map in one place, at one time. New
 * markers stay hidden, and markers React removed stay on the map, until
 * MapView swaps them in a single frame: it shows the new ones and takes the
 * removed ones off together. Without that, the map would flicker:
 * - React replaces markers, e.g. when clusters change. The old ones would
 *   leave before the new ones had drawn their icons, leaving a gap.
 * - React moves a marker in the children order by removing it and adding it
 *   back. That would make a new Google marker, which blinks while it draws.
 * - A new marker would show Google's red default pin until its icon draws.
 *
 * MapMarker owns its phase. MapView tells it what React did with on…()
 * methods, and tells it to show or leave the map with plain verbs:
 * - onAddedByReact(): OFF_MAP → WAITING_FOR_ICON or READY_TO_SHOW. When
 *   React moves a marker, REMOVED_BY_REACT → SHOWN, or WAITING_FOR_ICON if
 *   we hadn't shown it yet.
 * - onIconReady(): WAITING_FOR_ICON → READY_TO_SHOW, once it has drawn its
 *   icon
 * - show(): READY_TO_SHOW → SHOWN
 * - onRemovedByReact(): anything on the map → REMOVED_BY_REACT
 * - removeFromMap(): → OFF_MAP
 * - onMapRecreated(): → OFF_MAP, when the Google map was recreated
 *
 * MapView keeps every marker that's WAITING_FOR_ICON, READY_TO_SHOW or
 * REMOVED_BY_REACT in markersToSwap, and MarkerSwapPlanner decides when
 * swapMarkersIfReady() calls show() and removeFromMap() on them.
 *
 * Flow 1: React adds a marker with a custom view:
 * 1. Fabric's MapViewManager.addView() calls MapView.addFeature(), which
 *    schedules a swap for after React's batch and calls onAddedByReact().
 *    The marker goes on the map hidden, WAITING_FOR_ICON.
 * 2. Fabric adds our custom view: MapMarker.addView() calls redraw(),
 *    which waits for the next frame. Layout follows in the same batch.
 * 3. Next frame, the scheduled swap finds the marker still waiting, so it
 *    sets a timeout of MarkerSwapPlanner.maxWaitMs.
 * 4. The redraw draws our laid-out view, so updateMarkerIcon() calls
 *    onIconReady(): READY_TO_SHOW. MapView.onMarkerIconReady() swaps
 *    right away if nothing else is waiting: show() makes the marker
 *    visible, and markers it replaces leave the map in the same frame.
 * 5. If other new markers are still drawing, the swap waits for them, up
 *    to the timeout.
 *
 * Flow 2: React moves a marker, e.g. because the children's order changed:
 * 1. MapViewManager.removeViewAt() calls MapView.removeFeatureAt(), which
 *    calls onRemovedByReact(): REMOVED_BY_REACT. MapView takes it out of
 *    markerMap so taps can't hit it, and schedules a swap.
 * 2. In the same batch, MapViewManager.addView() calls addFeature() at the
 *    new index. onAddedByReact() sees REMOVED_BY_REACT on a visible marker,
 *    so it goes straight back to SHOWN, and MapView drops it from
 *    markersToSwap.
 * 3. The scheduled swap has nothing to do. The Google marker never left
 *    the map, and we didn't redraw it.
 *
 * Flow 3: A marker waits for an image:
 * - With the `image` prop and no custom view: setImage() starts loading it
 *   with Fresco. onAddedByReact() leaves the marker WAITING_FOR_ICON, since
 *   markReadyAfterBatchIfNoCustomView() skips markers whose image is still
 *   loading. When Fresco calls onFinalImageSet(), update(true) sets the
 *   icon and onIconReady() makes it READY_TO_SHOW, which swaps it in. If
 *   the image fails, onFailure() falls back to Google's default pin.
 * - With an image inside the custom view: the marker shows once its view
 *   is laid out, whether or not the image has loaded. When the image
 *   draws, onDescendantInvalidated() redraws the marker if it has
 *   tracksViewChanges={true}.
 * - If an icon takes longer than maxWaitMs, the swap goes ahead without
 *   it. The late marker shows on its own once its icon is ready.
 *
 * Flow 4: React removes a marker and nothing replaces it:
 * 1. MapViewManager.removeViewAt() calls MapView.removeFeatureAt(), which
 *    calls onRemovedByReact(): REMOVED_BY_REACT. MapView takes it out of
 *    markerMap so taps can't hit it, and schedules a swap.
 * 2. Nothing adds it back in the same batch, so it stays on the map with
 *    its last icon.
 * 3. Next frame, the scheduled swap calls removeFromMap(): OFF_MAP. If
 *    other new markers are still drawing their icons, the swap waits for
 *    them, up to MarkerSwapPlanner.maxWaitMs.
 */
public enum MarkerPhase {
    /** Not on the map. New markers, and markers taken off the map. */
    OFF_MAP,
    /**
     * Hidden until its icon is drawn. Before that, Google would show its red
     * default pin, or an empty bitmap.
     */
    WAITING_FOR_ICON,
    /** Hidden until MapView shows it along with the other new markers */
    READY_TO_SHOW,
    SHOWN,
    /**
     * React removed it, but MapView keeps it on the map with its last icon
     * until the markers replacing it are shown, or until the next swap if
     * nothing replaces it. That way the map never shows a gap.
     */
    REMOVED_BY_REACT,
}
