import Ember from 'ember';

const ActionManager = Ember.__loader.require('ember-views/system/action_manager').default;

const { merge, get, set, isNone, getOwner } = Ember;

const ROOT_ELEMENT_CLASS = 'ember-application';
const ROOT_ELEMENT_SELECTOR = '.' + ROOT_ELEMENT_CLASS;

export default Ember.EventDispatcher.extend({
  init() {
    this._super(...arguments);

    this._eventHandlers = Object.create(null);
  },

  /*
   Override the implementation in Ember itself
   */
  setup(addedEvents, rootElement) {
    let event;
    let events = {};

    merge(events, get(this, 'events'));
    merge(events, addedEvents);

    this._finalEvents = events;

    if (!isNone(rootElement)) {
      set(this, 'rootElement', rootElement);
    }

    let rootElementSelector = get(this, 'rootElement');
    rootElement = document.querySelector(rootElementSelector);

    //assert(`You cannot use the same root element (${rootElement.selector || rootElement[0].tagName}) multiple times in an Ember.Application`, !rootElement.is(ROOT_ELEMENT_SELECTOR));
    //assert('You cannot make a new Ember.Application using a root element that is a descendent of an existing Ember.Application', !rootElement.closest(ROOT_ELEMENT_SELECTOR).length);
    //assert('You cannot make a new Ember.Application using a root element that is an ancestor of an existing Ember.Application', !rootElement.find(ROOT_ELEMENT_SELECTOR).length);

    rootElement.className += ' ' + ROOT_ELEMENT_SELECTOR;

    //if (!rootElement.is(ROOT_ELEMENT_SELECTOR)) {
    //  throw new TypeError(`Unable to add '${ROOT_ELEMENT_CLASS}' class to root element (${rootElement.selector || rootElement[0].tagName}). Make sure you set rootElement to the body or an element in the body.`);
    //}

    for (event in events) {
      if (events.hasOwnProperty(event)) {
        this.setupHandler(rootElement, event, events[event]);
      }
    }
  },

  setupHandler(rootElement, event, eventName) {
    let self = this;

    let owner = getOwner(this);
    let viewRegistry = owner && owner.lookup('-view-registry:main');

    if (eventName === null) {
      return;
    }

    let viewHandler = (event, triggeringManager) => {
      let view = viewRegistry[event.target.id];
      let result = true;

      let manager = this.canDispatchToEventManager ? this._findNearestEventManager(view, eventName) : null;

      if (manager && manager !== triggeringManager) {
        result = this._dispatchEvent(manager, event, eventName, view);
      } else if (view) {
        result = this._bubbleEvent(view, event, eventName);
      }

      return result;
    };

    let actionHandler = (event) => {
      let actionId = event.target.getAttribute('data-ember-action');
      let actions = ActionManager.registeredActions[actionId];

      // In Glimmer2 this attribute is set to an empty string and an additional
      // attribute it set for each action on a given element. In this case, the
      // attributes need to be read so that a proper set of action handlers can
      // be coalesced.
      if (actionId === '') {
        let attributes = event.target.attributes;
        let attributeCount = attributes.length;

        actions = [];

        for (let i = 0; i < attributeCount; i++) {
          let attr = attributes.item(i);
          let attrName = attr.name;

          if (attrName.indexOf('data-ember-action-') === 0) {
            actions = actions.concat(ActionManager.registeredActions[attr.value]);
          }
        }
      }

      // We have to check for actions here since in some cases, jQuery will trigger
      // an event on `removeChild` (i.e. focusout) after we've already torn down the
      // action handlers for the view.
      if (!actions) {
        return;
      }

      for (let index = 0; index < actions.length; index++) {
        let action = actions[index];

        if (action && action.eventName === eventName) {
          return action.handler(event);
        }
      }
    };

    let handleEvent = this._eventHandlers[event] = (event) => {
      let target = event.target;
      if (viewRegistry[target.id]) {
        return viewHandler(event);
      } else if (target.hasAttribute('data-ember-action')) {
        return actionHandler(event);
      }
    };

    rootElement.addEventListener(event, handleEvent);
  },
});
