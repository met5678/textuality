Package.describe({
  name: 'textuality-core',
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
  api.use(['iron:router','mrt:twilio-meteor']);
  //api.use('mrt:twilio-meteor@1.1.0');
  api.addFiles('textuality-core.js');
  api.addFiles(['src/collections/inTexts.js',
                'src/collections/participants.js']);
  api.addFiles('src/server/twilio.js','server');
  api.export('Textuality');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('textuality-core');
  api.addFiles('textuality-core-tests.js');
});
