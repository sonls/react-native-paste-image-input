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
  if (action == @selector(paste:) && [UIPasteboard generalPasteboard].image)
    return YES;
  else
    return [super canPerformAction:action withSender:sender];
}

-(void)paste:(id)sender {
  [super paste:sender];
  
  if (_onPaste) {
    if ([UIPasteboard generalPasteboard].image) {
      UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
      NSArray<NSDictionary *> *files = [pasteboard getCopiedFiles];
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
  [self resignFirstResponder];
}
@end
