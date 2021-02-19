const sinon = require("sinon");

const next09 = require("next09");
const next10 = require("next10");

const ORIG_ISTTY = process.stdout.isTTY;

const NEXTS = {
  "9": next09,
  "10": next10
};

const nextBuild = ({ version, silent = true } = {}) => (...args) => {
  if (process.env.NO_BUILD === "true") { return Promise.resolve(); }
  if (!NEXTS[version]) {
    throw new Error(`Could not find Next.js version: ${version}`);
  }


  let sandbox;
  if (silent) {
    sandbox = sinon.createSandbox();
    sandbox.stub(console);
    process.stdout.isTTY = false;
  }

  let err;
  return NEXTS[version].build(...args)
    .catch((e) => { err = e; })
    .then((result) => {
      if (silent) {
        if (sandbox) {
          sandbox.restore();
        }
        process.stdout.isTTY = ORIG_ISTTY;
      }

      if (err) {
        throw err;
      }

      return result;
    });
};

module.exports = {
  nextBuild
};
