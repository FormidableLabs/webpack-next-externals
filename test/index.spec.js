

const path = require("path");
const nextBuild = require("next/dist/build").default;

describe("TODO REMOVE", () => {
  describe("test/fixtures/simple", () => {
    it("TODO DO A NEXT COMPILE ON DISK :P", async () => {
      const dir = path.resolve("test/fixtures/simple");
      await nextBuild(dir);
    });
  });
});
