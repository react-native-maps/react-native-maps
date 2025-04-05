#import <UIKit/UIKit.h>
#if __has_include(<React-RCTAppDelegate/RCTAppDelegate.h>)
#import <React-RCTAppDelegate/RCTAppDelegate.h>
#elif __has_include(<React_RCTAppDelegate/RCTAppDelegate.h>)
#import <React_RCTAppDelegate/RCTAppDelegate.h>
#else
#import "RCTAppDelegate.h"
#endif

@interface AppDelegate : RCTAppDelegate

@property (nonatomic, strong) UIWindow *window;

@end
