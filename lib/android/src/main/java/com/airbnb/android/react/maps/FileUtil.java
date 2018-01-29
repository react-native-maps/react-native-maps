package com.airbnb.android.react.maps;

import android.content.Context;
import android.net.Uri;
import android.support.annotation.Nullable;

import com.facebook.common.logging.FLog;
import com.facebook.react.common.ReactConstants;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;

public class FileUtil {

  private static final String NAME = "FileUtil";
  private static final String TEMP_FILE_SUFFIX = "temp";

  public static @Nullable InputStream getFileInputStream(
      Context context,
      String fileContentUriStr) {
    try {
      Uri fileContentUri = Uri.parse(fileContentUriStr);

      if (fileContentUri.getScheme().startsWith("http")) {
        return getDownloadFileInputStream(context, fileContentUri);
      }
      return context.getContentResolver().openInputStream(fileContentUri);
    } catch (Exception e) {
      FLog.e(
          ReactConstants.TAG,
          "Could not retrieve file for contentUri " + fileContentUriStr,
          e);
      return null;
    }
  }

  private static InputStream getDownloadFileInputStream(Context context, Uri uri)
      throws IOException {
    final File outputDir = context.getApplicationContext().getCacheDir();
    final File file = File.createTempFile(NAME, TEMP_FILE_SUFFIX, outputDir);
    file.deleteOnExit();

    final URL url = new URL(uri.toString());
    final InputStream is = url.openStream();
    try {
      final ReadableByteChannel channel = Channels.newChannel(is);
      try {
        final FileOutputStream stream = new FileOutputStream(file);
        try {
          stream.getChannel().transferFrom(channel, 0, Long.MAX_VALUE);
          return new FileInputStream(file);
        } finally {
          stream.close();
        }
      } finally {
        channel.close();
      }
    } finally {
      is.close();
    }
  }

}
