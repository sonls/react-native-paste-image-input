//
//  UIPasteboard+GetImageInfo.h
//  bic_group
//
//  Created by EVOL- Le Si Son on 12/8/22.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface UIPasteboard (GetImageInfo)

-(NSArray<NSDictionary *> *)getCopiedFiles;

@end

NS_ASSUME_NONNULL_END
