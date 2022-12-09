//
//  RCTTextInputModule.m
//  bic_group
//
//  Created by EVOL- Le Si Son on 12/7/22.
//

#import "BeinTextViewCustom.h"
#import "UIPasteboard+GetImageInfo.h"

@implementation BeinTextViewCustom

- (BOOL)canPerformAction:(SEL)action withSender:(id)sender
{
    BOOL imagePresent = YES;
    UIPasteboard *clipboard = [UIPasteboard generalPasteboard];
    if (@available(iOS 10, *)) {
        imagePresent = clipboard.hasImages;
    } else {
        UIImage *imageInPasteboard = clipboard.image;
        imagePresent = imageInPasteboard != nil;
    }
    
    if (action == @selector(paste:) && imagePresent){
        return YES;
    }
    else{
        return [super canPerformAction:action withSender:sender];
    }
}

-(void)paste:(id)sender {
    [super paste:sender];
    
    if (_onPaste) {
        BOOL imagePresent = YES;
        UIPasteboard *clipboard = [UIPasteboard generalPasteboard];
        if (@available(iOS 10, *)) {
            imagePresent = clipboard.hasImages;
        } else {
            UIImage *imageInPasteboard = clipboard.image;
            imagePresent = imageInPasteboard != nil;
        }
        if (imagePresent) {
            NSArray<NSDictionary *> *files = [clipboard getCopiedFiles];
            if (files != nil && files.count > 0) {
                _onPaste(@{
                    @"data": files,
                });
            }
        } else {
            return;
        }
    }
    // Dismiss contextual menu
    //    [self resignFirstResponder];
}
@end
