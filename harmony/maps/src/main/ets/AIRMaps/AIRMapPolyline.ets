import { Descriptor, ComponentBuilderContext, ViewBaseProps, ViewRawProps } from 'rnoh';
import { RNOHContext } from 'rnoh'
import { LatLng, Region, TAG } from '../sharedTypes';
import { AIRMapPolylineDescriptor } from './AIRMapDescriptorTypes';
import { MapsManager } from '../MapsManager';
import { LWLog } from '../LWLog';

export const AIR_MAP_POLYLINE_TYPE: string = "AIRMapPolyline"

@Component
export struct AIRMapPolyline {
  ctx!: RNOHContext
  tag: number = 0
  @BuilderParam buildCustomComponent: (componentBuilderContext: ComponentBuilderContext) => void
  @State descriptor: AIRMapPolylineDescriptor = {} as AIRMapPolylineDescriptor
  private unregisterDescriptorChangesListener?: () => void = undefined

  aboutToAppear() {
    LWLog('AIRMapPolyline.aboutToAppear 初始化 AIRMapPolyline...')
    this.descriptor = this.ctx.descriptorRegistry.getDescriptor<AIRMapPolylineDescriptor>(this.tag)
    this.unregisterDescriptorChangesListener = this.ctx.descriptorRegistry.subscribeToDescriptorChanges(this.tag,
      (newDescriptor) => {
        this.descriptor = (newDescriptor as AIRMapPolylineDescriptor)
        MapsManager.getInstance().addPolyline(this.descriptor);
      }
    )

    if (MapsManager.getInstance().isInitMapController()) {
      MapsManager.getInstance().addPolyline(this.descriptor);
    }else {
      setTimeout(()=>{
        MapsManager.getInstance().addPolyline(this.descriptor);
      }, 500)
    }
  }

  aboutToDisappear() {
    this.unregisterDescriptorChangesListener?.()
  }

  build() {
  }
}
