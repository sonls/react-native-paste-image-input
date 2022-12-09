//
//  RCTTextInputModuleManager.m
//  bic_group
//
//  Created by EVOL- Le Si Son on 12/7/22.
//

#import "BeinTextInputModuleManager.h"
#import "BeinTextInputView.h"

@implementation BeinTextInputModuleManager

RCT_EXPORT_MODULE(PasteInput)

- (UIView *)view
{
    return [[BeinTextInputView alloc] initWithBridge:self.bridge];
}

#pragma mark - Multiline <TextInput> (aka TextView) specific properties

RCT_EXPORT_VIEW_PROPERTY(onPaste, RCTBubblingEventBlock)

@end
