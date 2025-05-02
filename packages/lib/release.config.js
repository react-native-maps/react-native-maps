module.exports = {
  branches: [
    'master',
    {name: 'alpha', channel: 'alpha', prerelease: 'alpha'},
    {name: 'beta', channel: 'beta', prerelease: 'beta'},
  ],
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
          'yarn workspace react-native-maps version ${nextRelease.version}',
        publishCmd: 'npm publish --access public',
      },
    ],
    '@semantic-release/github',
  ],
};
