package com.rnmaps.fabric.event;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;

public class OnUserLocationChangeEvent extends Event<OnUserLocationChangeEvent> {
    public static final String EVENT_NAME = "topUserLocationChange";

    private final WritableMap payload;

    public OnUserLocationChangeEvent(int surfaceId, int viewId, WritableMap payload) {
        super(surfaceId, viewId);
        this.payload = payload;
    }

    @Override
    public String getEventName() {
        return EVENT_NAME;
    }

    @Override
    public WritableMap getEventData() {
        return payload;
    }
}