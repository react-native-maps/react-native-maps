#import <Foundation/Foundation.h>
#import "FMResultSet.h"
#import "FMDatabasePool.h"

NS_ASSUME_NONNULL_BEGIN

#if ! __has_feature(objc_arc)
    #define FMDBAutorelease(__v) ([__v autorelease]);
    #define FMDBReturnAutoreleased FMDBAutorelease

    #define FMDBRetain(__v) ([__v retain]);
    #define FMDBReturnRetained FMDBRetain

    #define FMDBRelease(__v) ([__v release]);

    #define FMDBDispatchQueueRelease(__v) (dispatch_release(__v));
#else
    // -fobjc-arc
    #define FMDBAutorelease(__v)
    #define FMDBReturnAutoreleased(__v) (__v)

    #define FMDBRetain(__v)
    #define FMDBReturnRetained(__v) (__v)

    #define FMDBRelease(__v)

// If OS_OBJECT_USE_OBJC=1, then the dispatch objects will be treated like ObjC objects
// and will participate in ARC.
// See the section on "Dispatch Queues and Automatic Reference Counting" in "Grand Central Dispatch (GCD) Reference" for details. 
    #if OS_OBJECT_USE_OBJC
        #define FMDBDispatchQueueRelease(__v)
    #else
        #define FMDBDispatchQueueRelease(__v) (dispatch_release(__v));
    #endif
#endif

#if !__has_feature(objc_instancetype)
    #define instancetype id
#endif


typedef int(^FMDBExecuteStatementsCallbackBlock)(NSDictionary *resultsDictionary);


/** A SQLite ([http://sqlite.org/](http://sqlite.org/)) Objective-C wrapper.
 
 ### Usage
 The three main classes in FMDB are:

 - `FMDatabase` - Represents a single SQLite database.  Used for executing SQL statements.
 - `<FMResultSet>` - Represents the results of executing a query on an `FMDatabase`.
 - `<FMDatabaseQueue>` - If you want to perform queries and updates on multiple threads, you'll want to use this class.

 ### See also
 
 - `<FMDatabasePool>` - A pool of `FMDatabase` objects.
 - `<FMStatement>` - A wrapper for `sqlite_stmt`.
 
 ### External links
 
 - [FMDB on GitHub](https://github.com/ccgus/fmdb) including introductory documentation
 - [SQLite web site](http://sqlite.org/)
 - [FMDB mailing list](http://groups.google.com/group/fmdb)
 - [SQLite FAQ](http://www.sqlite.org/faq.html)
 
 @warning Do not instantiate a single `FMDatabase` object and use it across multiple threads. Instead, use `<FMDatabaseQueue>`.

 */

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wobjc-interface-ivars"


@interface FMDatabase : NSObject

///-----------------
/// @name Properties
///-----------------

/** Whether should trace execution */

@property (atomic, assign) BOOL traceExecution;

/** Whether checked out or not */

@property (atomic, assign) BOOL checkedOut;

/** Crash on errors */

@property (atomic, assign) BOOL crashOnErrors;

/** Logs errors */

@property (atomic, assign) BOOL logsErrors;

/** Dictionary of cached statements */

@property (atomic, retain, nullable) NSMutableDictionary *cachedStatements;

///---------------------
/// @name Initialization
///---------------------

/** Create a `FMDatabase` object.
 
 An `FMDatabase` is created with a path to a SQLite database file.  This path can be one of these three:

 1. A file system path.  The file does not have to exist on disk.  If it does not exist, it is created for you.
 2. An empty string (`@""`).  An empty database is created at a temporary location.  This database is deleted with the `FMDatabase` connection is closed.
 3. `nil`.  An in-memory database is created.  This database will be destroyed with the `FMDatabase` connection is closed.

 For example, to create/open a database in your Mac OS X `tmp` folder:

    FMDatabase *db = [FMDatabase databaseWithPath:@"/tmp/tmp.db"];

 Or, in iOS, you might open a database in the app's `Documents` directory:

    NSString *docsPath = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES)[0];
    NSString *dbPath   = [docsPath stringByAppendingPathComponent:@"test.db"];
    FMDatabase *db     = [FMDatabase databaseWithPath:dbPath];

 (For more information on temporary and in-memory databases, read the sqlite documentation on the subject: [http://www.sqlite.org/inmemorydb.html](http://www.sqlite.org/inmemorydb.html))

 @param inPath Path of database file

 @return `FMDatabase` object if successful; `nil` if failure.

 */

+ (instancetype)databaseWithPath:(NSString * _Nullable)inPath;

/** Create a `FMDatabase` object.
 
 An `FMDatabase` is created with a path to a SQLite database file.  This path can be one of these three:
 
 1. A file system URL.  The file does not have to exist on disk.  If it does not exist, it is created for you.
 2. `nil`.  An in-memory database is created.  This database will be destroyed with the `FMDatabase` connection is closed.
 
 For example, to create/open a database in your Mac OS X `tmp` folder:
 
    FMDatabase *db = [FMDatabase databaseWithPath:@"/tmp/tmp.db"];
 
 Or, in iOS, you might open a database in the app's `Documents` directory:
 
    NSString *docsPath = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES)[0];
    NSString *dbPath   = [docsPath stringByAppendingPathComponent:@"test.db"];
    FMDatabase *db     = [FMDatabase databaseWithPath:dbPath];
 
 (For more information on temporary and in-memory databases, read the sqlite documentation on the subject: [http://www.sqlite.org/inmemorydb.html](http://www.sqlite.org/inmemorydb.html))
 
 @param url The local file URL (not remote URL) of database file
 
 @return `FMDatabase` object if successful; `nil` if failure.
 
 */

+ (instancetype)databaseWithURL:(NSURL * _Nullable)url;

/** Initialize a `FMDatabase` object.
 
 An `FMDatabase` is created with a path to a SQLite database file.  This path can be one of these three:

 1. A file system path.  The file does not have to exist on disk.  If it does not exist, it is created for you.
 2. An empty string (`@""`).  An empty database is created at a temporary location.  This database is deleted with the `FMDatabase` connection is closed.
 3. `nil`.  An in-memory database is created.  This database will be destroyed with the `FMDatabase` connection is closed.

 For example, to create/open a database in your Mac OS X `tmp` folder:

    FMDatabase *db = [FMDatabase databaseWithPath:@"/tmp/tmp.db"];

 Or, in iOS, you might open a database in the app's `Documents` directory:

    NSString *docsPath = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES)[0];
    NSString *dbPath   = [docsPath stringByAppendingPathComponent:@"test.db"];
    FMDatabase *db     = [FMDatabase databaseWithPath:dbPath];

 (For more information on temporary and in-memory databases, read the sqlite documentation on the subject: [http://www.sqlite.org/inmemorydb.html](http://www.sqlite.org/inmemorydb.html))

 @param path Path of database file.
 
 @return `FMDatabase` object if successful; `nil` if failure.

 */

