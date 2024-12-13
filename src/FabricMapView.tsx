import React, {forwardRef, useImperativeHandle, useRef} from 'react';

// Import your native commands for FabricMapView
import type {MapBoundaries} from './specs/NativeAirMapsModule';
import NativeAirMapsModule from './specs/NativeAirMapsModule';

import type {
  MapFabricNativeProps,
  Camera,
  Point,
} from './specs/NativeComponentMapView';
import FabricMapView, {Commands} from './specs/NativeComponentMapView';
import {LatLng, Region} from './sharedTypes';
import {Address, EdgePadding, SnapshotOptions} from './MapView.types';
import {findNodeHandle} from 'react-native';

export interface FabricMapHandle {
  getCamera: () => Promise<Camera>;
  setCamera: (camera: Partial<Camera>) => void;
  animateToRegion: (region: Region, duration: number) => void;
  animateCamera: (camera: Partial<Camera>, duration: number) => void;
  getMarkersFrames: (onlyVisible: boolean) => Promise<unknown>;
  fitToElements: (edgePadding: EdgePadding, animated: boolean) => void;

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

  getMapBoundaries: () => Promise<MapBoundaries>;
  takeSnapshot: (config: SnapshotOptions) => Promise<string>;
  getAddressFromCoordinates: (coordinate: LatLng) => Promise<Address>;
  getPointForCoordinate: (coordinate: LatLng) => Promise<Point>;
  getCoordinateForPoint: (point: Point) => Promise<LatLng>;
}

export const FabricMap = forwardRef<FabricMapHandle, MapFabricNativeProps>(
  (props, ref) => {
    const fabricRef = useRef<React.ElementRef<React.ComponentType>>(null);
    // Use Imperative Handle to expose commands
    useImperativeHandle(ref, () => ({
      async getMarkersFrames(onlyVisible: boolean) {
        if (fabricRef.current) {
          return NativeAirMapsModule.getMarkersFrames(
            findNodeHandle(fabricRef.current) ?? -1,
            onlyVisible,
          );
        } else {
          throw new Error(
            'getMarkersFrames is only supported on iOS with Fabric.',
          );
        }
      },
      async getCoordinateForPoint(point: Point) {
        if (fabricRef.current) {
          return NativeAirMapsModule.getCoordinateForPoint(
            findNodeHandle(fabricRef.current) ?? -1,
            point,
          );
        } else {
          throw new Error(
            'getCoordinateForPoint is only supported on iOS with Fabric.',
          );
        }
      },
      async getPointForCoordinate(coordinate: LatLng) {
        if (fabricRef.current) {
          return NativeAirMapsModule.getPointForCoordinate(
            findNodeHandle(fabricRef.current) ?? -1,
            coordinate,
          );
        } else {
          throw new Error(
            'getPointForCoordinate is only supported on iOS with Fabric.',
          );
        }
      },
      async getAddressFromCoordinates(coordinate: LatLng) {
        if (fabricRef.current) {
          return NativeAirMapsModule.getAddressFromCoordinates(
            findNodeHandle(fabricRef.current) ?? -1,
            coordinate,
          );
        } else {
          throw new Error(
            'getAddressFromCoordinates is only supported on iOS with Fabric.',
          );
        }
      },
      async takeSnapshot(config: SnapshotOptions) {
        if (fabricRef.current) {
          return NativeAirMapsModule.takeSnapshot(
            findNodeHandle(fabricRef.current) ?? -1,
            config,
          );
        } else {
          throw new Error('takeSnapshot is only supported on iOS with Fabric.');
        }
      },
      async getCamera() {
        if (fabricRef.current) {
          return NativeAirMapsModule.getCamera(
            findNodeHandle(fabricRef.current) ?? -1,
          );
        } else {
          throw new Error('getCamera is only supported on iOS with Fabric.');
        }
      },
      async getMapBoundaries() {
        if (fabricRef.current) {
          return NativeAirMapsModule.getMapBoundaries(
            findNodeHandle(fabricRef.current) ?? -1,
          );
        } else {
          throw new Error(
            'getMapBoundaries is only supported on iOS with Fabric.',
          );
        }
      },
      animateToRegion(region: Region, duration: number) {
        if (fabricRef.current) {
          try {
            Commands.animateToRegion(
              fabricRef.current,
              JSON.stringify(region),
              duration,
            );
          } catch (error) {
            throw new Error('Failed to animateToRegion');
          }
        } else {
          throw new Error(
            'animateToRegion is only supported on iOS with Fabric.',
          );
        }
      },
      fitToElements(edgePadding: EdgePadding, animated: boolean) {
        if (fabricRef.current) {
          try {
            Commands.fitToElements(
              fabricRef.current,
              JSON.stringify(edgePadding),
              animated,
            );
          } catch (error) {
            throw new Error('Failed to fitToElements');
          }
        } else {
          throw new Error(
            'fitToElements is only supported on iOS with Fabric.',
          );
        }
      },
      fitToSuppliedMarkers(
        markers: string[],
        edgePadding: EdgePadding,
        animated: boolean,
      ) {
        if (fabricRef.current) {
          try {
            Commands.fitToSuppliedMarkers(
              fabricRef.current,
              JSON.stringify(markers),
              JSON.stringify(edgePadding),
              animated,
            );
          } catch (error) {
            throw new Error('Failed to fitToSuppliedMarkers');
          }
        } else {
          throw new Error(
            'fitToSuppliedMarkers is only supported on iOS with Fabric.',
          );
        }
      },
      animateCamera(camera: Partial<Camera>, duration: number) {
        if (fabricRef.current) {
          try {
            Commands.animateCamera(
              fabricRef.current,
              JSON.stringify(camera),
              duration,
            );
          } catch (error) {
            throw new Error('Failed to animateCamera');
          }
        } else {
          throw new Error(
            'animateCamera is only supported on iOS with Fabric.',
          );
        }
      },
      fitToCoordinates(
        coordinates: LatLng[],
        edgePadding: EdgePadding,
        animated: boolean,
      ) {
        if (fabricRef.current) {
          try {
            Commands.fitToCoordinates(
              fabricRef.current,
              JSON.stringify(coordinates),
              JSON.stringify(edgePadding),
              animated,
            );
          } catch (error) {
            throw new Error('Failed to fitToCoordinates');
          }
        } else {
          throw new Error(
            'fitToCoordinates is only supported on iOS with Fabric.',
          );
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
    }));

    return <FabricMapView {...props} ref={fabricRef} />;
  },
);

export default FabricMap;
