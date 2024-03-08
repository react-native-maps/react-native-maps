import { Descriptor, ComponentBuilderContext, ViewBaseProps, ViewRawProps, RNViewBase,
  rnComponentFactoryBuilder,
  Tag
} from 'rnoh';
import { RNOHContext } from 'rnoh'
import { LatLng, Region, TAG } from '../sharedTypes';
import { GeojsonDescriptor } from './AIRMapDescriptorTypes';
import { MapsManager } from '../MapsManager';
import { LWLog } from '../LWLog';

export const AIR_GEOJSON_TYPE: string = "Geojson"

@Component
export struct Geojson {
  ctx!: RNOHContext
  tag: number = 0
  @BuilderParam buildCustomComponent: (componentBuilderContext: ComponentBuilderContext) => void
  @State descriptor: GeojsonDescriptor = {} as GeojsonDescriptor
  private unregisterDescriptorChangesListener?: () => void = undefined

  aboutToAppear() {
    LWLog('Geojson.aboutToAppear 初始化 Geojson...')
    this.descriptor = this.ctx.descriptorRegistry.getDescriptor<GeojsonDescriptor>(this.tag)
    this.unregisterDescriptorChangesListener = this.ctx.descriptorRegistry.subscribeToDescriptorChanges(this.tag,
      (newDescriptor) => {
        this.descriptor = (newDescriptor as GeojsonDescriptor)
      }
    )

    if (MapsManager.getInstance().isInitMapController()) {
      MapsManager.getInstance().addGeojson(this.descriptor);
    }else {
      setTimeout(()=>{
        MapsManager.getInstance().addGeojson(this.descriptor);
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