- (instancetype)initWithPath:(NSString * _Nullable)path;

/** Initialize a `FMDatabase` object.
 
 An `FMDatabase` is created with a local file URL to a SQLite database file.  This path can be one of these three:
 
 1. A file system URL.  The file does not have to exist on disk.  If it does not exist, it is created for you.
 2. `nil`.  An in-memory database is created.  This database will be destroyed with the `FMDatabase` connection is closed.
 
 For example, to create/open a database in your Mac OS X `tmp` folder:
 
 FMDatabase *db = [FMDatabase databaseWithPath:@"/tmp/tmp.db"];
 
 Or, in iOS, you might open a database in the app's `Documents` directory:
 
 NSString *docsPath = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES)[0];
 NSString *dbPath   = [docsPath stringByAppendingPathComponent:@"test.db"];
 FMDatabase *db     = [FMDatabase databaseWithPath:dbPath];
 
 (For more information on temporary and in-memory databases, read the sqlite documentation on the subject: [http://www.sqlite.org/inmemorydb.html](http://www.sqlite.org/inmemorydb.html))
 
 @param url The file `NSURL` of database file.
 
 @return `FMDatabase` object if successful; `nil` if failure.
 
 */

- (instancetype)initWithURL:(NSURL * _Nullable)url;

///-----------------------------------
/// @name Opening and closing database
///-----------------------------------

/** Opening a new database connection
 
 The database is opened for reading and writing, and is created if it does not already exist.

 @return `YES` if successful, `NO` on error.

 @see [sqlite3_open()](http://sqlite.org/c3ref/open.html)
 @see openWithFlags:
 @see close
 */

- (BOOL)open;

/** Opening a new database connection with flags and an optional virtual file system (VFS)

 @param flags one of the following three values, optionally combined with the `SQLITE_OPEN_NOMUTEX`, `SQLITE_OPEN_FULLMUTEX`, `SQLITE_OPEN_SHAREDCACHE`, `SQLITE_OPEN_PRIVATECACHE`, and/or `SQLITE_OPEN_URI` flags:

 `SQLITE_OPEN_READONLY`

 The database is opened in read-only mode. If the database does not already exist, an error is returned.
 
 `SQLITE_OPEN_READWRITE`
 
 The database is opened for reading and writing if possible, or reading only if the file is write protected by the operating system. In either case the database must already exist, otherwise an error is returned.
 
 `SQLITE_OPEN_READWRITE | SQLITE_OPEN_CREATE`
 
 The database is opened for reading and writing, and is created if it does not already exist. This is the behavior that is always used for `open` method.
  
 @return `YES` if successful, `NO` on error.

 @see [sqlite3_open_v2()](http://sqlite.org/c3ref/open.html)
 @see open
 @see close
 */

- (BOOL)openWithFlags:(int)flags;

/** Opening a new database connection with flags and an optional virtual file system (VFS)
 
 @param flags one of the following three values, optionally combined with the `SQLITE_OPEN_NOMUTEX`, `SQLITE_OPEN_FULLMUTEX`, `SQLITE_OPEN_SHAREDCACHE`, `SQLITE_OPEN_PRIVATECACHE`, and/or `SQLITE_OPEN_URI` flags:
 
 `SQLITE_OPEN_READONLY`
 
 The database is opened in read-only mode. If the database does not already exist, an error is returned.
 
 `SQLITE_OPEN_READWRITE`
 
 The database is opened for reading and writing if possible, or reading only if the file is write protected by the operating system. In either case the database must already exist, otherwise an error is returned.
 
 `SQLITE_OPEN_READWRITE | SQLITE_OPEN_CREATE`
 
 The database is opened for reading and writing, and is created if it does not already exist. This is the behavior that is always used for `open` method.
 
 @param vfsName   If vfs is given the value is passed to the vfs parameter of sqlite3_open_v2.
 
 @return `YES` if successful, `NO` on error.
 
 @see [sqlite3_open_v2()](http://sqlite.org/c3ref/open.html)
 @see open
 @see close
 */

- (BOOL)openWithFlags:(int)flags vfs:(NSString * _Nullable)vfsName;

/** Closing a database connection
 
 @return `YES` if success, `NO` on error.
 
 @see [sqlite3_close()](http://sqlite.org/c3ref/close.html)
 @see open
 @see openWithFlags:
 */

- (BOOL)close;

/** Test to see if we have a good connection to the database.
 
 This will confirm whether:
 
 - is database open
 - if open, it will try a simple SELECT statement and confirm that it succeeds.

 @return `YES` if everything succeeds, `NO` on failure.
 */

@property (nonatomic, readonly) BOOL goodConnection;


///----------------------
/// @name Perform updates
///----------------------

/** Execute single update statement
 
 This method executes a single SQL update statement (i.e. any SQL that does not return results, such as `UPDATE`, `INSERT`, or `DELETE`. This method employs [`sqlite3_prepare_v2`](http://sqlite.org/c3ref/prepare.html), [`sqlite3_bind`](http://sqlite.org/c3ref/bind_blob.html) to bind values to `?` placeholders in the SQL with the optional list of parameters, and [`sqlite_step`](http://sqlite.org/c3ref/step.html) to perform the update.

 The optional values provided to this method should be objects (e.g. `NSString`, `NSNumber`, `NSNull`, `NSDate`, and `NSData` objects), not fundamental data types (e.g. `int`, `long`, `NSInteger`, etc.). This method automatically handles the aforementioned object types, and all other object types will be interpreted as text values using the object's `description` method.

 @param sql The SQL to be performed, with optional `?` placeholders.
 
 @param outErr A reference to the `NSError` pointer to be updated with an auto released `NSError` object if an error if an error occurs. If `nil`, no `NSError` object will be returned.
 
 @param ... Optional parameters to bind to `?` placeholders in the SQL statement. These should be Objective-C objects (e.g. `NSString`, `NSNumber`, etc.), not fundamental C data types (e.g. `int`, `char *`, etc.).

 @return `YES` upon success; `NO` upon failure. If failed, you can call `<lastError>`, `<lastErrorCode>`, or `<lastErrorMessage>` for diagnostic information regarding the failure.

 @see lastError
 @see lastErrorCode
 @see lastErrorMessage
 @see [`sqlite3_bind`](http://sqlite.org/c3ref/bind_blob.html)
 */

- (BOOL)executeUpdate:(NSString*)sql withErrorAndBindings:(NSError * _Nullable *)outErr, ...;

