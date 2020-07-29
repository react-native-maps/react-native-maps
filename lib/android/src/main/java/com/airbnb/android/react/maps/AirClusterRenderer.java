package com.airbnb.android.react.maps;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.target.CustomTarget;
import com.bumptech.glide.request.transition.Transition;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.model.BitmapDescriptor;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.maps.android.clustering.ClusterManager;
import com.google.maps.android.clustering.view.DefaultClusterRenderer;

public class AirClusterRenderer extends DefaultClusterRenderer<AirMapClusterItem> {
  private Context context;

  public AirClusterRenderer(Context context, GoogleMap map, ClusterManager<AirMapClusterItem> clusterManager) {
    super(context, map, clusterManager);
    this.context = context;
  }

  @Override
  protected void onBeforeClusterItemRendered(AirMapClusterItem item, MarkerOptions markerOptions) {
    BitmapDescriptor prevIconDescriptor = item.getIconDescriptor();

    if (prevIconDescriptor == null) {
      markerOptions.visible(false);
    }
  }

  @Override
  protected void onClusterItemRendered(final AirMapClusterItem clusterItem, final Marker marker) {
    BitmapDescriptor prevIconDescriptor = clusterItem.getIconDescriptor();
    String iconUrl = clusterItem.getImageUrl();

    if (prevIconDescriptor != null) {
      marker.setIcon(prevIconDescriptor);
    } else if (iconUrl != null) {
      Glide.with(context)
          .asBitmap()
          .load(iconUrl)
          .into(new CustomTarget<Bitmap>() {
            @Override
            public void onResourceReady(@NonNull Bitmap resource, @Nullable Transition<? super Bitmap> transition) {
              marker.setVisible(true);
              int newWidth = clusterItem.getIconWidth();
              int width = resource.getWidth();
              int height = resource.getHeight();
              float ratio = (float) newWidth / (float) width;
              float newHeight = height * ratio;

              clusterItem.setIconDescriptor(Bitmap.createScaledBitmap(resource, newWidth, (int) newHeight, false));
              marker.setIcon(clusterItem.getIconDescriptor());
            }

            @Override
            public void onLoadCleared(@Nullable Drawable placeholder) {

            }
          });
    }
  }
}
