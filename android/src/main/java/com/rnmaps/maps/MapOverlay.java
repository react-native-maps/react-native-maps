package com.rnmaps.maps;

import android.content.Context;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;

import com.facebook.common.references.CloseableReference;
import com.facebook.datasource.BaseDataSubscriber;
import com.facebook.datasource.DataSource;
import com.facebook.datasource.DataSubscriber;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.drawee.drawable.ScalingUtils;
import com.facebook.drawee.generic.GenericDraweeHierarchy;
import com.facebook.drawee.generic.GenericDraweeHierarchyBuilder;
import com.facebook.imagepipeline.core.ImagePipeline;
import com.facebook.imagepipeline.image.CloseableBitmap;
import com.facebook.imagepipeline.image.CloseableImage;
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
import java.util.concurrent.Executors;

public class MapOverlay extends MapFeature {


    private String imageUri;

    private GroundOverlayOptions groundOverlayOptions;
    private GroundOverlay groundOverlay;
    private LatLngBounds bounds;
    private float bearing;
    private BitmapDescriptor bitmapDescriptor;
    private boolean tappable;
    private float zIndex;
    private float transparency;

    private DataSource<CloseableReference<CloseableImage>> dataSource;

    private GroundOverlayManager.Collection groundOverlayCollection;

    private ImageManager.OnImageLoadedListener imageLoadedListener;


    public MapOverlay(Context context) {
        super(context);
        transparency = 1;
    }

    private GenericDraweeHierarchy createDraweeHierarchy() {
        return new GenericDraweeHierarchyBuilder(getResources())
                .setActualImageScaleType(ScalingUtils.ScaleType.FIT_CENTER)
                .setFadeDuration(0)
                .build();
    }



    public void setBounds(LatLngBounds bounds) {
        this.bounds = bounds;
        if (this.groundOverlay != null) {
            this.groundOverlay.setPositionFromBounds(this.bounds);
        }
    }

    public void setBearing(float bearing) {
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
        boolean shouldLoadImage = true;

        this.imageUri = uri;
        if (!shouldLoadImage) {
            return;
        }

        if (uri == null) {
            bitmapDescriptor = null;
        } else if (uri.startsWith("http://") || uri.startsWith("https://") ||
                uri.startsWith("file://") || uri.startsWith("asset://") || uri.startsWith("data:")) {

            ImageRequest imageRequest = ImageRequestBuilder
                    .newBuilderWithSource(Uri.parse(uri))
                    .build();

            ImagePipeline imagePipeline = Fresco.getImagePipeline();
            dataSource = imagePipeline.fetchDecodedImage(imageRequest, this);

            DataSubscriber<CloseableReference<CloseableImage>> subscriber = new BaseDataSubscriber<CloseableReference<CloseableImage>>() {
                @Override
                protected void onNewResultImpl(DataSource<CloseableReference<CloseableImage>> dataSource) {
                    if (!dataSource.isFinished()) {
                        return;
                    }

                    CloseableReference<CloseableImage> imageReference = dataSource.getResult();
                    if (imageReference != null) {
                        try {
                            CloseableImage closeableImage = imageReference.get();
                            if (closeableImage instanceof CloseableBitmap) {
                                Bitmap bitmap = ((CloseableBitmap) closeableImage).getUnderlyingBitmap();
                                if (bitmap != null) {
                                    bitmapDescriptor = BitmapDescriptorFactory.fromBitmap(bitmap);
                                }
                            }
                        } finally {
                            CloseableReference.closeSafely(imageReference);
                        }
                        new Handler(Looper.getMainLooper()).post(() -> update());
                    }
                }

                @Override
                protected void onFailureImpl(DataSource<CloseableReference<CloseableImage>> dataSource) {
                    // Handle failure
                }
            };

            dataSource.subscribe(subscriber, Executors.newSingleThreadExecutor());

        } else {
            bitmapDescriptor = getBitmapDescriptorByName(uri);
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
        if (this.bitmapDescriptor != null) {
            options.image(bitmapDescriptor);
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
//        options.transparency(transparency);
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

    public void update() {
        this.groundOverlay = getGroundOverlay();
        if (this.groundOverlay != null) {
            this.groundOverlay.setVisible(true);
            this.groundOverlay.setImage(this.bitmapDescriptor);
            //          this.groundOverlay.setTransparency(this.transparency);
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
