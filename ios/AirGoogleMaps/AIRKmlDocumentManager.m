// AIRKmlDocumentManager.m

#ifdef HAVE_GOOGLE_MAPS

#import "AIRKmlDocumentManager.h"
#import <SSZipArchive/SSZipArchive.h>
#import <CommonCrypto/CommonDigest.h>


#ifdef HAVE_GOOGLE_MAPS_UTILS
#import "AIRGoogleMap.h"
#import "GMUKMLParser.h"
#import "GMUPlacemark.h"
#import "GMUPoint.h"
#import "GMUGeometryRenderer.h"
#define REQUIRES_GOOGLE_MAPS_UTILS(feature) do {} while (0)
#else
#define GMUKMLParser void
#define GMUPlacemark void
#define REQUIRES_GOOGLE_MAPS_UTILS(feature) do { \
[NSException raise:@"ReactNativeMapsDependencyMissing" \
format:@"Use of " feature "requires Google-Maps-iOS-Utils, you  must install via CocoaPods to use this feature"]; \
} while (0)
#endif


static const uint8_t kZipMagic[4] = {0x50, 0x4B, 0x03, 0x04}; // “PK\003\004”


@interface AIRKmlDocumentManager ()

@property (nonatomic, strong) NSFileManager *fileManager;
@property (nonatomic, weak) AIRGoogleMap *mapView;

@end

@implementation AIRKmlDocumentManager

- (instancetype)initWithMapView:(AIRGoogleMap *)mapView {
  self = [super init];
  if (self) {
    _mapView = mapView;
    _kmlLayers = [[NSMutableDictionary alloc] init];
    _fileManager = [NSFileManager defaultManager];
  }
  return self;
}


/**
 * Synchronizes the displayed KML/KMZ layers with a new source list.
 *
 * - Removes any previously loaded KML/KMZ documents that are no longer in the provided list.
 * - Adds and parses any new KML/KMZ sources that are missing.
 *
 * @param kmlSrcList A mutable array of NSString URLs (local or remote) representing KML or KMZ documents to load.
 */
- (void)setKmlSrc:(NSMutableArray<NSString *> *)kmlSrcList {
#ifdef HAVE_GOOGLE_MAPS_UTILS

  dispatch_group_t group = dispatch_group_create();

  for (NSString *url in [self.kmlLayers allKeys]) {
    if (![kmlSrcList containsObject:url]) {
      [self removeKmlSrc:url];
    }
  }

  for (NSString *url in kmlSrcList) {
    if (![self.kmlLayers objectForKey:url]) {
      [self addKmlSrc:url withGroup:group];
    }
  }

  dispatch_group_notify(group, dispatch_get_main_queue(), ^{
    if (self.mapView.onKmlReady) {
      if (kmlSrcList.count > 0 || [self.kmlLayers allKeys].count > 0) {
        self.mapView.onKmlReady(@{});
      }
    }
  });

#else
  REQUIRES_GOOGLE_MAPS_UTILS();
#endif
}


/**
 * Adds and renders a single KML or KMZ source URL.
 *
 * @param kmlSrc A string representing a local or remote URL for a KML or KMZ document.
 * @param group  A dispatch group used to track completion of loading and parsing operations.
 */
- (void)addKmlSrc:(NSString *)kmlSrc withGroup:(dispatch_group_t)group {

  // Check if it's a local file
  NSURL *url = [NSURL URLWithString:kmlSrc];
  if (url.isFileURL) {
    dispatch_group_enter(group);
    [self renderLocalKmlDocument:url sourceKey:kmlSrc completion:^(void){
      dispatch_group_leave(group);
    }];
    return;
  }

  __weak typeof(self) weakSelf = self;

  dispatch_group_enter(group);
  // Download file from network
  [[[NSURLSession sharedSession] dataTaskWithURL:url
                               completionHandler:^(NSData *data,
                                                   NSURLResponse *resp,
                                                   NSError *err)
    {
    __strong typeof(weakSelf) self = weakSelf;

    if (!self) { dispatch_group_leave(group); return; }

    if (err) {
      NSLog(@"[KML] download error: %@", err.localizedDescription);
      dispatch_group_leave(group);
      return;
    }

    if ([self isZipData:data]) {
      [self writeKmzToDisk:data sourceKey:kmlSrc completion:^(NSURL *localZipURL, NSError *error) {
        if (error) {
          NSLog(@"Failed to save KMZ: %@", error.localizedDescription);
          dispatch_group_leave(group);
          return;
        }

        [self renderKMZ:localZipURL sourceKey:kmlSrc completion: ^(void){
          dispatch_group_leave(group);
        }];

      }];
    } else {
      [self renderKml:data sourceKey:kmlSrc completion:^(void){
        dispatch_group_leave(group);
      }];
    }
  }] resume];
}


/**
 * Renders a local KML document (.kml or .kmz).
 *
 * - If the URL points to a plain .kml file, it parses and renders it directly.
 * - If the URL points to a compressed .kmz archive, it delegates to `renderKMZ:sourceKey:group:`.
 */
