//
//  RCTTextViewCustom.h
//  bic_group
//
//  Created by EVOL- Le Si Son on 12/7/22.
//
#import <React/RCTUITextView.h>
#import <React/RCTComponent.h>

@interface BeinTextViewCustom : RCTUITextView
@property (nonatomic, copy, nullable) RCTDirectEventBlock onPaste;
@end
