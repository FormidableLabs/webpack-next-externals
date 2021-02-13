

module.exports = {
  target: "serverless",
  webpack: (config, { isServer }) => {
    // Speed things up by disabling prod stuff we don't cate about.
    config.mode = "development";
    config.devtool = "false";
    config.optimization.minimize = false;
    config.optimization.minimizer = [];

    if (isServer) {
      // Add more information in the bundle.
      config.output.pathinfo = true;

      // TODO: HERE -- We care about these in terms of things to ignore.
      console.log("TODO HERE CONFIG", {
        resolve: {
          alias: config.resolve.alias
        },
        resolveLoader: {
          alias: config.resolveLoader.alias
        }
      });
    }

    return config;
  }
};
