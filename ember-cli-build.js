'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var options = {
    vendorFiles: { 'jquery.js': null }
  };

  if (process.env.EMBER_TRY_CURRENT_SCENARIO === 'ember-lts-2.8') {
    delete options.vendorFiles;
  }

  var app = new EmberAddon(defaults, options);

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return app.toTree();
};