/** Execute single update statement
 
 @see executeUpdate:withErrorAndBindings:
 
 @warning **Deprecated**: Please use `<executeUpdate:withErrorAndBindings>` instead.
 */

- (BOOL)update:(NSString*)sql withErrorAndBindings:(NSError * _Nullable*)outErr, ...  __deprecated_msg("Use executeUpdate:withErrorAndBindings: instead");;

/** Execute single update statement

 This method executes a single SQL update statement (i.e. any SQL that does not return results, such as `UPDATE`, `INSERT`, or `DELETE`. This method employs [`sqlite3_prepare_v2`](http://sqlite.org/c3ref/prepare.html), [`sqlite3_bind`](http://sqlite.org/c3ref/bind_blob.html) to bind values to `?` placeholders in the SQL with the optional list of parameters, and [`sqlite_step`](http://sqlite.org/c3ref/step.html) to perform the update.

 The optional values provided to this method should be objects (e.g. `NSString`, `NSNumber`, `NSNull`, `NSDate`, and `NSData` objects), not fundamental data types (e.g. `int`, `long`, `NSInteger`, etc.). This method automatically handles the aforementioned object types, and all other object types will be interpreted as text values using the object's `description` method.
 
 @param sql The SQL to be performed, with optional `?` placeholders.

 @param ... Optional parameters to bind to `?` placeholders in the SQL statement. These should be Objective-C objects (e.g. `NSString`, `NSNumber`, etc.), not fundamental C data types (e.g. `int`, `char *`, etc.).

 @return `YES` upon success; `NO` upon failure. If failed, you can call `<lastError>`, `<lastErrorCode>`, or `<lastErrorMessage>` for diagnostic information regarding the failure.
 
 @see lastError
 @see lastErrorCode
 @see lastErrorMessage
 @see [`sqlite3_bind`](http://sqlite.org/c3ref/bind_blob.html)
 
 @note This technique supports the use of `?` placeholders in the SQL, automatically binding any supplied value parameters to those placeholders. This approach is more robust than techniques that entail using `stringWithFormat` to manually build SQL statements, which can be problematic if the values happened to include any characters that needed to be quoted.
 
 @note You cannot use this method from Swift due to incompatibilities between Swift and Objective-C variadic implementations. Consider using `<executeUpdate:values:>` instead.
 */

- (BOOL)executeUpdate:(NSString*)sql, ...;

/** Execute single update statement

 This method executes a single SQL update statement (i.e. any SQL that does not return results, such as `UPDATE`, `INSERT`, or `DELETE`. This method employs [`sqlite3_prepare_v2`](http://sqlite.org/c3ref/prepare.html) and [`sqlite_step`](http://sqlite.org/c3ref/step.html) to perform the update. Unlike the other `executeUpdate` methods, this uses printf-style formatters (e.g. `%s`, `%d`, etc.) to build the SQL. Do not use `?` placeholders in the SQL if you use this method.

 @param format The SQL to be performed, with `printf`-style escape sequences.

 @param ... Optional parameters to bind to use in conjunction with the `printf`-style escape sequences in the SQL statement.

 @return `YES` upon success; `NO` upon failure. If failed, you can call `<lastError>`, `<lastErrorCode>`, or `<lastErrorMessage>` for diagnostic information regarding the failure.

 @see executeUpdate:
 @see lastError
 @see lastErrorCode
 @see lastErrorMessage
 
 @note This method does not technically perform a traditional printf-style replacement. What this method actually does is replace the printf-style percent sequences with a SQLite `?` placeholder, and then bind values to that placeholder. Thus the following command

    [db executeUpdateWithFormat:@"INSERT INTO test (name) VALUES (%@)", @"Gus"];

 is actually replacing the `%@` with `?` placeholder, and then performing something equivalent to `<executeUpdate:>`

    [db executeUpdate:@"INSERT INTO test (name) VALUES (?)", @"Gus"];

 There are two reasons why this distinction is important. First, the printf-style escape sequences can only be used where it is permissible to use a SQLite `?` placeholder. You can use it only for values in SQL statements, but not for table names or column names or any other non-value context. This method also cannot be used in conjunction with `pragma` statements and the like. Second, note the lack of quotation marks in the SQL. The `VALUES` clause was _not_ `VALUES ('%@')` (like you might have to do if you built a SQL statement using `NSString` method `stringWithFormat`), but rather simply `VALUES (%@)`.
 */

- (BOOL)executeUpdateWithFormat:(NSString *)format, ... NS_FORMAT_FUNCTION(1,2);

/** Execute single update statement
 
 This method executes a single SQL update statement (i.e. any SQL that does not return results, such as `UPDATE`, `INSERT`, or `DELETE`. This method employs [`sqlite3_prepare_v2`](http://sqlite.org/c3ref/prepare.html) and [`sqlite3_bind`](http://sqlite.org/c3ref/bind_blob.html) binding any `?` placeholders in the SQL with the optional list of parameters.
 
 The optional values provided to this method should be objects (e.g. `NSString`, `NSNumber`, `NSNull`, `NSDate`, and `NSData` objects), not fundamental data types (e.g. `int`, `long`, `NSInteger`, etc.). This method automatically handles the aforementioned object types, and all other object types will be interpreted as text values using the object's `description` method.
 
 @param sql The SQL to be performed, with optional `?` placeholders.
 
 @param arguments A `NSArray` of objects to be used when binding values to the `?` placeholders in the SQL statement.
 
 @return `YES` upon success; `NO` upon failure. If failed, you can call `<lastError>`, `<lastErrorCode>`, or `<lastErrorMessage>` for diagnostic information regarding the failure.
 
 @see executeUpdate:values:error:
 @see lastError
 @see lastErrorCode
 @see lastErrorMessage
 */

- (BOOL)executeUpdate:(NSString*)sql withArgumentsInArray:(NSArray *)arguments;

/** Execute single update statement
 
 This method executes a single SQL update statement (i.e. any SQL that does not return results, such as `UPDATE`, `INSERT`, or `DELETE`. This method employs [`sqlite3_prepare_v2`](http://sqlite.org/c3ref/prepare.html) and [`sqlite3_bind`](http://sqlite.org/c3ref/bind_blob.html) binding any `?` placeholders in the SQL with the optional list of parameters.
 
 The optional values provided to this method should be objects (e.g. `NSString`, `NSNumber`, `NSNull`, `NSDate`, and `NSData` objects), not fundamental data types (e.g. `int`, `long`, `NSInteger`, etc.). This method automatically handles the aforementioned object types, and all other object types will be interpreted as text values using the object's `description` method.
 
 This is similar to `<executeUpdate:withArgumentsInArray:>`, except that this also accepts a pointer to a `NSError` pointer, so that errors can be returned.

 In Swift, this throws errors, as if it were defined as follows:
 
 `func executeUpdate(sql: String, values: [Any]?) throws -> Bool`
 
 @param sql The SQL to be performed, with optional `?` placeholders.
 
 @param values A `NSArray` of objects to be used when binding values to the `?` placeholders in the SQL statement.

 @param error A `NSError` object to receive any error object (if any).

 @return `YES` upon success; `NO` upon failure. If failed, you can call `<lastError>`, `<lastErrorCode>`, or `<lastErrorMessage>` for diagnostic information regarding the failure.
 
 @see lastError
 @see lastErrorCode
 @see lastErrorMessage
 
 */

