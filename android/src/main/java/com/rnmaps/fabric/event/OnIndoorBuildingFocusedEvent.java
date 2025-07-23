package com.rnmaps.fabric.event;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;

public class OnIndoorBuildingFocusedEvent extends Event<OnIndoorBuildingFocusedEvent> {
    public static final String EVENT_NAME = "topIndoorBuildingFocused";

    private final WritableMap payload;

    public OnIndoorBuildingFocusedEvent(int surfaceId, int viewId, WritableMap payload) {
        super(surfaceId, viewId);
        this.payload = payload;
    }

    @NonNull
    @Override
    public String getEventName() {
        return EVENT_NAME;
    }

    @Override
    public WritableMap getEventData() {
        return payload;
    }
}