
ember-native-dom-event-dispatcher
==============================================================================

`ember-native-dom-event-dispatcher` is intended to be used with Ember 2.9.0-alpha.1 and higher.
It replaces the default event dispatcher in use by Ember apps with one that does not use jQuery.

In general, this should be a drop in replacement for `Ember.EventDispatcher` (which is the default).


Installation
------------------------------------------------------------------------------

```
ember install ember-native-dom-event-dispatcher
```

To remove JQuery from your build change `ember-cli-build.js` to:

```js
var app = new EmberApp(defaults, {
  vendorFiles: {
    'jquery.js': null,
  },
});
```


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
