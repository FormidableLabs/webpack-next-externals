const path = require("path");
const fs = require("fs").promises;

const { getPackageFromParts } = require("../../lib/package");
const { toPosix } = require("../../lib/path");

// Traverse absolute paths to get ultimate package.
const getPackageFromPath = (filePath = "") => {
  const parts = toPosix(path.normalize(filePath)).split("/");
  const nodeModulesIdx = parts.lastIndexOf("node_modules");
  if (nodeModulesIdx === -1) { return null; }

  return getPackageFromParts(parts.slice(nodeModulesIdx + 1));
};

const getBundled = (page) => {
  const webpack = {};
  const externals = {};
  const packages = {};
  const build = {};
  const sources = {};

  (page.match(/ {2}\!\*\*\* .* \*\*\*\!/gm) || [])
    .map((line) => line.replace(/( {2}\!\*\*\* | \*\*\*\!)/g, ""))
    .forEach((info) => {
      let key;

      if (info.startsWith("(webpack)")) {
        key = info.replace("(webpack)", "");
        webpack[key] = (webpack[key] || 0) + 1;
        return;
      }

      if (info.startsWith("external ")) {
        key = info
          .replace("external ", "")
          .replace(/^["']|["']$/g, "");
        externals[key] = (externals[key] || 0) + 1;
        return;
      }

      const pkgName = getPackageFromPath(info);
      if (pkgName) {
        packages[pkgName] = (packages[pkgName] || 0) + 1;
        return;
      }

      if ((/\.[\/|\\]\.next/).test(info)) {
        build[info] = (build[info] || 0) + 1;
        return;
      }

      // Everything else should be an application source
      sources[info] = (sources[info] || 0) + 1;
    });

  return {
    externals,
    packages,
    build,
    sources
  };
};

const getRequired = (page) => {
  const required = {};

  (page.match(/require\([^\)]+\)/gm) || [])
    .map((line) => line.replace(/(^require\(['"]|['"]\)$)/g, ""))
    .forEach((dep) => {
      required[dep] = (required[dep] || 0) + 1;
    });

  return required;
};

// Read pages data into the form we'll assert against.
const readPages = async (dir) => {
  const pagesManifest = JSON.parse((await fs.readFile(
    path.resolve(dir, ".next/serverless/pages-manifest.json"))).toString());

  const pages = await Promise
    .all(Object
      .entries(pagesManifest)
      .map(([route, page]) => fs
        .readFile(path.resolve(dir, `.next/serverless/${page}`))
        .then((buf) => [route, buf.toString()])
      )
    )
    .then((datas) => datas
      .reduce((memo, [route, page]) => Object.assign(memo, {
        [route]: {
          bundled: getBundled(page),
          required: getRequired(page)
        }
      }), {})
    );

  return pages;
};

module.exports = {
  readPages
};
