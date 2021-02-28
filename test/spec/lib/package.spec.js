const { getPackageFromParts } = require("../../../lib/package");

describe("lib/package", () => {
  describe("#getPackageFromParts", () => {
    it("handles base cases", async () => {
      expect(getPackageFromParts()).to.eql(null);
      expect(getPackageFromParts([])).to.eql(null);
      expect(getPackageFromParts([""])).to.eql(null);
      expect(getPackageFromParts([".", "relative"])).to.eql(null);
      expect(getPackageFromParts(["_", "also", "disallowed"])).to.eql(null);
      expect(getPackageFromParts(["@only-scope"])).to.eql(null);
    });

    it("handles application source paths", () => {
      expect(getPackageFromParts("./src/lib/foo.js".split("/"))).to.eql(null);
      expect(getPackageFromParts("/ABS/PATH/src/lib/foo.js".split("/"))).to.eql(null);
    });

    it("handles normal package paths", () => {
      expect(getPackageFromParts("foo/index.js".split("/"))).to.eql("foo");
      expect(getPackageFromParts("two/more/index.js".split("/"))).to.eql("two");
    });

    it("handles scoped package paths", () => {
      expect(getPackageFromParts("@scope".split("/"))).to.eql(null);
      expect(getPackageFromParts("@scope/foo/index.js".split("/"))).to.eql("@scope/foo");
      expect(getPackageFromParts("@scope/two/more/index.js".split("/"))).to.eql("@scope/two");
    });
  });
});
