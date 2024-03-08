import { Descriptor, ComponentBuilderContext, ViewBaseProps, ViewRawProps, RNViewBase,
  rnComponentFactoryBuilder,
  Tag
} from 'rnoh';
import { RNOHContext } from 'rnoh'
import { LatLng, Region, TAG } from '../sharedTypes';
import { AIRMapUrlTileDescriptor } from './AIRMapDescriptorTypes';
import { MapsManager } from '../MapsManager';
import { LWLog } from '../LWLog';

export const AIR_URLTILE_TYPE: string = "AIRMapUrlTile"

@Component
export struct AIRMapUrlTile {
  ctx!: RNOHContext
  tag: number = 0
  @BuilderParam buildCustomComponent: (componentBuilderContext: ComponentBuilderContext) => void
  @State descriptor: AIRMapUrlTileDescriptor = {} as AIRMapUrlTileDescriptor
  private unregisterDescriptorChangesListener?: () => void = undefined

  aboutToAppear() {
    LWLog('AIRMapUrlTile.aboutToAppear 初始化 AIRMapUrlTile...')
    this.descriptor = this.ctx.descriptorRegistry.getDescriptor<AIRMapUrlTileDescriptor>(this.tag)
    this.unregisterDescriptorChangesListener = this.ctx.descriptorRegistry.subscribeToDescriptorChanges(this.tag,
      (newDescriptor) => {
        this.descriptor = (newDescriptor as AIRMapUrlTileDescriptor)
      }
    )

    if (MapsManager.getInstance().isInitMapController()) {
      MapsManager.getInstance().addURLTile(this.descriptor);
    }else {
      setTimeout(()=>{
        MapsManager.getInstance().addURLTile(this.descriptor);
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
