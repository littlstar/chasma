'use strict';

/**
 * children property symbol
 *
 * @private
 * @const
 * @type Symbol
 * @name CHILDREN_SYMBOL
 */

const CHILDREN_SYMBOL = Symbol('children');

/**
 * data property symbol
 *
 * @private
 * @const
 * @type Symbol
 * @name DATA_SYMBOL
 */

const DATA_SYMBOL = Symbol('data');

/**
 * events property symbol
 *
 * @private
 * @const
 * @type Symbol
 * @name EVENTS_SYMBOL
 */

const EVENTS_SYMBOL = Symbol('events');

/**
 * Helper to get children set in
 * a Screen instance.
 *
 * @private
 * @method
 * @name children
 * @param {Screen} s
 * @return Set
 */

const children = s => s[CHILDREN_SYMBOL];

/**
 * Helper to get data set in
 * a Screen instance.
 *
 * @private
 * @method
 * @name data
 * @param {Screen} s
 * @return Set
 */

const data = s => s[DATA_SYMBOL];

/**
 * Helper to get event set in
 * a Screen instance.
 *
 * @private
 * @method
 * @name event
 * @param {Screen} s
 * @return Set
 */

const events = s => s[EVENTS_SYMBOL];

/**
 * ScreenFactory class.
 *
 * @public
 * @class ScreenFactory
 */

let screenFactoryInstance = null;
export class ScreenFactory {

  /**
   * Returns a shared ScreenFactory instance.
   *
   * @public
   * @static
   * @method
   * @name sharedInstance
   * @return ScreenFactory
   */

  static sharedInstance () {
    return (
      screenFactoryInstance = screenFactoryInstance || new ScreenFactory()
    );
  }

  /**
   * ScreenFactory constructor
   *
   * @public
   * @constructor
   */

  constructor () {

    if (null == screenFactoryInstance)
      screenFactoryInstance = this;

    /**
     * Known screens map by id.
     *
     * @public
     * @type Map
     * @name screens
     */

    this.screens = new Map();
  }

  /**
   * Creates a screen with options.
   *
   * @public
   * @method
   * @name createScreen
   * @param {Screen} [parent]
   * @param {Object} [opts]
   * @param {Array} [children]
   * @return Screen
   */

  createScreen (...args) {
    return new Screen(...args);
  }
}

/**
 * Screen class.
 *
 * @public
 * @class Screen
 */

export class Screen {

  /**
   * Screen constructor.
   *
   * @public
   * @constructor
   * @param {Screen} [parent = null]
   * @param {Object} [data = {}]
   * @param {iterable} [children = []]
   */

  constructor (parent = null, data = {}, children = []) {

    /**
     * Parent screen if available.
     *
     * @public
     * @type Screen
     * @name parent
     */

    this.parent = null;

    /**
     * Child screens.
     *
     * @private
     * @type Set<Screen>
     * @name Symbol(children)
     */

    this[CHILDREN_SYMBOL] = new Set(children || []);

    /**
     * Screen data.
     *
     * @private
     * @type Map<String, Mixed>
     * @name Symbol(data)
     */

    this[DATA_SYMBOL] = new Map();

    /**
     * Screen events.
     *
     * @private
     * @type Map<String, Set<Function>>
     * @name Symbol(events)
     */

    this[EVENTS_SYMBOL] = new Map();

    // set data if given
    if (data)
      for (let key in data)
        this.set(key, data[key]);
  }

  /**
   * Returns the screen id if defined.
   *
   * @public
   * @getter
   * @name id
   * @reurn {Mixed}
   */

  get id () {
    return this.get('id');
  }

  /**
   * Returns screen length by
   * counting child screens.
   *
   * @public
   * @getter
   * @name length
   * @return Number
   */

  get length () {
    return children(this).size || 0;
  }

  /**
   * Adds child to children set.
   *
   * @public
   * @method
   * @name appendChild
   * @param {Screen} child
   * @return Screen
   */

  appendChild (child) {
    const id = child.get('id')
    const predecessor = id ? this.getScreenById(id) : null;
    if (predecessor)
      this.removeChild(predecessor);
    children(this).add(child);
    child.parent = this;
    return this;
  }

