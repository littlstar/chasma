'use strict';

/**
 * Module dependencies.
 */

import {ScreenFactory} from './screen';

/**
 * Application class.
 *
 * @public
 * @class
 */

let applicationInstance = null;
export default class Application {

  /**
   * Returns a shared Application instance.
   *
   * @public
   * @static
   * @method
   * @name sharedInstance
   * @return Application
   */

  static sharedInstance () {
    return (
      applicationInstance = applicationInstance || new Application()
    );
  }

  /**
   * Application constructor.
   *
   * @public
   * @constructor
   */

  constructor () {
    if (null == applicationInstance)
      applicationInstance = this;
  }

  /**
   * Creates a screen with options.
   *
   * @public
   * @method
   * @name createScreen
   * @param {Object} opts
   * @return Screen
   */

  createScreen (opts = {}) {
    return ScreenFactory.sharedInstance().createScreen(opts);
  }
}
