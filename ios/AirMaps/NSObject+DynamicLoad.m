//
//  NSObject+DynamicLoad.m
//  react-native-maps
//
//  Created by Salah Ghanim on 16.03.25.
//
#import <Foundation/Foundation.h>
#import <objc/runtime.h>
#import "NSObject+DynamicLoad.h"

@implementation NSObject (DynamicLoad)
+ (void)load {
    [self ensureClassExists:"RNMapsGoogleMapView"];
    [self ensureClassExists:"RNMapsGooglePolygonView"];
}

+ (void)ensureClassExists:(const char *)className {
    // Check if the class exists
    Class existingClass = objc_getClass(className);
    if (!existingClass) {
        // If the class does not exist, create a new class that is a subclass of NSObject
        Class newClass = objc_allocateClassPair([NSObject class], className, 0);
        // Register the new class with the runtime
        objc_registerClassPair(newClass);
    }
}

@end