- (BOOL)executeUpdate:(NSString*)sql values:(NSArray * _Nullable)values error:(NSError * _Nullable __autoreleasing *)error;

/** Execute single update statement

 This method executes a single SQL update statement (i.e. any SQL that does not return results, such as `UPDATE`, `INSERT`, or `DELETE`. This method employs [`sqlite3_prepare_v2`](http://sqlite.org/c3ref/prepare.html) and [`sqlite_step`](http://sqlite.org/c3ref/step.html) to perform the update. Unlike the other `executeUpdate` methods, this uses printf-style formatters (e.g. `%s`, `%d`, etc.) to build the SQL.

 The optional values provided to this method should be objects (e.g. `NSString`, `NSNumber`, `NSNull`, `NSDate`, and `NSData` objects), not fundamental data types (e.g. `int`, `long`, `NSInteger`, etc.). This method automatically handles the aforementioned object types, and all other object types will be interpreted as text values using the object's `description` method.

 @param sql The SQL to be performed, with optional `?` placeholders.

 @param arguments A `NSDictionary` of objects keyed by column names that will be used when binding values to the `?` placeholders in the SQL statement.

 @return `YES` upon success; `NO` upon failure. If failed, you can call `<lastError>`, `<lastErrorCode>`, or `<lastErrorMessage>` for diagnostic information regarding the failure.

 @see lastError
 @see lastErrorCode
 @see lastErrorMessage
*/

- (BOOL)executeUpdate:(NSString*)sql withParameterDictionary:(NSDictionary *)arguments;


/** Execute single update statement

 This method executes a single SQL update statement (i.e. any SQL that does not return results, such as `UPDATE`, `INSERT`, or `DELETE`. This method employs [`sqlite3_prepare_v2`](http://sqlite.org/c3ref/prepare.html) and [`sqlite_step`](http://sqlite.org/c3ref/step.html) to perform the update. Unlike the other `executeUpdate` methods, this uses printf-style formatters (e.g. `%s`, `%d`, etc.) to build the SQL.

 The optional values provided to this method should be objects (e.g. `NSString`, `NSNumber`, `NSNull`, `NSDate`, and `NSData` objects), not fundamental data types (e.g. `int`, `long`, `NSInteger`, etc.). This method automatically handles the aforementioned object types, and all other object types will be interpreted as text values using the object's `description` method.

 @param sql The SQL to be performed, with optional `?` placeholders.

 @param args A `va_list` of arguments.

 @return `YES` upon success; `NO` upon failure. If failed, you can call `<lastError>`, `<lastErrorCode>`, or `<lastErrorMessage>` for diagnostic information regarding the failure.

 @see lastError
 @see lastErrorCode
 @see lastErrorMessage
 */

- (BOOL)executeUpdate:(NSString*)sql withVAList: (va_list)args;

/** Execute multiple SQL statements
 
 This executes a series of SQL statements that are combined in a single string (e.g. the SQL generated by the `sqlite3` command line `.dump` command). This accepts no value parameters, but rather simply expects a single string with multiple SQL statements, each terminated with a semicolon. This uses `sqlite3_exec`. 

 @param  sql  The SQL to be performed
 
 @return      `YES` upon success; `NO` upon failure. If failed, you can call `<lastError>`, `<lastErrorCode>`, or `<lastErrorMessage>` for diagnostic information regarding the failure.

 @see executeStatements:withResultBlock:
 @see [sqlite3_exec()](http://sqlite.org/c3ref/exec.html)

 */

- (BOOL)executeStatements:(NSString *)sql;

/** Execute multiple SQL statements with callback handler
 
 This executes a series of SQL statements that are combined in a single string (e.g. the SQL generated by the `sqlite3` command line `.dump` command). This accepts no value parameters, but rather simply expects a single string with multiple SQL statements, each terminated with a semicolon. This uses `sqlite3_exec`.

 @param sql       The SQL to be performed.
 @param block     A block that will be called for any result sets returned by any SQL statements. 
                  Note, if you supply this block, it must return integer value, zero upon success (this would be a good opportunity to use SQLITE_OK),
                  non-zero value upon failure (which will stop the bulk execution of the SQL).  If a statement returns values, the block will be called with the results from the query in NSDictionary *resultsDictionary.
                  This may be `nil` if you don't care to receive any results.

 @return          `YES` upon success; `NO` upon failure. If failed, you can call `<lastError>`,
                  `<lastErrorCode>`, or `<lastErrorMessage>` for diagnostic information regarding the failure.
 
 @see executeStatements:
 @see [sqlite3_exec()](http://sqlite.org/c3ref/exec.html)

 */

- (BOOL)executeStatements:(NSString *)sql withResultBlock:(__attribute__((noescape)) FMDBExecuteStatementsCallbackBlock _Nullable)block;

/** Last insert rowid
 
 Each entry in an SQLite table has a unique 64-bit signed integer key called the "rowid". The rowid is always available as an undeclared column named `ROWID`, `OID`, or `_ROWID_` as long as those names are not also used by explicitly declared columns. If the table has a column of type `INTEGER PRIMARY KEY` then that column is another alias for the rowid.
 
 This routine returns the rowid of the most recent successful `INSERT` into the database from the database connection in the first argument. As of SQLite version 3.7.7, this routines records the last insert rowid of both ordinary tables and virtual tables. If no successful `INSERT`s have ever occurred on that database connection, zero is returned.
 
 @return The rowid of the last inserted row.
 
 @see [sqlite3_last_insert_rowid()](http://sqlite.org/c3ref/last_insert_rowid.html)

 */

@property (nonatomic, readonly) int64_t lastInsertRowId;

/** The number of rows changed by prior SQL statement.
 
 This function returns the number of database rows that were changed or inserted or deleted by the most recently completed SQL statement on the database connection specified by the first parameter. Only changes that are directly specified by the INSERT, UPDATE, or DELETE statement are counted.
 
 @return The number of rows changed by prior SQL statement.
 
 @see [sqlite3_changes()](http://sqlite.org/c3ref/changes.html)
 
 */

