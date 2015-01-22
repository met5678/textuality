Package.describe({
  name: 'met5678:cloudinary',
  summary: 'Cloudinary API server-side wrapper for Meteor',
  version: '1.0.0',
  git: ' /* Fill me in! */ '
});


Package.onUse(function(api) {
  api.versionsFrom('1.0.2.1');
  api.addFiles('cloudinary.js', 'server');
  api.export('Cloudinary', 'server');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('met5678:cloudinary');
  api.addFiles('cloudinary-tests.js');
});

Npm.depends({	'cloudinary': '1.1.1'});
