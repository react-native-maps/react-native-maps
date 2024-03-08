// import { Descriptor, ComponentBuilderContext, ViewBaseProps, Tag } from 'rnoh';
// import { RNComponentFactory, RNOHContext, RNViewBase } from 'rnoh'
//
// export const AIR_GOOGLE_MAP_TYPE: string = "AIRGoogleMap"
//
// export interface AIRGoogleMapProps extends ViewBaseProps {
//   text: string
// }
//
// export type AIRGoogleMapDescriptor = Descriptor<"AIRGoogleMap", AIRGoogleMapProps>
//
//
// @Component
// export struct AIRGoogleMap {
//   ctx!: RNOHContext
//   tag: number = 0
//   @BuilderParam buildCustomComponent: (componentBuilderContext: ComponentBuilderContext) => void
//   @State descriptor: AIRGoogleMapDescriptor = {} as AIRGoogleMapDescriptor
//   private unregisterDescriptorChangesListener?: () => void = undefined
//
//   aboutToAppear() {
//     this.descriptor = this.ctx.descriptorRegistry.getDescriptor<AIRGoogleMapDescriptor>(this.tag)
//     this.unregisterDescriptorChangesListener = this.ctx.descriptorRegistry.subscribeToDescriptorChanges(this.tag,
//       (newDescriptor) => {
//         this.descriptor = (newDescriptor as AIRGoogleMapDescriptor)
//       }
//     )
//   }
//
//   aboutToDisappear() {
//     this.unregisterDescriptorChangesListener?.()
//   }
//
//   build() {
//     RNViewBase({ ctx: this.ctx, tag: this.tag }) {
//       Text(this.descriptor.props.text)
//         .fontColor("red")
//         .fontSize(12)
//         .textAlign(TextAlign.Center)
//         .width("100%")
//         .height("100%")
//     }
//   }
// }
