module.exports = {
  branches: ['master', 'alpha', 'beta'],
  tagFormat: 'v${version}',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/git',
    [
      '@semantic-release/exec',
      {
        prepareCmd:
          'yarn workspace react-native-maps version ${nextRelease.version} --no-git-tag-version',
        publishCmd: 'npm publish --workspace packages/lib --access public',
      },
    ],
    '@semantic-release/github',
  ],
};