  /**
   * Removes child from children set.
   *
   * @public
   * @method
   * @name removeChild
   * @param {Screen} child
   * @return Screen
   */

  removeChild (child) {
    if (children(this).has(child))
      children(this).delete(child);
    if (child.parent == this)
      child.parent = null;
    return this;
  }

  /**
   * Predicate to determine if
   * child is in children set.
   *
   * @public
   * @method
   * @name contains
   * @param {Screen} child
   * @return Boolean
   */

  contains (child) {
    return children(this).has(child);
  }

  /**
   * Set a screen property by key to value.
   *
   * @public
   * @method
   * @name set
   * @param {String} key
   * @param {Mixed} value
   * @return Screen
   */

  set (key, value) {
    data(this).set(key, value);
    return this;
  }

  /**
   * Get a screen property by key.
   *
   * @public
   * @method
   * @name get
   * @param {String} key
   * @return Mixed
   */

  get (key) {
    return data(this).get(key) || null;
  }

  /**
   * Get a screen by ID.
   *
   * @public
   * @method
   * @name getScreenById
   * @param {String} id
   * @return Screen
   */

  getScreenById (id) {
    if (!id) return null;
    for (let screen of this.children())
      if (id == screen.get('id'))
        return screen;
    return null;
  }

  /**
   * Get screens by class type. Subclassing
   * makes this method useful.
   *
   * @public
   * @method
   * @name getScreensByClass
   * @param {Function} classType
   * @return Screen
   */

  getScreensByClass (classType = Screen) {
    const screens = [];
    if (classType)
      for (let screen of this.children())
        if (screen instanceof classType)
          screens.push(screen);
    return screens;
  }

  /**
   * Returns an iterator for child screens.
   *
   * @public
   * @method
   * @name children
   * @return {iterable}
   */

  children () {
    const entries = [];
    for (let child of children(this).entries())
      entries.push(child[0]);
    return entries;
  }

  /**
   * Dispatches an event by name
   * with optional data and a predicate
   * indicating whether the event should
   * propagate to all child screens.
   *
   * @public
   * @method
   * @name dispatchEvent
   * @param {Strign} event
   * @param {Object} [data = {}]
   * @param {Boolean} [propagate = true]
   * @param {Boolean} [bubble = false]
   * @return Screen
   */

  dispatchEvent (event, data = {}, propagate = true, bubble = false) {
    const listeners = events(this).get(event);
    // call listeners if present
    if (listeners && listeners.size)
      for (let listener of listeners)
        listener(data);

    // propagate to children if allowed
    if (propagate && this.length)
      for (let child of this.children())
        child.dispatchEvent(event, data, propagate);

    // bubble up
    if (bubble && this.parent)
      this.parent.dispatchEvent(event, data, false, true);
    return this;
  }

  /**
   * Adds an event listener by event name.
   *
   * @public
   * @method
   * @name addEventListener
   * @param {String} event
   * @param {Function} listener
   * @return Screen
   */

  addEventListener (event, listener) {
    const listeners = events(this).get(event) || new Set();
    // add listener if not already present
    if (false == listeners.has(listener))
      listeners.add(listener);

    // add to events map if not already set
    if (false == events(this).has(event))
        events(this).set(event, listeners);
    return this;
  }

  /**
   * Removes an event listener by listener.
   *
   * @public
   * @method
   * @name removeEventListener
   * @param {String} event
   * @param {Function} listener
   * @return Screen
   */

  removeEventListener (event, listener) {
    const listeners = events(this).get(event);
    // remove listener from listener set if present
    if (listeners && listeners.has(listener))
      listeners.delete(listener);
    return this;
  }

  /**
   * Removes all event listeners by event name.
   *
   * @public
   * @method
   * @name removeAllEventListeners
   * @param {String} event
   * @return Screen
   */

  removeAllEventListeners (event) {
    const listeners = events(this).get(event);
    // clear listeners if present and containing anything
    if (listeners && listeners.size)
      listeners.clear();
    return this;
  }
}
