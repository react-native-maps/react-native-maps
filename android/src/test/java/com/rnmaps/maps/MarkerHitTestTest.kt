package com.rnmaps.maps

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class MarkerHitTestTest {
    @Test
    fun `a tap outside every padded icon is a map press`() {
        val candidates = listOf(
            MarkerHitTest.Candidate("left", MarkerHitTest.IconRect(0f, 0f, 10f, 10f), 0f),
            MarkerHitTest.Candidate("right", MarkerHitTest.IconRect(20f, 0f, 30f, 10f), 0f),
        )

        // Between the icons, more than half the 4px square away from both
        assertNull(MarkerHitTest.findTappedMarker(candidates, tapAt(15f, 5f, googleMarker = "left")))
        // Within half the square of the left icon
        assertEquals("left", MarkerHitTest.findTappedMarker(candidates, tapAt(11f, 5f, googleMarker = "right")))
    }

    @Test
    fun `repeated taps cycle through overlapping markers and wrap around`() {
        val candidates = listOf(
            MarkerHitTest.Candidate("back", MarkerHitTest.IconRect(0f, 0f, 10f, 10f), 1f),
            MarkerHitTest.Candidate("front", MarkerHitTest.IconRect(0f, 0f, 10f, 10f), 3f),
            MarkerHitTest.Candidate("middle", MarkerHitTest.IconRect(0f, 0f, 10f, 10f), 2f),
        )

        val tappedMarkers = mutableListOf<String?>()
        var lastTappedMarker: String? = null
        repeat(4) {
            lastTappedMarker = MarkerHitTest.findTappedMarker(
                candidates,
                tapAt(5f, 5f, googleMarker = "back", lastTappedMarker = lastTappedMarker),
            )
            tappedMarkers.add(lastTappedMarker)
        }

        assertEquals(listOf("front", "middle", "back", "front"), tappedMarkers)
    }

    private fun tapAt(
        x: Float,
        y: Float,
        googleMarker: String,
        lastTappedMarker: String? = null,
    ) = MarkerHitTest.Tap(x, y, 4f, googleMarker, lastTappedMarker)
}
