package com.rnmaps.maps;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.UIManager;
import com.facebook.react.fabric.FabricUIManager;
import com.facebook.react.fabric.interop.UIBlockViewResolver;
import com.facebook.react.uimanager.common.UIManagerType;
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.UIManagerModule;

import java.util.function.Function;

public class MapUIBlock implements UIBlockInterface {
    private int tag;
    private Promise promise;
    private ReactApplicationContext context;
    private Function<MapView, Void> mapOperation;

    public MapUIBlock(int tag, Promise promise, ReactApplicationContext context, Function<MapView, Void> mapOperation) {
        this.tag = tag;
        this.promise = promise;
        this.context = context;
        this.mapOperation = mapOperation;
    }

    @Override
    public void execute(NativeViewHierarchyManager nvhm) {
        executeImpl(nvhm, null);
    }

    @Override
    public void execute(UIBlockViewResolver uiBlockViewResolver) {
        executeImpl(null, uiBlockViewResolver);
    }

    private void executeImpl(NativeViewHierarchyManager nvhm, UIBlockViewResolver uiBlockViewResolver) {
        MapView view = uiBlockViewResolver != null ? (MapView) uiBlockViewResolver.resolveView(tag) : (MapView) nvhm.resolveView(tag);
        if (view == null) {
            promise.reject("AirMapView not found");
            return;
        }
        if (view.map == null) {
            promise.reject("AirMapView.map is not valid");
            return;
        }

        mapOperation.apply(view);
    }

    public void addToUIManager() {
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            UIManager uiManager = UIManagerHelper.getUIManager(context, UIManagerType.FABRIC);
            ((FabricUIManager) uiManager).addUIBlock(this);
        } else {
            UIManagerModule uiManager = context.getNativeModule(UIManagerModule.class);
            uiManager.addUIBlock(this);
        }
    }
}

interface UIBlockInterface extends UIBlock, com.facebook.react.fabric.interop.UIBlock  {}
