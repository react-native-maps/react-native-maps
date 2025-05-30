import { withMapsIOS } from './ios';
import withMapsAndroid from './android';
const withMaps = (config, props) => {
    config = withMapsIOS(config, props);
    config = withMapsAndroid(config, props);
    return config;
};
export default withMaps;
