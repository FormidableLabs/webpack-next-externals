const path = require("path");

const fs = require("fs-extra");
const sinon = require("sinon");

const next09 = require("next09");
const next10 = require("next10");

const ORIG_ISTTY = process.stdout.isTTY;

const NEXTS = {
  "9": next09,
  "10": next10
};

/**
 * Invoke the Next.js build process.
 *
 * Steps:
 * 1. Clean existing `.next` directory.
 * 2. Run Next.js build.
 * 3. Copy `.next` build directory to outputs location.
 *
 * @param {Object}  opts                - Options
 * @param {string}  opts.version        - Next.js version to use
 * @param {string}  opts.output         - Output directory to copy to
 * @param {boolean} [opts.silent=true]  - Silence console output
 * @returns {void}
 *
 * Note: If `silent: true` is passed, we silence console.* methods. If you
 * want to log out information during the build (e.g., while developing the
 * plugin in this repo) use `process.stdout|stderr.write()`, etc.
 */
const nextBuild = ({ version, output, silent = true } = {}) => async (...args) => {
  if (process.env.NO_BUILD === "true") { return; }
  if (!NEXTS[version]) {
    throw new Error(`Could not find Next.js version: ${version}`);
  }

  // Clean out build and output directories.
  const dir = args[0];
  if (!dir) {
    throw new Error("No Next.js build directory specified");
  }
  const buildDir = path.resolve(dir);

  if (!output) {
    throw new Error("No output directory specified");
  }
  const outputDir = path.resolve(output);

  // TODO: CLEAN
  await Promise.all([
    fs.remove(path.resolve(buildDir, ".next")),
    fs.remove(outputDir)
  ]);

  // Build.
  let sandbox;
  if (silent) {
    sandbox = sinon.createSandbox();
    sandbox.stub(console);
    process.stdout.isTTY = false;
  }

  let err;
  await NEXTS[version].build(...args)
    .catch((e) => { err = e; })
    .then(() => {
      if (silent) {
        if (sandbox) {
          sandbox.restore();
        }
        process.stdout.isTTY = ORIG_ISTTY;
      }

      if (err) { // eslint-disable-line promise/always-return
        throw err;
      }
    });

  // Copy build output.
  await fs.copy(
    path.resolve(buildDir, ".next"),
    path.resolve(outputDir, ".next")
  );
};

module.exports = {
  nextBuild
};
