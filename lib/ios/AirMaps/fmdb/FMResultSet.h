#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

#ifndef __has_feature      // Optional.
#define __has_feature(x) 0 // Compatibility with non-clang compilers.
#endif

#ifndef NS_RETURNS_NOT_RETAINED
#if __has_feature(attribute_ns_returns_not_retained)
#define NS_RETURNS_NOT_RETAINED __attribute__((ns_returns_not_retained))
#else
#define NS_RETURNS_NOT_RETAINED
#endif
#endif

@class FMDatabase;
@class FMStatement;

/** Represents the results of executing a query on an `<FMDatabase>`.
 
 ### See also
 
 - `<FMDatabase>`
 */

@interface FMResultSet : NSObject

@property (nonatomic, retain, nullable) FMDatabase *parentDB;

///-----------------
/// @name Properties
///-----------------

/** Executed query */

@property (atomic, retain, nullable) NSString *query;

/** `NSMutableDictionary` mapping column names to numeric index */

@property (readonly) NSMutableDictionary *columnNameToIndexMap;

/** `FMStatement` used by result set. */

@property (atomic, retain, nullable) FMStatement *statement;

///------------------------------------
/// @name Creating and closing database
///------------------------------------

/** Create result set from `<FMStatement>`
 
 @param statement A `<FMStatement>` to be performed
 
 @param aDB A `<FMDatabase>` to be used
 
 @return A `FMResultSet` on success; `nil` on failure
 */

+ (instancetype)resultSetWithStatement:(FMStatement *)statement usingParentDatabase:(FMDatabase*)aDB;

/** Close result set */

- (void)close;

///---------------------------------------
/// @name Iterating through the result set
///---------------------------------------

/** Retrieve next row for result set.
 
 You must always invoke `next` or `nextWithError` before attempting to access the values returned in a query, even if you're only expecting one.

 @return `YES` if row successfully retrieved; `NO` if end of result set reached
 
 @see hasAnotherRow
 */

- (BOOL)next;

/** Retrieve next row for result set.
 
  You must always invoke `next` or `nextWithError` before attempting to access the values returned in a query, even if you're only expecting one.
 
 @param outErr A 'NSError' object to receive any error object (if any).
 
 @return 'YES' if row successfully retrieved; 'NO' if end of result set reached
 
 @see hasAnotherRow
 */

- (BOOL)nextWithError:(NSError * _Nullable *)outErr;

/** Did the last call to `<next>` succeed in retrieving another row?

 @return `YES` if the last call to `<next>` succeeded in retrieving another record; `NO` if not.
 
 @see next
 
 @warning The `hasAnotherRow` method must follow a call to `<next>`. If the previous database interaction was something other than a call to `next`, then this method may return `NO`, whether there is another row of data or not.
 */

- (BOOL)hasAnotherRow;

///---------------------------------------------
/// @name Retrieving information from result set
///---------------------------------------------

/** How many columns in result set
 
 @return Integer value of the number of columns.
 */

@property (nonatomic, readonly) int columnCount;

/** Column index for column name

 @param columnName `NSString` value of the name of the column.

 @return Zero-based index for column.
 */

- (int)columnIndexForName:(NSString*)columnName;

/** Column name for column index

 @param columnIdx Zero-based index for column.

 @return columnName `NSString` value of the name of the column.
 */

- (NSString * _Nullable)columnNameForIndex:(int)columnIdx;

/** Result set integer value for column.

 @param columnName `NSString` value of the name of the column.

 @return `int` value of the result set's column.
 */

- (int)intForColumn:(NSString*)columnName;

/** Result set integer value for column.

 @param columnIdx Zero-based index for column.

 @return `int` value of the result set's column.
 */

- (int)intForColumnIndex:(int)columnIdx;

/** Result set `long` value for column.

 @param columnName `NSString` value of the name of the column.

 @return `long` value of the result set's column.
 */

- (long)longForColumn:(NSString*)columnName;

/** Result set long value for column.

 @param columnIdx Zero-based index for column.

 @return `long` value of the result set's column.
 */

- (long)longForColumnIndex:(int)columnIdx;