@property (nonatomic, readonly) int changes;


///-------------------------
/// @name Retrieving results
///-------------------------

/** Execute select statement

 Executing queries returns an `<FMResultSet>` object if successful, and `nil` upon failure.  Like executing updates, there is a variant that accepts an `NSError **` parameter.  Otherwise you should use the `<lastErrorMessage>` and `<lastErrorMessage>` methods to determine why a query failed.
 
 In order to iterate through the results of your query, you use a `while()` loop.  You also need to "step" (via `<[FMResultSet next]>`) from one record to the other.
 
 This method employs [`sqlite3_bind`](http://sqlite.org/c3ref/bind_blob.html) for any optional value parameters. This  properly escapes any characters that need escape sequences (e.g. quotation marks), which eliminates simple SQL errors as well as protects against SQL injection attacks. This method natively handles `NSString`, `NSNumber`, `NSNull`, `NSDate`, and `NSData` objects. All other object types will be interpreted as text values using the object's `description` method.

 @param sql The SELECT statement to be performed, with optional `?` placeholders.

 @param ... Optional parameters to bind to `?` placeholders in the SQL statement. These should be Objective-C objects (e.g. `NSString`, `NSNumber`, etc.), not fundamental C data types (e.g. `int`, `char *`, etc.).

 @return A `<FMResultSet>` for the result set upon success; `nil` upon failure. If failed, you can call `<lastError>`, `<lastErrorCode>`, or `<lastErrorMessage>` for diagnostic information regarding the failure.
 
 @see FMResultSet
 @see [`FMResultSet next`](<[FMResultSet next]>)
 @see [`sqlite3_bind`](http://sqlite.org/c3ref/bind_blob.html)
 
 @note You cannot use this method from Swift due to incompatibilities between Swift and Objective-C variadic implementations. Consider using `<executeQuery:values:>` instead.
 */

- (FMResultSet * _Nullable)executeQuery:(NSString*)sql, ...;

/** Execute select statement

 Executing queries returns an `<FMResultSet>` object if successful, and `nil` upon failure.  Like executing updates, there is a variant that accepts an `NSError **` parameter.  Otherwise you should use the `<lastErrorMessage>` and `<lastErrorMessage>` methods to determine why a query failed.
 
 In order to iterate through the results of your query, you use a `while()` loop.  You also need to "step" (via `<[FMResultSet next]>`) from one record to the other.
 
 @param format The SQL to be performed, with `printf`-style escape sequences.

 @param ... Optional parameters to bind to use in conjunction with the `printf`-style escape sequences in the SQL statement.

 @return A `<FMResultSet>` for the result set upon success; `nil` upon failure. If failed, you can call `<lastError>`, `<lastErrorCode>`, or `<lastErrorMessage>` for diagnostic information regarding the failure.

 @see executeQuery:
 @see FMResultSet
 @see [`FMResultSet next`](<[FMResultSet next]>)

 @note This method does not technically perform a traditional printf-style replacement. What this method actually does is replace the printf-style percent sequences with a SQLite `?` placeholder, and then bind values to that placeholder. Thus the following command
 
    [db executeQueryWithFormat:@"SELECT * FROM test WHERE name=%@", @"Gus"];
 
 is actually replacing the `%@` with `?` placeholder, and then performing something equivalent to `<executeQuery:>`
 
    [db executeQuery:@"SELECT * FROM test WHERE name=?", @"Gus"];
 
 There are two reasons why this distinction is important. First, the printf-style escape sequences can only be used where it is permissible to use a SQLite `?` placeholder. You can use it only for values in SQL statements, but not for table names or column names or any other non-value context. This method also cannot be used in conjunction with `pragma` statements and the like. Second, note the lack of quotation marks in the SQL. The `WHERE` clause was _not_ `WHERE name='%@'` (like you might have to do if you built a SQL statement using `NSString` method `stringWithFormat`), but rather simply `WHERE name=%@`.
 
 */

- (FMResultSet * _Nullable)executeQueryWithFormat:(NSString*)format, ... NS_FORMAT_FUNCTION(1,2);

/** Execute select statement

 Executing queries returns an `<FMResultSet>` object if successful, and `nil` upon failure.  Like executing updates, there is a variant that accepts an `NSError **` parameter.  Otherwise you should use the `<lastErrorMessage>` and `<lastErrorMessage>` methods to determine why a query failed.
 
 In order to iterate through the results of your query, you use a `while()` loop.  You also need to "step" (via `<[FMResultSet next]>`) from one record to the other.
 
 @param sql The SELECT statement to be performed, with optional `?` placeholders.

 @param arguments A `NSArray` of objects to be used when binding values to the `?` placeholders in the SQL statement.

 @return A `<FMResultSet>` for the result set upon success; `nil` upon failure. If failed, you can call `<lastError>`, `<lastErrorCode>`, or `<lastErrorMessage>` for diagnostic information regarding the failure.

 @see -executeQuery:values:error:
 @see FMResultSet
 @see [`FMResultSet next`](<[FMResultSet next]>)
 */

- (FMResultSet * _Nullable)executeQuery:(NSString *)sql withArgumentsInArray:(NSArray *)arguments;

/** Execute select statement
 
 Executing queries returns an `<FMResultSet>` object if successful, and `nil` upon failure.  Like executing updates, there is a variant that accepts an `NSError **` parameter.  Otherwise you should use the `<lastErrorMessage>` and `<lastErrorMessage>` methods to determine why a query failed.
 
 In order to iterate through the results of your query, you use a `while()` loop.  You also need to "step" (via `<[FMResultSet next]>`) from one record to the other.
 
 This is similar to `<executeQuery:withArgumentsInArray:>`, except that this also accepts a pointer to a `NSError` pointer, so that errors can be returned.
 
 In Swift, this throws errors, as if it were defined as follows:
 
 `func executeQuery(sql: String, values: [Any]?) throws  -> FMResultSet!`

 @param sql The SELECT statement to be performed, with optional `?` placeholders.
 
 @param values A `NSArray` of objects to be used when binding values to the `?` placeholders in the SQL statement.

 @param error A `NSError` object to receive any error object (if any).

 @return A `<FMResultSet>` for the result set upon success; `nil` upon failure. If failed, you can call `<lastError>`, `<lastErrorCode>`, or `<lastErrorMessage>` for diagnostic information regarding the failure.
 
 @see FMResultSet
 @see [`FMResultSet next`](<[FMResultSet next]>)
 
 @note When called from Swift, only use the first two parameters, `sql` and `values`. This but throws the error.

 */

