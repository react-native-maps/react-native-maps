import { Descriptor, ComponentBuilderContext, ViewBaseProps, ViewRawProps } from 'rnoh';
import { RNOHContext } from 'rnoh'
import { LatLng, Region, TAG } from '../sharedTypes';
import { AIRMapCircleDescriptor } from './AIRMapDescriptorTypes';
import { MapsManager } from '../MapsManager';
import { LWLog } from '../LWLog';

export const AIR_MAP_CIRCLE_TYPE: string = "AIRMapCircle"



@Component
export struct AIRMapCircle {
  ctx!: RNOHContext
  tag: number = 0
  @BuilderParam buildCustomComponent: (componentBuilderContext: ComponentBuilderContext) => void
  @State descriptor: AIRMapCircleDescriptor = {} as AIRMapCircleDescriptor
  private unregisterDescriptorChangesListener?: () => void = undefined

  aboutToAppear() {
    LWLog('AIRMapCircle.aboutToAppear 初始化 AIRMapCircle...')
    this.descriptor = this.ctx.descriptorRegistry.getDescriptor<AIRMapCircleDescriptor>(this.tag)
    this.unregisterDescriptorChangesListener = this.ctx.descriptorRegistry.subscribeToDescriptorChanges(this.tag,
      (newDescriptor) => {
        this.descriptor = (newDescriptor as AIRMapCircleDescriptor)
        MapsManager.getInstance().addCircle(this.descriptor);
      }
    )

    if (MapsManager.getInstance().isInitMapController()) {
      MapsManager.getInstance().addCircle(this.descriptor);
    }else {
      setTimeout(()=>{
        MapsManager.getInstance().addCircle(this.descriptor);
      }, 500)
    }
  }

  aboutToDisappear() {
    this.unregisterDescriptorChangesListener?.()
  }

  build() {
  }
}
