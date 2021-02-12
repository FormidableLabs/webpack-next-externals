

module.exports = {
  target: "serverless",
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Add more information in the bundle.
      config.output.pathinfo = true;
    }

    // Speed things up.
    config.mode = "development";
    config.devtool = "false";
    config.optimization.minimize = false;
    config.optimization.minimizer = [];

    return config;
  }
};
