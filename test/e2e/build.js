
const { build } = require("next09");

const nextBuild = (...args) => {
  if (process.env.NO_BUILD === "true") { return Promise.resolve(); }
  return build(...args);
};

module.exports = {
  nextBuild
};
