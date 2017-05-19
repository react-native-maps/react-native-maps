package com.airbnb.android.react.maps;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Rect;
import android.graphics.drawable.Drawable;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.RelativeLayout;
import android.widget.TextView;

/**
 * Created by Eric Kim on 2017-05-08.
 */

public class ClusterMarkerIconGenerator {
    private final Context mContext;

    private RelativeLayout mContainer;
    private TextView mTextView;

    /**
     * Creates a new IconGenerator with the default style.
     */
    public ClusterMarkerIconGenerator(Context context) {
        mContext = context;
        mContainer = (RelativeLayout) LayoutInflater.from(mContext).inflate(R.layout.evo_text_bubble, null);
        mTextView = (TextView) mContainer.findViewById(R.id.evo_text);
    }

    public Bitmap makeIcon(CharSequence text) {
        if (mTextView != null) {
            mTextView.setText(text);
        }

        return makeIcon();
    }

    public Bitmap makeIcon() {
        int measureSpec = View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED);
        mContainer.measure(measureSpec, measureSpec);

        int measuredWidth = mContainer.getMeasuredWidth();
        int measuredHeight = mContainer.getMeasuredHeight();

        mContainer.layout(0, 0, measuredWidth, measuredHeight);

        Bitmap r = Bitmap.createBitmap(measuredWidth, measuredHeight, Bitmap.Config.ARGB_8888);
        r.eraseColor(Color.TRANSPARENT);

        Canvas canvas = new Canvas(r);

        mContainer.draw(canvas);
        return r;
    }
}
