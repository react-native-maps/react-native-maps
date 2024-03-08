import { TurboModule, RNOHError } from 'rnoh/ts';
import { MapsTurboManager } from '../MapsTurboManager';
import { Camera, LatLng, Point, Region, TAG } from '../sharedTypes';

export class AIRMapMarkerManager extends TurboModule {

  /**
   * Shows the callout for this marker
   */
  public showCallout(){
    MapsTurboManager.getInstance().showCallout();
  }

  /**
   * Hides the callout for this marker
   */
  public hideCallout(){
    MapsTurboManager.getInstance().hideCallout();
  }

  /**
   * Causes a redraw of the marker's callout. Useful for Google Maps on iOS. Note: iOS only.
   */
  public redrawCallout(){
    //todo 华为地图不支持
  }

  /**
   * Animates marker movement. Note: Android only
   */
  public animateMarkerToCoordinate(coordinate: LatLng, duration: number){
    //todo 华为地图不支持
  }

  /**
   * Causes a redraw of the marker. Useful when there are updates to the marker and tracksViewChanges comes with a cost that is too high.
   */
  public redraw(){
    //todo 华为地图不支持
  }
}