/** Result set `long long int` value for column.

 @param columnName `NSString` value of the name of the column.

 @return `long long int` value of the result set's column.
 */

- (long long int)longLongIntForColumn:(NSString*)columnName;

/** Result set `long long int` value for column.

 @param columnIdx Zero-based index for column.

 @return `long long int` value of the result set's column.
 */

- (long long int)longLongIntForColumnIndex:(int)columnIdx;

/** Result set `unsigned long long int` value for column.

 @param columnName `NSString` value of the name of the column.

 @return `unsigned long long int` value of the result set's column.
 */

- (unsigned long long int)unsignedLongLongIntForColumn:(NSString*)columnName;

/** Result set `unsigned long long int` value for column.

 @param columnIdx Zero-based index for column.

 @return `unsigned long long int` value of the result set's column.
 */

- (unsigned long long int)unsignedLongLongIntForColumnIndex:(int)columnIdx;

/** Result set `BOOL` value for column.

 @param columnName `NSString` value of the name of the column.

 @return `BOOL` value of the result set's column.
 */

- (BOOL)boolForColumn:(NSString*)columnName;

/** Result set `BOOL` value for column.

 @param columnIdx Zero-based index for column.

 @return `BOOL` value of the result set's column.
 */

- (BOOL)boolForColumnIndex:(int)columnIdx;

/** Result set `double` value for column.

 @param columnName `NSString` value of the name of the column.

 @return `double` value of the result set's column.
 
 */

- (double)doubleForColumn:(NSString*)columnName;

/** Result set `double` value for column.

 @param columnIdx Zero-based index for column.

 @return `double` value of the result set's column.
 
 */

- (double)doubleForColumnIndex:(int)columnIdx;

/** Result set `NSString` value for column.

 @param columnName `NSString` value of the name of the column.

 @return String value of the result set's column.
 
 */

- (NSString * _Nullable)stringForColumn:(NSString*)columnName;

/** Result set `NSString` value for column.

 @param columnIdx Zero-based index for column.

 @return String value of the result set's column.
 */

- (NSString * _Nullable)stringForColumnIndex:(int)columnIdx;

/** Result set `NSDate` value for column.

 @param columnName `NSString` value of the name of the column.

 @return Date value of the result set's column.
 */

- (NSDate * _Nullable)dateForColumn:(NSString*)columnName;

/** Result set `NSDate` value for column.

 @param columnIdx Zero-based index for column.

 @return Date value of the result set's column.
 
 */

- (NSDate * _Nullable)dateForColumnIndex:(int)columnIdx;

/** Result set `NSData` value for column.
 
 This is useful when storing binary data in table (such as image or the like).

 @param columnName `NSString` value of the name of the column.

 @return Data value of the result set's column.
 
 */

- (NSData * _Nullable)dataForColumn:(NSString*)columnName;

/** Result set `NSData` value for column.

 @param columnIdx Zero-based index for column.

 @return Data value of the result set's column.
 */

- (NSData * _Nullable)dataForColumnIndex:(int)columnIdx;

/** Result set `(const unsigned char *)` value for column.

 @param columnName `NSString` value of the name of the column.

 @return `(const unsigned char *)` value of the result set's column.
 */

- (const unsigned char * _Nullable)UTF8StringForColumn:(NSString*)columnName;

- (const unsigned char * _Nullable)UTF8StringForColumnName:(NSString*)columnName __deprecated_msg("Use UTF8StringForColumn instead");

/** Result set `(const unsigned char *)` value for column.

 @param columnIdx Zero-based index for column.

 @return `(const unsigned char *)` value of the result set's column.
 */

- (const unsigned char * _Nullable)UTF8StringForColumnIndex:(int)columnIdx;

/** Result set object for column.

 @param columnName Name of the column.

 @return Either `NSNumber`, `NSString`, `NSData`, or `NSNull`. If the column was `NULL`, this returns `[NSNull null]` object.

 @see objectForKeyedSubscript:
 */

- (id _Nullable)objectForColumn:(NSString*)columnName;

- (id _Nullable)objectForColumnName:(NSString*)columnName __deprecated_msg("Use objectForColumn instead");

