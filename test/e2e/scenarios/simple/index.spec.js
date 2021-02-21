/* eslint-disable camelcase */
const path = require("path");

const { nextBuild } = require("../../build");
const { readPages } = require("../../util");
const FIXTURE_DIR = __dirname;
const VERSIONS = ["9", "10"];


describe("test/e2e/scenarios/simple", () => {
  VERSIONS.forEach((version) => {
    describe(`Next.js v${version}`, () => {
      const output = path.resolve(__dirname, `../../.builds/simple/${version}`);
      let pages;

      beforeEach(async () => {
        await nextBuild({ version, output })(FIXTURE_DIR);
        pages = await readPages(output);
      });

      it("externalizes package dependencies", async () => {
        // Use index page.
        const page = pages["/"];

        // Baseline. Things that _should_ be in page bundle.
        expect(page)
          .to.have.nested.property("bundled.build")
          .that.deep.eql({
            "./.next/react-loadable-manifest.json": 1,
            "./.next/build-manifest.json": 1,
            "./.next/routes-manifest.json": 1
          });

        expect(page)
          .to.have.nested.property("bundled.sources")
          .that.deep.eql({
            "./pages/_app.js": 1,
            "./styles/global.css": 1,
            "./pages/index.js": 1,
            "./lib/posts.js": 1
          });

        // Requires. Should be _actually_ requiring these.
        // TODO: Refactor when more imports are here.
        expect(page)
          .to.have.nested.property("required")
          .that.includes({
            // Different in Next 9 vs 10
            // "<next/dist/compiled/|>@ampproject/toolbox-optimizer": 1,
            // "iconv-lite": <NUMBER>,
            // "critters": 1, // Added in Next 10

            // Common asserts
            events: 1,
            https: 1,
            querystring: 1,
            zlib: 1,
            http: 1,
            buffer: 1,
            crypto: 1,
            url: 1,
            util: 1,
            os: 1,
            stream: 1,
            fs: 1,
            path: 1,
            string_decoder: 1
          });

        console.log("TODO HERE", JSON.stringify(page, null, 2));
      });
    });
  });
});
