//
//  RCTTextInputView.h
//  bic_group
//
//  Created by EVOL- Le Si Son on 12/7/22.
//

#import <React/RCTMultilineTextInputView.h>

NS_ASSUME_NONNULL_BEGIN

@interface BeinTextInputView : RCTMultilineTextInputView
    @property (nonatomic, copy, nullable) RCTDirectEventBlock onPaste;
@end

NS_ASSUME_NONNULL_END
