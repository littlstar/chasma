(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x4, _x5, _x6) { var _again = true; _function: while (_again) { var object = _x4, property = _x5, receiver = _x6; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x4 = parent; _x5 = property; _x6 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _2 = require('../../');

var chasma = _interopRequireWildcard(_2);

// storage reference
var STORAGE = window.localStorage;

/**
 * Merge helper.
 */

var merge = function merge(a, b) {
  for (var k in b) {
    a[k] = b[k];
  }return a;
};

/**
 * DOM creation helper.
 */

var dom = function dom(source) {
  var doc = document.createDocumentFragment();
  var body = document.createElement('body');
  doc.appendChild(body);
  body.innerHTML = source;
  return body.children[0];
};

/**
 * DOM event delegation helper.
 */

var bind = function bind(object, domElement, event, handler) {
  var bubble = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];

  if ('string' == typeof handler && 'function' == typeof object[handler]) handler = object[handler].bind(object);else if ('function' == typeof object['on' + event]) handler = object['on' + event].bind(object);

  if ('string' == typeof domElement) domElement = object.domElement.querySelector(domElement);else if (null == domElement) domElement = object.domElement;

  if (domElement) domElement.addEventListener(event, function (e) {
    if ('function' == typeof handler) handler(e);
    object.dispatchEvent('on' + event, e, true, bubble);
  });
};

/**
 * TodoApplication class
 */

var TodoApplication = (function (_chasma$Application) {
  _inherits(TodoApplication, _chasma$Application);

  function TodoApplication() {
    _classCallCheck(this, TodoApplication);

    _get(Object.getPrototypeOf(TodoApplication.prototype), 'constructor', this).call(this);
    this.storage = new TodoStorage();
  }

  /**
   * Todo storage class.
   */

  _createClass(TodoApplication, [{
    key: 'save',
    value: function save(todo) {
      var todos = this.storage.get('todos') || [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = todos[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _ = _step.value;

          if (_.id == todo.id) merge(_, todo);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (false == todos.some(function (_) {
        return _.id == todo.id;
      })) todos.push(todo);
      this.storage.set('todos', todos);
      return this;
    }
  }, {
    key: 'load',
    value: function load(todo) {
      var data = this.storage.get('todos');
      if (data) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var d = _step2.value;

            if (d.id == todo.id) merge(todo, d);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2['return']) {
              _iterator2['return']();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }return data;
    }
  }]);

  return TodoApplication;
})(chasma.Application);

var STORAGE_KEY = '__todo__';

var TodoStorage = (function () {
  function TodoStorage() {
    _classCallCheck(this, TodoStorage);

    this.state = {};
  }

  /**
   * Base todo screen class.
   */

  _createClass(TodoStorage, [{
    key: 'load',
    value: function load() {
      try {
        this.state = JSON.parse(STORAGE[STORAGE_KEY]);
      } catch (e) {
        this.state = {};
        this.save();
      }
      return this;
    }
  }, {
    key: 'save',
    value: function save() {
      try {
        STORAGE[STORAGE_KEY] = JSON.stringify(this.state);
      } catch (e) {}
      return this;
    }
  }, {
    key: 'set',
    value: function set(k, v) {
      this.state[k] = v;
      return this.save();
    }
  }, {
    key: 'get',
    value: function get(k) {
      this.load();
      return this.state[k];
    }
  }, {
    key: 'delete',
    value: function _delete(k) {
      this.load();
      delete this.state[k];
      return this.save();
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.state = {};
      return this.save();
    }
  }]);

  return TodoStorage;
})();

var TodoScreen = (function (_chasma$Screen) {
  _inherits(TodoScreen, _chasma$Screen);

  function TodoScreen(domElement, opts) {
    _classCallCheck(this, TodoScreen);

    _get(Object.getPrototypeOf(TodoScreen.prototype), 'constructor', this).call(this, null, opts);
    this.domElement = 'string' == typeof domElement ? dom(domElement) : domElement;
  }

  /**
   * Root application screen class.
   */

  _createClass(TodoScreen, [{
    key: 'appendChild',
    value: function appendChild(child) {
      var _get2;

      this.domElement.appendChild(child.domElement);

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return (_get2 = _get(Object.getPrototypeOf(TodoScreen.prototype), 'appendChild', this)).call.apply(_get2, [this, child].concat(args));
    }
  }, {
    key: 'removeChild',
    value: function removeChild(child) {
      var _get3;

      if (this.domElement.contains(child.domElement)) this.domElement.removeChild(child.domElement);

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      return (_get3 = _get(Object.getPrototypeOf(TodoScreen.prototype), 'removeChild', this)).call.apply(_get3, [this, child].concat(args));
    }
  }, {
    key: 'focus',
    value: function focus() {
      this.domElement.focus();
    }
  }]);

  return TodoScreen;
})(chasma.Screen);

var TodoRootScreen = (function (_TodoScreen) {
  _inherits(TodoRootScreen, _TodoScreen);

  function TodoRootScreen() {
    _classCallCheck(this, TodoRootScreen);

    _get(Object.getPrototypeOf(TodoRootScreen.prototype), 'constructor', this).call(this, document.querySelector('#main'), { id: 'root' });
  }

  /**
   * Todo menu class.
   */

  return TodoRootScreen;
})(TodoScreen);

var TodoMenuScreen = (function (_TodoScreen2) {
  _inherits(TodoMenuScreen, _TodoScreen2);

  function TodoMenuScreen() {
    _classCallCheck(this, TodoMenuScreen);

    _get(Object.getPrototypeOf(TodoMenuScreen.prototype), 'constructor', this).call(this, dom('<section class="menu">\n        <h3>Todos</h3>\n        <ul class="items"></ul>\n      </section>'));
  }

  /**
   * Todo menu item class.
   */

  return TodoMenuScreen;
})(TodoScreen);

var TodoMenuItemScreen = (function (_TodoScreen3) {
  _inherits(TodoMenuItemScreen, _TodoScreen3);

  function TodoMenuItemScreen() {
    var todo = arguments.length <= 0 || arguments[0] === undefined ? new Todo({}) : arguments[0];

    _classCallCheck(this, TodoMenuItemScreen);

    _get(Object.getPrototypeOf(TodoMenuItemScreen.prototype), 'constructor', this).call(this, dom('<li class="item">\n        <input type="checkbox"\n               name="check"\n               ' + (todo.completed ? 'checked' : '') + '>\n        <span class="content"> ' + todo.content + ' </span>\n      </li>'));

    bind(this, '[name=check]', 'change', function (e) {
      todo.completed = Boolean(e.target.checked);
      todo.save();
    });
  }

  /**
   * new todo item screen
   */

  return TodoMenuItemScreen;
})(TodoScreen);

var TodoNewItemScreen = (function (_TodoScreen4) {
  _inherits(TodoNewItemScreen, _TodoScreen4);

  function TodoNewItemScreen() {
    _classCallCheck(this, TodoNewItemScreen);

    _get(Object.getPrototypeOf(TodoNewItemScreen.prototype), 'constructor', this).call(this, '<section class="new">\n        <input type="text"\n               name="content"\n               placeholder="New Todo" />\n        <input type="date"\n               name="when" />\n\n        <input type="button"\n               name="save"\n               value="Save" />\n      </section>');

    bind(this, '[name=save]', 'click');
    bind(this, '[name=when]', 'keyup');
    bind(this, '[name=content]', 'keyup');
  }

  /**
   * Todo data model class
   */

  _createClass(TodoNewItemScreen, [{
    key: 'onkeyup',
    value: function onkeyup(e) {
      if (13 == e.keyCode) this.domElement.querySelector('[name=save]').click();
    }
  }, {
    key: 'onclick',
    value: function onclick(e) {
      var domElement = this.domElement;
      var content = domElement.querySelector('[name=content]');
      var when = domElement.querySelector('[name=when]');
      var todo = new Todo();

      e.preventDefault();

      if (!when.value) when.valueAsNumber = Date.now();

      todo.content = content.value;
      todo.when = Date.parse(when.value);

      if (todo.when && todo.content) {
        todo.save();
        this.clear();
        this.dispatchEvent('todosaved', todo, false, true);
      }
    }
  }, {
    key: 'clear',
    value: function clear() {
      var _arr = [].concat(_toConsumableArray(this.domElement.querySelectorAll('input')));

      for (var _i = 0; _i < _arr.length; _i++) {
        var input = _arr[_i];
        // black list input types
        if (['button'].indexOf(input.getAttribute('type')) > -1) continue;
        input.value = '';
      }
      return this;
    }
  }]);

  return TodoNewItemScreen;
})(TodoScreen);

var Todo = (function () {
  _createClass(Todo, null, [{
    key: 'uid',
    value: function uid() {
      return Math.random() * 10e3 | 0;
    }
  }, {
    key: 'load',
    value: function load(id) {
      var app = TodoApplication.sharedInstance();
      var todo = new Todo();
      todo.id = id;
      var data = app.load(todo) || {};
      todo.content = data.content;
      todo.when = data.when;
      return todo;
    }
  }]);

  function Todo() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$completed = _ref.completed;
    var completed = _ref$completed === undefined ? false : _ref$completed;
    var _ref$content = _ref.content;
    var content = _ref$content === undefined ? null : _ref$content;
    var _ref$when = _ref.when;
    var when = _ref$when === undefined ? Date.now() : _ref$when;
    var _ref$id = _ref.id;
    var id = _ref$id === undefined ? Todo.uid() : _ref$id;

    _classCallCheck(this, Todo);

    this.completed = completed || false;
    this.content = content;
    this.when = when || Date.now();
    this.id = id;
  }

  _createClass(Todo, [{
    key: 'save',
    value: function save() {
      var app = TodoApplication.sharedInstance();
      this.completed = this.completed || false;
      this.when = this.when || Date.now();
      this.id = this.id || Todo.uid();
      app.save(this);
      return this;
    }
  }]);

  return Todo;
})();

var TodoController = (function () {
  function TodoController() {
    var _this = this;

    _classCallCheck(this, TodoController);

    var create = new TodoNewItemScreen();
    var menu = new TodoMenuScreen();
    var root = new TodoRootScreen();
    var app = new TodoApplication();

    // @DEBUG
    window.app = app;
    window.root = root;

    this.knownTodos = [];
    this.create = create;
    this.menu = menu;
    this.root = root;
    this.app = app;

    this.renderTodos();

    root.addEventListener('todosaved', function (todo) {
      _this.renderTodos();
      _this.create.focus();
    });
  }

  /**
   * Main.
   */

  _createClass(TodoController, [{
    key: 'loadTodos',
    value: function loadTodos() {
      var app = TodoApplication.sharedInstance();
      var todos = app.storage.load().get('todos') || [];
      app.storage.set('todos', todos);
      return todos.map(function (todo) {
        return new Todo(todo);
      });
    }
  }, {
    key: 'renderTodos',
    value: function renderTodos() {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.loadTodos()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var todo = _step3.value;

          if (this.knownTodos.indexOf(todo.id) > -1) continue;

          this.knownTodos.push(todo.id);
          this.menu.appendChild(new TodoMenuItemScreen(todo));
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3['return']) {
            _iterator3['return']();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      this.root.appendChild(this.menu);
      this.root.appendChild(this.create);
    }
  }]);

  return TodoController;
})();

void (function () {
  var controller = new TodoController();
})();

},{"../../":4}],2:[function(require,module,exports){
(function (process,global){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var hasOwn = Object.prototype.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var iteratorSymbol =
    typeof Symbol === "function" && Symbol.iterator || "@@iterator";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided, then outerFn.prototype instanceof Generator.
    var generator = Object.create((outerFn || Generator).prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `value instanceof AwaitArgument` to determine if the yielded value is
  // meant to be awaited. Some may consider the name of this method too
  // cutesy, but they are curmudgeons.
  runtime.awrap = function(arg) {
    return new AwaitArgument(arg);
  };

  function AwaitArgument(arg) {
    this.arg = arg;
  }

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value instanceof AwaitArgument) {
          return Promise.resolve(value.arg).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof process === "object" && process.domain) {
      invoke = process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          if (method === "return" ||
              (method === "throw" && delegate.iterator[method] === undefined)) {
            // A return or throw (when the delegate iterator has no throw
            // method) always terminates the yield* loop.
            context.delegate = null;

            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            var returnMethod = delegate.iterator["return"];
            if (returnMethod) {
              var record = tryCatch(returnMethod, delegate.iterator, arg);
              if (record.type === "throw") {
                // If the return method threw an exception, let that
                // exception prevail over the original return or throw.
                method = "throw";
                arg = record.arg;
                continue;
              }
            }

            if (method === "return") {
              // Continue with the outer return, now that the delegate
              // iterator has been terminated.
              continue;
            }
          }

          var record = tryCatch(
            delegate.iterator[method],
            delegate.iterator,
            arg
          );

          if (record.type === "throw") {
            context.delegate = null;

            // Like returning generator.throw(uncaught), but without the
            // overhead of an extra function call.
            method = "throw";
            arg = record.arg;
            continue;
          }

          // Delegate generator ran and handled its own exceptions so
          // regardless of what the method was, we continue as if it is
          // "next" with an undefined arg.
          method = "next";
          arg = undefined;

          var info = record.arg;
          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
          } else {
            state = GenStateSuspendedYield;
            return info;
          }

          context.delegate = null;
        }

        if (method === "next") {
          if (state === GenStateSuspendedYield) {
            context.sent = arg;
          } else {
            context.sent = undefined;
          }

        } else if (method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw arg;
          }

          if (context.dispatchException(arg)) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            method = "next";
            arg = undefined;
          }

        } else if (method === "return") {
          context.abrupt("return", arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          var info = {
            value: record.arg,
            done: context.done
          };

          if (record.arg === ContinueSentinel) {
            if (context.delegate && method === "next") {
              // Deliberately forget the last sent value so that we don't
              // accidentally pass it on to the delegate.
              arg = undefined;
            }
          } else {
            return info;
          }

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(arg) call above.
          method = "throw";
          arg = record.arg;
        }
      }
    };
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      this.sent = undefined;
      this.done = false;
      this.delegate = null;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;
        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.next = finallyEntry.finallyLoc;
      } else {
        this.complete(record);
      }

      return ContinueSentinel;
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = record.arg;
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":6}],3:[function(require,module,exports){
'use strict';

