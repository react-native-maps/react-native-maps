import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import invariant from 'fbjs/lib/invariant';
import PropTypes from 'prop-types';
import React from 'react';

const LOADING_STATE_NONE = 'NONE';
const LOADING_STATE_BEGIN = 'BEGIN';
const LOADING_STATE_LOADED = 'LOADED';

const getDisplayName = Component => {
  if (typeof Component === 'string') {
    return Component;
  }

  if (!Component) {
    return undefined;
  }

  return Component.displayName || Component.name || 'Component';
};

export function withRemoteStyles(BaseComponent) {
  const factory = React.createFactory(BaseComponent);

  class Container extends React.PureComponent {
    static displayName = `withRemoteStyles(${getDisplayName(BaseComponent)})`;

    static propTypes = {
      loadingElement: PropTypes.node.isRequired,
      url: PropTypes.string.isRequired,
    };

    static defaultProps = {
      loadingElement: <div style={{ height: '100%' }} />,
    };

    state = {
      loadingState: LOADING_STATE_NONE,
    };

    isUnmounted = false;

    handleLoaded = () => {
      if (this.isUnmounted) {
        return;
      }
      this.setState({
        loadingState: LOADING_STATE_LOADED,
      });
    };

    componentWillMount() {
      const { loadingElement, url } = this.props;
      invariant(
        !!loadingElement && !!url,
        'Required props loadingElement or url is missing. You need to provide both of them.'
      );
    }

    componentDidMount() {
      const { loadingState } = this.state;
      if (loadingState !== LOADING_STATE_NONE || !canUseDOM) {
        return;
      }
      this.setState({
        loadingState: LOADING_STATE_BEGIN,
      });
      // Don't load scriptjs as a dependency since we do not want this module be used on server side.
      // eslint-disable-next-line global-require
      const { default: autoLink, onloadCSS } = require('./autoLink');
      const { url } = this.props;
      //   scriptjs(url, this.handleLoaded);

      const ss = autoLink(url, null, null, {
        crossorigin: '',
        integrity:
          'sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ==',
      });
      onloadCSS(ss, this.handleLoaded);
    }

    componentWillUnmount() {
      this.isUnmounted = true;
    }

    render() {
      const {
        loadingElement,
        url, // eslint-disable-line no-unused-vars
        ...restProps
      } = this.props;

      const { loadingState } = this.state;

      if (loadingState === LOADING_STATE_LOADED) {
        return <BaseComponent ref={ref => (this.ref = ref)} {...restProps} />;
      }
      return loadingElement;
    }
  }

  return Container;
}

export default withRemoteStyles;
