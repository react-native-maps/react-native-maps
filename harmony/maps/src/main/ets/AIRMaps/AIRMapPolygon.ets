import { Descriptor, ComponentBuilderContext, ViewBaseProps, ViewRawProps } from 'rnoh';
import { RNOHContext } from 'rnoh'
import { LatLng, Region, TAG } from '../sharedTypes';
import { AIRMapPolygonDescriptor } from './AIRMapDescriptorTypes';
import { MapsManager } from '../MapsManager';
import { LWLog } from '../LWLog';

export const AIR_MAP_POLYGON_TYPE: string = "AIRMapPolygon"

@Component
export struct AIRMapPolygon {
  ctx!: RNOHContext
  tag: number = 0
  @BuilderParam buildCustomComponent: (componentBuilderContext: ComponentBuilderContext) => void
  @State descriptor: AIRMapPolygonDescriptor = {} as AIRMapPolygonDescriptor
  private unregisterDescriptorChangesListener?: () => void = undefined

  aboutToAppear() {
    LWLog('AIRMapPolygon.aboutToAppear 初始化 AIRMapPolygon...')
    this.descriptor = this.ctx.descriptorRegistry.getDescriptor<AIRMapPolygonDescriptor>(this.tag)
    this.unregisterDescriptorChangesListener = this.ctx.descriptorRegistry.subscribeToDescriptorChanges(this.tag,
      (newDescriptor) => {
        this.descriptor = (newDescriptor as AIRMapPolygonDescriptor)
        MapsManager.getInstance().addPolygon(this.descriptor);
      }
    )

    if (MapsManager.getInstance().isInitMapController()) {
      MapsManager.getInstance().addPolygon(this.descriptor);
    }else {
      setTimeout(()=>{
        MapsManager.getInstance().addPolygon(this.descriptor);
      }, 500)
    }
  }

  aboutToDisappear() {
    this.unregisterDescriptorChangesListener?.()
  }

  build() {
  }
}
