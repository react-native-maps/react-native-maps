package com.rnmaps.maps;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.drawable.Animatable;
import android.graphics.drawable.Drawable;
import android.net.Uri;

import androidx.annotation.Nullable;

import com.facebook.common.references.CloseableReference;
import com.facebook.datasource.DataSource;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.drawee.controller.BaseControllerListener;
import com.facebook.drawee.controller.ControllerListener;
import com.facebook.drawee.drawable.ScalingUtils;
import com.facebook.drawee.generic.GenericDraweeHierarchy;
import com.facebook.drawee.generic.GenericDraweeHierarchyBuilder;
import com.facebook.drawee.interfaces.DraweeController;
import com.facebook.drawee.view.DraweeHolder;
import com.facebook.imagepipeline.core.ImagePipeline;
import com.facebook.imagepipeline.image.CloseableImage;
import com.facebook.imagepipeline.image.CloseableStaticBitmap;
import com.facebook.imagepipeline.image.ImageInfo;
import com.facebook.imagepipeline.request.ImageRequest;
import com.facebook.imagepipeline.request.ImageRequestBuilder;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.google.android.gms.common.images.ImageManager;
import com.google.android.gms.maps.model.BitmapDescriptor;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.GroundOverlay;
import com.google.android.gms.maps.model.GroundOverlayOptions;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;
import com.google.maps.android.collections.GroundOverlayManager;
import com.rnmaps.fabric.event.OnPressEvent;

import java.util.Map;

public class MapOverlay extends MapFeature implements ImageReadable {


  private String imageUri;
  private boolean loadingImage;

  private GroundOverlayOptions groundOverlayOptions;
  private GroundOverlay groundOverlay;
  private LatLngBounds bounds;
  private float bearing;
  private BitmapDescriptor iconBitmapDescriptor;
  private Bitmap iconBitmap;
  private boolean tappable;
  private float zIndex;
  private float transparency;

  private DataSource<CloseableReference<CloseableImage>> dataSource;

  private final ImageReader mImageReader;
  private GroundOverlayManager.Collection groundOverlayCollection;

  private final DraweeHolder<?> logoHolder;
  private ImageManager.OnImageLoadedListener imageLoadedListener;

  public boolean isLoadingImage() {
    return loadingImage;
  }

  public ImageManager.OnImageLoadedListener getImageLoadedListener() {
    return imageLoadedListener;
  }

  public void setImageLoadedListener(ImageManager.OnImageLoadedListener imageLoadedListener) {
    this.imageLoadedListener = imageLoadedListener;
  }


  public MapOverlay(Context context) {
    super(context);
    this.mImageReader = new ImageReader(context, getResources(), this);
    logoHolder = DraweeHolder.create(createDraweeHierarchy(), context);
    logoHolder.onAttach();
  }

  private GenericDraweeHierarchy createDraweeHierarchy() {
    return new GenericDraweeHierarchyBuilder(getResources())
            .setActualImageScaleType(ScalingUtils.ScaleType.FIT_CENTER)
            .setFadeDuration(0)
            .build();
  }

  private final ControllerListener<ImageInfo> mLogoControllerListener =
          new BaseControllerListener<ImageInfo>() {
            @Override
            public void onSubmit(String id, Object callerContext){
              loadingImage = true;
            }
            @Override
            public void onFinalImageSet(
                    String id,
                    @Nullable final ImageInfo imageInfo,
                    @Nullable Animatable animatable) {
              CloseableReference<CloseableImage> imageReference = null;
              try {
                imageReference = dataSource.getResult();
                if (imageReference != null) {
                  CloseableImage image = imageReference.get();
                  if (image instanceof CloseableStaticBitmap) {
                    CloseableStaticBitmap closeableStaticBitmap = (CloseableStaticBitmap) image;
                    Bitmap bitmap = closeableStaticBitmap.getUnderlyingBitmap();
                    if (bitmap != null) {
                      bitmap = bitmap.copy(Bitmap.Config.ARGB_8888, true);
                      iconBitmap = bitmap;
                      iconBitmapDescriptor = BitmapDescriptorFactory.fromBitmap(bitmap);
                    }
                  }
                }
              } finally {
                dataSource.close();
                if (imageReference != null) {
                  CloseableReference.closeSafely(imageReference);
                }
              }

              loadingImage = false;
              if (imageLoadedListener != null){
                imageLoadedListener.onImageLoaded(null, null, false);
                // fire and forget
                imageLoadedListener = null;
              }
              update();
            }
          };

