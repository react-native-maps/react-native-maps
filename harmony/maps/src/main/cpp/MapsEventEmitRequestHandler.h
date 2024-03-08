/*
 * MIT License
 *
 * Copyright (C) 2023 Huawei Device Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

#pragma once
#include "RNOH/ArkJS.h"
#include "RNOH/EventEmitRequestHandler.h"
#include "EventEmitters.h"

using namespace facebook;
namespace rnoh {

    enum AIRMapEventType {
        MAP_READY = 0,
        MAP_PRESS = 1,
        MAP_LONG_PRESS = 2,
        MAP_REGION_CHANGE = 3,
        MAP_MARKER_PRESS = 4,
        MAP_MARKER_DRAG = 5,
        MAP_MARKER_DRAG_START = 6,
        MAP_MARKER_DRAG_END = 7,
        MAP_POI = 8,
    };

    AIRMapEventType getAIRMapEventType(ArkJS &arkJs, napi_value eventObject) {
        auto eventType = arkJs.getString(arkJs.getObjectProperty(eventObject, "type"));
        if (eventType == "onMapReady") {
            return AIRMapEventType::MAP_READY;
        } else if (eventType == "onPress") {
            return AIRMapEventType::MAP_PRESS;
        } else if (eventType == "onLongPress") {
            return AIRMapEventType::MAP_LONG_PRESS;
        } else if (eventType == "onRegionChange") {
            return AIRMapEventType::MAP_REGION_CHANGE;
        } else if (eventType == "onMarkerPress") {
            return AIRMapEventType::MAP_MARKER_PRESS;
        } else if (eventType == "onMarkerDrag") {
            return AIRMapEventType::MAP_MARKER_DRAG;
        } else if (eventType == "onMarkerDragStart") {
            return AIRMapEventType::MAP_MARKER_DRAG_START;
        } else if (eventType == "onMarkerDragEnd") {
            return AIRMapEventType::MAP_MARKER_DRAG_END;
        } else if (eventType == "onPoiClick") {
            return AIRMapEventType::MAP_POI;
        } else {
            throw std::runtime_error("Unknown Page event type");
        }
}

class AIRMapEventEmitRequestHandler : public EventEmitRequestHandler {
public:
    void handleEvent(EventEmitRequestHandler::Context const &ctx) override
    {
        if (ctx.eventName != "AIRMap") {
            return;
        }
        ArkJS arkJs(ctx.env);
        auto eventEmitter = ctx.shadowViewRegistry->getEventEmitter<react::AIRMapEventEmitter>(ctx.tag);
        if (eventEmitter == nullptr) {
            return;
        }
        switch (getAIRMapEventType(arkJs, ctx.payload)) {
            case AIRMapEventType::MAP_READY: {
                react::AIRMapEventEmitter::onMapReadyEvent event{};
                eventEmitter->onMapReady(event);
                }
                break;
            case AIRMapEventType::MAP_PRESS: {
                auto _coordinate = arkJs.getObjectProperty(ctx.payload, "coordinate");
                facebook::react::Coordinate coordinate = {
                    (float)arkJs.getDouble(arkJs.getObjectProperty(_coordinate, "latitude")),
                    (float)arkJs.getDouble(arkJs.getObjectProperty(_coordinate, "longitude"))
                };
                react::AIRMapEventEmitter::onPressEvent event{coordinate};
                eventEmitter->onPress(event);
                }
                break;
            case AIRMapEventType::MAP_LONG_PRESS: {
                auto _coordinate = arkJs.getObjectProperty(ctx.payload, "coordinate");
                facebook::react::Coordinate coordinate = {
                    (float)arkJs.getDouble(arkJs.getObjectProperty(_coordinate, "latitude")),
                    (float)arkJs.getDouble(arkJs.getObjectProperty(_coordinate, "longitude"))};
                react::AIRMapEventEmitter::onLongPressEvent event{coordinate};
                eventEmitter->onLongPress(event);
                }
                break;
            case AIRMapEventType::MAP_REGION_CHANGE: {
                auto _region = arkJs.getObjectProperty(ctx.payload, "region");
                facebook::react::Region region = {
                    (float)arkJs.getDouble(arkJs.getObjectProperty(_region, "latitude")),
                    (float)arkJs.getDouble(arkJs.getObjectProperty(_region, "longitude")),
                    (float)arkJs.getDouble(arkJs.getObjectProperty(_region, "longitudeDelta")),
                    (float)arkJs.getDouble(arkJs.getObjectProperty(_region, "longitudeDelta"))
                };
                react::AIRMapEventEmitter::onRegionEvent event{region};
                eventEmitter->onRegionChange(event);
                } break;
            case AIRMapEventType::MAP_MARKER_PRESS: {
                auto _coordinate = arkJs.getObjectProperty(ctx.payload, "coordinate");
                facebook::react::Coordinate coordinate = {
                    (float)arkJs.getDouble(arkJs.getObjectProperty(_coordinate, "latitude")),
                    (float)arkJs.getDouble(arkJs.getObjectProperty(_coordinate, "longitude"))};
                react::AIRMapEventEmitter::onPressEvent event{coordinate};
                eventEmitter->onMarkerPress(event);
                } break;
                case AIRMapEventType::MAP_MARKER_DRAG: {
                auto _coordinate = arkJs.getObjectProperty(ctx.payload, "coordinate");
                facebook::react::Coordinate coordinate = {
                    (float)arkJs.getDouble(arkJs.getObjectProperty(_coordinate, "latitude")),
                    (float)arkJs.getDouble(arkJs.getObjectProperty(_coordinate, "longitude"))};
                react::AIRMapEventEmitter::onPressEvent event{coordinate};
                eventEmitter->onMarkerDrag(event);
                } break;
                case AIRMapEventType::MAP_MARKER_DRAG_START: {
                auto _coordinate = arkJs.getObjectProperty(ctx.payload, "coordinate");
                facebook::react::Coordinate coordinate = {
                    (float)arkJs.getDouble(arkJs.getObjectProperty(_coordinate, "latitude")),
                    (float)arkJs.getDouble(arkJs.getObjectProperty(_coordinate, "longitude"))};
                react::AIRMapEventEmitter::onPressEvent event{coordinate};
                eventEmitter->onMarkerDragStart(event);
                } break;
                case AIRMapEventType::MAP_MARKER_DRAG_END: {
                auto _coordinate = arkJs.getObjectProperty(ctx.payload, "coordinate");
                facebook::react::Coordinate coordinate = {
                    (float)arkJs.getDouble(arkJs.getObjectProperty(_coordinate, "latitude")),
                    (float)arkJs.getDouble(arkJs.getObjectProperty(_coordinate, "longitude"))};
                react::AIRMapEventEmitter::onPressEvent event{coordinate};
                eventEmitter->onMarkerDragEnd(event);
                } break;
                case AIRMapEventType::MAP_POI: {
                auto _coordinate = arkJs.getObjectProperty(ctx.payload, "coordinate");
                facebook::react::Coordinate coordinate = {
                    (float)arkJs.getDouble(arkJs.getObjectProperty(_coordinate, "latitude")),
                    (float)arkJs.getDouble(arkJs.getObjectProperty(_coordinate, "longitude"))};
                auto placeId = arkJs.getString(arkJs.getObjectProperty(ctx.payload, "placeId"));
                auto name = arkJs.getString(arkJs.getObjectProperty(ctx.payload, "name"));
                react::AIRMapEventEmitter::onPoiClickEvent event{placeId, name, coordinate};
                eventEmitter->onPoiClick(event);
                } break;
            default:
                break;
        }
    };
};

enum AIRMapMarkerEventType {
    MARKER_PRESS = 0,
    MARKER_DRAG_START = 1,
    MARKER_DRAG = 2,
    MARKER_DRAG_END = 3,
};

AIRMapMarkerEventType getAIRMapMarkerEventType(ArkJS &arkJs, napi_value eventObject) {
    auto eventType = arkJs.getString(arkJs.getObjectProperty(eventObject, "type"));
    if (eventType == "onPress") {
        return AIRMapMarkerEventType::MARKER_PRESS;
    } else if (eventType == "onDragStart") {
        return AIRMapMarkerEventType::MARKER_DRAG_START;
    } else if (eventType == "onDrag") {
        return AIRMapMarkerEventType::MARKER_DRAG;
    } else if (eventType == "onDragEnd") {
        return AIRMapMarkerEventType::MARKER_DRAG_END;
    } else {
        throw std::runtime_error("Unknown Page event type");
    }
}

class AIRMapMarkerEventEmitRequestHandler : public EventEmitRequestHandler {
public:
    void handleEvent(EventEmitRequestHandler::Context const &ctx) override {
        if (ctx.eventName != "AIRMapMarker") {
            return;
        }
        ArkJS arkJs(ctx.env);
        auto eventEmitter = ctx.shadowViewRegistry->getEventEmitter<react::AIRMapMarkerEventEmitter>(ctx.tag);
        if (eventEmitter == nullptr) {
            return;
        }
        switch (getAIRMapMarkerEventType(arkJs, ctx.payload)) {
            case AIRMapMarkerEventType::MARKER_PRESS: {
                    react::AIRMapMarkerEventEmitter::onPressEvent event{};
                    eventEmitter->onPress(event);
                    }
                    break;
            case AIRMapMarkerEventType::MARKER_DRAG_START: {
                    auto _coordinate = arkJs.getObjectProperty(ctx.payload, "coordinate");
                    facebook::react::Coordinate coordinate = {
                        (float)arkJs.getDouble(arkJs.getObjectProperty(_coordinate, "latitude")),
                        (float)arkJs.getDouble(arkJs.getObjectProperty(_coordinate, "longitude"))};
                    react::AIRMapMarkerEventEmitter::onDragStartEvent event{coordinate};
                    eventEmitter->onDragStart(event);
                    }
                    break;
            case AIRMapMarkerEventType::MARKER_DRAG: {
                    auto _coordinate = arkJs.getObjectProperty(ctx.payload, "coordinate");
                    facebook::react::Coordinate coordinate = {
                        (float)arkJs.getDouble(arkJs.getObjectProperty(_coordinate, "latitude")),
                        (float)arkJs.getDouble(arkJs.getObjectProperty(_coordinate, "longitude"))};
                    react::AIRMapMarkerEventEmitter::onDragEvent event{coordinate};
                    eventEmitter->onDrag(event);
                    }
                    break;
            case AIRMapMarkerEventType::MARKER_DRAG_END: {
                    auto _coordinate = arkJs.getObjectProperty(ctx.payload, "coordinate");
                    facebook::react::Coordinate coordinate = {
                        (float)arkJs.getDouble(arkJs.getObjectProperty(_coordinate, "latitude")),
                        (float)arkJs.getDouble(arkJs.getObjectProperty(_coordinate, "longitude"))};
                    react::AIRMapMarkerEventEmitter::onDragEndEvent event{coordinate};
                    eventEmitter->onDragEnd(event);
                    break;
                    }
            default:
                    break;
        }
    };
};

enum AIRMapCalloutEventType {
    CALLOUT_PRESS = 0,
};

AIRMapCalloutEventType getAIRMapCalloutEventType(ArkJS &arkJs, napi_value eventObject) {
    auto eventType = arkJs.getString(arkJs.getObjectProperty(eventObject, "type"));
    if (eventType == "onPress") {
        return AIRMapCalloutEventType::CALLOUT_PRESS;
    } else {
        throw std::runtime_error("Unknown Page event type");
    }
}

class AIRMapCalloutEventEmitRequestHandler : public EventEmitRequestHandler {
public:
    void handleEvent(EventEmitRequestHandler::Context const &ctx) override {
        if (ctx.eventName != "AIRMapCallout") {
                    return;
        }
        ArkJS arkJs(ctx.env);
        auto eventEmitter = ctx.shadowViewRegistry->getEventEmitter<react::AIRMapCalloutEventEmitter>(ctx.tag);
        if (eventEmitter == nullptr) {
                    return;
        }
        switch (getAIRMapCalloutEventType(arkJs, ctx.payload)) {
        case AIRMapCalloutEventType::CALLOUT_PRESS: {
                    auto _coordinate = arkJs.getObjectProperty(ctx.payload, "coordinate");
                    facebook::react::Coordinate coordinate = {
                        (float)arkJs.getDouble(arkJs.getObjectProperty(_coordinate, "latitude")),
                        (float)arkJs.getDouble(arkJs.getObjectProperty(_coordinate, "longitude"))};
                    react::AIRMapCalloutEventEmitter::onPressEvent event{coordinate};
                    eventEmitter->onPress(event);
        } break;
        default:
                    break;
        }
    };
};

enum AIRMapCalloutSubviewEventType {
    CALLOUT_SUBVIEW_PRESS = 0,
};

AIRMapCalloutSubviewEventType getAIRMapCalloutSubviewEventType(ArkJS &arkJs, napi_value eventObject) {
    auto eventType = arkJs.getString(arkJs.getObjectProperty(eventObject, "type"));
    if (eventType == "onPress") {
        return AIRMapCalloutSubviewEventType::CALLOUT_SUBVIEW_PRESS;
    } else {
        throw std::runtime_error("Unknown Page event type");
    }
}

class AIRMapCalloutSubviewEventEmitRequestHandler : public EventEmitRequestHandler {
public:
    void handleEvent(EventEmitRequestHandler::Context const &ctx) override {
        if (ctx.eventName != "AIRMapCalloutSubview") {
                    return;
        }
        ArkJS arkJs(ctx.env);
        auto eventEmitter = ctx.shadowViewRegistry->getEventEmitter<react::AIRMapCalloutSubviewEventEmitter>(ctx.tag);
        if (eventEmitter == nullptr) {
                    return;
        }
        switch (getAIRMapCalloutSubviewEventType(arkJs, ctx.payload)) {
        case AIRMapCalloutSubviewEventType::CALLOUT_SUBVIEW_PRESS: {
                    react::AIRMapCalloutSubviewEventEmitter::onPressEvent event{};
                    eventEmitter->onPress(event);
        } break;
        default:
                    break;
        }
    };
};
} // namespace rnoh