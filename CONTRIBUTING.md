Contributing
============

Thanks for contributing!

## Development

If you want to try out a scenario in development, you can do something like:

```sh
# next dev test/fixtures/<SCENARIO>
$ next dev test/fixtures/simple
```

## Quality checks

```sh
$ yarn lint
$ yarn test

# ... or all together ...
$ yarn run check
```

### Tests

#### E2E Tests

For our E2E tests, we run full on-disk builds for each example Next.js app found in `test/e2e/scenarios/<NAME>`. You can run only the E2E tests with:

```sh
$ yarn test:e2e
```

We run our tests multiple times against different versions of Next.js. (Our next installs are found in `test/packages/next<VERSION>`). Our builds run as follows:

1. Remove any pre-existing builds in `test/scenarios/<SCENARIO>/.next` and `.builds/<SCENARIO>/<VERSION>`
2. Run a Next.js build in `test/scenarios/<SCENARIO>` for each Next.js `VERSION`.
3. Copy the new build from `test/scenarios/<SCENARIO>/.next` to `.builds/<SCENARIO>/<VERSION>/.next`

Because the build takes so long, if you are just developing test logic (as opposed to the core project code) and don't want to do a new build during each build, you can skip the entire clean + build + copy steps with:

```sh
$ NO_BUILD=true yarn test:e2e
```

The tests will then use whatever was last produced in `.builds/<SCENARIO>/<VERSION>/.next`.

## Releasing a new version to NPM

_Only for project administrators_.

1. Update `CHANGELOG.md`, following format for previous versions
2. Commit as "Changes for version VERSION"
3. Run `npm version patch` (or `minor|major|VERSION`) to run tests and lint,
   build published directories, then update `package.json` + add a git tag.
4. Run `npm publish` and publish to NPM if all is well.
5. Run `git push && git push --tags`
