'use strict';

/**
 * Module dependencies.
 */

import {Screen, ScreenFactory} from './screen';
import Application from './application';

/**
 * Module exports.
 */

export {
  ScreenFactory,
  Application,
  Screen,
};

/**
 * Creates an Application instance.
 *
 * @public
 * @function
 * @name createApplication
 * @return Application
 */

export function createApplication () {
  return new Application();
}
