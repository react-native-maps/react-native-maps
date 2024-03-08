import { Descriptor, ComponentBuilderContext, ViewBaseProps, ViewRawProps, RNViewBase,
  rnComponentFactoryBuilder,
  Tag
} from 'rnoh';
import { RNOHContext } from 'rnoh'
import { AIRMapCalloutDescriptor } from './AIRMapDescriptorTypes';
import { MapsManager } from '../MapsManager';
import { LWLog } from '../LWLog';

export const AIR_MAP_CALLOUT_TYPE: string = "AIRMapCallout"



@Component
export struct AIRMapCallout {
  ctx!: RNOHContext
  tag: number = 0
  @BuilderParam buildCustomComponent: (componentBuilderContext: ComponentBuilderContext) => void
  @State descriptor: AIRMapCalloutDescriptor = {} as AIRMapCalloutDescriptor
  private unregisterDescriptorChangesListener?: () => void = undefined

  aboutToAppear() {
    LWLog('AIRMapCallout.aboutToAppear 初始化 AIRMapCallout...')
    this.descriptor = this.ctx.descriptorRegistry.getDescriptor<AIRMapCalloutDescriptor>(this.tag)
    this.unregisterDescriptorChangesListener = this.ctx.descriptorRegistry.subscribeToDescriptorChanges(this.tag,
      (newDescriptor) => {
        this.descriptor = (newDescriptor as AIRMapCalloutDescriptor)
      }
    )
    if (MapsManager.getInstance().isInitMapController()) {
      MapsManager.getInstance().addCallout(this);
    }else {
      setTimeout(()=>{
        MapsManager.getInstance().addCallout(this);
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
