package com.rnmaps.maps;

import androidx.annotation.Nullable;

import java.util.ArrayList;
import java.util.List;

/**
 * Decides which marker a tap went to, copying the Google Maps iOS SDK so
 * markers feel the same on both platforms.
 *
 * We mainly do this so markers have smaller tap areas. Google's Android SDK
 * makes every marker's tap area about 30dp bigger than its icon, and doesn't
 * let us change that:
 * https://issuetracker.google.com/issues/35823783
 *
 * We also cycle through overlapping markers ourselves, since Google's own
 * cycling isn't reliable: it often takes two taps to move to the next marker.
 *
 * Google still calls onMarkerClick for us, but we redo the hit test like
 * this:
 * 1. A marker is hit when a 4×4dp square around the finger overlaps its
 *    icon's rectangle. Transparent parts of the icon count.
 * 2. When several markers are hit, the one with the highest zIndex wins. For
 *    equal zIndexes, the marker lower on screen wins, since it's drawn in
 *    front.
 * 3. A repeated tap on the same overlapping markers goes to the next one
 *    after the last tapped marker, wrapping around.
 *
 * We got these rules by disassembling the Google Maps iOS SDK (9.4.0).
 *
 * This only does the math, with no Android calls, so we can unit test it.
 */
public final class MarkerHitTest {
    /**
     * Square around the finger, in dp, that has to overlap a marker's icon
     * for the tap to count. Same as kGMSStickerTapPadding in the Google Maps
     * iOS SDK (9.4.0), which sets GMSMarker's tap padding to 4×4pt.
     */
    public static final float tapSquareSizeDp = 4;

    /** A marker that's visible on the map */
    public static final class Candidate<M> {
        final M marker;
        /**
         * Where its icon sits on screen, in map view pixels, or null when we
         * can't tell, e.g. for Google's default pin. See
         * MapMarker.getIconScreenRect().
         */
        @Nullable
        final IconRect iconRect;
        final float zIndex;

        public Candidate(M marker, @Nullable IconRect iconRect, float zIndex) {
            this.marker = marker;
            this.iconRect = iconRect;
            this.zIndex = zIndex;
        }
    }

    /**
     * A rectangle in map view pixels. We don't use android.graphics.RectF,
     * since it doesn't work in JVM unit tests.
     */
    public static final class IconRect {
        final float left;
        final float top;
        final float right;
        final float bottom;

        public IconRect(float left, float top, float right, float bottom) {
            this.left = left;
            this.top = top;
            this.right = right;
            this.bottom = bottom;
        }
    }

    /** Where a tap landed, and what we knew before it */
    public static final class Tap<M> {
        final float x;
        final float y;
        /** tapSquareSizeDp in pixels */
        final float tapSquareSizePx;
        /** The marker Google's own hit test picked */
        final M googleMarker;
        /** The marker our last tap went to, or null after a map press */
        @Nullable
        final M lastTappedMarker;

        public Tap(float x, float y, float tapSquareSizePx, M googleMarker, @Nullable M lastTappedMarker) {
            this.x = x;
            this.y = y;
            this.tapSquareSizePx = tapSquareSizePx;
            this.googleMarker = googleMarker;
            this.lastTappedMarker = lastTappedMarker;
        }
    }

    private MarkerHitTest() {
        throw new AssertionError("MarkerHitTest only has static methods");
    }

    /**
     * Returns the marker the tap went to, or null when it missed every marker
     * and should count as a tap on the map.
     *
     * Some markers have icons we can't hit-test, like Google's default pin.
     * When they might be involved, we go with Google's pick, the same as
     * without this hit test:
     * - When Google picked one of those markers
     * - When the tap missed every marker we can hit-test, but there are
     *   markers we can't
     */
    @Nullable
    public static <M> M findTappedMarker(List<Candidate<M>> candidates, Tap<M> tap) {
        boolean hasMarkerWeCantHitTest = false;
        // Growing each icon by half the square on every side is the same as
        // checking whether the square overlaps the icon
        float padding = tap.tapSquareSizePx / 2;
        List<Candidate<M>> hits = new ArrayList<>();
        for (Candidate<M> candidate : candidates) {
            IconRect rect = candidate.iconRect;
            if (rect == null) {
                if (candidate.marker == tap.googleMarker) {
                    return tap.googleMarker;
                }
                hasMarkerWeCantHitTest = true;
                continue;
            }
            if (tap.x >= rect.left - padding && tap.x < rect.right + padding
                    && tap.y >= rect.top - padding && tap.y < rect.bottom + padding) {
                hits.add(candidate);
            }
        }
        if (hits.isEmpty()) {
            return hasMarkerWeCantHitTest ? tap.googleMarker : null;
        }

        // The marker drawn in front comes first
        hits.sort((a, b) -> {
            // Highest zIndex first
            int byZIndex = Float.compare(b.zIndex, a.zIndex);
            if (byZIndex != 0) {
                return byZIndex;
            }
            // Then lowest on screen first. This is inferred, rather than
            // traced exactly: iOS sorts by a tapOrdering tuple of priority,
            // zIndex and a value that -[GMSMarker updateZOrderForCamera:]
            // computes from screen position.
            return Float.compare(b.iconRect.bottom, a.iconRect.bottom);
        });

        // When the last tapped marker wasn't hit this time, lastTappedIndex is
        // -1, so we start from the front marker
        int lastTappedIndex = -1;
        for (int i = 0; i < hits.size(); i++) {
            if (hits.get(i).marker == tap.lastTappedMarker) {
                lastTappedIndex = i;
                break;
            }
        }
        return hits.get((lastTappedIndex + 1) % hits.size()).marker;
    }
}