  // seems like apple users north west, south east
  // google uses north east, south west
  private static LatLngBounds fixBoundsIfNecessary(ReadableArray bounds){
    double lat1 = bounds.getArray(0).getDouble(0);
    double lon1 = bounds.getArray(0).getDouble(1);
    double lat2 = bounds.getArray(1).getDouble(0);
    double lon2 = bounds.getArray(1).getDouble(1);

// Ensure lat1/lon1 is the SW corner and lat2/lon2 is the NE corner
    double southLat = Math.min(lat1, lat2);
    double northLat = Math.max(lat1, lat2);
    double westLon = Math.min(lon1, lon2);
    double eastLon = Math.max(lon1, lon2);

// Create corrected LatLngs
    LatLng sw = new LatLng(southLat, westLon);
    LatLng ne = new LatLng(northLat, eastLon);
   return new LatLngBounds(sw, ne);
  }

  public void setBounds(ReadableArray bounds) {

    this.bounds = fixBoundsIfNecessary(bounds);
    if (this.groundOverlay != null) {
      this.groundOverlay.setPositionFromBounds(this.bounds);
    }
  }

  public void setBearing(float bearing){
    this.bearing = bearing;
    if (this.groundOverlay != null) {
      this.groundOverlay.setBearing(bearing);
    }
  }

  public void setZIndex(float zIndex) {
    this.zIndex = zIndex;
    if (this.groundOverlay != null) {
      this.groundOverlay.setZIndex(zIndex);
    }
  }

  public void setTransparency(float transparency) {
      this.transparency = transparency;
      if (groundOverlay != null) {
          groundOverlay.setTransparency(transparency);
      }
  }

  public void setImage(String uri) {
    this.mImageReader.setImage(uri);
    boolean shouldLoadImage = true;

    this.imageUri = uri;
    if (!shouldLoadImage) {return;}

    if (uri == null) {
      iconBitmapDescriptor = null;
    } else if (uri.startsWith("http://") || uri.startsWith("https://") ||
            uri.startsWith("file://") || uri.startsWith("asset://") || uri.startsWith("data:")) {
      ImageRequest imageRequest = ImageRequestBuilder
              .newBuilderWithSource(Uri.parse(uri))
              .build();

      ImagePipeline imagePipeline = Fresco.getImagePipeline();
      dataSource = imagePipeline.fetchDecodedImage(imageRequest, this);
      DraweeController controller = Fresco.newDraweeControllerBuilder()
              .setImageRequest(imageRequest)
              .setControllerListener(mLogoControllerListener)
              .setOldController(logoHolder.getController())
              .build();
      logoHolder.setController(controller);
    } else {
      iconBitmapDescriptor = getBitmapDescriptorByName(uri);
      int drawableId = getDrawableResourceByName(uri);
      iconBitmap = BitmapFactory.decodeResource(getResources(), drawableId);
      if (iconBitmap == null) { // VectorDrawable or similar
        Drawable drawable = getResources().getDrawable(drawableId);
        iconBitmap = Bitmap.createBitmap(drawable.getIntrinsicWidth(), drawable.getIntrinsicHeight(), Bitmap.Config.ARGB_8888);
        drawable.setBounds(0, 0, drawable.getIntrinsicWidth(), drawable.getIntrinsicHeight());
        Canvas canvas = new Canvas(iconBitmap);
        drawable.draw(canvas);
      }

  }
    }

