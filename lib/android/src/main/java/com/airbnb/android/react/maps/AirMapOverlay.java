package com.airbnb.android.react.maps;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.Animatable;
import android.net.Uri;

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
import com.facebook.react.bridge.ReadableMap;
import com.google.android.gms.maps.model.BitmapDescriptor;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.model.LatLngBounds;
import com.google.android.gms.maps.model.GroundOverlay;
import com.google.android.gms.maps.model.GroundOverlayOptions;

import java.util.ArrayList;

import javax.annotation.Nullable;

public class AirMapOverlay extends AirMapFeature {

  private GoogleMap map;
  private GroundOverlayOptions groundOverlayOptions;
  private GroundOverlay groundOverlay;

  private LatLngBounds bounds;
  private float zIndex;
  private float bearing;
  private BitmapDescriptor iconBitmapDescriptor;
  private Bitmap iconBitmap;

  private final DraweeHolder<?> logoHolder;
  private DataSource<CloseableReference<CloseableImage>> dataSource;
  private final ControllerListener<ImageInfo> mLogoControllerListener =
          new BaseControllerListener<ImageInfo>() {
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
                  if (image != null && image instanceof CloseableStaticBitmap) {
                    CloseableStaticBitmap closeableStaticBitmap = (CloseableStaticBitmap) image;
                    Bitmap bitmap = closeableStaticBitmap.getUnderlyingBitmap();
                    if (bitmap != null) {
                      bitmap = bitmap.copy(Bitmap.Config.ARGB_8888, true);
                      iconBitmap = bitmap;
                      iconBitmapDescriptor = BitmapDescriptorFactory.fromBitmap(bitmap);
                      addToMap(map);
                    }
                  }
                }
              } finally {
                dataSource.close();
                if (imageReference != null) {
                  CloseableReference.closeSafely(imageReference);
                }
              }
              //update();
            }
          };


  public AirMapOverlay(Context context) {
    super(context);
    zIndex = 0;
    bearing = 0;
    logoHolder = DraweeHolder.create(createDraweeHierarchy(), context);
    logoHolder.onAttach();
  }

  private GenericDraweeHierarchy createDraweeHierarchy() {
    return new GenericDraweeHierarchyBuilder(getResources())
            .setActualImageScaleType(ScalingUtils.ScaleType.FIT_CENTER)
            .setFadeDuration(0)
            .build();
  }

  public void setBounds(ReadableArray bnds) {
    if (bnds.size() != 2) return;

    LatLng[] latlngs = new LatLng[2];
    for (int i = 0; i < bnds.size(); i++) {
      ReadableMap coordinate = bnds.getMap(i);
      LatLng latLng = new LatLng(coordinate.getDouble("latitude"), coordinate.getDouble("longitude"));
      latlngs[i] = latLng;
    }

    this.bounds = new LatLngBounds(latlngs[1], latlngs[0]);

    if (groundOverlay != null) {
      groundOverlay.setPositionFromBounds(this.bounds);
    }
  }

  public void setImage(String uri) {
    if (uri == null) {
      iconBitmapDescriptor = null;
      //update();
    } else if (uri.startsWith("http://") || uri.startsWith("https://") ||
            uri.startsWith("file://")) {
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
      if (iconBitmapDescriptor != null) {
        iconBitmap = BitmapFactory.decodeResource(getResources(), getDrawableResourceByName(uri));
        if (groundOverlay != null) {
          groundOverlay.setImage(iconBitmapDescriptor);
        }
      }
      //update();
    }
  }

  public void setBearing(float bearing) {
    if (this.bearing != bearing) {
      this.bearing = bearing;
      if (groundOverlay != null) {
        groundOverlay.setBearing(bearing);
      }
    }
  }

  public void setZIndex(float zIndex) {
    if (this.zIndex != zIndex) {
      this.zIndex = zIndex;
      if (groundOverlay != null) {
        groundOverlay.setZIndex(zIndex);
      }
    }
  }

  public GroundOverlayOptions getGroundOverlayOptions() {
    if (groundOverlayOptions == null) {
      groundOverlayOptions = createGroundOverlayOptions();
    }
    return groundOverlayOptions;
  }

  private GroundOverlayOptions createGroundOverlayOptions() {
    GroundOverlayOptions options = new GroundOverlayOptions();
    options.zIndex(this.zIndex);
    options.bearing(this.bearing);
    options.image(this.iconBitmapDescriptor);
    options.positionFromBounds(this.bounds);
    return options;
  }

  @Override
  public Object getFeature() {
    return groundOverlay;
  }

  @Override
  public void addToMap(GoogleMap map) {
    if (map == null) return;
    this.map = map;
    if (this.iconBitmapDescriptor == null || this.bounds == null) return;
    GroundOverlayOptions options = getGroundOverlayOptions();
    this.groundOverlay = map.addGroundOverlay(options);
  }

  @Override
  public void removeFromMap(GoogleMap map) {
    groundOverlay.remove();
  }

  private int getDrawableResourceByName(String name) {
    return getResources().getIdentifier(
            name,
            "drawable",
            getContext().getPackageName());
  }

  private BitmapDescriptor getBitmapDescriptorByName(String name) {
    return BitmapDescriptorFactory.fromResource(getDrawableResourceByName(name));
  }
}
