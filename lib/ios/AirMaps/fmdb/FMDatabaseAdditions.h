//
//  FMDatabaseAdditions.h
//  fmdb
//
//  Created by August Mueller on 10/30/05.
//  Copyright 2005 Flying Meat Inc.. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "FMDatabase.h"

NS_ASSUME_NONNULL_BEGIN

/** Category of additions for `<FMDatabase>` class.
 
 ### See also

 - `<FMDatabase>`
 */

@interface FMDatabase (FMDatabaseAdditions)

///----------------------------------------
/// @name Return results of SQL to variable
///----------------------------------------

/** Return `int` value for query
 
 @param query The SQL query to be performed. 
 @param ... A list of parameters that will be bound to the `?` placeholders in the SQL query.

 @return `int` value.
 
 @note This is not available from Swift.
 */

- (int)intForQuery:(NSString*)query, ...;

/** Return `long` value for query

 @param query The SQL query to be performed.
 @param ... A list of parameters that will be bound to the `?` placeholders in the SQL query.

 @return `long` value.
 
 @note This is not available from Swift.
 */

- (long)longForQuery:(NSString*)query, ...;

/** Return `BOOL` value for query

 @param query The SQL query to be performed.
 @param ... A list of parameters that will be bound to the `?` placeholders in the SQL query.

 @return `BOOL` value.
 
 @note This is not available from Swift.
 */

- (BOOL)boolForQuery:(NSString*)query, ...;

/** Return `double` value for query

 @param query The SQL query to be performed.
 @param ... A list of parameters that will be bound to the `?` placeholders in the SQL query.

 @return `double` value.
 
 @note This is not available from Swift.
 */

- (double)doubleForQuery:(NSString*)query, ...;

/** Return `NSString` value for query

 @param query The SQL query to be performed.
 @param ... A list of parameters that will be bound to the `?` placeholders in the SQL query.

 @return `NSString` value.
 
 @note This is not available from Swift.
 */

- (NSString * _Nullable)stringForQuery:(NSString*)query, ...;

/** Return `NSData` value for query

 @param query The SQL query to be performed.
 @param ... A list of parameters that will be bound to the `?` placeholders in the SQL query.

 @return `NSData` value.
 
 @note This is not available from Swift.
 */

- (NSData * _Nullable)dataForQuery:(NSString*)query, ...;

/** Return `NSDate` value for query

 @param query The SQL query to be performed.
 @param ... A list of parameters that will be bound to the `?` placeholders in the SQL query.

 @return `NSDate` value.
 
 @note This is not available from Swift.
 */

- (NSDate * _Nullable)dateForQuery:(NSString*)query, ...;


// Notice that there's no dataNoCopyForQuery:.
// That would be a bad idea, because we close out the result set, and then what
// happens to the data that we just didn't copy?  Who knows, not I.


///--------------------------------
/// @name Schema related operations
///--------------------------------

/** Does table exist in database?

 @param tableName The name of the table being looked for.

 @return `YES` if table found; `NO` if not found.
 */

- (BOOL)tableExists:(NSString*)tableName;

/** The schema of the database.
 
 This will be the schema for the entire database. For each entity, each row of the result set will include the following fields:
 
 - `type` - The type of entity (e.g. table, index, view, or trigger)
 - `name` - The name of the object
 - `tbl_name` - The name of the table to which the object references
 - `rootpage` - The page number of the root b-tree page for tables and indices
 - `sql` - The SQL that created the entity

 @return `FMResultSet` of schema; `nil` on error.
 
 @see [SQLite File Format](http://www.sqlite.org/fileformat.html)
 */

- (FMResultSet *)getSchema;

/** The schema of the database.

 This will be the schema for a particular table as report by SQLite `PRAGMA`, for example:
 
    PRAGMA table_info('employees')
 
 This will report:
 
 - `cid` - The column ID number
 - `name` - The name of the column
 - `type` - The data type specified for the column
 - `notnull` - whether the field is defined as NOT NULL (i.e. values required)
 - `dflt_value` - The default value for the column
 - `pk` - Whether the field is part of the primary key of the table

 @param tableName The name of the table for whom the schema will be returned.
 
 @return `FMResultSet` of schema; `nil` on error.
 
 @see [table_info](http://www.sqlite.org/pragma.html#pragma_table_info)
 */

- (FMResultSet*)getTableSchema:(NSString*)tableName;

/** Test to see if particular column exists for particular table in database
 
 @param columnName The name of the column.
 
 @param tableName The name of the table.
 
 @return `YES` if column exists in table in question; `NO` otherwise.
 */

- (BOOL)columnExists:(NSString*)columnName inTableWithName:(NSString*)tableName;

/** Test to see if particular column exists for particular table in database

 @param columnName The name of the column.

 @param tableName The name of the table.

 @return `YES` if column exists in table in question; `NO` otherwise.
 
 @see columnExists:inTableWithName:
 
 @warning Deprecated - use `<columnExists:inTableWithName:>` instead.
 */

- (BOOL)columnExists:(NSString*)tableName columnName:(NSString*)columnName __deprecated_msg("Use columnExists:inTableWithName: instead");


/** Validate SQL statement
 
 This validates SQL statement by performing `sqlite3_prepare_v2`, but not returning the results, but instead immediately calling `sqlite3_finalize`.
 
 @param sql The SQL statement being validated.
 
 @param error This is a pointer to a `NSError` object that will receive the autoreleased `NSError` object if there was any error. If this is `nil`, no `NSError` result will be returned.
 
 @return `YES` if validation succeeded without incident; `NO` otherwise.
 
 */

- (BOOL)validateSQL:(NSString*)sql error:(NSError * _Nullable *)error;


///-----------------------------------
/// @name Application identifier tasks
///-----------------------------------

/** Retrieve application ID
 
 @return The `uint32_t` numeric value of the application ID.
 
 @see setApplicationID:
 */

@property (nonatomic) uint32_t applicationID;

#if TARGET_OS_MAC && !TARGET_OS_IPHONE

/** Retrieve application ID string

 @see setApplicationIDString:
 */

@property (nonatomic, retain) NSString *applicationIDString;

#endif

///-----------------------------------
/// @name user version identifier tasks
///-----------------------------------

/** Retrieve user version
 
 @see setUserVersion:
 */

@property (nonatomic) uint32_t userVersion;

@end

NS_ASSUME_NONNULL_END
