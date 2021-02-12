"use strict";

const fs = require("fs").promises;
const path = require("path");
const mockFs = require("mock-fs");
const mockRequire = require('mock-require');
const sinon = require("sinon");

const nextRequire = require("next/dist/next-server/server/require");
const { getPagePath } = nextRequire;
const nextBuild = require("next/dist/build").default;

const PAGES_MAP = {
  "/_app": path.resolve(".next/pages/_app.js")
};

describe("TODO REMOVE", () => {
  let sandbox;

  beforeEach(async () => {
    mockFs({});
    sandbox = sinon.createSandbox();

    sandbox
      .stub(nextRequire, "getPagePath")
      .callsFake((page, distDir, serverless, dev) => {
        const found = PAGES_MAP[page];
        if (found) { return found; }

        return getPagePath(page, distDir, serverless, dev);
      });
  });

  afterEach(() => {
    mockFs.restore();
    sandbox.restore();
    mockRequire.stopAll();
  });

  it("TODO DO A NEXT COMPILE IN MEMORY", async () => {
    mockFs({
      pages: {
        "_app.js": `
          export default function App({ Component, pageProps }) {
            return <Component {...pageProps} />
          }
        `,
        "index.js": `
          export default function Home() {
            return (<h1>HI</h1>);
          }
        `
      },
      ".next": mockFs.load(path.resolve(__dirname, "../.next")),
      "node_modules": mockFs.load(path.resolve(__dirname, "../node_modules"))
    });

    mockRequire(
      path.resolve(".next/server/pages-manifest.json"),
      {
        "/": "pages/index.js",
      }
    );

    const dir = process.cwd();
    await nextBuild(dir);
  });
});
