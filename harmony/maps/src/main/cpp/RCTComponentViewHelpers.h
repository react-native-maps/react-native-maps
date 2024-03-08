/**
 * MIT License
 *
 * Copyright (C) 2023 Huawei Device Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
#ifndef HARMONY_MAPS_SRC_MAIN_CPP_RCTCOMPONENTVIEWHELPERS_H
#define HARMONY_MAPS_SRC_MAIN_CPP_RCTCOMPONENTVIEWHELPERS_H
#import <Foundation/Foundation.h>
#import <React/RCTDefines.h>
#import <React/RCTLog.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RCTAIRMapProtocol <NSObject>
- (NSObject)getCamera;
@end

RCT_EXTERN inline void
RCTAIRMapCommand(id<RCTAIRMapProtocol> componentView,
                             NSString const *commandName, NSArray const *args) {
  if ([commandName isEqualToString:@"getCamera"]) {
    RCTLogError(@"%@ command %@ received %d arguments,expected %d.",
                @"AIRMap", commandName, (int)[args count], 1);

    [componentView getCamera];
    return;
  }

#if RCT_DEBUG
  RCTLogError(@"%@ received command %@, which is not a supported command.",
              @"RNCViewPager", commandName);
#endif
}

NS_ASSUME_NONNULL_END
#endif