import {RNPackage, TurboModulesFactory} from 'rnoh/ts';
import type {TurboModule, TurboModuleContext} from 'rnoh/ts';
import { TAG } from './sharedTypes';
import { AIRMapManager } from './AIRMaps/AIRMapManager';
import { AIRMapMarkerManager } from './AIRMaps/AIRMapMarkerManager';

const REACT_CLASS_AIRMAP_MANAGER = 'AIRMapManager';
const REACT_CLASS_AIRMAP_MARKER_MANAGER = 'AIRMapMarkerManager';

class MapsTurboModulesFactory extends TurboModulesFactory {
  createTurboModule(name: string): TurboModule | null {
    console.log(TAG, '初始化 MapsTurboModulesFactory.createTurboModule=' + name)
    if (name === REACT_CLASS_AIRMAP_MANAGER) {
      return new AIRMapManager(this.ctx);
    }else if(name === REACT_CLASS_AIRMAP_MARKER_MANAGER){
      return new AIRMapMarkerManager(this.ctx);
    }
    return null;
  }

  hasTurboModule(name: string): boolean {
    return name === REACT_CLASS_AIRMAP_MANAGER || name === REACT_CLASS_AIRMAP_MARKER_MANAGER;
  }
}

export class MapsPackage extends RNPackage {
  createTurboModulesFactory(ctx: TurboModuleContext): TurboModulesFactory {
    return new MapsTurboModulesFactory(ctx);
  }
}
