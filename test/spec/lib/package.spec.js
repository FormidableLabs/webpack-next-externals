

const { normalize } = require("path");

const { getPackageName } = require("../../../lib/package");

describe("lib/package", () => {
  describe("#getPackageName", () => {
    it("handles base cases", async () => {
      expect(getPackageName()).to.eql(null);
      expect(getPackageName("")).to.eql(null);
      expect(getPackageName(process.cwd())).to.eql(null);
    });

    it("handles application source paths", () => {
      expect(getPackageName("./src/lib/foo.js")).to.eql(null);
      expect(getPackageName("/ABS/PATH/src/lib/foo.js")).to.eql(null);
    });

    it("handles normal package paths", () => {
      expect(getPackageName("./node_modules/foo/index.js")).to.eql("foo");

      expect(getPackageName(
        "/ABS/PATH/node_modules/one/node_modules/two/more/index.js"
      )).to.eql("two");

      expect(getPackageName(
        "D:\\a\\WIN\\PATH\\node_modules\\three\\more\\index.js"
      )).to.eql("three");
    });

    // TODO: ENABLE
    it.skip("handles scoped package paths", () => {
      expect(getPackageName("./node_modules/@scope")).to.eql(null);

      expect(getPackageName("./node_modules/@scope/foo/index.js")).to.eql({
        name: "@scope/foo",
        file: normalize("@scope/foo/index.js")
      });

      expect(getPackageName(
        "/PATH/node_modules/one/node_modules/@scope/two/more/index.js"
      )).to.eql({
        name: "@scope/two",
        file: normalize("@scope/two/more/index.js")
      });


      expect(getPackageName(
        "D:\\a\\WIN\\PATH\\node_modules\\@scope\\three\\more\\index.js"
      )).to.eql({
        name: "@scope/three",
        file: normalize("@scope/three/more/index.js")
      });

      expect(getPackageName(
        "/PATH/node_modules/@scope/one/node_modules/four/more/index.js"
      )).to.eql({
        name: "four",
        file: normalize("four/more/index.js")
      });
    });
  });
});
