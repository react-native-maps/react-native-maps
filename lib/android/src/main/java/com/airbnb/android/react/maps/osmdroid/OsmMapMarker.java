package com.airbnb.android.react.maps.osmdroid;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Rect;
import android.graphics.drawable.Animatable;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.view.MotionEvent;
import android.view.View;
import android.widget.LinearLayout;

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
import com.facebook.react.bridge.ReadableMap;

import org.osmdroid.util.GeoPoint;
import org.osmdroid.views.MapView;
import org.osmdroid.views.overlay.Marker;
import org.osmdroid.views.overlay.infowindow.InfoWindow;

import javax.annotation.Nullable;

import static android.view.KeyEvent.ACTION_UP;

public class OsmMapMarker extends OsmMapFeature {

    private Marker marker;
    private MapView mapView;
    private InfoWindow defaultInfoWindow;
    private InfoWindow customInfoWindowCache;
    private Drawable defaultBubbleDrawable;
    private int width;
    private int height;
    private String identifier;

    private GeoPoint position;
    private String title;
    private String snippet;

    private boolean anchorIsSet;
    private float anchorX;
    private float anchorY;

    private OsmMapCallout calloutView;

    private float markerHue = 0.0f; // should be between 0 and 360
    private Drawable iconBitmapDrawable;
    private Bitmap iconBitmap;

    private float rotation = 0.0f;
    private boolean flat = false;
    private boolean draggable = false;
    private int zIndex = 0;
    private float opacity = 1.0f;

    private float calloutAnchorX;
    private float calloutAnchorY;
    private boolean calloutAnchorIsSet;

    private boolean hasCustomMarkerView = false;
    private boolean isCustomMarkerViewDirty = false;
    private Bitmap customMarkerViewBitmap = null;

    private OnCalloutPressListener onCalloutPressListener;

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
                                    iconBitmapDrawable = new BitmapDrawable(getResources(), bitmap);
                                }
                            }
                        }
                    } finally {
                        dataSource.close();
                        if (imageReference != null) {
                            CloseableReference.closeSafely(imageReference);
                        }
                    }
                    update();
                }
            };

    public OsmMapMarker(Context context) {
        super(context);
        logoHolder = DraweeHolder.create(createDraweeHierarchy(), context);
        logoHolder.onAttach();
    }

    private GenericDraweeHierarchy createDraweeHierarchy() {
        return new GenericDraweeHierarchyBuilder(getResources())
                .setActualImageScaleType(ScalingUtils.ScaleType.FIT_CENTER)
                .setFadeDuration(0)
                .build();
    }

    public void setCoordinate(ReadableMap coordinate) {
        position = new GeoPoint(coordinate.getDouble("latitude"), coordinate.getDouble("longitude"));
        if (marker != null) {
            marker.setPosition(position);
        }
        update();
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
        update();
    }

    public String getIdentifier() {
        return this.identifier;
    }

    public void setTitle(String title) {
        this.title = title;
        if (marker != null) {
            marker.setTitle(title);
        }
        update();
    }

    public void setSnippet(String snippet) {
        this.snippet = snippet;
        if (marker != null) {
            marker.setSnippet(snippet);
        }
        update();
    }

    public void setRotation(float rotation) {
        this.rotation = rotation;
        if (marker != null) {
            marker.setRotation(rotation);
        }
        update();
    }

    public void setFlat(boolean flat) {
        this.flat = flat;
        if (marker != null) {
            marker.setFlat(flat);
        }
        update();
    }

    public void setDraggable(boolean draggable) {
        this.draggable = draggable;
        if (marker != null) {
            marker.setDraggable(draggable);
        }
        update();
    }

