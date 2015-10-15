'use strict';
import * as chasma from '../../';

// storage reference
const STORAGE = window.localStorage;

/**
 * Merge helper.
 */

const merge = (a, b) => {
  for (let k in b) a[k] = b[k];
  return a;
}

/**
 * DOM creation helper.
 */

const dom = source => {
  const doc = document.createDocumentFragment();
  const body = document.createElement('body');
  doc.appendChild(body);
  body.innerHTML = source;
  return body.children[0];
};

/**
 * DOM event delegation helper.
 */

const bind = (object, domElement, event, handler, bubble = false) => {
  if ('string' == typeof handler && 'function' == typeof object[handler])
    handler = object[handler].bind(object);
  else if ('function' == typeof object[`on${event}`])
    handler = object[`on${event}`].bind(object);

  if ('string' == typeof domElement)
    domElement = object.domElement.querySelector(domElement);
  else if (null == domElement)
    domElement = object.domElement;

  if (domElement)
    domElement.addEventListener(event, e => {
      if ('function' == typeof handler)
        handler(e);
      object.dispatchEvent(`on${event}`, e, true, bubble);
    });
};

/**
 * TodoApplication class
 */

class TodoApplication extends chasma.Application {
  constructor () {
    super();
    this.storage = new TodoStorage();
  }

  save (todo) {
    const todos = this.storage.get('todos') || [];
    for (let _ of todos)
      if (_.id == todo.id)
        merge(_, todo);

    if (false == todos.some(_ => _.id == todo.id))
      todos.push(todo);
    this.storage.set('todos', todos);
    return this;
  }

  load (todo) {
    const data = this.storage.get('todos');
    if (data)
      for (let d of data) {
        if (d.id == todo.id)
          merge(todo, d);
      }
    return data;
  }
}

/**
 * Todo storage class.
 */

const STORAGE_KEY = '__todo__';
class TodoStorage {
  constructor () {
    this.state = {};
  }

  load () {
    try {
      this.state = JSON.parse(STORAGE[STORAGE_KEY]);
    } catch (e) {
      this.state = {};
      this.save();
    }
    return this;
  }

  save () {
    try {
      STORAGE[STORAGE_KEY] = JSON.stringify(this.state);
    } catch (e) { }
    return this;
  }

  set (k, v) {
    this.state[k] = v;
    return this.save();
  }

  get (k) {
    this.load();
    return this.state[k];
  }

  delete (k) {
    this.load();
    delete this.state[k];
    return this.save();
  }

  clear () {
    this.state = {};
    return this.save();
  }
}

/**
 * Base todo screen class.
 */

class TodoScreen extends chasma.Screen {

  constructor (domElement, opts) {
    super(null, opts);
    this.domElement = (
      'string' == typeof domElement ?
      dom(domElement) :
      domElement
    );
  }

  appendChild (child, ...args) {
    this.domElement.appendChild(child.domElement);
    return super.appendChild(child, ...args);
  }

  removeChild (child, ...args) {
    if (this.domElement.contains(child.domElement))
      this.domElement.removeChild(child.domElement);
    return super.removeChild(child, ...args)
  }

  focus () {
    this.domElement.focus();
  }
}

/**
 * Root application screen class.
 */

class TodoRootScreen extends TodoScreen {
  constructor () {
    super(document.querySelector('#main'), {id: 'root'});
  }
}

/**
 * Todo menu class.
 */

class TodoMenuScreen extends TodoScreen {
  constructor () {
    super(dom(
      `<section class="menu">
        <h3>Todos</h3>
        <ul class="items"></ul>
      </section>`
    ));
  }
}

/**
 * Todo menu item class.
 */

class TodoMenuItemScreen extends TodoScreen {
  constructor (todo = new Todo({})) {
    super(dom(
      `<li class="item">
        <input type="checkbox"
               name="check"
               ${todo.completed ? 'checked' : ''}>
        <span class="content"> ${todo.content} </span>
      </li>`
    ));

    bind(this, '[name=check]', 'change', e => {
      todo.completed = Boolean(e.target.checked);
      todo.save();
    });
  }
}

/**
 * new todo item screen
 */

class TodoNewItemScreen extends TodoScreen {
  constructor () {
    super(
      `<section class="new">
        <input type="text"
               name="content"
               placeholder="New Todo" />
        <input type="date"
               name="when" />

        <input type="button"
               name="save"
               value="Save" />
      </section>`
    );

    bind(this, '[name=save]', 'click');
    bind(this, '[name=when]', 'keyup');
    bind(this, '[name=content]', 'keyup');
  }

  onkeyup (e) {
    if (13 == e.keyCode)
      this.domElement.querySelector('[name=save]').click();
  }

  onclick (e) {
    const domElement = this.domElement;
    const content = domElement.querySelector('[name=content]');
    const when = domElement.querySelector('[name=when]');
    const todo = new Todo();

    e.preventDefault();

    if (!when.value)
      when.valueAsNumber = Date.now();

    todo.content = content.value;
    todo.when = Date.parse(when.value);

    if (todo.when && todo.content) {
      todo.save();
      this.clear();
      this.dispatchEvent('todosaved', todo, false, true);
    }
  }

  clear () {
    for (let input of [...this.domElement.querySelectorAll('input')]) {
      // black list input types
      if (['button'].indexOf(input.getAttribute('type')) > -1)
        continue;
      input.value = '';
    }
    return this;
  }
}

/**
 * Todo data model class
 */

class Todo {
  static uid () {
    return (Math.random() * 10e3 |0);
  }

  static load (id) {
    const app = TodoApplication.sharedInstance();
    const todo = new Todo();
    todo.id = id;
    const data = app.load(todo) || {};
    todo.content = data.content;
    todo.when = data.when;
    return todo;
  }

  constructor ({completed = false,
               content = null,
               when = Date.now(),
               id = Todo.uid()} = {}) {
    this.completed = completed || false;
    this.content = content;
    this.when = when || Date.now();
    this.id = id;
  }

  save () {
    const app = TodoApplication.sharedInstance();
    this.completed = this.completed || false;
    this.when = this.when || Date.now();
    this.id = this.id || Todo.uid();
    app.save(this);
    return this;
  }
}

class TodoController {
  constructor () {
    const create = new TodoNewItemScreen();
    const menu = new TodoMenuScreen();
    const root = new TodoRootScreen();
    const app = new TodoApplication();

    // @DEBUG
    window.app = app;
    window.root = root;

    this.knownTodos = [];
    this.create = create;
    this.menu = menu;
    this.root = root;
    this.app = app;

    this.renderTodos();

    root.addEventListener('todosaved', todo => {
      this.renderTodos();
      this.create.focus();
    });
  }

  loadTodos () {
    const app = TodoApplication.sharedInstance();
    const todos = app.storage.load().get('todos') || [];
    app.storage.set('todos', todos);
    return todos.map(todo => new Todo(todo));
  }

  renderTodos () {
    for (let todo of this.loadTodos()) {
      if (this.knownTodos.indexOf(todo.id) > -1)
        continue;

      this.knownTodos.push(todo.id);
      this.menu.appendChild(new TodoMenuItemScreen(todo));
    }

    this.root.appendChild(this.menu);
    this.root.appendChild(this.create);
  }
}

/**
 * Main.
 */

void () => {
  const controller = new TodoController();
}();
