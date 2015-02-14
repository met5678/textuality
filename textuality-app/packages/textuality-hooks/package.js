Package.describe({
  name: 'textuality-hooks',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.1');
  api.use('underscore');
  api.addFiles('textuality-hooks.js');
  api.export('Hooks');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('textuality-hooks');
  api.addFiles('textuality-hooks-tests.js');
});
