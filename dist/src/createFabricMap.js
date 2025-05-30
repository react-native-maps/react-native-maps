import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { findNodeHandle } from 'react-native';
import NativeAirMapsModule, {} from './specs/NativeAirMapsModule';
const createFabricMap = (ViewComponent, Commands) => {
    return forwardRef((props, ref) => {
        const fabricRef = useRef(null);
        useImperativeHandle(ref, () => ({
            async getMarkersFrames(onlyVisible) {
                if (fabricRef.current) {
                    return NativeAirMapsModule.getMarkersFrames(findNodeHandle(fabricRef.current) ?? -1, onlyVisible);
                }
                else {
                    throw new Error('getMarkersFrames is only supported on iOS with Fabric.');
                }
            },
            async getCoordinateForPoint(point) {
                if (fabricRef.current) {
                    return NativeAirMapsModule.getCoordinateForPoint(findNodeHandle(fabricRef.current) ?? -1, point);
                }
                else {
                    throw new Error('getCoordinateForPoint is only supported on iOS with Fabric.');
                }
            },
            async getPointForCoordinate(coordinate) {
                if (fabricRef.current) {
                    return NativeAirMapsModule.getPointForCoordinate(findNodeHandle(fabricRef.current) ?? -1, coordinate);
                }
                else {
                    throw new Error('getPointForCoordinate is not supported on this platform.');
                }
            },
            async getAddressFromCoordinates(coordinate) {
                if (fabricRef.current) {
                    return NativeAirMapsModule.getAddressFromCoordinates(findNodeHandle(fabricRef.current) ?? -1, coordinate);
                }
                else {
                    throw new Error('getAddressFromCoordinates is not supported on this platform');
                }
            },
            async takeSnapshot(config) {
                if (fabricRef.current) {
                    return NativeAirMapsModule.takeSnapshot(findNodeHandle(fabricRef.current) ?? -1, JSON.stringify(config));
                }
                else {
                    throw new Error('takeSnapshot is only supported on iOS with Fabric.');
                }
            },
            async getCamera() {
                if (fabricRef.current) {
                    return NativeAirMapsModule.getCamera(findNodeHandle(fabricRef.current) ?? -1);
                }
                else {
                    throw new Error('getCamera is only supported on iOS with Fabric.');
                }
            },
            async getMapBoundaries() {
                if (fabricRef.current) {
                    return NativeAirMapsModule.getMapBoundaries(findNodeHandle(fabricRef.current) ?? -1);
                }
                else {
                    throw new Error('getMapBoundaries is only supported on iOS with Fabric.');
                }
            },
            animateToRegion(region, duration) {
                if (fabricRef.current) {
                    try {
                        Commands.animateToRegion(fabricRef.current, JSON.stringify(region), duration);
                    }
                    catch (error) {
                        throw new Error('Failed to animateToRegion');
                    }
                }
                else {
                    throw new Error('animateToRegion is only supported on iOS with Fabric.');
                }
            },
            fitToElements(edgePadding, animated) {
                if (fabricRef.current) {
                    try {
                        Commands.fitToElements(fabricRef.current, JSON.stringify(edgePadding), animated);
                    }
                    catch (error) {
                        throw new Error('Failed to fitToElements');
                    }
                }
                else {
                    throw new Error('fitToElements is only supported on iOS with Fabric.');
                }
            },
            fitToSuppliedMarkers(markers, edgePadding, animated) {
                if (fabricRef.current) {
                    try {
                        Commands.fitToSuppliedMarkers(fabricRef.current, JSON.stringify(markers), JSON.stringify(edgePadding), animated);
                    }
                    catch (error) {
                        throw new Error('Failed to fitToSuppliedMarkers');
                    }
                }
                else {
                    throw new Error('fitToSuppliedMarkers is only supported on iOS with Fabric.');
                }
            },
            animateCamera(camera, duration) {
                if (fabricRef.current) {
                    try {
                        Commands.animateCamera(fabricRef.current, JSON.stringify(camera), duration);
                    }
                    catch (error) {
                        throw new Error('Failed to animateCamera');
                    }
                }
                else {
                    throw new Error('animateCamera is only supported on iOS with Fabric.');
                }
            },
            fitToCoordinates(coordinates, edgePadding, animated) {
                if (fabricRef.current) {
                    try {
                        Commands.fitToCoordinates(fabricRef.current, JSON.stringify(coordinates), JSON.stringify(edgePadding), animated);
                    }
                    catch (error) {
                        throw new Error('Failed to fitToCoordinates');
                    }
                }
                else {
                    throw new Error('fitToCoordinates is only supported on iOS with Fabric.');
                }
            },
            setIndoorActiveLevelIndex(activeLevelIndex) {
                if (fabricRef.current) {
                    try {
                        Commands.setIndoorActiveLevelIndex(fabricRef.current, activeLevelIndex);
                    }
                    catch (error) {
                        console.error('Failed to set camera:', error);
                    }
                }
                else {
                    console.warn('setIndoorActiveLevelIndex is not supported.');
                }
            },
            setCamera(camera) {
                if (fabricRef.current) {
                    try {
                        Commands.setCamera(fabricRef.current, JSON.stringify(camera));
                    }
                    catch (error) {
                        console.error('Failed to set camera:', error);
                    }
                }
                else {
                    console.warn('setCamera is not supported');
                }
            },
        }));
        // @ts-ignore
        return <ViewComponent {...props} ref={fabricRef}/>;
    });
};
export default createFabricMap;
