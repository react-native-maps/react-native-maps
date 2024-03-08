import { Descriptor, ComponentBuilderContext, ViewBaseProps, ViewRawProps, RNViewBase, Tag,
  rnComponentFactoryBuilder } from 'rnoh';
import { RNOHContext } from 'rnoh'
import { LatLng, Region, TAG } from '../sharedTypes';
import { MapsManager } from '../MapsManager';
import { AIRMapCalloutSubviewDescriptor } from './AIRMapDescriptorTypes';
import { LWLog } from '../LWLog';

export const AIR_MAP_CALLOUT_SUBVIEW_TYPE: string = "AIRMapCalloutSubview"

//todo 不支持自定义view显示
@Component
export struct AIRMapCalloutSubview {
  ctx!: RNOHContext
  tag: number = 0
  @BuilderParam buildCustomComponent: (componentBuilderContext: ComponentBuilderContext) => void
  @State descriptor: AIRMapCalloutSubviewDescriptor = {} as AIRMapCalloutSubviewDescriptor
  private unregisterDescriptorChangesListener?: () => void = undefined

  aboutToAppear() {
    LWLog('AIRMapCalloutSubview.aboutToAppear 初始化 AIRMapCalloutSubview...')
    this.descriptor = this.ctx.descriptorRegistry.getDescriptor<AIRMapCalloutSubviewDescriptor>(this.tag)
    this.unregisterDescriptorChangesListener = this.ctx.descriptorRegistry.subscribeToDescriptorChanges(this.tag,
      (newDescriptor) => {
        this.descriptor = (newDescriptor as AIRMapCalloutSubviewDescriptor)
      }
    )

    setTimeout(()=>{
      MapsManager.getInstance().addCalloutSubview(this.descriptor);
    }, 500)
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
