'use strict';

let VersionChecker = require('ember-cli-version-checker');

module.exports = {
  name: 'ember-native-dom-event-dispatcher',
  init() {
    this._super && this._super.init.apply(this, arguments);

    let checker = new VersionChecker(this);
    this._shouldDisable = checker.forEmber().gt('3.0.0-beta.2');
  },

  treeFor() {
    if (this._shouldDisable) {
      return null;
    }

    return this._super.treeFor.apply(this, arguments);
  }
};
