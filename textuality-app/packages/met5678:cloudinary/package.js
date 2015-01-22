Package.describe({
  name: 'met5678:cloudinary',
  summary: ' /* Fill me in! */ ',
  version: '1.0.0',
  git: ' /* Fill me in! */ '
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.2.1');
  api.addFiles('met5678:cloudinary.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('met5678:cloudinary');
  api.addFiles('met5678:cloudinary-tests.js');
});
