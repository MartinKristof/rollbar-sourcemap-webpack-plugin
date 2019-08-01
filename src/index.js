/* eslint-disable no-restricted-syntax,global-require */
const RollbarSourceMapPlugin = require('./RollbarSourceMapPlugin');

export const withRollbar = (nextConfig = {}) => Object.assign({}, nextConfig, {
  webpack(config, options) {
    if (!options.defaultLoaders) {
      throw new Error('This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade');
    }

    const { dev, buildId, isServer } = options;
    const customConfig = config;

    if (!dev && !isServer) {
      const { accessToken, publicPath } = nextConfig;
      customConfig.output.futureEmitAssets = false;

      const rollbarPlugin = new RollbarSourceMapPlugin({
        accessToken,
        version: buildId,
        publicPath,
        buildId,
        nextJs: true,
      });
      customConfig.plugins.push(rollbarPlugin);
    }

    if (typeof nextConfig.webpack === 'function') {
      return nextConfig.webpack(customConfig, options);
    }

    return customConfig;
  }
});

export default RollbarSourceMapPlugin;
