//
//  NSData+MimeType.h
//  bic_group
//
//  Created by EVOL- Le Si Son on 12/8/22.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface NSData (MimeType)

-(NSString *)mimeType;
-(NSString *)extension;

@end

NS_ASSUME_NONNULL_END