/** Result set object for column.

 @param columnIdx Zero-based index for column.

 @return Either `NSNumber`, `NSString`, `NSData`, or `NSNull`. If the column was `NULL`, this returns `[NSNull null]` object.

 @see objectAtIndexedSubscript:
 */

- (id _Nullable)objectForColumnIndex:(int)columnIdx;

/** Result set object for column.
 
 This method allows the use of the "boxed" syntax supported in Modern Objective-C. For example, by defining this method, the following syntax is now supported:
 
    id result = rs[@"employee_name"];
 
 This simplified syntax is equivalent to calling:
 
    id result = [rs objectForKeyedSubscript:@"employee_name"];
 
 which is, it turns out, equivalent to calling:
 
    id result = [rs objectForColumnName:@"employee_name"];

 @param columnName `NSString` value of the name of the column.

 @return Either `NSNumber`, `NSString`, `NSData`, or `NSNull`. If the column was `NULL`, this returns `[NSNull null]` object.
 */

- (id _Nullable)objectForKeyedSubscript:(NSString *)columnName;

/** Result set object for column.

 This method allows the use of the "boxed" syntax supported in Modern Objective-C. For example, by defining this method, the following syntax is now supported:

    id result = rs[0];

 This simplified syntax is equivalent to calling:

    id result = [rs objectForKeyedSubscript:0];

 which is, it turns out, equivalent to calling:

    id result = [rs objectForColumnName:0];

 @param columnIdx Zero-based index for column.

 @return Either `NSNumber`, `NSString`, `NSData`, or `NSNull`. If the column was `NULL`, this returns `[NSNull null]` object.
 */

- (id _Nullable)objectAtIndexedSubscript:(int)columnIdx;

/** Result set `NSData` value for column.

 @param columnName `NSString` value of the name of the column.

 @return Data value of the result set's column.

 @warning If you are going to use this data after you iterate over the next row, or after you close the
result set, make sure to make a copy of the data first (or just use `<dataForColumn:>`/`<dataForColumnIndex:>`)
If you don't, you're going to be in a world of hurt when you try and use the data.
 
 */

- (NSData * _Nullable)dataNoCopyForColumn:(NSString *)columnName NS_RETURNS_NOT_RETAINED;

/** Result set `NSData` value for column.

 @param columnIdx Zero-based index for column.

 @return Data value of the result set's column.

 @warning If you are going to use this data after you iterate over the next row, or after you close the
 result set, make sure to make a copy of the data first (or just use `<dataForColumn:>`/`<dataForColumnIndex:>`)
 If you don't, you're going to be in a world of hurt when you try and use the data.

 */

- (NSData * _Nullable)dataNoCopyForColumnIndex:(int)columnIdx NS_RETURNS_NOT_RETAINED;

/** Is the column `NULL`?
 
 @param columnIdx Zero-based index for column.

 @return `YES` if column is `NULL`; `NO` if not `NULL`.
 */

- (BOOL)columnIndexIsNull:(int)columnIdx;

/** Is the column `NULL`?

 @param columnName `NSString` value of the name of the column.

 @return `YES` if column is `NULL`; `NO` if not `NULL`.
 */

- (BOOL)columnIsNull:(NSString*)columnName;


/** Returns a dictionary of the row results mapped to case sensitive keys of the column names. 
 
 @warning The keys to the dictionary are case sensitive of the column names.
 */

@property (nonatomic, readonly, nullable) NSDictionary *resultDictionary;
 
/** Returns a dictionary of the row results
 
 @see resultDictionary
 
 @warning **Deprecated**: Please use `<resultDictionary>` instead.  Also, beware that `<resultDictionary>` is case sensitive! 
 */

- (NSDictionary * _Nullable)resultDict __deprecated_msg("Use resultDictionary instead");

///-----------------------------
/// @name Key value coding magic
///-----------------------------

/** Performs `setValue` to yield support for key value observing.
 
 @param object The object for which the values will be set. This is the key-value-coding compliant object that you might, for example, observe.

 */

- (void)kvcMagic:(id)object;

 
@end

NS_ASSUME_NONNULL_END
