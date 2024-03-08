import { map, mapCommon } from '@kit.MapKit';
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
import { Camera, ColorMap, DEFAULT_ZOOM, EdgePadding, ImageURISource, LatLng, Region, TAG } from './sharedTypes';

export class MapsManager{
  private constructor() {
  }

  private static instance: MapsManager;

  public static getInstance(): MapsManager {
    if (!MapsManager.instance) {
      MapsManager.instance = new MapsManager();
    }
    return MapsManager.instance;
  }
  
  private mapController: map.MapComponentController = new map.MapComponentController();
  
  async initMapComponentController(controller: map.MapComponentController){
    console.info(TAG, 'MapsManager.initMapComponentController----->controller=' + controller)
    this.mapController = controller;
  }

  addMarker(desc: AIRMapMarkerDescriptor, clear: boolean, markerEventCallback: Function){
    console.info(TAG, 'MapsManager.addMarker----->rawProps=【' + JSON.stringify(desc.rawProps) + '】')
    if (!this.mapController) {
      console.error(TAG, 'addMarker error, mapController is undefined!')
      return;
    }
    if (clear) {
      //map api中没有清除marker，只能用clear
      this.mapController.clear();
    }
    let markerOptions: mapCommon.MarkerOptions = {
      position: {
        latitude: desc.rawProps.coordinate.latitude,
        longitude: desc.rawProps.coordinate.longitude
      },
      title: desc.rawProps.title,
      rotation: desc.rawProps.rotation,
      visible: true,
      zIndex: desc.rawProps.zIndex,
      alpha: 1,
      anchorU: 0.5,
      anchorV: 1,
      clickable: true,
      draggable: desc.rawProps.draggable,
      flat: desc.rawProps.flat,
      icon: this.imageSourceConvert(desc.rawProps.image),
    };
    this.mapController.addMarker(markerOptions).then(marker => {
      console.info(TAG, 'MapsManager.addMarker----------marker=' + marker.getId())
      this.mapController.on("markerClick", (marker)=>{
        markerEventCallback('markerClick', marker);
      })
      this.mapController.on("markerDragStart", (marker)=>{
        markerEventCallback('markerDragStart', marker);
      })
      this.mapController.on("markerDrag", (marker)=>{
        markerEventCallback('markerDrag', marker);
      })
      this.mapController.on("markerDragEnd", (marker)=>{
        markerEventCallback('markerDragEnd', marker);
      })
    });
  }

  addPolyline(desc: AIRMapPolylineDescriptor){
    console.info(TAG, 'MapsManager.addPolyline----------rawProps=【' + JSON.stringify(desc.rawProps) + '】')
    let polylineOption: mapCommon.MapPolylineOptions = {
      points: desc.rawProps.coordinates,
      clickable: true,
      startCap: mapCommon.CapStyle.BUTT,
      endCap: mapCommon.CapStyle.BUTT,
      geodesic: desc.rawProps.geodesic,
      jointType: mapCommon.JointType.BEVEL,
      visible: true,
      width: desc.rawProps.strokeWidth,
      zIndex: 10,
      gradient: false,
      color: this.colorCovertHex(desc.rawProps.strokeColor),
      patterns: this.lineDashPatternConvert(desc.rawProps.lineDashPattern)
    }
    // 创建polyline
    this.mapController.addPolyline(polylineOption).then(mapPolygon=>{
      console.info(TAG, 'MapsManager.addPolyline----------polyline=' + mapPolygon)
    });

  }

