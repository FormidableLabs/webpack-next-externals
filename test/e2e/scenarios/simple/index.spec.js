const path = require("path");

const { nextBuild } = require("../../build");
const { readPages } = require("../../util");
const FIXTURE_DIR = __dirname;
const VERSIONS = ["9", "10"];


describe("test/fixtures/simple", () => {
  VERSIONS.forEach((version) => {
    describe(`Next.js v${version}`, () => {
      const output = path.resolve(__dirname, `../../.builds/simple/${version}`);
      let pages;

      beforeEach(async () => {
        await nextBuild({ version, output })(FIXTURE_DIR);
        pages = await readPages(output);
      });

      it("TODO: ADD SCENARIO TESTS", async () => {
        // eslint-disable-next-line no-console
        console.log("TODO HERE", pages);
      });
    });
  });
});