/**
 * Module dependencies.
 */

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _screen = require('./screen');

/**
 * Application class.
 *
 * @public
 * @class
 */

var applicationInstance = null;

var Application = (function () {
  _createClass(Application, null, [{
    key: 'sharedInstance',

    /**
     * Returns a shared Application instance.
     *
     * @public
     * @static
     * @method
     * @name sharedInstance
     * @return Application
     */

    value: function sharedInstance() {
      return applicationInstance = applicationInstance || new Application();
    }

    /**
     * Application constructor.
     *
     * @public
     * @constructor
     */

  }]);

  function Application() {
    _classCallCheck(this, Application);

    if (null == applicationInstance) applicationInstance = this;
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

  _createClass(Application, [{
    key: 'createScreen',
    value: function createScreen() {
      var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return _screen.ScreenFactory.sharedInstance().createScreen(opts);
    }
  }]);

  return Application;
})();

exports['default'] = Application;
module.exports = exports['default'];

},{"./screen":5}],4:[function(require,module,exports){
'use strict';

/**
 * Module dependencies.
 */

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.createApplication = createApplication;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _screen = require('./screen');

var _application = require('./application');

var _application2 = _interopRequireDefault(_application);

/**
 * Module exports.
 */

exports.ScreenFactory = _screen.ScreenFactory;
exports.Application = _application2['default'];
exports.Screen = _screen.Screen;

/**
 * Creates an Application instance.
 *
 * @public
 * @function
 * @name createApplication
 * @return Application
 */

function createApplication() {
  return new _application2['default']();
}

},{"./application":3,"./screen":5}],5:[function(require,module,exports){
'use strict';

/**
 * Module dependencies.
 */

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

require('regenerator/runtime');

/**
 * children property symbol
 *
 * @private
 * @const
 * @type Symbol
 * @name CHILDREN_SYMBOL
 */

var CHILDREN_SYMBOL = Symbol('children');

/**
 * data property symbol
 *
 * @private
 * @const
 * @type Symbol
 * @name DATA_SYMBOL
 */

var DATA_SYMBOL = Symbol('data');

/**
 * events property symbol
 *
 * @private
 * @const
 * @type Symbol
 * @name EVENTS_SYMBOL
 */

var EVENTS_SYMBOL = Symbol('events');

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

var _children = function _children(s) {
  return s[CHILDREN_SYMBOL];
};

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

var data = function data(s) {
  return s[DATA_SYMBOL];
};

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

var events = function events(s) {
  return s[EVENTS_SYMBOL];
};

/**
 * ScreenFactory class.
 *
 * @public
 * @class ScreenFactory
 */

var screenFactoryInstance = null;

var ScreenFactory = (function () {
  _createClass(ScreenFactory, null, [{
    key: 'sharedInstance',

    /**
     * Returns a shared ScreenFactory instance.
     *
     * @public
     * @static
     * @method
     * @name sharedInstance
     * @return ScreenFactory
     */

    value: function sharedInstance() {
      return screenFactoryInstance = screenFactoryInstance || new ScreenFactory();
    }

    /**
     * ScreenFactory constructor
     *
     * @public
     * @constructor
     */

  }]);

  function ScreenFactory() {
    _classCallCheck(this, ScreenFactory);

    if (null == screenFactoryInstance) screenFactoryInstance = this;

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
   * Screen class.
   *
   * @public
   * @class Screen
   */

  /**
   * Creates a screen with options.
   *
   * @public
   * @method
   * @name createScreen
   * @param {Object} opts
   * @return Screen
   */

  _createClass(ScreenFactory, [{
    key: 'createScreen',
    value: function createScreen() {
      var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var screen = new Screen(this, opts);
      return screen;
    }
  }]);

  return ScreenFactory;
})();

exports.ScreenFactory = ScreenFactory;

var Screen = (function () {

  /**
   * Screen constructor.
   *
   * @public
   * @constructor
   * @param {ScreenFactory} factory
   * @param {iterable} [children = []]
   */

  function Screen() {
    var factory = arguments.length <= 0 || arguments[0] === undefined ? new ScreenFactory() : arguments[0];
    var data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var children = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

    _classCallCheck(this, Screen);

    /**
     * This Screen instance's ScreenFactory
     * instance.
     *
     * @public
     * @type ScreenFactory
     */

    this.factory = factory || ScreenFactory.sharedInstance();

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
    if (data) for (var key in data) {
      this.set(key, data[key]);
    }
  }

  /**
   * Returns the screen id if defined.
   *
   * @public
   * @getter
   * @name id
   * @reurn {Mixed}
   */

  _createClass(Screen, [{
    key: 'appendChild',

    /**
     * Adds child to children set.
     *
     * @public
     * @method
     * @name appendChild
     * @param {Screen} child
     * @return Screen
     */

    value: function appendChild(child) {
      var id = child.get('id');
      var predecessor = id ? this.getScreenById(id) : null;
      if (predecessor) this.removeChild(predecessor);
      _children(this).add(child);
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

  }, {
    key: 'removeChild',
    value: function removeChild(child) {
      if (_children(this).has(child)) _children(this)['delete'](child);
      if (child.parent == this) child.parent = null;
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

  }, {
    key: 'contains',
    value: function contains(child) {
      return _children(this).has(child);
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

  }, {
    key: 'set',
    value: function set(key, value) {
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

  }, {
    key: 'get',
    value: function get(key) {
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

  }, {
    key: 'getScreenById',
    value: function getScreenById(id) {
      if (!id) return null;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.children()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _screen = _step.value;

          if (id == _screen.get('id')) return _screen;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

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

  }, {
    key: 'getScreensByClass',
    value: function getScreensByClass() {
      var classType = arguments.length <= 0 || arguments[0] === undefined ? Screen : arguments[0];

      var screens = [];
      if (classType) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = this.children()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _screen2 = _step2.value;

            if (_screen2 instanceof classType) screens.push(_screen2);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2['return']) {
              _iterator2['return']();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }return screens;
    }

    /**
     * Returns an iterator for child screens.
     *
     * @public
     * @method
     * @name children
     * @return {iterable}
     */

  }, {
    key: 'children',
    value: function children() {
      var entries = [];
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = _children(this).entries()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var child = _step3.value;

          entries.push(child[0]);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3['return']) {
            _iterator3['return']();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

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

  }, {
    key: 'dispatchEvent',
    value: function dispatchEvent(event) {
      var data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var propagate = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
      var bubble = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

      var listeners = events(this).get(event);
      // call listeners if present
      if (listeners && listeners.size) {
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = listeners[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var listener = _step4.value;

            listener(data);
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4['return']) {
              _iterator4['return']();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }
      } // propagate to children if allowed
      if (propagate && this.length) {
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = this.children()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var child = _step5.value;

            child.dispatchEvent(event, data, propagate);
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5['return']) {
              _iterator5['return']();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }
      } // bubble up
      if (bubble && this.parent) this.parent.dispatchEvent(event, data, false, true);
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

  }, {
    key: 'addEventListener',
    value: function addEventListener(event, listener) {
      var listeners = events(this).get(event) || new Set();
      // add listener if not already present
      if (false == listeners.has(listener)) listeners.add(listener);

      // add to events map if not already set
      if (false == events(this).has(event)) events(this).set(event, listeners);
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

  }, {
    key: 'removeEventListener',
    value: function removeEventListener(event, listener) {
      var listeners = events(this).get(event);
      // remove listener from listener set if present
      if (listeners && listeners.has(listener)) listeners['delete'](listener);
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

  }, {
    key: 'removeAllEventListeners',
    value: function removeAllEventListeners(event) {
      var listeners = events(this).get(event);
      // clear listeners if present and containing anything
      if (listeners && listeners.size) listeners.clear();
      return this;
    }
  }, {
    key: 'id',
    get: function get() {
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

  }, {
    key: 'length',
    get: function get() {
      return _children(this).size || 0;
    }
  }]);

  return Screen;
})();

exports.Screen = Screen;

},{"regenerator/runtime":2}],6:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[1]);