  addPolygon(desc: AIRMapPolygonDescriptor){
    console.info(TAG, 'MapsManager.addPolygon----------rawProps=【' + JSON.stringify(desc.rawProps) + '】')
    let polygonOptions: mapCommon.MapPolygonOptions = {
      points: desc.rawProps.coordinates,
      clickable: true,
      fillColor: this.colorCovertHex(desc.rawProps.fillColor),
      geodesic: desc.rawProps.geodesic,
      strokeColor: this.colorCovertHex(desc.rawProps.strokeColor),
      jointType: mapCommon.JointType.DEFAULT,
      patterns: this.lineDashPatternConvert(desc.rawProps.lineDashPattern),
      strokeWidth: desc.rawProps.strokeWidth,
      visible: true,
      zIndex: desc.rawProps.zIndex,
      holes: desc.rawProps.holes,
    }
    // 创建多边形
    this.mapController.addPolygon(polygonOptions).then(mapPolygon=>{
      console.info(TAG, 'MapsManager.addPolygon----------polygon=' + mapPolygon)
    });

  }

  addCircle(desc: AIRMapCircleDescriptor){
    console.info(TAG, 'MapsManager.addCircle----------rawProps=【' + JSON.stringify(desc.rawProps) + '】')
    let mapCircleOptions: mapCommon.MapCircleOptions = {
      center: {
        latitude: desc.rawProps.center.latitude,
        longitude: desc.rawProps.center.longitude
      },
      radius: desc.rawProps.radius,
      clickable: true,
      fillColor: this.colorCovertHex(desc.rawProps.fillColor),
      strokeColor: this.colorCovertHex(desc.rawProps.strokeColor),
      strokeWidth: desc.rawProps.strokeWidth,
      visible: true,
      zIndex: desc.rawProps.zIndex,

      patterns: this.lineDashPatternConvert(desc.rawProps.lineDashPattern)
    }
    // 创建Circle
    this.mapController.addCircle(mapCircleOptions).then(mapCircle=>{
      console.info(TAG, 'MapsManager.addCircle----------circle=' + mapCircle)
    });
  }

  addCallout(desc: AIRMapCalloutDescriptor){
    console.info(TAG, 'MapsManager.addCallout----marker不自带callout显示，自定义ui实现？------rawProps=【' + JSON.stringify(desc.rawProps) + '】')
    let pointAnnotationOptions: mapCommon.PointAnnotationParams = {
      // 定义点注释图标锚点
      position: {
        latitude: 39.91,
        longitude: 116.41
      },
      // 定义点注释名称与地图poi名称相同时，是否支持去重
      repeatable: true,
      // 定义点注释的碰撞规则
      collisionRule: mapCommon.CollisionRule.NAME,
      // 定义点注释的标题，数组长度最小为1，最大为3
      titles: [{
        // 定义标题内容
        content: "Callout用PointAnnotation实现",
        // 定义标题字体颜色
        color: 0xFF000000,
        // 定义标题字体大小
        fontSize: 15,
        // 定义标题描边颜色
        strokeColor: 0xFFFFFFFF,
        // 定义标题描边宽度
        strokeWidth: 2,
        // 定义标题字体样式
        fontStyle: mapCommon.FontStyle.ITALIC
      }
      ],
      // 定义点注释的图标，图标存放在resources/rawfile
      icon: "",
      // 定义点注释是否展示图标
      showIcon: true,
      // 定义点注释的锚点在水平方向上的位置
      anchorU: 0.5,
      // 定义点注释的锚点在垂直方向上的位置
      anchorV: 1,
      // 定义点注释的显示属性，为true时，在被碰撞后仍能显示
      forceVisible: false,
      // 定义碰撞优先级，数值越大，优先级越低
      priority: 3,
      // 定义点注释展示的最小层级
      minZoom: 2,
      // 定义点注释展示的最大层级
      maxZoom: 22,
      // 定义点注释是否可见
      visible: true,
      // 定义点注释叠加层级属性
      zIndex: 10
    }
    this.mapController.addPointAnnotation(pointAnnotationOptions).then(pointAnnotation=>{
      console.info(TAG, 'MapsManager.addCallout----------pointAnnotation=' + pointAnnotation)
      this.mapController.on('pointAnnotationClick', (pointAnnotation)=>{
        console.info(TAG, 'MapsManager.pointAnnotationClick----------pointAnnotation=' + JSON.stringify(pointAnnotation));
      })
    });
  }

