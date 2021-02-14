const path = require("path");
const fs = require("fs").promises;

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
          bundled: (page.match(/ {2}\!\*\*\* .* \*\*\*\!/gm) || [])
            .map((line) => line.replace(/( {2}\!\*\*\* | \*\*\*\!)/g, "")),
          required: (page.match(/require\([^\)]+\)/gm) || [])
            .map((line) => line.replace(/(^require\(['"]|['"]\)$)/g, ""))
        }
      }), {})
    );

  return pages;
};

module.exports = {
  readPages
};