- (void)renderLocalKmlDocument:(NSURL *)url
                     sourceKey:(NSString *)key
                    completion:(void (^)(void))completion{

  NSError *error = nil;
  NSData *data = [NSData dataWithContentsOfURL:url options:0 error:&error];
  if (!data) {
    NSLog(@"[KML] Failed to read local file: %@", error.localizedDescription);
    return;
  }

  if ([self isZipData:data]) {
    [self renderKMZ:url sourceKey:key completion:completion];
  } else {
    [self renderKml:data sourceKey:key completion:completion];
  }
}

/**
 * Parses and renders KML data onto the map.
 *
 * @param data  The KML data to parse and render.
 * @param key   A unique source key used to track the rendered KML layer.
 */
- (void)renderKml:(NSData *)data
        sourceKey:(NSString *)key
       completion:(void (^)(void))completion {

  GMUKMLParser *parser = [[GMUKMLParser alloc] initWithData:data];
  [parser parse];

  dispatch_async(dispatch_get_main_queue(), ^{
    [self renderKmlFromParser:parser withStyles:parser.styles sourceKey:key];
    if (completion) completion();
  });
}


/**
 * Unzips and renders a local KMZ archive (.kmz).
 *
 * - Unzips the KMZ archive into a temporary, deterministic directory based on `sourceKey`.
 * - Looks for the `doc.kml` file inside the unzipped folder.
 * - Parses and renders the extracted KML content and associated styles.
 * - Updates any relative icon URLs to absolute file URLs pointing inside the temporary directory.
 */
- (void)renderKMZ:(NSURL *)zipURL
        sourceKey:(NSString *)key
       completion:(void (^)(void))completion{

  NSError  *err = nil;
  NSString *unzipDir = [self createTempDirectoryForKey:key error:&err];

  if (!unzipDir) {
    NSLog(@"[KML] temp-file error: %@", err.localizedDescription);
    return;
  }

  if (![SSZipArchive unzipFileAtPath:zipURL.path toDestination:unzipDir]) {
    NSLog(@"[KML] unzip failed for %@", zipURL.lastPathComponent);
    return;
  }

  NSString *docPath = [unzipDir stringByAppendingPathComponent:@"doc.kml"];
  if (![self.fileManager fileExistsAtPath:docPath]) {
    NSLog(@"[KML] doc.kml not found inside %@", zipURL.lastPathComponent);
    return;
  }

  GMUKMLParser *parser = [[GMUKMLParser alloc] initWithURL:[NSURL fileURLWithPath:docPath]];
  [parser parse];

  NSArray<GMUStyle *> *fixedStyles =
  [self stylesByFixingIcons:parser.styles baseDir:unzipDir];

  dispatch_async(dispatch_get_main_queue(), ^{
    [self renderKmlFromParser:parser
                   withStyles:fixedStyles
                    sourceKey:key];
    if (completion) completion();
  });

}


/**
 *Writes a remote or in-memory KMZ data to a local temp file.
 *Calls completion with the resulting file URL, or error if failed.
 */
- (void)writeKmzToDisk:(NSData *)data
             sourceKey:(NSString *)key
            completion:(void (^)(NSURL * _Nullable localZipUrl, NSError * _Nullable error))completion
{
  dispatch_async(dispatch_get_global_queue(QOS_CLASS_UTILITY, 0), ^{

    NSError *err = nil;
    NSString *generatedPath =  [self getDeterministicPathForKey:key extension:@"kmz"];
    NSURL *localZipURL   = [self writeData:data path:generatedPath error:&err];

    if (!localZipURL) {
      dispatch_async(dispatch_get_main_queue(), ^{
        if (completion) completion(nil, err);
      });
      return;
    }

    dispatch_async(dispatch_get_main_queue(), ^{
      if (completion) completion(localZipURL, nil);
    });
  });
}



/**
 * Adjusts the icon URLs in an array of GMUStyle objects to ensure they are absolute paths.
 *
 * This method iterates over an array of GMUStyle objects and modifies the icon URLs
 * to be absolute paths if they are currently relative paths. It does this by appending
 * the relative path to the provided base directory. If the icon URL is already an
 * absolute path (starting with "http://", "https://", or "/"), it remains unchanged.
 *
 * @param styles An array of GMUStyle objects whose icon URLs need to be fixed.
 * @param baseDir The base directory to use for converting relative icon paths to absolute paths.
 * @return A new array of GMUStyle objects with fixed icon URLs.
 */
- (NSArray<GMUStyle *> *)stylesByFixingIcons:(NSArray<GMUStyle *> *)styles
                                     baseDir:(NSString *)baseDir {

  NSMutableArray *newStyles = [NSMutableArray arrayWithCapacity:styles.count];

  for (GMUStyle *style in styles) {
    NSString *icon = style.iconUrl;

    // change only relative paths
    if (icon.length &&
        ![icon hasPrefix:@"http://"] &&
        ![icon hasPrefix:@"https://"] &&
        ![icon hasPrefix:@"/"])
    {
      NSString *absIconPath =
      [baseDir stringByAppendingPathComponent:icon];
      icon = [NSURL fileURLWithPath:absIconPath].absoluteString;
    }

    GMUStyle *s = [[GMUStyle alloc] initWithStyleID:style.styleID
                                        strokeColor:style.strokeColor
                                          fillColor:style.fillColor
                                              width:style.width
                                              scale:style.scale
                                            heading:style.heading
                                             anchor:style.anchor
                                            iconUrl:icon
                                              title:style.title
                                            hasFill:style.hasFill
                                          hasStroke:style.hasStroke];
    [newStyles addObject:s];
  }
  return newStyles;
}