  addCalloutSubview(desc: AIRMapCalloutSubviewDescriptor){
    console.info(TAG, 'MapsManager.addCalloutSubview----------rawProps=【' + JSON.stringify(desc.rawProps) + '】')
  }

  addGeojson(desc: GeojsonDescriptor){
    console.info(TAG, 'MapsManager.addGeojson----------rawProps=【' + JSON.stringify(desc.rawProps) + '】')
  }

  addURLTile(desc: AIRMapUrlTileDescriptor){
    console.info(TAG, 'MapsManager.addURLTile----------rawProps=【' + JSON.stringify(desc.rawProps) + '】')
  }

  addWMSTile(desc: AIRMapWMSTileDescriptor){
    console.info(TAG, 'MapsManager.addWMSTile----------rawProps=【' + JSON.stringify(desc.rawProps) + '】')
  }

  addOverlay(desc: AIRMapOverlayDescriptor){
    console.info(TAG, 'MapsManager.addOverlay----------rawProps=【' + JSON.stringify(desc.rawProps) + '】')
  }

  colorCovertHex(color: string){
    let colorResult: number = 0XFF000000;
    if (color) {
      color = color.toLowerCase().trim();
      if (color.startsWith('rgba') || color.startsWith('rgb')) {
        //rgba(0, 255, 255, 0.5)  rgb(255, 255, 255)
        let strHex: ESObject = "0x";
        let colorArr = color.replace(/(?:\(|\)|rgba|RGBA|rgb|RGB)*/g, "").split(",");
        let hex = '';
        //补全透明度
        if (colorArr.length == 3) {
          colorArr.push('1');
        }
        console.log(TAG, '颜色转换值 rgb colorArr=', colorArr);
        // 转成16进制
        for (let i = 0; i < colorArr.length; i++) {
          if (i === colorArr.length - 1) {
            hex = Math.round(Number(colorArr[i])*255).toString(16);
          }else {
            hex = Number(colorArr[i]).toString(16);
            if (hex === "0") {
              hex += hex;
            }
          }
          strHex += hex;
        }
        console.log(TAG, '颜色转换值 rgb strHex=', strHex);
        colorResult = strHex as number;
      }else if (color.startsWith('#')){
        if (color.length === 4) {
          color = color.slice(1);
          let fullColor = '#ff';
          for (let i = 0; i < color.length; i++) {
            fullColor += `${color[i]}${color[i]}`; // 重复每个字符两次得到完整的颜色值
          }
          color = fullColor;
        }
        if (color.length === 7) {
          color = '#ff' + color.substring(1);
        }
        colorResult = parseInt(color.slice(1), 16);
      }else {
        let colorKey = color.toLowerCase();
        if (ColorMap.getInstance().colorMap.has(colorKey)) {
          colorResult = parseInt(ColorMap.getInstance().colorMap.get(colorKey)!!.slice(1), 16);
        }else {
          console.warn('unsupport color');
        }
      }
    }
    return colorResult;
  }

  lineDashPatternConvert(target: number[]){
    if (target && target.length > 0) {
      let result = new Array<mapCommon.PatternItem>();
      target.forEach(element => {
        result.push({type: mapCommon.PatternItemType.DASH, length: element})
      });
      return result;
    }
    return [];
  }

  imageSourceConvert(target: string){
    //asset://examples_maps_assets_flagblue.png 对应到鸿蒙侧规则：所在文件夹名字下划线分割_替换-的图片名
    if (target && target.startsWith("asset://")) {
      return target.replace("asset://", "assets/");
    }
    return undefined;
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
    };
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

  public setIndoorActiveLevelIndex(activeLevelIndex: number) {
    //todo 暂无对应api实现
  }
}