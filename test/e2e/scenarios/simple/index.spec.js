const { nextBuild } = require("../../build");
const { readPages } = require("../../util");
const FIXTURE_DIR = __dirname;

describe("test/fixtures/simple", () => {
  let pages;

  beforeEach(async () => {
    await nextBuild(FIXTURE_DIR);
    pages = await readPages(FIXTURE_DIR);
  });

  it("TODO DO A NEXT COMPILE ON DISK :P", async () => {
    // eslint-disable-next-line no-console
    console.log("TODO HERE", pages);
  });
});