/**
 * Renders parsed KML geometry onto the map using the provided styles.
 *
 * - Initializes a `GMUGeometryRenderer` with the given KML parser results and styles.
 * - Renders all placemarks and geometries immediately onto the associated map view.
 * - Caches the renderer instance in `kmlLayers` using the provided source key for future management (e.g., removal).
 *
 * @param parser  A `GMUKMLParser` instance containing parsed KML data (placemarks, geometries, and style maps).
 * @param styles  An array of `GMUStyle` objects to apply to the parsed geometries.
 * @param key     A unique source key identifying the rendered KML layer.
 */
- (void)renderKmlFromParser:(GMUKMLParser *)parser
                 withStyles:(NSArray<GMUStyle *> *)styles
                  sourceKey:(NSString *)key {

  GMUGeometryRenderer *renderer =
  [[GMUGeometryRenderer alloc] initWithMap:self.mapView
                                geometries:parser.placemarks
                                    styles:styles
                                 styleMaps:parser.styleMaps];

  [renderer render];
  self.kmlLayers[key] = renderer;
}

/**
 * Generates a deterministic file path in the temporary directory based on a SHA-256 hash of the given key.
 *
 * @param key A unique string used to generate the deterministic filename.
 * @param ext The file extension to append (e.g., "kmz", "kml").
 * @return A full temporary file path as an NSString.
 */
- (NSString *)getDeterministicPathForKey:(NSString *)key
                               extension:(NSString *)ext {

  NSString *hashedName   = [[self hashStringSHA256:key] stringByAppendingPathExtension:ext];
  NSString *path         = [NSTemporaryDirectory() stringByAppendingPathComponent:hashedName];

  return path;
}


/**
 * Writes data to a specified path if it does not already exist.
 *
 * @param data The NSData object to write to disk.
 * @param path The full filesystem path where the data should be written.
 * @param err  An optional pointer to an NSError object to capture writing errors.
 * @return A file URL pointing to the written data, or nil on failure.
 */
- (NSURL *)writeData:(NSData *)data
                path:(NSString *)path
               error:(NSError *__autoreleasing *)err {

  // If the file already exists we reuse it.
  if (![self.fileManager fileExistsAtPath:path]) {
    if (![data writeToFile:path options:NSDataWritingAtomic error:err]) {
      return nil;
    }
  }
  return [NSURL fileURLWithPath:path];
}


/**
 * Creates a deterministic temporary directory based on a SHA-256 hash of the given key.
 *
 * @param key A unique string used to generate the directory name.
 * @param err An optional pointer to an NSError object to capture creation errors.
 * @return The full path to the created (or existing) directory, or nil if creation failed.
 */
- (NSString *)createTempDirectoryForKey:(NSString *)key
                                  error:(NSError *__autoreleasing *)err
{
  NSString *dir = [NSTemporaryDirectory()
                   stringByAppendingPathComponent:
                     [[self hashStringSHA256:key] stringByAppendingString:@".unzipped"]];


  if (![self.fileManager fileExistsAtPath:dir]) {
    if (![self.fileManager createDirectoryAtPath:dir
                     withIntermediateDirectories:YES
                                      attributes:nil
                                           error:err]) {
      return nil;
    }
  }
  return dir;
}

/**
 * Removes a previously rendered KML layer associated with the given source key.
 *
 * @param kmlSrc The source key identifying the KML layer to remove.
 */
- (void)removeKmlSrc:(NSString *)kmlSrc {
  GMUGeometryRenderer *renderer = self.kmlLayers[kmlSrc];
  [renderer clear];
  [self.kmlLayers removeObjectForKey:kmlSrc];
}

- (NSFileManager *)fileManager {
  if (!_fileManager) _fileManager = [NSFileManager defaultManager];
  return _fileManager;
}

- (BOOL)isZipData:(NSData *)data {
  return data.length >= 4 && memcmp(data.bytes, kZipMagic, 4) == 0;
}


- (NSString *)hashStringSHA256:(NSString *)input {
  const char *bytes = input.UTF8String;
  uint8_t digest[CC_SHA256_DIGEST_LENGTH];
  CC_SHA256(bytes, (CC_LONG)strlen(bytes), digest);
  NSMutableString *hex = [NSMutableString stringWithCapacity:CC_SHA256_DIGEST_LENGTH * 2];
  for (int i = 0; i < CC_SHA256_DIGEST_LENGTH; i++) {
    [hex appendFormat:@"%02x", digest[i]];
  }
  return hex;
}

@end

#endif
