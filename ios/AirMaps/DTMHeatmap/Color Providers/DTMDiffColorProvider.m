//
//  DTMDiffColorProvider.m
//  DTMHeatMapExample
//
//  Created by Bryan Oltman on 1/8/15.
//  Copyright (c) 2015 Dataminr. All rights reserved.
//

#import "DTMDiffColorProvider.h"

@implementation DTMDiffColorProvider

- (void)colorForValue:(double)value
                  red:(CGFloat *)red
                green:(CGFloat *)green
                 blue:(CGFloat *)blue
                alpha:(CGFloat *)alpha
{
    static int maxVal = 255;
    
    if (value == 0) {
        return;
    }
    
    BOOL isNegative = value < 0;
    value = sqrt(MIN(ABS(value), 1));
    if (value < kSBAlphaPivotY) {
        *alpha = value * kSBAlphaPivotY / kSBAlphaPivotX;
    } else {
        *alpha = kSBAlphaPivotY + ((kSBMaxAlpha - kSBAlphaPivotY) / (1 - kSBAlphaPivotX)) * (value - kSBAlphaPivotX);
    }
    
    if (isNegative) {
        *red = 0;
        if (value <= 0) {
            *green = *blue = *alpha = 0;
        } else if (value < 0.125) {
            *green = 0;
            *blue = 2 * (value + 0.125);
        } else if (value < 0.375) {
            *blue = 2 * (value + 0.125);
            *green = 4 * (value - 0.125);
        } else if (value < 0.625) {
            *blue = 4 * (value - 0.375);
            *green = 1;
        } else if (value < 0.875) {
            *blue = 1;
            *green = 1 - 4 * (value - 0.625);
        } else {
            *blue = MAX(1 - 4 * (value - 0.875), 0.5);
            *green = 0;
        }
    } else {
        *blue = 0;
        if (value <= 0) {
            *red = *green = *alpha = 0;
        } else if (value < 0.125) {
            *green = value;
            *red = (value);
        } else if (value < 0.375) {
            *red = (value + 0.125);
            *green = value;
        } else if (value < 0.625) {
            *red = (value + 0.125);
            *green = value;
        } else if (value < 0.875) {
            *red = (value + 0.125);
            *green = 1 - 4 * (value - 0.625);
        } else {
            *green = 0;
            *red = MAX(1 - 4 * (value - 0.875), 0.5);
        }
    }
    
    *alpha *= maxVal;
    *blue *= *alpha;
    *green *= *alpha;
    *red *= *alpha;
}

@end
