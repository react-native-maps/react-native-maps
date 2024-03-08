import { Descriptor, ComponentBuilderContext, ViewBaseProps, ViewRawProps, RNViewBase,
  rnComponentFactoryBuilder,
  Tag
} from 'rnoh';
import { RNOHContext } from 'rnoh'
import { LatLng, Region, TAG } from '../sharedTypes';
import { AIRMapOverlayDescriptor } from './AIRMapDescriptorTypes';
import { MapsManager } from '../MapsManager';
import { LWLog } from '../LWLog';

export const AIR_OVERLAY_TYPE: string = "AIRMapOverlay"

@Component
export struct AIRMapOverlay {
  ctx!: RNOHContext
  tag: number = 0
  @BuilderParam buildCustomComponent: (componentBuilderContext: ComponentBuilderContext) => void
  @State descriptor: AIRMapOverlayDescriptor = {} as AIRMapOverlayDescriptor
  private unregisterDescriptorChangesListener?: () => void = undefined

  aboutToAppear() {
    LWLog('AIRMapOverlay.aboutToAppear 初始化 AIRMapOverlay...')
    this.descriptor = this.ctx.descriptorRegistry.getDescriptor<AIRMapOverlayDescriptor>(this.tag)
    this.unregisterDescriptorChangesListener = this.ctx.descriptorRegistry.subscribeToDescriptorChanges(this.tag,
      (newDescriptor) => {
        this.descriptor = (newDescriptor as AIRMapOverlayDescriptor)
      }
    )

    if (MapsManager.getInstance().isInitMapController()) {
      MapsManager.getInstance().addOverlay(this.descriptor);
    }else {
      setTimeout(()=>{
        MapsManager.getInstance().addOverlay(this.descriptor);
      }, 500)
    }
  }

  aboutToDisappear() {
    this.unregisterDescriptorChangesListener?.()
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
