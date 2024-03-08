import { Descriptor, ComponentBuilderContext, ViewBaseProps, ViewRawProps, rnComponentFactoryBuilder, Tag,
  RNViewManager } from 'rnoh';
import { RNOHContext, RNViewBase } from 'rnoh'
import { ImageURISource, Region, TAG } from '../sharedTypes';
import { MapsManager } from '../MapsManager';
import { mapCommon, map } from '@kit.MapKit';
import { AIRMapMarkerDescriptor } from './AIRMapDescriptorTypes';
import { LWLog } from '../LWLog';

export const AIR_MAP_MARKER_TYPE: string = "AIRMapMarker"

@Component
export struct AIRMapMarker {
  ctx!: RNOHContext
  tag: number = 0
  @BuilderParam buildCustomComponent: (componentBuilderContext: ComponentBuilderContext) => void
  @State descriptor: AIRMapMarkerDescriptor = {} as AIRMapMarkerDescriptor
  protected cleanUpCallbacks: (() => void)[] = []

  aboutToAppear() {
    LWLog('AIRMapMarker.aboutToAppear 初始化 AIRMapMarker...')
    this.descriptor = this.ctx.descriptorRegistry.getDescriptor<AIRMapMarkerDescriptor>(this.tag)
    this.cleanUpCallbacks.push(this.ctx.descriptorRegistry.subscribeToDescriptorChanges(this.tag,
      (newDescriptor) => {
        this.descriptor = (newDescriptor as AIRMapMarkerDescriptor)
       LWLog('AIRMapMarker.subscribeToDescriptorChanges=' + JSON.stringify(this.descriptor))
        MapsManager.getInstance().addMarker(this, true);
      }
    ));
    this.cleanUpCallbacks.push(this.ctx.componentCommandReceiver.registerCommandCallback(
      this.tag,
      (command, args: [ESObject, ESObject, ESObject]) => {
       LWLog('AIRMapMarker.aboutToAppear----------command=' + command, JSON.stringify(args))
        if (command === 'showCallout') {
          if (this.marker) {
            this.marker.setInfoWindowVisible(true);
          }
        } else if (command === 'hideCallout') {
          if (this.marker) {
            this.marker.setInfoWindowVisible(false);
          }
        } else if (command === 'redrawCallout') {
          //todo 华为地图不支持
        } else if (command === 'animateMarkerToCoordinate') {
          //todo 华为地图不支持
        } else if (command === 'redraw') {
          //todo 华为地图不支持
        }
      }));

    if (MapsManager.getInstance().isInitMapController()) {
      MapsManager.getInstance().addMarker(this, false);
    }else {
      setTimeout(()=>{
        MapsManager.getInstance().addMarker(this, false);
      }, 500)
    }
  }

  private marker?: map.Marker;

  public setMarker(marker: map.Marker){
    this.marker = marker;
  }

  aboutToDisappear() {
    this.cleanUpCallbacks.forEach(cb => cb())
  }

  build() {
    RNViewBase({ ctx: this.ctx, tag: this.tag }) {
      Stack(){
        ForEach(this.descriptor.childrenTags, (tag: Tag) => {
          rnComponentFactoryBuilder(this.ctx, tag, this.ctx.rnInstance.getComponentNameFromDescriptorType(this.ctx.descriptorRegistry.getDescriptor(tag)?.type))
        }, (tag: Tag) => tag.toString())
      }
    }
  }
}
