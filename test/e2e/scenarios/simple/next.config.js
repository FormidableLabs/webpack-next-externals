const { nextExternals } = require("../../../../index");

module.exports = {
  target: "serverless",
  webpack: (config, { isServer }) => {
    // Speed things up by disabling prod stuff we don't cate about.
    config.mode = "development";
    config.devtool = false;
    config.optimization.minimize = false;
    config.optimization.minimizer = [];

    if (isServer) {
      // Add more information in the bundle.
      config.output.pathinfo = true;

      // Add externals wrapper.
      //
      // TODO: Have a process.env variable to switch on / off and stash outputs?
      config.externals = (config.externals || []).concat(
        nextExternals({ config })
      );
    }

    return config;
  }
};
