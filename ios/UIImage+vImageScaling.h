//
//  UIImage+vImageScaling.h
//  bic_group
//
//  Created by EVOL- Le Si Son on 12/8/22.
//

#import <UIKit/UIKit.h>

@interface UIImage (vImageScaling)

- (UIImage *)vImageScaledImageWithSize:(CGSize)destSize;
- (UIImage *)vImageScaledImageWithSize:(CGSize)destSize contentMode:(UIViewContentMode)contentMode;

@end
