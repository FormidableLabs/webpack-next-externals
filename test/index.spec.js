

const path = require("path");
const fs = require("fs").promises;
const nextBuild = require("next/dist/build").default;

// TODO: Move to utilities.
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

// TODO: Move actual tests to the fixtures (or rename to `scenarios` or something?)
describe("TODO REMOVE", () => {
  describe("test/fixtures/simple", () => {
    it("TODO DO A NEXT COMPILE ON DISK :P", async () => {
      const dir = path.resolve("test/fixtures/simple");
      await nextBuild(dir);

      const pages = await readPages(dir);
      console.log("TODO HERE", pages);
    });
  });
});