- (FMResultSet * _Nullable)executeQuery:(NSString *)sql values:(NSArray * _Nullable)values error:(NSError * _Nullable __autoreleasing *)error;

/** Execute select statement

 Executing queries returns an `<FMResultSet>` object if successful, and `nil` upon failure.  Like executing updates, there is a variant that accepts an `NSError **` parameter.  Otherwise you should use the `<lastErrorMessage>` and `<lastErrorMessage>` methods to determine why a query failed.
 
 In order to iterate through the results of your query, you use a `while()` loop.  You also need to "step" (via `<[FMResultSet next]>`) from one record to the other.
 
 @param sql The SELECT statement to be performed, with optional `?` placeholders.

 @param arguments A `NSDictionary` of objects keyed by column names that will be used when binding values to the `?` placeholders in the SQL statement.

 @return A `<FMResultSet>` for the result set upon success; `nil` upon failure. If failed, you can call `<lastError>`, `<lastErrorCode>`, or `<lastErrorMessage>` for diagnostic information regarding the failure.

 @see FMResultSet
 @see [`FMResultSet next`](<[FMResultSet next]>)
 */

- (FMResultSet * _Nullable)executeQuery:(NSString *)sql withParameterDictionary:(NSDictionary * _Nullable)arguments;


// Documentation forthcoming.
- (FMResultSet * _Nullable)executeQuery:(NSString *)sql withVAList:(va_list)args;

///-------------------
/// @name Transactions
///-------------------

/** Begin a transaction
 
 @return `YES` on success; `NO` on failure. If failed, you can call `<lastError>`, `<lastErrorCode>`, or `<lastErrorMessage>` for diagnostic information regarding the failure.
 
 @see commit
 @see rollback
 @see beginDeferredTransaction
 @see isInTransaction
 */

- (BOOL)beginTransaction;

/** Begin a deferred transaction
 
 @return `YES` on success; `NO` on failure. If failed, you can call `<lastError>`, `<lastErrorCode>`, or `<lastErrorMessage>` for diagnostic information regarding the failure.
 
 @see commit
 @see rollback
 @see beginTransaction
 @see isInTransaction
 */

- (BOOL)beginDeferredTransaction;

/** Commit a transaction

 Commit a transaction that was initiated with either `<beginTransaction>` or with `<beginDeferredTransaction>`.
 
 @return `YES` on success; `NO` on failure. If failed, you can call `<lastError>`, `<lastErrorCode>`, or `<lastErrorMessage>` for diagnostic information regarding the failure.
 
 @see beginTransaction
 @see beginDeferredTransaction
 @see rollback
 @see isInTransaction
 */

- (BOOL)commit;

/** Rollback a transaction

 Rollback a transaction that was initiated with either `<beginTransaction>` or with `<beginDeferredTransaction>`.

 @return `YES` on success; `NO` on failure. If failed, you can call `<lastError>`, `<lastErrorCode>`, or `<lastErrorMessage>` for diagnostic information regarding the failure.
 
 @see beginTransaction
 @see beginDeferredTransaction
 @see commit
 @see isInTransaction
 */

- (BOOL)rollback;

/** Identify whether currently in a transaction or not
  
 @see beginTransaction
 @see beginDeferredTransaction
 @see commit
 @see rollback
 */

@property (nonatomic, readonly) BOOL isInTransaction;

- (BOOL)inTransaction __deprecated_msg("Use isInTransaction property instead");


///----------------------------------------
/// @name Cached statements and result sets
///----------------------------------------

/** Clear cached statements */

- (void)clearCachedStatements;

/** Close all open result sets */

- (void)closeOpenResultSets;

/** Whether database has any open result sets
 
 @return `YES` if there are open result sets; `NO` if not.
 */

@property (nonatomic, readonly) BOOL hasOpenResultSets;

/** Whether should cache statements or not
  */

@property (nonatomic) BOOL shouldCacheStatements;

/** Interupt pending database operation
 
 This method causes any pending database operation to abort and return at its earliest opportunity
 
 @return `YES` on success; `NO` on failure. If failed, you can call `<lastError>`, `<lastErrorCode>`, or `<lastErrorMessage>` for diagnostic information regarding the failure.
 
 */

- (BOOL)interrupt;

///-------------------------
/// @name Encryption methods
///-------------------------

/** Set encryption key.
 
 @param key The key to be used.

 @return `YES` if success, `NO` on error.

 @see https://www.zetetic.net/sqlcipher/
 
 @warning You need to have purchased the sqlite encryption extensions for this method to work.
 */

- (BOOL)setKey:(NSString*)key;

/** Reset encryption key

 @param key The key to be used.

 @return `YES` if success, `NO` on error.

 @see https://www.zetetic.net/sqlcipher/

 @warning You need to have purchased the sqlite encryption extensions for this method to work.
 */

- (BOOL)rekey:(NSString*)key;

/** Set encryption key using `keyData`.
 
 @param keyData The `NSData` to be used.

 @return `YES` if success, `NO` on error.

 @see https://www.zetetic.net/sqlcipher/
 
 @warning You need to have purchased the sqlite encryption extensions for this method to work.
 */

- (BOOL)setKeyWithData:(NSData *)keyData;

/** Reset encryption key using `keyData`.

 @param keyData The `NSData` to be used.

 @return `YES` if success, `NO` on error.

 @see https://www.zetetic.net/sqlcipher/

 @warning You need to have purchased the sqlite encryption extensions for this method to work.
 */

- (BOOL)rekeyWithData:(NSData *)keyData;


///------------------------------
/// @name General inquiry methods
///------------------------------

/** The path of the database file
 */

@property (nonatomic, readonly, nullable) NSString *databasePath;

/** The file URL of the database file.
 */

@property (nonatomic, readonly, nullable) NSURL *databaseURL;

/** The underlying SQLite handle 
 
 @return The `sqlite3` pointer.
 
 */

@property (nonatomic, readonly) void *sqliteHandle;


///-----------------------------
/// @name Retrieving error codes
///-----------------------------

/** Last error message
 
 Returns the English-language text that describes the most recent failed SQLite API call associated with a database connection. If a prior API call failed but the most recent API call succeeded, this return value is undefined.

 @return `NSString` of the last error message.
 
 @see [sqlite3_errmsg()](http://sqlite.org/c3ref/errcode.html)
 @see lastErrorCode
 @see lastError
 
 */

- (NSString*)lastErrorMessage;

/** Last error code
 
 Returns the numeric result code or extended result code for the most recent failed SQLite API call associated with a database connection. If a prior API call failed but the most recent API call succeeded, this return value is undefined.
 
 @return Integer value of the last error code.
 
 @see [sqlite3_errcode()](http://sqlite.org/c3ref/errcode.html)
 @see lastErrorMessage
 @see lastError
 
 */

