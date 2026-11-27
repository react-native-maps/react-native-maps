package com.rnmaps.maps;

import java.util.Collection;

/**
 * Decides when MapView swaps markers: when it shows the new markers that are
 * ready and takes the ones React removed off the map, all in one frame. See
 * MapView.swapMarkersIfReady() and MarkerPhase.
 *
 * This only does the math, with no Android calls, so we can unit test it.
 */
public final class MarkerSwapPlanner {
    /**
     * How long a marker waits for a swap. That's how long we keep old markers
     * on the map while new ones draw their icons, and how long a ready marker
     * waits for the others.
     *
     * Icons take a frame or two to lay out and draw, so this is several
     * frames. If one takes longer, we show what's ready instead of holding up
     * the whole map.
     */
    public static final long maxWaitMs = 200;

    /** A marker that's partway through a swap */
    public interface PendingMarker {
        /** WAITING_FOR_ICON, READY_TO_SHOW or REMOVED_BY_REACT */
        MarkerPhase getPhase();

        /**
         * When the marker started waiting for a swap, from
         * SystemClock.uptimeMillis(): when React added or removed it. A
         * marker keeps this time when its icon becomes ready, so a
         * READY_TO_SHOW marker's wait counts from when React added it.
         */
        long getSwapWaitStartMs();
    }

    private MarkerSwapPlanner() {
        throw new AssertionError("MarkerSwapPlanner only has static methods");
    }

    /**
     * Returns when to swap, from SystemClock.uptimeMillis(). A time at or
     * before nowMs means "swap now".
     *
     * 1. We swap as soon as no new marker is still waiting for its icon.
     * 2. Otherwise, we swap once some marker has waited maxWaitMs. We count
     *    removed and ready markers too. That way a gesture that keeps changing
     *    the clusters can't keep the old markers on screen until it ends.
     * 3. A marker still waiting for its icon after maxWaitMs is late. It
     *    doesn't hold up later swaps, and shows up in the first swap after
     *    its icon is ready. Otherwise a marker whose icon never draws would
     *    delay every later swap.
     */
    public static long getSwapTimeMs(Collection<? extends PendingMarker> markers, long nowMs) {
        boolean isAnyMarkerWaiting = false;
        long swapTimeMs = Long.MAX_VALUE;
        for (PendingMarker marker : markers) {
            long deadlineMs = marker.getSwapWaitStartMs() + maxWaitMs;
            boolean isWaitingForIcon = marker.getPhase() == MarkerPhase.WAITING_FOR_ICON;
            if (isWaitingForIcon && deadlineMs <= nowMs) {
                // Late, so it doesn't hold anything up
                continue;
            }
            isAnyMarkerWaiting = isAnyMarkerWaiting || isWaitingForIcon;
            swapTimeMs = Math.min(swapTimeMs, deadlineMs);
        }
        return isAnyMarkerWaiting ? swapTimeMs : nowMs;
    }
}
