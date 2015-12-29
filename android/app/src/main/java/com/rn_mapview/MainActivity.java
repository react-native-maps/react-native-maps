package com.rn_mapview;

import android.app.Activity;
import android.os.Bundle;
import android.view.KeyEvent;

import com.facebook.react.LifecycleState;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.react.shell.MainReactPackage;

import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.GoogleApiClient.ConnectionCallbacks;
import com.google.android.gms.common.api.GoogleApiClient.OnConnectionFailedListener;

public class MainActivity
        extends Activity
        implements DefaultHardwareBackBtnHandler {

    private ReactInstanceManager reactInstanceManager;
    private ReactRootView reactRootView;
    private GoogleApiClient mGoogleApiClient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        reactRootView = new ReactRootView(this);

        reactInstanceManager = ReactInstanceManager.builder()
                .setApplication(getApplication())
                .setBundleAssetName("index.android.bundle")
                .setJSMainModuleName("index.android")
                .addPackage(new MainReactPackage())
                .addPackage(new AirPackage())
                .setUseDeveloperSupport(BuildConfig.DEBUG)
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .build();

        reactRootView.startReactApplication(reactInstanceManager, "rn_mapview", null);

        // Create a GoogleApiClient instance
//        mGoogleApiClient = new GoogleApiClient.Builder(this)
//                .addApi(Drive.API)
//                .addScope(Drive.SCOPE_FILE)
//                .addConnectionCallbacks(this)
//                .addOnConnectionFailedListener(this)
//                .build();

        setContentView(reactRootView);
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_MENU && reactInstanceManager != null) {
            reactInstanceManager.showDevOptionsDialog();
            return true;
        }
        return super.onKeyUp(keyCode, event);
    }

    @Override
    public void onBackPressed() {
      if (reactInstanceManager != null) {
        reactInstanceManager.onBackPressed();
      } else {
        super.onBackPressed();
      }
    }

    @Override
    public void invokeDefaultOnBackPressed() {
      super.onBackPressed();
    }

    @Override
    protected void onPause() {
        super.onPause();

        if (reactInstanceManager != null) {
            reactInstanceManager.onPause();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (reactInstanceManager != null) {
            reactInstanceManager.onResume(this, this);
        }
    }

//    @Override
//    public void onConnected(Bundle connectionHint) {
//        // Connected to Google Play services!
//        // The good stuff goes here.
//    }
//
//    @Override
//    public void onConnectionSuspended(int cause) {
//        // The connection has been interrupted.
//        // Disable any UI components that depend on Google APIs
//        // until onConnected() is called.
//    }
//
//    @Override
//    public void onConnectionFailed(ConnectionResult result) {
//        // This callback is important for handling errors that
//        // may occur while attempting to connect with Google.
//        //
//        // More about this in the 'Handle Connection Failures' section.
//
//    }
}