//  public void setZIndex(int zIndex) {
//    this.zIndex = zIndex;
//    if (marker != null) {
//      marker.setZIndex(zIndex);
//    }
//    update();
//  }

    public void setOpacity(float opacity) {
        this.opacity = opacity;
        if (marker != null) {
            marker.setAlpha(opacity);
        }
        update();
    }

    public void setMarkerHue(float markerHue) {
        this.markerHue = markerHue;
        update();
    }

    public void setAnchor(double x, double y) {
        anchorIsSet = true;
        anchorX = (float) x;
        anchorY = (float) y;
        if (marker != null) {
            marker.setAnchor(anchorX, anchorY);
        }
        update();
    }

    public void setCalloutAnchor(double x, double y) {
        calloutAnchorIsSet = true;
        calloutAnchorX = (float) x;
        calloutAnchorY = (float) y;
        if (marker != null) {
            marker.setInfoWindowAnchor(calloutAnchorX, calloutAnchorY);
        }
        update();
    }

    public void setImage(String uri) {
        if (uri == null) {
            iconBitmapDrawable = null;
            update();
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
            iconBitmapDrawable = getBitmapDrawableByName(uri);
            if (iconBitmapDrawable != null) {
                iconBitmap = BitmapFactory.decodeResource(getResources(), getDrawableResourceByName(uri));
            }
            update();
        }
    }

    @Override
    public void addView(View child, int index) {
        super.addView(child, index);
        // if children are added, it means we are rendering a custom marker
        if (!(child instanceof OsmMapCallout)) {
            hasCustomMarkerView = true;
        }
        update();
    }

    @Override
    public Object getFeature() {
        return marker;
    }

    @Override
    public void addToMap(MapView map) {
        marker = new Marker(map);
        defaultInfoWindow = marker.getInfoWindow();
        defaultInfoWindow.getView().setOnTouchListener(OsmMapMarker.this.infoWindowTouched);
        mapView = map;
        fillProperties(marker);
        map.getOverlays().add(marker);
    }

    @Override
    public void removeFromMap(MapView map) {
        if (marker == null) return;
        marker.remove(map);
        cleanup();
    }

    public void cleanup() {
        marker = null;
        mapView = null;
        defaultInfoWindow = null;
        customInfoWindowCache = null;
        defaultBubbleDrawable = null;
    }

    private Drawable getIcon() {
        if (hasCustomMarkerView) {
            // creating a bitmap from an arbitrary view
            if (iconBitmapDrawable != null) {
                Bitmap viewBitmap = getCustomMarkerViewBitmap();
                int width = Math.max(iconBitmap.getWidth(), viewBitmap.getWidth());
                int height = Math.max(iconBitmap.getHeight(), viewBitmap.getHeight());
                Bitmap combinedBitmap = Bitmap.createBitmap(width, height, iconBitmap.getConfig());
                Canvas canvas = new Canvas(combinedBitmap);
                canvas.drawBitmap(iconBitmap, 0, 0, null);
                canvas.drawBitmap(viewBitmap, 0, 0, null);
                return new BitmapDrawable(getResources(), combinedBitmap);
            } else {
                return new BitmapDrawable(getResources(), getCustomMarkerViewBitmap());
            }
        } else if (iconBitmapDrawable != null) {
            // use local image as a marker
            return iconBitmapDrawable;
        } else {
            // render the default marker pin
            // return BitmapDescriptorFactory.defaultMarker(this.markerHue);
            return null;
        }
    }

    private void fillProperties(Marker marker) {
        marker.setPosition(position);
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
        marker.setInfoWindow(getInfoWindow());
        marker.setTitle(title);
        marker.setSnippet(snippet);
        marker.setRotation(rotation);
        marker.setFlat(flat);
        marker.setDraggable(draggable);
        marker.setAlpha(opacity);
        marker.setIcon(getIcon());
    }

    public void update() {
        if (marker == null) {
            return;
        }
        fillProperties(marker);
        mapView.invalidate();
    }

    public void update(int width, int height) {
        this.width = width;
        this.height = height;
        isCustomMarkerViewDirty = true;
        update();
    }

    @Nullable
    private InfoWindow getInfoWindow() {
        InfoWindow customInfoWindow = getCustomInfoWindow();
        if (customInfoWindow != null)
            return customInfoWindow;
        if (title != null || snippet != null)
            return defaultInfoWindow;
        return null;
    }

    private Bitmap getCustomMarkerViewBitmap() {
        if (isCustomMarkerViewDirty || customMarkerViewBitmap == null) {
            customMarkerViewBitmap = createCustomMarkerViewBitmap();
            isCustomMarkerViewDirty = false;
        }
        return customMarkerViewBitmap;
    }

    private Bitmap createCustomMarkerViewBitmap() {
        int width = this.width <= 0 ? 100 : this.width;
        int height = this.height <= 0 ? 100 : this.height;
        this.buildDrawingCache();
        Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);

        Canvas canvas = new Canvas(bitmap);
        this.draw(canvas);

        return bitmap;
    }

    public void setCalloutView(OsmMapCallout view) {
        this.calloutView = view;
    }

    public OsmMapCallout getCalloutView() {
        return calloutView;
    }

    private InfoWindow getCustomInfoWindow() {
        if (calloutView == null) {
            return null;
        }

        if (customInfoWindowCache == null) {
            int layoutID = getResources().getIdentifier("bonuspack_bubble", "layout", getContext().getPackageName());
            customInfoWindowCache = new CustomInfoWindow(layoutID, mapView);
        }

        LinearLayout bubbleView = (LinearLayout) customInfoWindowCache.getView();
        if (defaultBubbleDrawable == null) {
            defaultBubbleDrawable = bubbleView.getBackground();
        }

        boolean showDrawBubble = !calloutView.getTooltip();
        if (showDrawBubble && bubbleView.getBackground() == null) {
            bubbleView.setBackground(defaultBubbleDrawable);
            Rect padding = new Rect();
            if (defaultBubbleDrawable.getPadding(padding)) {
                bubbleView.setPadding(padding.left, padding.top, padding.right, padding.bottom);
            }
        } else if (!showDrawBubble && bubbleView.getBackground() != null) {
            bubbleView.setBackground(null);
            bubbleView.setPadding(0, 0, 0, 0);
        }
        bubbleView.removeAllViews();

        bubbleView.addView(calloutView, new LinearLayout.LayoutParams(
                calloutView.width,
                calloutView.height,
                0f
        ));
        return customInfoWindowCache;
    }

    private int getDrawableResourceByName(String name) {
        return getResources().getIdentifier(
                name,
                "drawable",
                getContext().getPackageName());
    }

    private Drawable getBitmapDrawableByName(String name) {
        return getResources().getDrawable(getDrawableResourceByName(name));
    }

    private void infoWindowPressed(MotionEvent e) {
        if (this.onCalloutPressListener != null) {
            onCalloutPressListener.OnCalloutPress(this);
        }
    }

    OnTouchListener infoWindowTouched = new OnTouchListener() {
        public boolean onTouch(View v, MotionEvent e) {
            if (e.getAction() == ACTION_UP) {
                OsmMapMarker.this.infoWindowPressed(e);
            }
            return true;
        }
    };

    public void setOnCalloutPressListener(OnCalloutPressListener onCalloutPressListener) {
        this.onCalloutPressListener = onCalloutPressListener;
    }

    public OnCalloutPressListener getOnCalloutPressListener() {
        return onCalloutPressListener;
    }

    private class CustomInfoWindow extends InfoWindow {
        public CustomInfoWindow(int resId, MapView mapView) {
            super(resId, mapView);

            this.mView.setOnTouchListener(OsmMapMarker.this.infoWindowTouched);
        }

        @Override
        public void onOpen(Object o) {
            closeAllInfoWindowsOn(this.getMapView());
        }

        @Override
        public void onClose() {
        }
    }

    public abstract static class OnCalloutPressListener {
        public abstract void OnCalloutPress(OsmMapMarker markerView);
    }
}
