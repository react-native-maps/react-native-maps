import React, {forwardRef, useImperativeHandle, useRef} from 'react';

// Import your native commands for FabricMapView
import type {MapFabricNativeProps, Camera} from './specs/NativeComponentMapView';
import FabricMapView, {Commands} from './specs/NativeComponentMapView';

export interface FabricMapHandle {
    getCamera: () => Promise<Camera>;
    setCamera: (camera: Partial<Camera>) => void;
    animateToRegion: (region: Region, duration: number) => void;
    animateCamera: (camera: Partial<Camera>, duration: number) => void;
    fitToElements: (
        edgePadding: EdgePadding,
        animated: boolean,
    ) => void;

    fitToSuppliedMarkers: (
        markers: string[],
        edgePadding: EdgePadding,
        animated: boolean,
    ) => void;

    fitToCoordinates: (
        coordinates: LatLng[],
        edgePadding: EdgePadding,
        animated: boolean,
    ) => void;

    setMapBoundaries: (
        northEast: LatLng,
        southWest: LatLng,
    ) => void;
}

import {LatLng, Region} from './sharedTypes';
import {EdgePadding} from './MapView.types';

export const FabricMap = forwardRef<FabricMapHandle, MapFabricNativeProps>(
    (props, ref) => {
        const fabricRef = useRef<React.ElementRef<React.ComponentType>>(null);
        // Use Imperative Handle to expose commands
        useImperativeHandle(ref, () => ({
            animateToRegion(region: Region, duration: number) {
                if (fabricRef.current) {
                    try {
                        Commands.animateToRegion(fabricRef.current, JSON.stringify(region), duration);
                    } catch (error) {
                        throw new Error('Failed to animateToRegion');
                    }
                } else {
                    throw new Error('animateToRegion is only supported on iOS with Fabric.');
                }
            },
            fitToElements(edgePadding: EdgePadding, animated: boolean) {
                if (fabricRef.current) {
                    try {
                        Commands.fitToElements(fabricRef.current, JSON.stringify(edgePadding), animated);
                    } catch (error) {
                        throw new Error('Failed to fitToElements');
                    }
                } else {
                    throw new Error('fitToElements is only supported on iOS with Fabric.');
                }
            },
            fitToSuppliedMarkers(
                markers: string[],
                edgePadding: EdgePadding,
                animated: boolean,
            ) {
                if (fabricRef.current) {
                    try {
                        Commands.fitToSuppliedMarkers(fabricRef.current, JSON.stringify(markers), JSON.stringify(edgePadding), animated);
                    } catch (error) {
                        throw new Error('Failed to fitToSuppliedMarkers');
                    }
                } else {
                    throw new Error('fitToSuppliedMarkers is only supported on iOS with Fabric.');
                }
            },
            animateCamera(camera: Partial<Camera>, duration: number) {
                if (fabricRef.current) {
                    try {
                        Commands.animateCamera(fabricRef.current, JSON.stringify(camera), duration);
                    } catch (error) {
                        throw new Error('Failed to animateCamera');
                    }
                } else {
                    throw new Error('animateCamera is only supported on iOS with Fabric.');
                }
            },
            fitToCoordinates(
                coordinates: LatLng[],
                edgePadding: EdgePadding,
                animated: boolean,
            ) {
                if (fabricRef.current) {
                    try {
                        Commands.fitToCoordinates(fabricRef.current, JSON.stringify(coordinates), JSON.stringify(edgePadding), animated);
                    } catch (error) {
                        throw new Error('Failed to fitToCoordinates');
                    }
                } else {
                    throw new Error('fitToCoordinates is only supported on iOS with Fabric.');
                }
            },
            async getCamera() {
                if (fabricRef.current) {
                    try {
                        const jsonString = await Commands.getCamera(fabricRef.current);
                        console.log('getCamera: ' + jsonString);
                        return JSON.parse(jsonString);
                    } catch (error) {
                        throw new Error('Failed to retrieve camera');
                    }
                } else {
                    throw new Error('getCamera is only supported on iOS with Fabric.');
                }
            },
            setCamera(camera: Partial<Camera>) {
                if (fabricRef.current) {
                    try {
                        Commands.setCamera(fabricRef.current, JSON.stringify(camera));
                    } catch (error) {
                        console.error('Failed to set camera:', error);
                    }
                } else {
                    console.warn('setCamera is only supported on iOS with Fabric.');
                }
            },
            setMapBoundaries(northEast: LatLng, southWest: LatLng) {
                if (fabricRef.current) {
                    try {
                        Commands.setMapBoundaries(fabricRef.current, JSON.stringify(northEast), JSON.stringify(southWest));
                    } catch (error) {
                        console.error('Failed to set camera:', error);
                    }
                } else {
                    console.warn('setMapBoundaries is only supported on iOS with Fabric.');
                }
            },
        }));

        return <FabricMapView {...props} ref={fabricRef}/>;
    },
);


export default FabricMap;
