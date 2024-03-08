import { TurboModule, RNOHError } from 'rnoh/ts';
import { MapsTurboManager } from '../MapsTurboManager';
import { Camera, EdgePadding, LatLng, Point, Region, TAG } from '../sharedTypes';

export class AIRMapManager extends TurboModule {

  /**
   * Like animateCamera, but sets the new view instantly, without an animation.
   *
   * @param camera
   */
  public setCamera(camera: Camera){
    MapsTurboManager.getInstance().setCamera(camera);
  }

  /**
   * Returns a Promise<Camera> structure indicating the current camera configuration.
   *
   * @returns
   */
  public getCamera(){
    let camera = MapsTurboManager.getInstance().getCamera();
    return camera;
  }

  //github api 上未标出
  public takeSnapshot(config: ESObject, callback: Function){
    // @return Promise Promise with either the file-uri or base64 encoded string;
    console.log(TAG, 'AIRMapManager.takeSnapshot------>config=' + JSON.stringify(config) + ' callback=' + callback)
  }

  /**
   * Get visible boudaries
   *
   * @return Promise Promise with the bounding box ({ northEast: <LatLng>, southWest: <LatLng> })
   */
  public getMapBoundaries(){
    //todo 暂无对应api实现
  }

  /**
   * Convert a coordinate to address by using default Geocoder
   *
   * @param coordinate Coordinate
   * @param [coordinate.latitude] Latitude
   * @param [coordinate.longitude] Longitude
   *
   * @return Promise with return type Address
   */
  public getAddressFromCoordinates(coordinate: LatLng){
    return MapsTurboManager.getInstance().getAddressFromCoordinates(coordinate);
  }

  /**
   * Convert a map coordinate to user-space point
   *
   * @param coordinate Coordinate
   * @param [coordinate.latitude] Latitude
   * @param [coordinate.longitude] Longitude
   *
   * @return Promise Promise with the point ({ x: Number, y: Number })
   */
  public pointForCoordinate(coordinate: LatLng){
    //todo 暂无对应api实现
  }

  /**
   * Convert a user-space point to a map coordinate
   *
   * @param point Point
   * @param [point.x] X
   * @param [point.x] Y
   *
   * @return Promise Promise with the coordinate ({ latitude: Number, longitude: Number })
   */
  public coordinateForPoint(point: Point){
    //todo 暂无对应api实现
  }

  /**
   * Get markers' centers and frames in user-space coordinates
   *
   * @param onlyVisible boolean true to include only visible markers, false to include all
   *
   * @return Promise Promise with { <identifier>: { point: Point, frame: Frame } }
   */
  public getMarkersFrames(onlyVisible: Boolean){
    //todo 暂无对应api实现
  }

  public animateToRegion(region: Region, duration: number) {
    MapsTurboManager.getInstance().animateToRegion(region, duration);
  }

  /**
   * Animate the camera to a new view. You can pass a partial camera object here; any property not given will remain unmodified.
   *
   * @param camera
   * @param duration
   */
  public animateCamera(camera: Camera, duration: number) {
    MapsTurboManager.getInstance().animateCamera(camera, duration);
  }

  /**
   * Note edgePadding is Google Maps only
   *
   * @param edgePadding
   * @param animated
   */
  public fitToElements(edgePadding: EdgePadding, animated: boolean) {
    //todo 暂无对应api实现
  }

  /**
   * If you need to use this in ComponentDidMount, make sure you put it in a timeout or it will cause performance problems. Note edgePadding is Google Maps only
   *
   * @param markers
   * @param edgePadding
   * @param animated
   */
  public fitToSuppliedMarkers(markers: string[], edgePadding: EdgePadding, animated: boolean) {
    //todo 暂无对应api实现
  }

  /**
   * If called in ComponentDidMount in android, it will cause an exception. It is recommended to call it from the MapView onLayout event.
   *
   * @param coordinates
   * @param edgePadding
   * @param animated
   */
  public fitToCoordinates(coordinates: LatLng[], edgePadding: EdgePadding, animated: boolean) {
    MapsTurboManager.getInstance().fitToCoordinates(coordinates, edgePadding, animated);
  }

  /**
   * 	The boundary is defined by the map's center coordinates, not the device's viewport itself. Note: Google Maps only.
   *
   * @param northEast
   * @param southWest
   */
  public setMapBoundaries(northEast: LatLng, southWest: LatLng) {
    MapsTurboManager.getInstance().setMapBoundaries(northEast, southWest)
  }

  public setIndoorActiveLevelIndex(activeLevelIndex: number) {
    //todo 暂无对应api实现
  }
}
