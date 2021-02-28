"use strict";

const { toPosix } = require("./lib/path");
const { getPackageFromParts } = require("./lib/package");


// Convert all `node_modules` dependencies to real `require()`s and don't add
// to bundle.
//
// Modeled after: https://github.com/liady/webpack-node-externals
// See: https://webpack.js.org/configuration/externals/#function
const nextExternals = ({ config }) => {
  const resolveAliases = Object.keys((config.resolve || {}).alias || {});
  const resolveLoaderAliases = Object.keys((config.resolveLoader || {}).alias || {});
  // TODO: HERE -- We care about these in terms of things to ignore.
  process.stdout.write(`TODO HERE CONFIG ${JSON.stringify({
    resolveAliases,
    resolveLoaderAliases
  }, null, 2)}\n`);

  return (...args) => {
    // TODO: Add unit tests for the different function signatures in webpack5 vs. webpack4.
    // Handle all versions of webpack externals function signature.
    const isWebpack5 = !!(args[0] && args[0].context && args[0].request);
    const context = isWebpack5 ? args[0].context : args[0];
    const request = isWebpack5 ? args[0].request : args[1];
    const callback = args[isWebpack5 ? 3 : 2];

    // TODO: resolve.alias - handle `$`
    // TODO: resolveLoader.alias - handle `$`

    // If resolve.alias has a match, ignore because webpack is handling
    // resolution.
    // TODO: TICKET - DO THE RESOLUTION MANUALLY?
    //
    // TODO: HERE -- Require `/`, `?`, other things?
    if (resolveAliases.some((key) => request.startsWith(key))) {
      process.stdout.write(`TODO HERE resolveAliases ${JSON.stringify({
        request
      }, null, 2)}\n`);
      return void callback();
    }

    // If resolve.alias has a match, ignore because a loader is doing things
    // in webpack.
    // TODO: TICKET - DO THE RESOLUTION MANUALLY?
    //
    // TODO: HERE -- Require `/`, `?`, other things?
    if (resolveLoaderAliases.some((key) => request.startsWith(key))) {
      process.stdout.write(`TODO HERE resolveLoaderAliases ${JSON.stringify({
        request
      }, null, 2)}\n`);
      return void callback();
    }


    // Infer if request is a package and externalize.
    const pkg = getPackageFromParts(toPosix(request).split("/"));
    if (pkg) {
      return void callback(null, `commonjs ${request}`);
    }

    callback();
  };
};

module.exports = {
  nextExternals
};
