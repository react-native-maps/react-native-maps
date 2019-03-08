package com.airbnb.android.react.maps;

import java.net.URL;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Bitmap.Config;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.ColorMatrixColorFilter;
import android.graphics.Rect;
import android.graphics.PorterDuffColorFilter;
import android.graphics.PorterDuff;
import android.graphics.drawable.Animatable;
import android.graphics.drawable.Drawable;
import android.graphics.Typeface;
import android.text.TextUtils;
import android.text.TextPaint;
import android.net.Uri;
import android.view.View;
import android.widget.LinearLayout;
import android.animation.ObjectAnimator;
import android.util.Property;
import android.util.Log;
import android.util.DisplayMetrics;
import android.animation.TypeEvaluator;

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
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.model.BitmapDescriptor;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;

import javax.annotation.Nullable;

public class AirMapMarker extends AirMapFeature {

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

  private AirMapCallout calloutView;
  private View wrappedCalloutView;
  private final Context context;

  private float markerHue = 0.0f; // should be between 0 and 360
  private int markerColor = 0;
  private boolean selected = false;
  private Bitmap innerIcon;
  private int innerIconColor = Color.WHITE;
  private String text;
  private int textColor = Color.WHITE;
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

  private boolean tracksViewChanges = true;
  private boolean tracksViewChangesActive = false;
  private boolean hasViewChanges = true;

  private boolean hasCustomMarkerView = false;

  private int markerWidth;
  private int markerWidthSelected;
  private int markerHeight;
  private int markerHeightSelected;

  private int innerIconWidth;
  private int innerIconWidthSelected;
  private int innerIconHeight;
  private int innerIconHeightSelected;

  private int innerIconYOffset;
  private int innerIconYOffsetSelected;

