import Ember from 'ember';

const ActionManager = Ember.__loader.require('ember-views/system/action_manager').default;

const { merge, get, set, isNone, getOwner } = Ember;

const ROOT_ELEMENT_CLASS = 'ember-application';

export default Ember.EventDispatcher.extend({
  init() {
    this._super(...arguments);

    this._eventHandlers = Object.create(null);
    this.canDispatchToEventManager = false;
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

    if (isNone(rootElement)) {
      rootElement = get(this, 'rootElement');
    } else {
      set(this, 'rootElement', rootElement);
    }

    let viewRegistry = this._getViewRegistry && this._getViewRegistry();
    // present in ember-source@2.12+
    if (!viewRegistry) {
      let owner = getOwner ? getOwner(this) : this.container;
      viewRegistry = owner && owner.lookup('-view-registry:main');
    }

    let rootElementSelector = get(this, 'rootElement');
    rootElement = document.querySelector(rootElementSelector);

    //assert(`You cannot use the same root element (${rootElement.selector || rootElement[0].tagName}) multiple times in an Ember.Application`, !rootElement.is(ROOT_ELEMENT_SELECTOR));
    //assert('You cannot make a new Ember.Application using a root element that is a descendent of an existing Ember.Application', !rootElement.closest(ROOT_ELEMENT_SELECTOR).length);
    //assert('You cannot make a new Ember.Application using a root element that is an ancestor of an existing Ember.Application', !rootElement.find(ROOT_ELEMENT_SELECTOR).length);

    rootElement.className += (rootElement.className.length === 0 ? '' : ' ') + ROOT_ELEMENT_CLASS;

    //if (!rootElement.is(ROOT_ELEMENT_SELECTOR)) {
    //  throw new TypeError(`Unable to add '${ROOT_ELEMENT_CLASS}' class to root element (${rootElement.selector || rootElement[0].tagName}). Make sure you set rootElement to the body or an element in the body.`);
    //}

    for (event in events) {
      if (events.hasOwnProperty(event)) {
        this.setupHandler(rootElement, event, events[event], viewRegistry);
      }
    }
  },

  setupHandler(rootElement, event, eventName, viewRegistry) {
    if (eventName === null) {
      return;
    }

    let viewHandler = (target, event) => {
      let view = viewRegistry[target.id];
      let result = true;

      if (view) {
        result = this._bubbleEvent(view, event, eventName);
      }

      return result;
    };

    let actionHandler = (target, event) => {
      let actionId = target.getAttribute('data-ember-action');
      let actions = ActionManager.registeredActions[actionId];

      // In Glimmer2 this attribute is set to an empty string and an additional
      // attribute it set for each action on a given element. In this case, the
      // attributes need to be read so that a proper set of action handlers can
      // be coalesced.
      if (actionId === '') {
        let attributes = target.attributes;
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

      do {
        if (viewRegistry[target.id]) {
          if (viewHandler(target, event) === false) {
            event.preventDefault();
            event.stopPropagation();
            break;
          }
        } else if (target.hasAttribute('data-ember-action')) {
          actionHandler(target, event);
          break;
        }

        target = target.parentNode;
      } while(target && target.nodeType === 1);
    };

    rootElement.addEventListener(event, handleEvent);
  },

  destroy() {
    let rootElement = get(this, 'rootElement');
    rootElement = document.querySelector(rootElement);

    for (let event in this._eventHandlers) {
      rootElement.removeEventListener(event, this._eventHandlers[event]);
    }

    if (rootElement.classList) {
      rootElement.classList.remove(ROOT_ELEMENT_CLASS);
    } else {
      rootElement.className = rootElement.className.replace(new RegExp('(^|\\b)' + ROOT_ELEMENT_CLASS.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  }
});
