package com.rnmaps.fabric;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;

public class JSONUtil {
    public static WritableMap convertJsonToWritable(JSONObject jsonObject) throws JSONException {
        WritableMap map = Arguments.createMap();
        Iterator<String> iterator = jsonObject.keys();

        while (iterator.hasNext()) {
            String key = iterator.next();
            Object value = jsonObject.get(key);

            if (value == JSONObject.NULL) {
                map.putNull(key);
            }
            // Check primitive types first
            else if (value instanceof Integer) {
                map.putInt(key, jsonObject.getInt(key));
            }
            else if (value instanceof Long) {
                map.putDouble(key, ((Long) value).doubleValue());
            }
            else if (value instanceof Double) {
                map.putDouble(key, jsonObject.getDouble(key));
            }
            else if (value instanceof Boolean) {
                map.putBoolean(key, jsonObject.getBoolean(key));
            }
            else if (value instanceof String) {
                map.putString(key, jsonObject.getString(key));
            }
            // Check complex types
            else if (value instanceof JSONObject) {
                map.putMap(key, convertJsonToWritable(jsonObject.getJSONObject(key)));
            }
            else if (value instanceof JSONArray) {
                map.putArray(key, convertJsonArrayToWritable(jsonObject.getJSONArray(key)));
            }
        }

        return map;
    }
    public static WritableArray convertJsonArrayToWritable(JSONArray jsonArray) throws JSONException {
        WritableArray array = Arguments.createArray();

        for (int i = 0; i < jsonArray.length(); i++) {
            Object value = jsonArray.get(i);

            if (value == JSONObject.NULL) {
                array.pushNull();
            }
            else if (value instanceof Integer) {
                array.pushInt((Integer) value);
            }
            else if (value instanceof Long) {
                array.pushDouble(((Long) value).doubleValue());
            }
            else if (value instanceof Double) {
                array.pushDouble((Double) value);
            }
            else if (value instanceof Boolean) {
                array.pushBoolean((Boolean) value);
            }
            else if (value instanceof String) {
                array.pushString((String) value);
            }
            else if (value instanceof JSONObject) {
                array.pushMap(convertJsonToWritable((JSONObject) value));
            }
            else if (value instanceof JSONArray) {
                array.pushArray(convertJsonArrayToWritable((JSONArray) value));
            }
        }

        return array;
    }
}