  private int textYOffset;
  private int textYOffsetSelected;
  
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
                }
              }
            }
          } finally {
            dataSource.close();
            if (imageReference != null) {
              CloseableReference.closeSafely(imageReference);
            }
          }
          update(true);
        }
      };

  private final DraweeHolder<?> logoHolderInnerIcon;
  private DataSource<CloseableReference<CloseableImage>> dataSourceInnerIcon;
  private final ControllerListener<ImageInfo> mLogoControllerListenerInnerIcon =
      new BaseControllerListener<ImageInfo>() {
        @Override
        public void onFinalImageSet(
            String id,
            @Nullable final ImageInfo imageInfo,
            @Nullable Animatable animatable) {
          CloseableReference<CloseableImage> imageReference = null;
          try {
            imageReference = dataSourceInnerIcon.getResult();
            if (imageReference != null) {
              CloseableImage image = imageReference.get();
              if (image != null && image instanceof CloseableStaticBitmap) {
                CloseableStaticBitmap closeableStaticBitmap = (CloseableStaticBitmap) image;
                Bitmap bitmap = closeableStaticBitmap.getUnderlyingBitmap();
                if (bitmap != null) {
                  bitmap = bitmap.copy(Bitmap.Config.ARGB_8888, true);
                  innerIcon = bitmap;
                }
              }
            }
          } finally {
            dataSourceInnerIcon.close();
            if (imageReference != null) {
              CloseableReference.closeSafely(imageReference);
            }
          }
          if (marker != null) {
            marker.setIcon(getIcon());
          }
        }
      };

  private void InitializeAttributes() { 
    this.markerWidth = convertDpToPixel(36, this.context);
    this.markerWidthSelected = convertDpToPixel(66, this.context);
    this.markerHeight = convertDpToPixel(40, this.context);
    this.markerHeightSelected = convertDpToPixel(81, this.context);

    this.innerIconWidth = convertDpToPixel(16, this.context);
    this.innerIconWidthSelected = convertDpToPixel(28, this.context);
    this.innerIconHeight = this.innerIconWidth;
    this.innerIconHeightSelected = this.innerIconWidthSelected;

    this.innerIconYOffset = convertDpToPixel(3, this.context);
    this.innerIconYOffsetSelected = convertDpToPixel(7, this.context);

    this.textYOffset = convertDpToPixel(-2, this.context);
    this.textYOffsetSelected = convertDpToPixel(-7, this.context);
  }

  public AirMapMarker(Context context) {
    super(context);
    this.context = context;

    logoHolder = DraweeHolder.create(createDraweeHierarchy(), context);
    logoHolder.onAttach();

    logoHolderInnerIcon = DraweeHolder.create(createDraweeHierarchy(), context);
    logoHolderInnerIcon.onAttach();
    
    InitializeAttributes();
  }

  public AirMapMarker(Context context, MarkerOptions options) {
    super(context);
    this.context = context;

    logoHolder = DraweeHolder.create(createDraweeHierarchy(), context);
    logoHolder.onAttach();

    logoHolderInnerIcon = DraweeHolder.create(createDraweeHierarchy(), context);
    logoHolderInnerIcon.onAttach();
    
    InitializeAttributes();

    position = options.getPosition();
    setAnchor(options.getAnchorU(), options.getAnchorV());
    setCalloutAnchor(options.getInfoWindowAnchorU(), options.getInfoWindowAnchorV());
    setTitle(options.getTitle());
    setSnippet(options.getSnippet());
    setRotation(options.getRotation());
    setFlat(options.isFlat());
    setDraggable(options.isDraggable());
    setZIndex(Math.round(options.getZIndex()));
    setAlpha(options.getAlpha());
    iconBitmapDescriptor = options.getIcon();
  }

  private GenericDraweeHierarchy createDraweeHierarchy() {
    return new GenericDraweeHierarchyBuilder(getResources())
        .setActualImageScaleType(ScalingUtils.ScaleType.FIT_CENTER)
        .setFadeDuration(0)
        .build();
  }

  public void setCoordinate(ReadableMap coordinate) {
    position = new LatLng(coordinate.getDouble("latitude"), coordinate.getDouble("longitude"));
    if (marker != null) {
      marker.setPosition(position);
    }
    update(false);
  }

  public void setIdentifier(String identifier) {
    this.identifier = identifier;
    update(false);
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
    update(false);
  }

  public void setMarkerColor(int markerColor) {
    this.markerColor = markerColor;
    
    if (marker != null) {
      marker.setIcon(getIcon());
    }
  }

  public void setSelected(boolean selected) {
    this.selected = selected;

    if (marker != null) {
      marker.setIcon(getIcon());
    }
  }

  public void setInnerIcon(String uri) {
    hasViewChanges = true;

    if (uri == null) {
      if (marker != null) {
        marker.setIcon(getIcon());
      }
    } else if (uri.startsWith("http://") || uri.startsWith("https://") ||
        uri.startsWith("file://") || uri.startsWith("asset://")) {
          ImageRequest imageRequest = ImageRequestBuilder
          .newBuilderWithSource(Uri.parse(uri))
          .build();

      ImagePipeline imagePipeline = Fresco.getImagePipeline();
      dataSourceInnerIcon = imagePipeline.fetchDecodedImage(imageRequest, this);
      DraweeController controller = Fresco.newDraweeControllerBuilder()
          .setImageRequest(imageRequest)
          .setControllerListener(mLogoControllerListenerInnerIcon)
          .setOldController(logoHolderInnerIcon.getController())
          .build();
          logoHolderInnerIcon.setController(controller);
    } else {
        int drawableId = getDrawableResourceByName(uri);
        innerIcon = BitmapFactory.decodeResource(getResources(), drawableId);
        if (innerIcon == null) { // VectorDrawable or similar
            Drawable drawable = getResources().getDrawable(drawableId);
            innerIcon = Bitmap.createBitmap(drawable.getIntrinsicWidth(), drawable.getIntrinsicHeight(), Bitmap.Config.ARGB_8888);
            drawable.setBounds(0, 0, drawable.getIntrinsicWidth(), drawable.getIntrinsicHeight());
            Canvas canvas = new Canvas(innerIcon);
            drawable.draw(canvas);
        }
      if (marker != null) {
        marker.setIcon(getIcon());
      }
    }
  }

  public void setInnerIconColor(int innerIconColor) {
    this.innerIconColor = innerIconColor;
    
    if (marker != null) {
      marker.setIcon(getIcon());
    }
  }

  public void setText(String text) {
    this.text = text;

    if (marker != null) {
      marker.setIcon(getIcon());
    }
  }

  public void setTextColor(int textColor) {
    this.textColor = textColor;
    
    if (marker != null) {
      marker.setIcon(getIcon());
    }
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
    this.tracksViewChanges = tracksViewChanges;
    updateTracksViewChanges();
  }

  private void updateTracksViewChanges() {
    boolean shouldTrack = tracksViewChanges && hasCustomMarkerView && marker != null;
    if (shouldTrack == tracksViewChangesActive) return;
    tracksViewChangesActive = shouldTrack;

    if (shouldTrack) {
      ViewChangesTracker.getInstance().addMarker(this);
    } else {
      ViewChangesTracker.getInstance().removeMarker(this);

      // Let it render one more time to avoid race conditions.
      // i.e. Image onLoad ->
      //      ViewChangesTracker may not get a chance to render ->
      //      setState({ tracksViewChanges: false }) ->
      //      image loaded but not rendered.
      updateMarkerIcon();
    }
  }

  public boolean updateCustomForTracking() {
    if (!tracksViewChangesActive)
      return false;

    updateMarkerIcon();

    return true;
  }

  public void updateMarkerIcon() {
    if (!hasViewChanges) return;

    if (!hasCustomMarkerView) {
      // No more updates for this, as it's a simple icon
      hasViewChanges = false;
    }
    if (marker != null) {
      marker.setIcon(getIcon());
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
    hasViewChanges = true;

    if (uri == null) {
      iconBitmapDescriptor = null;
      update(true);
    } else if (uri.startsWith("http://") || uri.startsWith("https://") ||
        uri.startsWith("file://") || uri.startsWith("asset://")) {
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
      update(true);
    }
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
    if (!(child instanceof AirMapCallout)) {
      hasCustomMarkerView = true;
      updateTracksViewChanges();
    }
    update(true);
  }

  @Override
  public void requestLayout() {
    super.requestLayout();

    if (getChildCount() == 0) {
      if (hasCustomMarkerView) {
        hasCustomMarkerView = false;
        clearDrawableCache();
        updateTracksViewChanges();
        update(true);
      }
    }
  }

  @Override
  public Object getFeature() {
    return marker;
  }

  @Override
  public void addToMap(GoogleMap map) {
    marker = map.addMarker(getMarkerOptions());
    updateTracksViewChanges();
  }

  @Override
  public void removeFromMap(GoogleMap map) {
    marker.remove();
    marker = null;
    updateTracksViewChanges();
  }

  private static Bitmap tintImage(Bitmap bitmap, int color) {
    Paint paint = new Paint();
    paint.setColorFilter(new PorterDuffColorFilter(color, PorterDuff.Mode.SRC_IN));
    Bitmap bitmapResult = Bitmap.createBitmap(bitmap.getWidth(), bitmap.getHeight(), Config.ARGB_8888);
    Canvas canvas = new Canvas(bitmapResult);
    canvas.drawBitmap(bitmap, 0, 0, paint);
    return bitmapResult;
  }

  private static int convertDpToPixel(float dp, Context context) {
    return (int) (dp * ((float) context.getResources().getDisplayMetrics().densityDpi / DisplayMetrics.DENSITY_DEFAULT));
  }

  private static void DrawText(Canvas canvas, String text, Context context, int color, int size, int yOffset) {
    Typeface plain = Typeface.create(Typeface.createFromAsset(context.getAssets(), "Macho.otf"), Typeface.NORMAL); 
    
    TextPaint paint = new TextPaint(TextPaint.ANTI_ALIAS_FLAG);
    paint.setTypeface(plain);
    paint.setTextSize(convertDpToPixel(size, context));
    paint.setColor(color);
    
    Rect r = new Rect();
    canvas.getClipBounds(r);

    int cWidth = r.width();
    int cHeight = r.height();

    paint.setTextAlign(Paint.Align.LEFT);
    paint.getTextBounds(text, 0, text.length(), r);
    float x = cWidth / 2f - r.width() / 2f - r.left;
    float y = cHeight / 2f + r.height() / 2f - r.bottom;
    canvas.drawText(text, x, y + yOffset, paint);
  }

  private static void DrawInnerIcon(Canvas canvas, Bitmap innerIcon, Context context, int color, int yOffset) {
    Rect r = new Rect();
    canvas.getClipBounds(r);

    canvas.drawBitmap(tintImage(innerIcon, color), (r.width() - innerIcon.getWidth()) / 2, (r.height() - innerIcon.getHeight()) / 2 - yOffset, null);
  }

  private BitmapDescriptor getIcon() {
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
        return BitmapDescriptorFactory.fromBitmap(combinedBitmap);
      } else {
        return BitmapDescriptorFactory.fromBitmap(createDrawable());
      }
    } else if (iconBitmapDescriptor != null) {
      // use local image as a marker
      return iconBitmapDescriptor;
    } else {
      // render the default Big City marker with color

      Bitmap finalBitmap = Bitmap.createScaledBitmap(tintImage(BitmapFactory.decodeResource(this.context.getResources(), this.selected ? R.drawable.marker_selected : R.drawable.marker), this.markerColor), this.selected ? this.markerWidthSelected : this.markerWidth, this.selected ? this.markerHeightSelected : this.markerHeight, true);
      Canvas canvas = new Canvas(finalBitmap);
      
      
      if (this.innerIcon != null) {
        DrawInnerIcon(canvas, Bitmap.createScaledBitmap(this.innerIcon, this.selected ? this.innerIconWidthSelected : this.innerIconWidth, this.selected ? this.innerIconHeightSelected : this.innerIconHeight, true), this.context, this.innerIconColor, this.selected ? this.innerIconYOffsetSelected : this.innerIconYOffset);
      } else if (!TextUtils.isEmpty(this.text)) {
        DrawText(canvas, this.text, this.context, this.textColor, this.selected ? 22 : 17, this.selected ? this.textYOffsetSelected : this.textYOffset);
      }

      return BitmapDescriptorFactory.fromBitmap(finalBitmap);
    }
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
    options.icon(getIcon());
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

    update(true);
  }

  private Bitmap mLastBitmapCreated = null;

  private void clearDrawableCache() {
    mLastBitmapCreated = null;
  }

  private Bitmap createDrawable() {
    int width = this.width <= 0 ? 100 : this.width;
    int height = this.height <= 0 ? 100 : this.height;
    this.buildDrawingCache();

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

  public void setCalloutView(AirMapCallout view) {
    this.calloutView = view;
  }

  public AirMapCallout getCalloutView() {
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

  private BitmapDescriptor getBitmapDescriptorByName(String name) {
    return BitmapDescriptorFactory.fromResource(getDrawableResourceByName(name));
  }

}
