"use strict";

const { toPosix } = require("./path");

/**
 * Helpers for dealing with packages.
 */

// Extract top-level package name.
//
// E.g., `["pkg2", "index.js"]` => "pkg2"
const getPackageFromParts = (parts = []) => {
  // Get first part of package.
  const firstPart = parts[0];
  // Check first part exists and is loosely valid per npm rules.
  // See, e.g.: https://github.com/npm/validate-npm-package-name/blob/master/index.js
  if (!firstPart || (/(^[\.\_]|[~'!()*])/).test(firstPart)) { return null; }

  // Default to unscoped.
  let name = firstPart;
  if (firstPart[0] === "@") {
    // Detect if scoped and adjust / short-circuit if no match.
    const secondPart = parts[1]; // eslint-disable-line no-magic-numbers
    if (!secondPart) { return null; }

    // Use posix path.
    name = [firstPart, secondPart].join("/");
  }

  return name;
};

module.exports = {
  getPackageFromParts
};