- (int)lastErrorCode;

/** Last extended error code
 
 Returns the numeric extended result code for the most recent failed SQLite API call associated with a database connection. If a prior API call failed but the most recent API call succeeded, this return value is undefined.
 
 @return Integer value of the last extended error code.
 
 @see [sqlite3_errcode()](http://sqlite.org/c3ref/errcode.html)
 @see [2. Primary Result Codes versus Extended Result Codes](http://sqlite.org/rescode.html#primary_result_codes_versus_extended_result_codes)
 @see [5. Extended Result Code List](http://sqlite.org/rescode.html#extrc)
 @see lastErrorMessage
 @see lastError
 
 */

- (int)lastExtendedErrorCode;

/** Had error

 @return `YES` if there was an error, `NO` if no error.
 
 @see lastError
 @see lastErrorCode
 @see lastErrorMessage
 
 */

- (BOOL)hadError;

/** Last error

 @return `NSError` representing the last error.
 
 @see lastErrorCode
 @see lastErrorMessage
 
 */

- (NSError *)lastError;


// description forthcoming
@property (nonatomic) NSTimeInterval maxBusyRetryTimeInterval;


///------------------
/// @name Save points
///------------------

/** Start save point
 
 @param name Name of save point.
 
 @param outErr A `NSError` object to receive any error object (if any).
 
 @return `YES` on success; `NO` on failure. If failed, you can call `<lastError>`, `<lastErrorCode>`, or `<lastErrorMessage>` for diagnostic information regarding the failure.
 
 @see releaseSavePointWithName:error:
 @see rollbackToSavePointWithName:error:
 */

- (BOOL)startSavePointWithName:(NSString*)name error:(NSError * _Nullable *)outErr;

/** Release save point

 @param name Name of save point.
 
 @param outErr A `NSError` object to receive any error object (if any).
 
 @return `YES` on success; `NO` on failure. If failed, you can call `<lastError>`, `<lastErrorCode>`, or `<lastErrorMessage>` for diagnostic information regarding the failure.

 @see startSavePointWithName:error:
 @see rollbackToSavePointWithName:error:
 
 */

- (BOOL)releaseSavePointWithName:(NSString*)name error:(NSError * _Nullable *)outErr;

/** Roll back to save point

 @param name Name of save point.
 @param outErr A `NSError` object to receive any error object (if any).
 
 @return `YES` on success; `NO` on failure. If failed, you can call `<lastError>`, `<lastErrorCode>`, or `<lastErrorMessage>` for diagnostic information regarding the failure.
 
 @see startSavePointWithName:error:
 @see releaseSavePointWithName:error:
 
 */

- (BOOL)rollbackToSavePointWithName:(NSString*)name error:(NSError * _Nullable *)outErr;

/** Start save point

 @param block Block of code to perform from within save point.
 
 @return The NSError corresponding to the error, if any. If no error, returns `nil`.

 @see startSavePointWithName:error:
 @see releaseSavePointWithName:error:
 @see rollbackToSavePointWithName:error:
 
 */

- (NSError * _Nullable)inSavePoint:(__attribute__((noescape)) void (^)(BOOL *rollback))block;

///----------------------------
/// @name SQLite library status
///----------------------------

/** Test to see if the library is threadsafe

 @return `NO` if and only if SQLite was compiled with mutexing code omitted due to the SQLITE_THREADSAFE compile-time option being set to 0.

 @see [sqlite3_threadsafe()](http://sqlite.org/c3ref/threadsafe.html)
 */

+ (BOOL)isSQLiteThreadSafe;

/** Run-time library version numbers
 
 @return The sqlite library version string.
 
 @see [sqlite3_libversion()](http://sqlite.org/c3ref/libversion.html)
 */

+ (NSString*)sqliteLibVersion;


+ (NSString*)FMDBUserVersion;

+ (SInt32)FMDBVersion;


///------------------------
/// @name Make SQL function
///------------------------

/** Adds SQL functions or aggregates or to redefine the behavior of existing SQL functions or aggregates.
 
 For example:
 
    [db makeFunctionNamed:@"RemoveDiacritics" arguments:1 block:^(void *context, int argc, void **argv) {
        SqliteValueType type = [self.db valueType:argv[0]];
        if (type == SqliteValueTypeNull) {
            [self.db resultNullInContext:context];
             return;
        }
        if (type != SqliteValueTypeText) {
            [self.db resultError:@"Expected text" context:context];
            return;
        }
        NSString *string = [self.db valueString:argv[0]];
        NSString *result = [string stringByFoldingWithOptions:NSDiacriticInsensitiveSearch locale:nil];
        [self.db resultString:result context:context];
    }];

    FMResultSet *rs = [db executeQuery:@"SELECT * FROM employees WHERE RemoveDiacritics(first_name) LIKE 'jose'"];
    NSAssert(rs, @"Error %@", [db lastErrorMessage]);
 
 @param name Name of function.

 @param arguments Maximum number of parameters.

 @param block The block of code for the function.

 @see [sqlite3_create_function()](http://sqlite.org/c3ref/create_function.html)
 */

- (void)makeFunctionNamed:(NSString *)name arguments:(int)arguments block:(void (^)(void *context, int argc, void * _Nonnull * _Nonnull argv))block;

- (void)makeFunctionNamed:(NSString *)name maximumArguments:(int)count withBlock:(void (^)(void *context, int argc, void * _Nonnull * _Nonnull argv))block __deprecated_msg("Use makeFunctionNamed:arguments:block:");

typedef NS_ENUM(int, SqliteValueType) {
    SqliteValueTypeInteger = 1,
    SqliteValueTypeFloat   = 2,
    SqliteValueTypeText    = 3,
    SqliteValueTypeBlob    = 4,
    SqliteValueTypeNull    = 5
};

- (SqliteValueType)valueType:(void *)argv;

/**
 Get integer value of parameter in custom function.
 
 @param value The argument whose value to return.
 @return The integer value.
 
 @see makeFunctionNamed:arguments:block:
 */
- (int)valueInt:(void *)value;

/**
 Get long value of parameter in custom function.
 
 @param value The argument whose value to return.
 @return The long value.
 
 @see makeFunctionNamed:arguments:block:
 */
- (long long)valueLong:(void *)value;

/**
 Get double value of parameter in custom function.
 
 @param value The argument whose value to return.
 @return The double value.
 
 @see makeFunctionNamed:arguments:block:
 */
- (double)valueDouble:(void *)value;

/**
 Get `NSData` value of parameter in custom function.
 
 @param value The argument whose value to return.
 @return The data object.
 
 @see makeFunctionNamed:arguments:block:
 */
