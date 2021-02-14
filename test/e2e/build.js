
const _nextBuild = require("next/dist/build").default;

const nextBuild = (...args) => {
  if (process.env.NO_BUILD === "true") { return Promise.resolve(); }
  return _nextBuild(...args);
};

module.exports = {
  nextBuild
};
