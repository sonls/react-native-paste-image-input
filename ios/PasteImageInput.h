
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNPasteImageInputSpec.h"

@interface PasteImageInput : NSObject <NativePasteImageInputSpec>
#else
#import <React/RCTBridgeModule.h>

@interface PasteImageInput : NSObject <RCTBridgeModule>
#endif

@end
