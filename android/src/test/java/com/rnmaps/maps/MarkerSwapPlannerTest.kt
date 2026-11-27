package com.rnmaps.maps

import org.junit.Assert.assertEquals
import org.junit.Test

class MarkerSwapPlannerTest {
    @Test
    fun `waits for a new icon until the oldest change has waited the max`() {
        val markers = listOf(
            FakePendingMarker(MarkerPhase.REMOVED_BY_REACT, swapWaitStartMs = 1000),
            FakePendingMarker(MarkerPhase.WAITING_FOR_ICON, swapWaitStartMs = 1100),
        )

        assertEquals(1200, MarkerSwapPlanner.getSwapTimeMs(markers, 1050))
    }

    @Test
    fun `a marker whose icon is late doesn't hold up later swaps`() {
        val markers = listOf(
            // Its icon never drew, so it's late
            FakePendingMarker(MarkerPhase.WAITING_FOR_ICON, swapWaitStartMs = 1000),
            // React removed this one later, and nothing new is waiting on time
            FakePendingMarker(MarkerPhase.REMOVED_BY_REACT, swapWaitStartMs = 1500),
        )

        assertEquals(1600, MarkerSwapPlanner.getSwapTimeMs(markers, 1600))
    }

    private class FakePendingMarker(
        private val phase: MarkerPhase,
        private val swapWaitStartMs: Long,
    ) : MarkerSwapPlanner.PendingMarker {
        override fun getPhase() = phase

        override fun getSwapWaitStartMs() = swapWaitStartMs
    }
}
