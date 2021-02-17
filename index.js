"use strict";

// Convert all `node_modules` dependencies to real `require()`s and don't add
// to bundle.
//
// Modeled after: https://github.com/liady/webpack-node-externals
// See: https://webpack.js.org/configuration/externals/#function
const nextExternals = ({ config }) => {
  // TODO: HERE -- We care about these in terms of things to ignore.
  // eslint-disable-next-line no-console
  console.log("TODO HERE CONFIG", {
    resolve: {
      alias: config.resolve.alias
    },
    resolveLoader: {
      alias: config.resolveLoader.alias
    }
  });

  // TODO: Back to fn return?
  // TODO: Add unit tests for the different function signatures in webpack5 vs. webpack4.
  return (...args) => {
    // Handle all versions of webpack externals function signature.
    const isWebpack5 = !!(args[0] && args[0].context && args[0].request);
    const context = isWebpack5 ? args[0].context : args[0];
    const request = isWebpack5 ? args[0].request : args[1];
    const callback = args[isWebpack5 ? 3 : 2];

    console.log("TODO HERE REQUEST", {
      isWebpack5,
      context,
      request
    });

    callback();
  };
};

module.exports = {
  nextExternals
};
