import { Descriptor, ComponentBuilderContext, ViewBaseProps, ViewRawProps, RNViewBase,
  rnComponentFactoryBuilder,
  Tag
} from 'rnoh';
import { RNOHContext } from 'rnoh'
import { LatLng, Region, TAG } from '../sharedTypes';
import { AIRMapWMSTileDescriptor } from './AIRMapDescriptorTypes';
import { MapsManager } from '../MapsManager';
import { LWLog } from '../LWLog';

export const AIR_WMSTILE_TYPE: string = "AIRMapWMSTile"

@Component
export struct AIRMapWMSTile {
  ctx!: RNOHContext
  tag: number = 0
  @BuilderParam buildCustomComponent: (componentBuilderContext: ComponentBuilderContext) => void
  @State descriptor: AIRMapWMSTileDescriptor = {} as AIRMapWMSTileDescriptor
  private unregisterDescriptorChangesListener?: () => void = undefined

  aboutToAppear() {
    LWLog('AIRMapWMSTile.aboutToAppear 初始化 AIRMapWMSTile...')
    this.descriptor = this.ctx.descriptorRegistry.getDescriptor<AIRMapWMSTileDescriptor>(this.tag)
    this.unregisterDescriptorChangesListener = this.ctx.descriptorRegistry.subscribeToDescriptorChanges(this.tag,
      (newDescriptor) => {
        this.descriptor = (newDescriptor as AIRMapWMSTileDescriptor)
      }
    )

    if (MapsManager.getInstance().isInitMapController()) {
      MapsManager.getInstance().addWMSTile(this.descriptor);
    }else {
      setTimeout(()=>{
        MapsManager.getInstance().addWMSTile(this.descriptor);
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
