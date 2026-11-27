package com.rnmaps.maps;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Point;
import android.graphics.drawable.Animatable;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.view.Choreographer;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.animation.ObjectAnimator;
import android.util.Property;
import android.animation.TypeEvaluator;

import android.os.Handler;
import android.os.Looper;
import android.os.SystemClock;
import android.util.Size;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.common.references.CloseableReference;
import com.facebook.datasource.DataSource;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.drawee.controller.AbstractDraweeController;
import com.facebook.drawee.controller.BaseControllerListener;
import com.facebook.drawee.controller.ControllerListener;
import com.facebook.drawee.drawable.ScalingUtils;
import com.facebook.drawee.generic.GenericDraweeHierarchy;
import com.facebook.drawee.generic.GenericDraweeHierarchyBuilder;
import com.facebook.drawee.interfaces.DraweeController;
import com.facebook.drawee.view.DraweeHolder;
import com.facebook.drawee.view.DraweeView;
import com.facebook.fresco.ui.common.ControllerListener2;
import com.facebook.imagepipeline.core.ImagePipeline;
import com.facebook.imagepipeline.image.CloseableImage;
import com.facebook.imagepipeline.image.CloseableStaticBitmap;
import com.facebook.imagepipeline.image.ImageInfo;
import com.facebook.imagepipeline.request.ImageRequest;
import com.facebook.imagepipeline.request.ImageRequestBuilder;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.google.android.gms.maps.Projection;
import com.google.android.gms.maps.model.BitmapDescriptor;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.maps.android.collections.MarkerManager;
import com.rnmaps.fabric.event.OnDeselectEvent;
import com.rnmaps.fabric.event.OnDragEndEvent;
import com.rnmaps.fabric.event.OnDragEvent;
import com.rnmaps.fabric.event.OnDragStartEvent;
import com.rnmaps.fabric.event.OnPressEvent;
import com.rnmaps.fabric.event.OnSelectEvent;

import java.lang.ref.SoftReference;
import java.lang.reflect.Method;
import java.util.Map;

public class MapMarker extends MapFeature implements MarkerSwapPlanner.PendingMarker {

    private MarkerOptions markerOptions;
    private Marker marker;
    private int width;
    private int height;
    private String identifier;

    private LatLng position;
    private String title;
    private String snippet;

    private boolean anchorIsSet;
    private float anchorX;
    private float anchorY;

    private MapCallout calloutView;
    private View wrappedCalloutView;
    private final Context context;

    private float markerHue = 0.0f; // should be between 0 and 360
    private BitmapDescriptor iconBitmapDescriptor;
    private Bitmap iconBitmap;

    private float rotation = 0.0f;
    private boolean flat = false;
    private boolean draggable = false;
    private int zIndex = 0;
    private float opacity = 1.0f;

    private float calloutAnchorX;
    private float calloutAnchorY;
    private boolean calloutAnchorIsSet;

    /**
     * Whether we redraw the marker when its custom view changes. When false,
     * the marker keeps its last bitmap until something calls redraw().
     */
    private boolean tracksViewChanges = true;
    /** See MarkerPhase for what each phase means and what changes it */
    private MarkerPhase phase = MarkerPhase.OFF_MAP;
    /**
     * When this marker started waiting for MapView to swap it, from
     * SystemClock.uptimeMillis(). Only means something while the phase is
     * WAITING_FOR_ICON, READY_TO_SHOW or REMOVED_BY_REACT. See MarkerPhase.
     */
    private long swapWaitStartMs = 0;
    /**
     * Whether Fresco is still loading the `image` prop. Until it's done, we
     * wait for the image instead of showing Google's default pin. See
     * markReadyAfterBatchIfNoCustomView().
     */
    private boolean isLoadingImage = false;
    /**
     * The MapView that added this marker to its map, or null when it's off
     * the map
     */
    @Nullable
    private MapView mapView;

    private boolean hasCustomMarkerView = false;
    /**
     * Size in screen pixels of the icon we last gave Google Maps. Google
     * draws bitmap icons at 1 bitmap pixel per screen pixel, so this is the
     * icon's size on screen.
     *
     * Null when we don't know the size: for the default pin, or for an icon
     * from a drawable resource we couldn't decode. Tap handling falls back to
     * Google's own hit test for those markers.
     */
    @Nullable
    private Size iconSizePx = null;
    private final MapMarkerManager markerManager;
    private String imageUri;

