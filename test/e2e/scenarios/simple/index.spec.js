const { nextBuild } = require("../../build");
const { readPages } = require("../../util");

describe("test/fixtures/simple", () => {
  it("TODO DO A NEXT COMPILE ON DISK :P", async () => {
    const dir = __dirname;
    await nextBuild(dir);

    const pages = await readPages(dir);
    // eslint-disable-next-line no-console
    console.log("TODO HERE", pages);
  });
});
