package com.rn_mapview;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.view.View;
import android.widget.LinearLayout;

import com.facebook.react.bridge.ReadableMap;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.model.BitmapDescriptor;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;

public class AirMapMarker extends AirMapFeature {

    private MarkerOptions markerOptions;
    private Marker marker;
    private int width;
    private int height;

    private LatLng position;
    private String title;
    private String snippet;

    private boolean anchorIsSet;
    private float anchorX;
    private float anchorY;

    private AirMapCallout calloutView;
    private View wrappedCalloutView;
    private Context context;

    private float markerHue = 0.0f; // should be between 0 and 360
    private Integer iconResourceId;

    private float rotation = 0.0f;
    private boolean flat = false;

    private float calloutAnchorX;
    private float calloutAnchorY;
    private boolean calloutAnchorIsSet;

    private boolean hasCustomMarkerView = false;

    public AirMapMarker(Context context) {
        super(context);
        this.context = context;
    }

    public void setCoordinate(ReadableMap coordinate) {
        position = new LatLng(coordinate.getDouble("latitude"), coordinate.getDouble("longitude"));
        if (marker != null) {
            marker.setPosition(position);
        }
    }

    public void setTitle(String title) {
        this.title = title;
        if (marker != null) {
            marker.setTitle(title);
        }
    }

    public void setSnippet(String snippet) {
        this.snippet = snippet;
        if (marker != null) {
            marker.setSnippet(snippet);
        }
    }

    public void setRotation(float rotation) {
        this.rotation = rotation;
        if (marker != null) {
            marker.setRotation(rotation);
        }
    }

    public void setFlat(boolean flat) {
        this.flat = flat;
        if (marker != null) {
            marker.setFlat(flat);
        }
    }

    public void setMarkerHue(float markerHue) {
        this.markerHue = markerHue;
        update();
    }

    public void setAnchor(double x, double y) {
        anchorIsSet = true;
        anchorX = (float)x;
        anchorY = (float)y;
        if (marker != null) {
            marker.setAnchor(anchorX, anchorY);
        }
    }

    public void setCalloutAnchor(double x, double y) {
        calloutAnchorIsSet = true;
        calloutAnchorX = (float)x;
        calloutAnchorY = (float)y;
        if (marker != null) {
            marker.setInfoWindowAnchor(calloutAnchorX, calloutAnchorY);
        }
    }

    public void setImage(ReadableMap image) {
        String name = image.getString("uri");
        name = name.toLowerCase().replace("-", "_");
        iconResourceId = context.getResources().getIdentifier(
                name,
                "drawable",
                context.getPackageName());
        update();
    }

    public MarkerOptions getMarkerOptions() {
        if (markerOptions == null) {
            markerOptions = createMarkerOptions();
        }
        return markerOptions;
    }

    @Override
    public void addView(View child, int index) {
        super.addView(child, index);
        // if children are added, it means we are rendering a custom marker
        hasCustomMarkerView = true;
        update();
    }

    @Override
    public Object getFeature() {
        return marker;
    }

    @Override
    public void addToMap(GoogleMap map) {
        marker = map.addMarker(getMarkerOptions());
    }

    @Override
    public void removeFromMap(GoogleMap map) {
        marker.remove();
    }

    private BitmapDescriptor getIcon() {
        if (hasCustomMarkerView) {
            // creating a bitmap from an arbitrary view
            return BitmapDescriptorFactory.fromBitmap(createDrawable());
        } else if (iconResourceId != null) {
            // use local image as a marker
            return BitmapDescriptorFactory.fromResource(iconResourceId);
        } else {
            // render the default marker pin
            return BitmapDescriptorFactory.defaultMarker(this.markerHue);
        }
    }

    private MarkerOptions createMarkerOptions() {
        MarkerOptions options = new MarkerOptions().position(position);
        if (anchorIsSet) options.anchor(anchorX, anchorY);
        if (calloutAnchorIsSet) options.anchor(calloutAnchorX, calloutAnchorY);
        options.title(title);
        options.snippet(snippet);
        options.rotation(rotation);
        options.flat(flat);
        options.icon(getIcon());
        return options;
    }

    public void update() {
        if (marker == null) {
            return;
        }

        marker.setIcon(getIcon());
    }

    public void update(int width, int height) {
        this.width = width;
        this.height = height;
        update();
    }

    private Bitmap createDrawable() {
        int width = this.width <= 0 ? 100 : this.width;
        int height = this.height <= 0 ? 100 : this.height;
        this.buildDrawingCache();
        Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);

        Canvas canvas = new Canvas(bitmap);
        this.draw(canvas);

        return bitmap;
    }

    public void setCalloutView(AirMapCallout view) {
        hasCustomMarkerView = view != null;
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
        LL.setLayoutParams(new LayoutParams(
                LayoutParams.WRAP_CONTENT,
                LayoutParams.WRAP_CONTENT
        ));


        LinearLayout LL2 = new LinearLayout(context);
        LL2.setOrientation(LinearLayout.HORIZONTAL);
        LL2.setLayoutParams(new LayoutParams(
                LayoutParams.WRAP_CONTENT,
                LayoutParams.WRAP_CONTENT
        ));


        View child = this.calloutView.getChildAt(0);
        this.calloutView.removeView(child);

        LL.addView(LL2);
        LL2.addView(child);

        this.wrappedCalloutView = LL;
    }
}
