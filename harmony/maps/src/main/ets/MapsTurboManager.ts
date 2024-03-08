import { map, mapCommon, site } from '@kit.MapKit';
import {  AIRMapMarkerDescriptor,
  AIRMapPolylineDescriptor,
  AIRMapPolygonDescriptor,
  AIRMapCircleDescriptor,
  AIRMapCalloutDescriptor,
  AIRMapCalloutSubviewDescriptor,
  GeojsonDescriptor,
  AIRMapWMSTileDescriptor,
  AIRMapUrlTileDescriptor,
  AIRMapOverlayDescriptor
} from './AIRMaps/AIRMapDescriptorTypes';
import {
  Address,
  Camera, ColorMap, DEFAULT_ZOOM, EdgePadding, ImageURISource, LatLng, Region, TAG } from './sharedTypes';

export class MapsTurboManager{
  private constructor() {
  }

  private static instance: MapsTurboManager;

  public static getInstance(): MapsTurboManager {
    if (!MapsTurboManager.instance) {
      MapsTurboManager.instance = new MapsTurboManager();
    }
    return MapsTurboManager.instance;
  }
  
  private mapController: map.MapComponentController = new map.MapComponentController();
  
  initMapComponentController(controller: map.MapComponentController){
    console.info(TAG, 'MapsTurboManager.initMapComponentController----->controller=' + controller)
    this.mapController = controller;
  }

  getMapController(){
    return this.mapController;
  }

  getCameraZoom(zoom?: number){
    if (zoom) {
      return zoom;
    }
    return DEFAULT_ZOOM;
  }

  public getCamera(){
    let cameraPosition = this.mapController.getCameraPosition();
    return {
      center: { latitude: cameraPosition.target.latitude, longitude: cameraPosition.target.longitude },
      zoom: cameraPosition.zoom,
      tilt: cameraPosition.tilt,
      bearing: cameraPosition.bearing,
      //rn地图中 heading 就是 bearing，RN侧获取camera时，反向填充进去返回
      heading: cameraPosition.bearing,
      //华为地图没提供这两个参数
      altitude: 0,
      pitch: 0,
    } as Camera;
  }

  public setCamera(camera: ESObject) {
    let cameraData = this.mapController?.getCameraPosition();
    let lat = cameraData?.target.latitude;
    if (camera.center && camera.center.latitude && camera.center.latitude !== 0) {
      lat = camera.center.latitude;
    }
    let lng = cameraData?.target.longitude;
    if (camera.center && camera.center.longitude && camera.center.longitude !== 0) {
      lng = camera.center.longitude;
    }
    let _zoom = cameraData?.zoom;
    if (camera.zoom && camera.zoom !== 0) {
      _zoom = camera.zoom;
    }
    let _bearing = cameraData?.bearing;
    if (camera.heading) {
      _bearing = camera.heading;
    }
    let mapCamera = {
      target: { latitude: lat, longitude: lng },
      zoom: _zoom,
      tilt: 0,
      bearing: _bearing,
    } as mapCommon.CameraPosition;
    let cameraUpdate = map.newCameraPosition(mapCamera);
    this.mapController?.moveCamera(cameraUpdate)
  }

  public animateCamera(camera: Camera, duration: number) {
    if (!camera.zoom) {
      camera.zoom = DEFAULT_ZOOM;
    }
    let cameraPosition: mapCommon.CameraPosition = {
      target: {
        latitude: camera.center.latitude,
        longitude: camera.center.longitude
      },
      zoom: this.getCameraZoom(camera.zoom),
      tilt: 0,
      bearing: camera.heading
    };
    let cameraUpdate = map.newCameraPosition(cameraPosition);
    // 以动画方式移动地图相机
    if (!cameraUpdate) {
      return;
    }
    this.mapController?.animateCamera(cameraUpdate, duration);
  }

  public animateToRegion(region: Region, duration: number) {
    let mapCamera = {
      target: { latitude: region.latitude, longitude: region.longitude },
      zoom: this.getCameraZoom(undefined),
      tilt: 0,
      bearing: 0,
    } as mapCommon.CameraPosition;
    let cameraUpdate = map.newCameraPosition(mapCamera);
    this.mapController?.animateCamera(cameraUpdate, duration);
  }

  public fitToElements(edgePadding: EdgePadding, animated: boolean) {
    //todo 对照华为地图api进行实现
  }

  public fitToSuppliedMarkers(markers: string[], edgePadding: EdgePadding, animated: boolean) {
    //todo 对照华为地图api进行实现
  }

  public fitToCoordinates(coordinates: LatLng[], edgePadding: EdgePadding, animated: boolean) {
    if (coordinates && coordinates.length > 1) {
      let bounds: mapCommon.LatLngBounds;
      if (coordinates.length == 1) {
        bounds = {
          northeast: coordinates[0],
          southwest: coordinates[1]
        };
      }else {
        bounds = {
          northeast: coordinates[0],
          southwest: coordinates[coordinates.length-1]
        };
      }
      let cameraUpdate = map.newLatLngBounds(bounds, edgePadding.top);
      if (animated) {
        this.mapController?.animateCamera(cameraUpdate);
      }else {
        this.mapController?.moveCamera(cameraUpdate);
      }
    }
  }

  public setMapBoundaries(northEast: LatLng, southWest: LatLng) {
    this.mapController?.setLatLngBounds({northeast: northEast, southwest: southWest})
  }

  public getAddressFromCoordinates(coordinate: LatLng): Promise<Address> {
    return new Promise((resolve, reject) => {
      let params: site.ReverseGeocodeParams = {
        location: {
          longitude: 10.252502,
          latitude: 43.8739168
          // longitude: coordinate.longitude,
          // latitude: coordinate.latitude
        },
        language: "zh",
        radius: 10
      };
      try {
        site.reverseGeocode(params).then((reverseGeocodeResult)=>{
          console.info(TAG, "MapsTurboManager.getAddressFromCoordinates success=" + JSON.stringify(reverseGeocodeResult));
          let address = {
            name: '',
            thoroughfare: '',
            subThoroughfare: '',
            locality: '',
            subLocality: '',
            administrativeArea: '',
            subAdministrativeArea: '',
            postalCode: '',
            countryCode: reverseGeocodeResult.addressComponent.countryCode,
            country: reverseGeocodeResult.addressComponent.countryName,
          }  as Address
          resolve(address)
        });
      } catch (err) {
        console.error(TAG, "MapsTurboManager.getAddressFromCoordinates err=" + JSON.stringify(err));
        reject(err)
      }
    });
  }

  public setIndoorActiveLevelIndex(activeLevelIndex: number) {
    //todo 暂无对应api实现
  }

  //marker
  public showCallout(){

  }

  public hideCallout(){

  }
}