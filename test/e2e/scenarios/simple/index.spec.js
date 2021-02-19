const { nextBuild } = require("../../build");
const { readPages } = require("../../util");
const FIXTURE_DIR = __dirname;
const VERSIONS = ["9", "10"];


describe("test/fixtures/simple", () => {
  VERSIONS.forEach((version) => {
    describe(`Next.js v${version}`, () => {
      let pages;

      // TODO: NEED TO STASH RESULTS
      beforeEach(async () => {
        await nextBuild({ version })(FIXTURE_DIR);
        pages = await readPages(FIXTURE_DIR);
      });

      it("TODO DO A NEXT COMPILE ON DISK :P", async () => {
        // eslint-disable-next-line no-console
        console.log("TODO HERE", pages);
      });
    });
  });
});
