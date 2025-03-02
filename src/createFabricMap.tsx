import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {findNodeHandle} from 'react-native';
import type {LatLng, Point, Region} from './sharedTypes';
import type {
  Address,
  Camera,
  EdgePadding,
  SnapshotOptions,
} from './MapView.types';
import NativeAirMapsModule, {MapBoundaries} from './specs/NativeAirMapsModule';
import {MapFabricNativeProps} from './specs/NativeComponentMapView';

export type FabricMapViewProps = MapFabricNativeProps;

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
  setIndoorActiveLevelIndex: (activeLevelIndex: number) => void;
}

const createFabricMap = (ViewComponent: React.ComponentType, Commands: any) => {
  return forwardRef<FabricMapHandle, FabricMapViewProps>((props, ref) => {
    const fabricRef = useRef<React.ElementRef<typeof ViewComponent>>(null);

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
            'getPointForCoordinate is not supported on this platform.',
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
            'getAddressFromCoordinates is not supported on this platform',
          );
        }
      },
      async takeSnapshot(config: SnapshotOptions) {
        if (fabricRef.current) {
          return NativeAirMapsModule.takeSnapshot(
            findNodeHandle(fabricRef.current) ?? -1,
            JSON.stringify(config),
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
      setIndoorActiveLevelIndex(activeLevelIndex: number) {
        if (fabricRef.current) {
          try {
            Commands.setIndoorActiveLevelIndex(
              fabricRef.current,
              activeLevelIndex,
            );
          } catch (error) {
            console.error('Failed to set camera:', error);
          }
        } else {
          console.warn('setIndoorActiveLevelIndex is not supported.');
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
          console.warn('setCamera is not supported');
        }
      },
    }));

    // @ts-ignore
    return <ViewComponent {...props} ref={fabricRef} />;
  });
};

export default createFabricMap;
