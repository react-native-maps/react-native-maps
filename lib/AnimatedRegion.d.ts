import { Animated } from 'react-native';
import { Region } from './sharedTypes';
declare const AnimatedWithChildren: any;
type Props = Partial<Region> | undefined;
export default class AnimatedMapRegion extends AnimatedWithChildren {
    constructor(valueIn?: Props);
    setValue(value: Region): void;
    setOffset(offset: Region): void;
    flattenOffset(): void;
    private __getValue;
    private __attach;
    private __detach;
    stopAnimation(callback: (region: Region) => void): void;
    addListener(callback: (region: Region) => void): string;
    removeListener(id: string): void;
    spring(config: Animated.SpringAnimationConfig & Region): Animated.CompositeAnimation;
    timing(config: Animated.TimingAnimationConfig & Region): Animated.CompositeAnimation;
}
export {};