  private BitmapDescriptor getBitmapDescriptorByName(String name) {
    return BitmapDescriptorFactory.fromResource(getDrawableResourceByName(name));
  }

  private int getDrawableResourceByName(String name) {
    return getResources().getIdentifier(
            name,
            "drawable",
            getContext().getPackageName());
  }

  public void setTappable(boolean tapabble) {
    this.tappable = tapabble;
    if (groundOverlay != null) {
      groundOverlay.setClickable(tappable);
    }
  }

  public static Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
    MapBuilder.Builder<String, Object> builder = MapBuilder.builder();
    builder.put(OnPressEvent.EVENT_NAME, MapBuilder.of("registrationName", OnPressEvent.EVENT_NAME));
    return builder.build();
  }

  public GroundOverlayOptions getGroundOverlayOptions() {
    if (this.groundOverlayOptions == null) {
      this.groundOverlayOptions = createGroundOverlayOptions();
    }
    return this.groundOverlayOptions;
  }

  private GroundOverlayOptions createGroundOverlayOptions() {
    if (this.groundOverlayOptions != null) {
      return this.groundOverlayOptions;
    }
    GroundOverlayOptions options = new GroundOverlayOptions();
    if (this.iconBitmapDescriptor != null) {
      options.image(iconBitmapDescriptor);
    } else {
      // add stub image to be able to instantiate the overlay
      // and store a reference to it in MapView
      options.image(BitmapDescriptorFactory.defaultMarker());
      // hide overlay until real image gets added
      options.visible(false);
    }
    options.positionFromBounds(bounds);
    options.zIndex(zIndex);
    options.bearing(bearing);
    options.transparency(transparency);
    return options;
  }

  @Override
  public Object getFeature() {
    return groundOverlay;
  }

  @Override
  public void addToMap(Object collection) {
    GroundOverlayManager.Collection groundOverlayCollection = (GroundOverlayManager.Collection) collection;
    GroundOverlayOptions groundOverlayOptions = getGroundOverlayOptions();
    if (groundOverlayOptions != null) {
      groundOverlay = groundOverlayCollection.addGroundOverlay(groundOverlayOptions);
      groundOverlay.setClickable(this.tappable);
    } else {
      this.groundOverlayCollection = groundOverlayCollection;
    }
  }

  @Override
  public void removeFromMap(Object collection) {
    if (groundOverlay != null) {
      GroundOverlayManager.Collection groundOverlayCollection = (GroundOverlayManager.Collection) collection;
      groundOverlayCollection.remove(groundOverlay);
      groundOverlay = null;
      groundOverlayOptions = null;
    }
    groundOverlayCollection = null;
  }

  @Override
  public void setIconBitmap(Bitmap bitmap) {
  }

  @Override
  public void setIconBitmapDescriptor(
      BitmapDescriptor iconBitmapDescriptor) {
    this.iconBitmapDescriptor = iconBitmapDescriptor;
  }

  @Override
  public void update() {
    this.groundOverlay = getGroundOverlay();
    if (this.groundOverlay != null) {
      this.groundOverlay.setVisible(true);
      this.groundOverlay.setImage(this.iconBitmapDescriptor);
      this.groundOverlay.setTransparency(this.transparency);
      this.groundOverlay.setClickable(this.tappable);
    }
  }

  private GroundOverlay getGroundOverlay() {
    if (this.groundOverlay != null) {
      return this.groundOverlay;
    }
    if (this.groundOverlayCollection == null) {
      return null;
    }
    GroundOverlayOptions groundOverlayOptions = getGroundOverlayOptions();
    if (groundOverlayOptions != null) {
      return this.groundOverlayCollection.addGroundOverlay(groundOverlayOptions);
    }
    return null;
  }
}
