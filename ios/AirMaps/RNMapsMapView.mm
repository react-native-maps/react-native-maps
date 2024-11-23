//
//  RNMapsMarker.m
//  AirMaps
//
//  Created by Salah Ghanim on 23.11.24.
//  Copyright © 2024 react-native-maps. All rights reserved.
//

#import "RNMapsMapView.h"
#import "AirMap.h"

#import <react/renderer/components/RNMapsSpecs/ComponentDescriptors.h>
#import <react/renderer/components/RNMapsSpecs/EventEmitters.h>
#import <react/renderer/components/RNMapsSpecs/Props.h>
#import <react/renderer/components/RNMapsSpecs/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"
#import <React/RCTConversions.h>

using namespace facebook::react;

@interface RNMapsMapView () <RCTComponentViewProtocol>
@end

@implementation RNMapsMapView {
    AIRMap *_view;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNMapsMapViewComponentDescriptor>();
}


- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNMapsMapViewProps>();
    _props = defaultProps;

      AIRMap *map = [AIRMap new];
      


    _view = map;

    self.contentView = _view;
  }

  return self;
}

- (id)getPaperViewFromChildComponentView:(UIView *)childComponentView {
    // Check if the childComponentView responds to the "adapter" selector
    if ([childComponentView respondsToSelector:@selector(paperView)]) {
        // Safely return the paperView
        return [childComponentView valueForKey:@"paperView"];
    }
    // Return nil if paperView is not accessible
    return nil;
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index{
    NSLog(@"childView %@", childComponentView );
    id<RCTComponent> paperView = [self getPaperViewFromChildComponentView:childComponentView];
    if (paperView){
        [_view insertReactSubview:paperView atIndex:index];
    }
}


- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &oldViewProps = *std::static_pointer_cast<RNMapsMapViewProps const>(_props);
  const auto &newViewProps = *std::static_pointer_cast<RNMapsMapViewProps const>(props);


  [super updateProps:props oldProps:oldProps];
}

@end

Class<RCTComponentViewProtocol> RNMapsMapViewCls(void)
{
  return RNMapsMapView.class;
}
