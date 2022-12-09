//
//  RCTTextInputView.m
//  bic_group
//
//  Created by EVOL- Le Si Son on 12/7/22.
//

#import "BeinTextInputView.h"
#import "BeinTextViewCustom.h"

@implementation BeinTextInputView
{
    BeinTextViewCustom *_backedTextInputView;
}

- (instancetype)initWithBridge:(RCTBridge *)bridge
{
    if (self = [super initWithBridge:bridge]) {
        // `blurOnSubmit` defaults to `false` for <TextInput multiline={true}> by design.
        self.blurOnSubmit = NO;
        
        _backedTextInputView = [[BeinTextViewCustom alloc] initWithFrame:self.bounds];
        _backedTextInputView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
        _backedTextInputView.textInputDelegate = self;
        
        [self addSubview:_backedTextInputView];
    }
    
    return self;
}

- (id<RCTBackedTextInputViewProtocol>)backedTextInputView
{
    return _backedTextInputView;
}

- (void)setOnPaste:(RCTDirectEventBlock)onPaste {
    _backedTextInputView.onPaste = onPaste;
}

#pragma mark - UIScrollViewDelegate

- (void)scrollViewDidScroll:(UIScrollView *)scrollView
{
    RCTDirectEventBlock onScroll = self.onScroll;
    
    if (onScroll) {
        CGPoint contentOffset = scrollView.contentOffset;
        CGSize contentSize = scrollView.contentSize;
        CGSize size = scrollView.bounds.size;
        UIEdgeInsets contentInset = scrollView.contentInset;
        
        onScroll(@{
            @"contentOffset": @{
                @"x": @(contentOffset.x),
                @"y": @(contentOffset.y)
            },
            @"contentInset": @{
                @"top": @(contentInset.top),
                @"left": @(contentInset.left),
                @"bottom": @(contentInset.bottom),
                @"right": @(contentInset.right)
            },
            @"contentSize": @{
                @"width": @(contentSize.width),
                @"height": @(contentSize.height)
            },
            @"layoutMeasurement": @{
                @"width": @(size.width),
                @"height": @(size.height)
            },
            @"zoomScale": @(scrollView.zoomScale ?: 1),
        });
    }
}

@end