    private SoftReference<MarkerManager.Collection> markerCollectionRef;



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
                    if (MapMarker.this.markerManager != null && MapMarker.this.imageUri != null) {
                        MapMarker.this.markerManager.getSharedIcon(MapMarker.this.imageUri)
                                .updateIcon(iconBitmapDescriptor, iconBitmap);
                    }
                    isLoadingImage = false;
                    update(true);
                    // We couldn't make a bitmap from the image, e.g. it's
                    // animated. Fall back to the default pin, like onFailure().
                    if (iconBitmapDescriptor == null) {
                        markReadyAfterBatchIfNoCustomView();
                    }
                }

                @Override
                public void onFailure(String id, Throwable throwable) {
                    // Upstream shows Google's default pin when the image
                    // fails, so we do too. Without this, the marker would
                    // wait for an icon forever.
                    isLoadingImage = false;
                    markReadyAfterBatchIfNoCustomView();
                }
            };

    public MapMarker(Context context, MapMarkerManager markerManager) {
        super(context);
        this.context = context;
        this.markerManager = markerManager;
        logoHolder = DraweeHolder.create(createDraweeHierarchy(), context);
        logoHolder.onAttach();
    }

    public MapMarker(Context context, MarkerOptions options, MapMarkerManager markerManager) {
        super(context);
        this.context = context;
        this.markerManager = markerManager;
        logoHolder = DraweeHolder.create(createDraweeHierarchy(), context);
        logoHolder.onAttach();

        position = options.getPosition();
        setAnchor(options.getAnchorU(), options.getAnchorV());
        setCalloutAnchor(options.getInfoWindowAnchorU(), options.getInfoWindowAnchorV());
        setTitle(options.getTitle());
        setSnippet(options.getSnippet());
        setRotation(options.getRotation());
        setFlat(options.isFlat());
        setDraggable(options.isDraggable());
        setZIndex(Math.round(options.getZIndex()));
        setOpacity(options.getAlpha());
        iconBitmapDescriptor = options.getIcon();
    }

    private GenericDraweeHierarchy createDraweeHierarchy() {
        return new GenericDraweeHierarchyBuilder(getResources())
                .setActualImageScaleType(ScalingUtils.ScaleType.FIT_CENTER)
                .setFadeDuration(0)
                .build();
    }

    public void setCoordinate(ReadableMap coordinate) {
        setCoordinate(new LatLng(coordinate.getDouble("latitude"), coordinate.getDouble("longitude")));
    }

    public void setCoordinate(LatLng position) {
        this.position = position;
        if (marker != null) {
            marker.setPosition(position);
        }
        update(false);
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
        update(false);
    }

    public void doDestroy() {
        Choreographer.getInstance().removeFrameCallback(redrawFrameCallback);
        isRedrawScheduled = false;
        // React deletes a marker right after removing it, in the same batch.
        // We leave it on the map anyway: MapView's removeFeatureAt() put it
        // in markersToSwap, and swapMarkersIfReady() calls removeFromMap() on
        // it once the markers replacing it are shown. Removing it here would
        // bring back the gap the swap avoids. See MarkerPhase.
        if (phase == MarkerPhase.REMOVED_BY_REACT) {
            return;
        }
        MarkerManager.Collection collection = markerCollectionRef != null
                ? markerCollectionRef.get()
                : null;

        if (collection != null) {
            this.removeFromMap(collection);
        }
        markerCollectionRef = null;
    }
    public String getIdentifier() {
        return this.identifier;
    }

    public void setTitle(String title) {
        this.title = title;
        if (marker != null) {
            marker.setTitle(title);
        }
        update(false);
    }

    public void setSnippet(String snippet) {
        this.snippet = snippet;
        if (marker != null) {
            marker.setSnippet(snippet);
        }
        update(false);
    }

    public void setRotation(float rotation) {
        this.rotation = rotation;
        if (marker != null) {
            marker.setRotation(rotation);
        }
        update(false);
    }

    public void setFlat(boolean flat) {
        this.flat = flat;
        if (marker != null) {
            marker.setFlat(flat);
        }
        update(false);
    }

    public void setDraggable(boolean draggable) {
        this.draggable = draggable;
        if (marker != null) {
            marker.setDraggable(draggable);
        }
        update(false);
    }

    public void setZIndex(int zIndex) {
        this.zIndex = zIndex;
        if (marker != null) {
            marker.setZIndex(zIndex);
        }
        update(false);
    }

    public void setOpacity(float opacity) {
        this.opacity = opacity;
        if (marker != null) {
            marker.setAlpha(opacity);
        }
        update(false);
    }

    public void setMarkerHue(float markerHue) {
        this.markerHue = markerHue;
        update(true);
    }

    public void setAnchor(double x, double y) {
        anchorIsSet = true;
        anchorX = (float) x;
        anchorY = (float) y;
        if (marker != null) {
            marker.setAnchor(anchorX, anchorY);
        }
        update(false);
    }

    public void setCalloutAnchor(double x, double y) {
        calloutAnchorIsSet = true;
        calloutAnchorX = (float) x;
        calloutAnchorY = (float) y;
        if (marker != null) {
            marker.setInfoWindowAnchor(calloutAnchorX, calloutAnchorY);
        }
        update(false);
    }

    public void setTracksViewChanges(boolean tracksViewChanges) {
        boolean wasTracking = this.tracksViewChanges;
        this.tracksViewChanges = tracksViewChanges;
        // Draw one last time when tracking turns off. A common pattern is
        // tracksViewChanges={!imageLoaded}: the image's onLoad turns tracking
        // off before we've drawn the loaded image.
        if (wasTracking && !tracksViewChanges && hasCustomMarkerView) {
            redraw();
        }
    }

    public LatLng getPosition() {
        return position;
    }

    /**
     * Gives Google Maps our current icon. Once the icon is what this marker
     * should look like, this also tells MapView the marker is ready to show.
     */
    public void updateMarkerIcon() {
        // Once React removes us, we keep our last icon until MapView takes us
        // off the map. See the getChildCount() == 0 case in requestLayout().
        if (marker == null || phase == MarkerPhase.REMOVED_BY_REACT) return;

        applyIcon(getIcon(), null);
        if (isIconReady()) {
            onIconReady();
        }
    }

    public LatLng interpolate(float fraction, LatLng a, LatLng b) {
        double lat = (b.latitude - a.latitude) * fraction + a.latitude;
        double lng = (b.longitude - a.longitude) * fraction + a.longitude;
        return new LatLng(lat, lng);
    }

    public void animateToCoodinate(LatLng finalPosition, Integer duration) {
        TypeEvaluator<LatLng> typeEvaluator = new TypeEvaluator<LatLng>() {
            @Override
            public LatLng evaluate(float fraction, LatLng startValue, LatLng endValue) {
                return interpolate(fraction, startValue, endValue);
            }
        };
        Property<Marker, LatLng> property = Property.of(Marker.class, LatLng.class, "position");
        ObjectAnimator animator = ObjectAnimator.ofObject(
                marker,
                property,
                typeEvaluator,
                finalPosition);
        animator.setDuration(duration);
        animator.start();
    }

    public void setImage(String uri) {

        boolean shouldLoadImage = true;

        if (this.markerManager != null) {
            // remove marker from previous shared icon if needed, to avoid future updates from it.
            // remove the shared icon completely if no markers on it as well.
            // this is to avoid memory leak due to orphan bitmaps.
            //
            // However in case where client want to update all markers from icon A to icon B
            // and after some time to update back from icon B to icon A
            // it may be better to keep it though. We assume that is rare.
            if (this.imageUri != null) {
                this.markerManager.getSharedIcon(this.imageUri).removeMarker(this);
                this.markerManager.removeSharedIconIfEmpty(this.imageUri);
            }
            if (uri != null) {
                // listening for marker bitmap descriptor update, as well as check whether to load the image.
                MapMarkerManager.AirMapMarkerSharedIcon sharedIcon = this.markerManager.getSharedIcon(uri);
                sharedIcon.addMarker(this);
                shouldLoadImage = sharedIcon.shouldLoadImage();
            }
        }

        this.imageUri = uri;
        if (!shouldLoadImage) {
            return;
        }

        isLoadingImage = false;
        if (uri == null) {
            iconBitmapDescriptor = null;
            update(true);
        } else if (uri.startsWith("http://") || uri.startsWith("https://") ||
                uri.startsWith("file://") || uri.startsWith("asset://") || uri.startsWith("data:")) {
            ImageRequest imageRequest = ImageRequestBuilder
                    .newBuilderWithSource(Uri.parse(uri))
                    .build();

            isLoadingImage = true;
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
            if (this.markerManager != null) {
                this.markerManager.getSharedIcon(uri).updateIcon(iconBitmapDescriptor, iconBitmap);
            }
            update(true);
        }
    }

    public void setIconBitmapDescriptor(BitmapDescriptor bitmapDescriptor, Bitmap bitmap) {
        this.iconBitmapDescriptor = bitmapDescriptor;
        this.iconBitmap = bitmap;
        this.update(true);
    }

    public void setIconBitmap(Bitmap bitmap) {
        this.iconBitmap = bitmap;
    }

    public MarkerOptions getMarkerOptions() {
        if (markerOptions == null) {
            markerOptions = new MarkerOptions();
        }

        fillMarkerOptions(markerOptions);
        return markerOptions;
    }

    @Override
    public void addView(View child, int index) {
        super.addView(child, index);
        // if children are added, it means we are rendering a custom marker
        if (!(child instanceof MapCallout)) {
            hasCustomMarkerView = true;
            hackToHandleDraweeLifecycle(child);
        }
        // The new child hasn't been laid out yet, so wait until it has
        update(false);
        redraw();
    }
    private void hackToHandleDraweeLifecycle(View child){
        if (child instanceof DraweeView<?>) {
            try {
                DraweeView draweeView = (DraweeView) child;

                Method onAttachMethod = DraweeView.class.getDeclaredMethod("onAttachedToWindow");
                onAttachMethod.setAccessible(true);
                onAttachMethod.invoke(child);

                Handler mainHandler = new Handler(Looper.getMainLooper());

                if (draweeView.getController() instanceof AbstractDraweeController<?,?>){
                    AbstractDraweeController abstractController = (AbstractDraweeController) draweeView.getController();

                    abstractController.addControllerListener2(new ControllerListener2() {
                        @Override
                        public void onSubmit(@NonNull String s, @Nullable Object o, @Nullable Extras extras) {

                        }

                        @Override
                        public void onFinalImageSet(@NonNull String s, @Nullable Object o, @Nullable Extras extras) {
                            mainHandler.postDelayed(() -> update(true), ((GenericDraweeHierarchy) draweeView.getHierarchy()).getFadeDuration());
                        }

                        @Override
                        public void onIntermediateImageSet(@NonNull String s, @Nullable Object o) {
                            mainHandler.post(() -> update(true));
                        }

                        @Override
                        public void onIntermediateImageFailed(@NonNull String s) {

                        }

                        @Override
                        public void onFailure(@NonNull String s, @Nullable Throwable throwable, @Nullable Extras extras) {

                        }

                        @Override
                        public void onRelease(@NonNull String s, @Nullable Extras extras) {

                        }

                        @Override
                        public void onEmptyEvent(@Nullable Object o) {

                        }
                    });
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void requestLayout() {
        super.requestLayout();

        if (getChildCount() == 0) {
            if (hasCustomMarkerView) {
                hasCustomMarkerView = false;
                // When React removes a marker, it removes our custom view
                // first. MapView then keeps the marker on the map until the
                // markers replacing it are ready to show. Redrawing now would
                // show Google's red default pin in the meantime, so we keep
                // our last icon. We only switch to the default pin if React
                // keeps the marker once this batch of UI changes finishes.
                clearDrawableCache();
                markReadyAfterBatchIfNoCustomView();
            }
        }
    }

    @Override
    public Object getFeature() {
        return marker;
    }

    /**
     * Use onAddedByReact() instead, so the marker can tell MapView when it's
     * ready
     */
    @Override
    public void addToMap(Object collection) {
        throw new UnsupportedOperationException("MapView adds markers with onAddedByReact()");
    }

    /**
     * MapView calls this when React adds the marker. Returns whether the
     * marker now waits for a swap, i.e. whether it's WAITING_FOR_ICON or
     * READY_TO_SHOW. See MarkerPhase.
     *
     * React only adds a marker that's new or that it just removed: it moves a
     * marker by removing it and adding it back in one batch.
     */
    boolean onAddedByReact(MapView mapView, MarkerManager.Collection markerCollection) {
        if (phase != MarkerPhase.REMOVED_BY_REACT) {
            // A new marker. Add it to the map hidden, since until our icon is
            // ready, Google would show its red default pin. With the new
            // architecture, React Native adds the marker to the map before it
            // adds our custom view as a child, so we usually don't have an
            // icon here yet. MapView shows it once its icon is ready, along
            // with the other new markers.
            this.mapView = mapView;
            startWaitingForIcon();
            MarkerOptions options = getMarkerOptions();
            options.visible(false);
            marker = markerCollection.addMarker(options);
            this.markerCollectionRef = new SoftReference<>(markerCollection);
            if (isIconReady()) {
                // We don't call onIconReady(), which tells MapView: MapView is
                // still adding us, and decides when to swap once React's batch
                // is done.
                phase = MarkerPhase.READY_TO_SHOW;
            } else {
                markReadyAfterBatchIfNoCustomView();
            }
            return true;
        }
        // React is moving the marker, and it's still on the map
        if (isVisibleOnMap()) {
            phase = MarkerPhase.SHOWN;
            return false;
        }
        // React removed it before we showed it. We skipped its redraws since
        // then, so draw it again before showing it.
        startWaitingForIcon();
        if (hasCustomMarkerView) {
            redraw();
        } else {
            markReadyAfterBatchIfNoCustomView();
        }
        return true;
    }

    /**
     * MapView calls this when React removes the marker. Returns whether it's
     * still on the map, and so waits for a swap to take it off. See
     * MarkerPhase.
     */
    boolean onRemovedByReact() {
        if (phase == MarkerPhase.OFF_MAP) {
            // React added it while the map was detached, and removed it
            // before we put it on the map
            return false;
        }
        phase = MarkerPhase.REMOVED_BY_REACT;
        swapWaitStartMs = SystemClock.uptimeMillis();
        return true;
    }

    /**
     * MapView calls this to show a READY_TO_SHOW marker, in the same frame
     * that it takes REMOVED_BY_REACT markers off the map. See MarkerPhase.
     */
    void show() {
        phase = MarkerPhase.SHOWN;
        if (marker != null) {
            marker.setVisible(true);
        }
    }

    /**
     * MapView calls this after the Google map behind it was recreated, which
     * removed all of its markers. The marker goes back to OFF_MAP, so MapView
     * can add it to the new map. See MarkerPhase.
     */
    void onMapRecreated() {
        marker = null;
        mapView = null;
        markerCollectionRef = null;
        phase = MarkerPhase.OFF_MAP;
    }

    @Override
    public MarkerPhase getPhase() {
        return phase;
    }

    @Override
    public long getSwapWaitStartMs() {
        return swapWaitStartMs;
    }

    /**
     * Whether Google Maps shows the marker: it's on the map and not hidden.
     * We keep a marker hidden until it's SHOWN. See MarkerPhase.
     */
    boolean isVisibleOnMap() {
        return marker != null && marker.isVisible();
    }

    /** See MarkerPhase */
    private void startWaitingForIcon() {
        phase = MarkerPhase.WAITING_FOR_ICON;
        swapWaitStartMs = SystemClock.uptimeMillis();
    }

    /**
     * Called once our icon is what this marker should look like. Moves a
     * WAITING_FOR_ICON marker to READY_TO_SHOW and tells MapView, which might
     * swap it in now. Does nothing in other phases. See MarkerPhase.
     */
    private void onIconReady() {
        if (phase != MarkerPhase.WAITING_FOR_ICON) {
            return;
        }
        phase = MarkerPhase.READY_TO_SHOW;
        if (mapView != null) {
            mapView.onMarkerIconReady();
        }
    }

    /**
     * Whether the icon we'd give Google Maps is what this marker should look
     * like, rather than a stand-in:
     * - With a custom view, the view must have been laid out. Before that,
     *   createDrawable() draws an empty 100×100 bitmap.
     * - Without one, we need the image from the `image` prop. Before it
     *   loads, getIcon() returns Google's red default pin.
     */
    private boolean isIconReady() {
        if (!hasCustomMarkerView) {
            return iconBitmapDescriptor != null;
        }
        // We check the snapshot size rather than our own, since a child can
        // be laid out outside our box, e.g. with absolute positioning
        Size snapshotSize = getSnapshotSize();
        return snapshotSize.getWidth() > 0 && snapshotSize.getHeight() > 0;
    }

    private boolean isMarkReadyAfterBatchScheduled = false;

    /**
     * Some markers really do use Google's default pin: they have no custom
     * view and no `image`, or their image failed to load. So once nothing
     * else will give us an icon, we show the default pin. React Native adds
     * or removes a marker's children in the same batch of UI changes that
     * adds or removes the marker. So if React still has the marker with no
     * custom view once that batch finishes, we show what we have.
     */
    private void markReadyAfterBatchIfNoCustomView() {
        if (isMarkReadyAfterBatchScheduled) {
            return;
        }
        isMarkReadyAfterBatchScheduled = true;
        // Like MapView.scheduleSwapMarkersAfterBatch(), this runs after
        // React's batch
        Choreographer.getInstance().postFrameCallback(frameTimeNanos -> {
            isMarkReadyAfterBatchScheduled = false;
            // A custom view or an image that's still loading will give us
            // our icon later
            if (marker == null || hasCustomMarkerView || isLoadingImage
                    || phase == MarkerPhase.REMOVED_BY_REACT) return;
            update(true);
            onIconReady();
        });
    }

    @Override
    public void removeFromMap(Object collection) {
        if (marker == null) {
            return;
        }
        MarkerManager.Collection markerCollection = (MarkerManager.Collection) collection;
        markerCollection.remove(marker);
        marker = null;
        mapView = null;
        phase = MarkerPhase.OFF_MAP;
    }

    /** An icon for Google Maps, and its size. See `iconSizePx`. */
    private static class MarkerIcon {
        final BitmapDescriptor descriptor;
        @Nullable
        final Size sizePx;

        MarkerIcon(BitmapDescriptor descriptor, @Nullable Size sizePx) {
            this.descriptor = descriptor;
            this.sizePx = sizePx;
        }
    }

    private MarkerIcon getIcon() {
        if (hasCustomMarkerView) {
            // creating a bitmap from an arbitrary view
            if (iconBitmapDescriptor != null) {
                Bitmap viewBitmap = createDrawable();
                int width = Math.max(iconBitmap.getWidth(), viewBitmap.getWidth());
                int height = Math.max(iconBitmap.getHeight(), viewBitmap.getHeight());
                Bitmap combinedBitmap = Bitmap.createBitmap(width, height, iconBitmap.getConfig());
                Canvas canvas = new Canvas(combinedBitmap);
                canvas.drawBitmap(iconBitmap, 0, 0, null);
                canvas.drawBitmap(viewBitmap, 0, 0, null);
                return new MarkerIcon(
                        BitmapDescriptorFactory.fromBitmap(combinedBitmap),
                        new Size(width, height));
            } else {
                Bitmap viewBitmap = createDrawable();
                return new MarkerIcon(
                        BitmapDescriptorFactory.fromBitmap(viewBitmap),
                        new Size(viewBitmap.getWidth(), viewBitmap.getHeight()));
            }
        } else if (iconBitmapDescriptor != null) {
            // use local image as a marker
            return new MarkerIcon(
                    iconBitmapDescriptor,
                    iconBitmap != null
                            ? new Size(iconBitmap.getWidth(), iconBitmap.getHeight())
                            : null);
        } else {
            // render the default marker pin
            return new MarkerIcon(BitmapDescriptorFactory.defaultMarker(this.markerHue), null);
        }
    }

    /**
     * Where this marker's icon sits on screen, in map view pixels, or null
     * when we can't tell. We can't tell when:
     * - The marker isn't visible on the map
     * - We don't know the icon's size (see `iconSizePx`)
     * - The marker is rotated or flat, so its icon isn't an upright rectangle
     *
     * MapView uses this to decide which marker a tap hit. See MarkerHitTest.
     */
    @Nullable
    public MarkerHitTest.IconRect getIconScreenRect(Projection projection) {
        if (!isVisibleOnMap() || iconSizePx == null || flat || rotation != 0) {
            return null;
        }

        Point anchorPoint = projection.toScreenLocation(marker.getPosition());
        // Google's default anchor is the bottom middle of the icon:
        // https://developers.google.com/android/reference/com/google/android/gms/maps/model/MarkerOptions#anchor(float,float)
        float effectiveAnchorX = anchorIsSet ? anchorX : 0.5f;
        float effectiveAnchorY = anchorIsSet ? anchorY : 1.0f;
        float left = anchorPoint.x - effectiveAnchorX * iconSizePx.getWidth();
        float top = anchorPoint.y - effectiveAnchorY * iconSizePx.getHeight();
        return new MarkerHitTest.IconRect(
                left, top, left + iconSizePx.getWidth(), top + iconSizePx.getHeight());
    }

    /**
     * Gives the icon to Google Maps: to `options` for a marker we're about to
     * add, or to our marker when `options` is null. We always set the icon
     * and `iconSizePx` together, so the hit test matches what's on screen.
     */
    private void applyIcon(MarkerIcon icon, @Nullable MarkerOptions options) {
        if (options != null) {
            options.icon(icon.descriptor);
        } else {
            marker.setIcon(icon.descriptor);
        }
        iconSizePx = icon.sizePx;
    }

    private MarkerOptions fillMarkerOptions(MarkerOptions options) {
        options.position(position);
        if (anchorIsSet) options.anchor(anchorX, anchorY);
        if (calloutAnchorIsSet) options.infoWindowAnchor(calloutAnchorX, calloutAnchorY);
        options.title(title);
        options.snippet(snippet);
        options.rotation(rotation);
        options.flat(flat);
        options.draggable(draggable);
        options.zIndex(zIndex);
        options.alpha(opacity);
        applyIcon(getIcon(), options);
        return options;
    }

    public void update(boolean updateIcon) {
        if (marker == null) {
            return;
        }

        if (updateIcon)
            updateMarkerIcon();

        if (anchorIsSet) {
            marker.setAnchor(anchorX, anchorY);
        } else {
            marker.setAnchor(0.5f, 1.0f);
        }

        if (calloutAnchorIsSet) {
            marker.setInfoWindowAnchor(calloutAnchorX, calloutAnchorY);
        } else {
            marker.setInfoWindowAnchor(0.5f, 0);
        }
    }

    public void update(int width, int height) {
        this.width = width;
        this.height = height;
        clearDrawableCache();
        // Our children might not be laid out at their new size yet, so wait
        // until they are
        update(false);
        redraw();
    }

    private Bitmap mLastBitmapCreated = null;

    // Walks the subtree to find the union of descendant bounds for bitmap sizing.
    // Uses only laid-out dimensions — do NOT call View#measure() here (Fabric assertion).
    private void expandSnapshotSizeFromSubtree(View view, int offsetX, int offsetY, int[] outWh) {
        int w = view.getWidth() > 0 ? view.getWidth() : view.getMeasuredWidth();
        int h = view.getHeight() > 0 ? view.getHeight() : view.getMeasuredHeight();
        outWh[0] = Math.max(outWh[0], offsetX + w);
        outWh[1] = Math.max(outWh[1], offsetY + h);
        if (view instanceof ViewGroup) {
            ViewGroup group = (ViewGroup) view;
            for (int i = 0; i < group.getChildCount(); i++) {
                View child = group.getChildAt(i);
                expandSnapshotSizeFromSubtree(child, offsetX + child.getLeft(), offsetY + child.getTop(), outWh);
            }
        }
    }

    private void clearDrawableCache() {
        mLastBitmapCreated = null;
    }

    /**
     * The size of the bitmap we draw our custom view into. It covers every
     * laid-out child, since with Fabric our own Yoga box can be too small.
     * Either side is 0 before we're laid out.
     */
    private Size getSnapshotSize() {
        int[] expanded = new int[] { Math.max(0, width), Math.max(0, height) };
        for (int i = 0; i < getChildCount(); i++) {
            View child = getChildAt(i);
            if (child instanceof MapCallout) {
                continue;
            }
            expandSnapshotSizeFromSubtree(child, child.getLeft(), child.getTop(), expanded);
        }
        return new Size(expanded[0], expanded[1]);
    }

    private Bitmap createDrawable() {
        int width = this.width <= 0 ? 100 : this.width;
        int height = this.height <= 0 ? 100 : this.height;

        if (hasCustomMarkerView) {
            Size snapshotSize = getSnapshotSize();
            width = Math.max(width, snapshotSize.getWidth());
            height = Math.max(height, snapshotSize.getHeight());
        }

        // Do not create the doublebuffer-bitmap each time. reuse it to save memory.
        Bitmap bitmap = mLastBitmapCreated;

        if (bitmap == null ||
                bitmap.isRecycled() ||
                bitmap.getWidth() != width ||
                bitmap.getHeight() != height) {
            bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
            mLastBitmapCreated = bitmap;
        } else {
            bitmap.eraseColor(Color.TRANSPARENT);
        }

        Canvas canvas = new Canvas(bitmap);
        this.draw(canvas);

        return bitmap;
    }

    public void setCalloutView(MapCallout view) {
        this.calloutView = view;
    }

    public MapCallout getCalloutView() {
        return this.calloutView;
    }

    public View getCallout() {
        if (this.calloutView == null) return null;

        if (this.wrappedCalloutView == null) {
            this.wrapCalloutView();
        }

        if (this.calloutView.getTooltip()) {
            return this.wrappedCalloutView;
        } else {
            return null;
        }
    }

    public View getInfoContents() {
        if (this.calloutView == null) return null;

        if (this.wrappedCalloutView == null) {
            this.wrapCalloutView();
        }

        if (this.calloutView.getTooltip()) {
            return null;
        } else {
            return this.wrappedCalloutView;
        }
    }

    private void wrapCalloutView() {
        // some hackery is needed to get the arbitrary infowindow view to render centered, and
        // with only the width/height that it needs.
        if (this.calloutView == null || this.calloutView.getChildCount() == 0) {
            return;
        }

        LinearLayout LL = new LinearLayout(context);
        LL.setOrientation(LinearLayout.VERTICAL);
        LL.setLayoutParams(new LinearLayout.LayoutParams(
                this.calloutView.width,
                this.calloutView.height,
                0f
        ));


        LinearLayout LL2 = new LinearLayout(context);
        LL2.setOrientation(LinearLayout.HORIZONTAL);
        LL2.setLayoutParams(new LinearLayout.LayoutParams(
                this.calloutView.width,
                this.calloutView.height,
                0f
        ));

        LL.addView(LL2);
        LL2.addView(this.calloutView);

        this.wrappedCalloutView = LL;
    }

    private int getDrawableResourceByName(String name) {
        return getResources().getIdentifier(
                name,
                "drawable",
                getContext().getPackageName());
    }

    @FunctionalInterface
    public interface EventCreator<T extends Event> {
        T create(int surfaceId, int viewId, WritableMap payload);
    }

    public <T extends Event> void dispatchEvent(WritableMap payload, MapView.EventCreator<T> creator) {
        // Cast context to ReactContext
        ReactContext reactContext = (ReactContext) context;

        // Get the event dispatcher
        EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, getId());

        // If there is a dispatcher, create and dispatch the event
        if (eventDispatcher != null) {
            int surfaceId = UIManagerHelper.getSurfaceId(reactContext);
            T event = creator.create(surfaceId, getId(), payload);
            eventDispatcher.dispatchEvent(event);
        }
    }

    private BitmapDescriptor getBitmapDescriptorByName(String name) {
        return BitmapDescriptorFactory.fromResource(getDrawableResourceByName(name));
    }

    public static Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
        MapBuilder.Builder<String, Object> builder = MapBuilder.builder();
        builder.put(OnPressEvent.EVENT_NAME, MapBuilder.of("registrationName", OnPressEvent.EVENT_NAME));
        return builder.build();
    }

    public static Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.of(
                OnSelectEvent.EVENT_NAME, MapBuilder.of("registrationName", OnSelectEvent.EVENT_NAME),
                OnDeselectEvent.EVENT_NAME, MapBuilder.of("registrationName", OnDeselectEvent.EVENT_NAME),
                OnDragEvent.EVENT_NAME, MapBuilder.of("registrationName", OnDragEvent.EVENT_NAME),
                OnDragStartEvent.EVENT_NAME, MapBuilder.of("registrationName", OnDragStartEvent.EVENT_NAME),
                OnDragEndEvent.EVENT_NAME, MapBuilder.of("registrationName", OnDragEndEvent.EVENT_NAME)
        );
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
        super.onLayout(changed, l, t, r, b);
        int newWidth = r - l;
        int newHeight = b - t;
        if (newWidth == width && newHeight == height) {
            return;
        }
        this.width = newWidth;
        this.height = newHeight;
        clearDrawableCache();
        redraw();
    }

    /**
     * Called when a child changes how it looks, e.g. React sets a new
     * background color or text on it, or an image finishes loading. This lets
     * tracksViewChanges={true} redraw only when something changed, instead of
     * relying on React telling the marker itself about a change. With
     * tracksViewChanges={false}, the marker keeps showing its last bitmap
     * until something calls redraw().
     */
    @Override
    public void onDescendantInvalidated(@NonNull View child, @NonNull View target) {
        super.onDescendantInvalidated(child, target);
        if (tracksViewChanges) {
            redraw();
        }
    }

    private boolean isRedrawScheduled = false;

    /**
     * Redraws the marker's bitmap from its custom view once, on the next
     * frame, after React finishes this batch.
     *
     * When a marker changes, React gives us the change in several steps: the
     * children's props, then layout. If we drew after each step, the map
     * would show a bitmap with the old contents at the new size, or the new
     * contents clipped to the old size. React applies all the steps from one
     * render in a single batch, so waiting until the next frame puts the new
     * size and the new contents on screen together. It also means many
     * changes in a frame only cost one redraw.
     *
     * We use Choreographer instead of a pre-draw listener because our view
     * sits in a hidden, zero-size group. Changes to it alone might not make
     * Android draw the window, so a pre-draw listener could wait until some
     * unrelated part of the screen changes.
     *
     * A child that animates changes every frame, so we redraw it at most once
     * per frame, at the display's refresh rate.
     */
    public void redraw() {
        if (isRedrawScheduled) {
            return;
        }
        isRedrawScheduled = true;
        Choreographer.getInstance().postFrameCallback(redrawFrameCallback);
    }

    private final Choreographer.FrameCallback redrawFrameCallback = frameTimeNanos -> {
        isRedrawScheduled = false;
        updateMarkerIcon();
    };
}
