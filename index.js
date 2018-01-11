'use strict';

let VersionChecker = require('ember-cli-version-checker');
let hasBeenWarned = false;

module.exports = {
  name: 'ember-native-dom-event-dispatcher',
  init() {
    this._super && this._super.init.apply(this, arguments);

    let checker = new VersionChecker(this);

    this._shouldDisable = true;
    if (checker.forEmber().lt('3.0.0-beta.2')) {
      this._shouldDisable = false;
    } else if (this.parent === this.project && !process.env.EMBER_TRY_CURRENT_SCENARIO && !hasBeenWarned) {
      this.ui.writeWarnLine('ember-native-dom-event-dispatcher is not required for Ember 3.0.0-beta.2 and later, please remove from your `package.json`.');
      hasBeenWarned = true;
    }
  },

  treeFor() {
    if (this._shouldDisable) {
      return null;
    }

    return this._super.treeFor.apply(this, arguments);
  }
};
