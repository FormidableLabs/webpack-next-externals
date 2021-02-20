"use strict";

const path = require("path");

/**
 * Helpers for dealing with packages.
 */

// Simple conversion to produce Linux/Mac style forward slash-based paths.
const toPosix = (file) => !file ? file : file.replace(/\\/g, "/");

// Extract top-level package name.
//
// E.g., `backend/node_modules/pkg1/node_modules/pkg2/index.js` => "pkg2"
const getPackageName = (filePath = "") => {
  const parts = toPosix(path.normalize(filePath)).split("/");
  const nodeModulesIdx = parts.lastIndexOf("node_modules");
  if (nodeModulesIdx === -1) { return null; }

  // Get first part of package.
  const firstPart = parts[nodeModulesIdx + 1];
  if (!firstPart) { return null; }

  // Default to unscoped.
  let name = firstPart;
  if (firstPart[0] === "@") {
    // Detect if scoped and adjust / short-circuit if no match.
    const secondPart = parts[nodeModulesIdx + 2]; // eslint-disable-line no-magic-numbers
    if (!secondPart) { return null; }

    // Use posix path.
    name = [firstPart, secondPart].join("/");
  }

  return name;
};

module.exports = {
  getPackageName
};