- (NSData * _Nullable)valueData:(void *)value;

/**
 Get string value of parameter in custom function.
 
 @param value The argument whose value to return.
 @return The string value.
 
 @see makeFunctionNamed:arguments:block:
 */
- (NSString * _Nullable)valueString:(void *)value;

/**
 Return null value from custom function.
 
 @param context The context to which the null value will be returned.
 
 @see makeFunctionNamed:arguments:block:
 */
- (void)resultNullInContext:(void *)context NS_SWIFT_NAME(resultNull(context:));

/**
 Return integer value from custom function.
 
 @param value The integer value to be returned.
 @param context The context to which the value will be returned.
 
 @see makeFunctionNamed:arguments:block:
 */
- (void)resultInt:(int) value context:(void *)context;

/**
 Return long value from custom function.
 
 @param value The long value to be returned.
 @param context The context to which the value will be returned.
 
 @see makeFunctionNamed:arguments:block:
 */
- (void)resultLong:(long long)value context:(void *)context;

/**
 Return double value from custom function.
 
 @param value The double value to be returned.
 @param context The context to which the value will be returned.
 
 @see makeFunctionNamed:arguments:block:
 */
- (void)resultDouble:(double)value context:(void *)context;

/**
 Return `NSData` object from custom function.
 
 @param data The `NSData` object to be returned.
 @param context The context to which the value will be returned.
 
 @see makeFunctionNamed:arguments:block:
 */
- (void)resultData:(NSData *)data context:(void *)context;

/**
 Return string value from custom function.
 
 @param value The string value to be returned.
 @param context The context to which the value will be returned.
 
 @see makeFunctionNamed:arguments:block:
 */
- (void)resultString:(NSString *)value context:(void *)context;

/**
 Return error string from custom function.
 
 @param error The error string to be returned.
 @param context The context to which the error will be returned.
 
 @see makeFunctionNamed:arguments:block:
 */
- (void)resultError:(NSString *)error context:(void *)context;

/**
 Return error code from custom function.
 
 @param errorCode The integer error code to be returned.
 @param context The context to which the error will be returned.
 
 @see makeFunctionNamed:arguments:block:
 */
- (void)resultErrorCode:(int)errorCode context:(void *)context;

/**
 Report memory error in custom function.
 
 @param context The context to which the error will be returned.
 
 @see makeFunctionNamed:arguments:block:
 */
- (void)resultErrorNoMemoryInContext:(void *)context NS_SWIFT_NAME(resultErrorNoMemory(context:));

/**
 Report that string or BLOB is too long to represent in custom function.
 
 @param context The context to which the error will be returned.
 
 @see makeFunctionNamed:arguments:block:
 */
- (void)resultErrorTooBigInContext:(void *)context NS_SWIFT_NAME(resultErrorTooBig(context:));

///---------------------
/// @name Date formatter
///---------------------

/** Generate an `NSDateFormatter` that won't be broken by permutations of timezones or locales.
 
 Use this method to generate values to set the dateFormat property.
 
 Example:

    myDB.dateFormat = [FMDatabase storeableDateFormat:@"yyyy-MM-dd HH:mm:ss"];

 @param format A valid NSDateFormatter format string.
 
 @return A `NSDateFormatter` that can be used for converting dates to strings and vice versa.
 
 @see hasDateFormatter
 @see setDateFormat:
 @see dateFromString:
 @see stringFromDate:
 @see storeableDateFormat:

 @warning Note that `NSDateFormatter` is not thread-safe, so the formatter generated by this method should be assigned to only one FMDB instance and should not be used for other purposes.

 */

+ (NSDateFormatter *)storeableDateFormat:(NSString *)format;

/** Test whether the database has a date formatter assigned.
 
 @return `YES` if there is a date formatter; `NO` if not.
 
 @see hasDateFormatter
 @see setDateFormat:
 @see dateFromString:
 @see stringFromDate:
 @see storeableDateFormat:
 */

- (BOOL)hasDateFormatter;

/** Set to a date formatter to use string dates with sqlite instead of the default UNIX timestamps.
 
 @param format Set to nil to use UNIX timestamps. Defaults to nil. Should be set using a formatter generated using FMDatabase::storeableDateFormat.
 
 @see hasDateFormatter
 @see setDateFormat:
 @see dateFromString:
 @see stringFromDate:
 @see storeableDateFormat:
 
 @warning Note there is no direct getter for the `NSDateFormatter`, and you should not use the formatter you pass to FMDB for other purposes, as `NSDateFormatter` is not thread-safe.
 */

- (void)setDateFormat:(NSDateFormatter *)format;

/** Convert the supplied NSString to NSDate, using the current database formatter.
 
 @param s `NSString` to convert to `NSDate`.
 
 @return The `NSDate` object; or `nil` if no formatter is set.
 
 @see hasDateFormatter
 @see setDateFormat:
 @see dateFromString:
 @see stringFromDate:
 @see storeableDateFormat:
 */

- (NSDate * _Nullable)dateFromString:(NSString *)s;

/** Convert the supplied NSDate to NSString, using the current database formatter.
 
 @param date `NSDate` of date to convert to `NSString`.

 @return The `NSString` representation of the date; `nil` if no formatter is set.
 
 @see hasDateFormatter
 @see setDateFormat:
 @see dateFromString:
 @see stringFromDate:
 @see storeableDateFormat:
 */

- (NSString *)stringFromDate:(NSDate *)date;

@end


/** Objective-C wrapper for `sqlite3_stmt`
 
 This is a wrapper for a SQLite `sqlite3_stmt`. Generally when using FMDB you will not need to interact directly with `FMStatement`, but rather with `<FMDatabase>` and `<FMResultSet>` only.
 
 ### See also
 
 - `<FMDatabase>`
 - `<FMResultSet>`
 - [`sqlite3_stmt`](http://www.sqlite.org/c3ref/stmt.html)
 */

@interface FMStatement : NSObject {
    void *_statement;
    NSString *_query;
    long _useCount;
    BOOL _inUse;
}

///-----------------
/// @name Properties
///-----------------

/** Usage count */

@property (atomic, assign) long useCount;

/** SQL statement */

@property (atomic, retain) NSString *query;

/** SQLite sqlite3_stmt
 
 @see [`sqlite3_stmt`](http://www.sqlite.org/c3ref/stmt.html)
 */

@property (atomic, assign) void *statement;

/** Indication of whether the statement is in use */

@property (atomic, assign) BOOL inUse;

///----------------------------
/// @name Closing and Resetting
///----------------------------

/** Close statement */

- (void)close;

/** Reset statement */

- (void)reset;

@end

#pragma clang diagnostic pop

NS_ASSUME_NONNULL_END
