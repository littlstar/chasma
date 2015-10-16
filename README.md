# chasma

Basic application screen management

*chasma* helps you structure your views.

## install

With npm:

```sh
$ npm install chasma --save
```

With duo:

```js
import * as chasma from 'littlstar/chasma';
```

## usage

*chasma* offers a `Screen` class that can be subclassed.
A screen may have children. A screen may also have a parent. A screen
can listen for and dispatch arbitrary events.

```js
class MyView extends chasma.Screen { }
```

## example

In this example we'll crean a base view screen class and extend it for
subclass views. Our base view class will be responsible for wrapping a
DOM element and knowning how to render it to a given screen instance.
We've also overloaded the `chasma.Screen` class's `appendChild()` and
`removeChild()` methods for DOM manipulation.

Our base class could look like this:

```js
class BaseScreen extends chasma.Screen {
  constructor (domElement = null) {
    super();
    this.domElement = domElement || document.createElement('div');
  }

  appendChild (child, ...args) {
    this.domElement.appendChild(child.domElement);
    return super.appendChild(child, ...args);
  }

  appendChild (child, ...args) {
    this.domElement.removeChild(child.domElement);
    return super.removeChild(child, ...args);
  }
}
```

We can now subclass and create a DOM element and pass it to the super
class constructor. We will also define an `add()` method for creating
menu items. Our menu items will also be subclasses of `BaseScreen`.

Our menu item screen class could look like this:

```js
class MenuItem extends BaseScreen {
  constructor (opts = {}) {
    super(createDom(`
      <li class="item">
        <a href="${opts.href}">${opts.content}</a>
      </li>
    `));
  }
}
```

and our menu class would look like this:

```js
class Menu extends BaseScreen {
  constructor () {
    super(createDom('<ul class="items"></ul'));
  }

  add (content) {
    this.appendChild(new MenuItem({content: content, href: '#'}));
    return this;
  }
}
```

We can make use of the `BaseScreen` class we just defined by creating a
root view instance. We'll pass the document body as the dom element and
create an instance. We will next create a menu and add a few items to
it and call its `render()` method passing in the root view.

```js
const root = new BaseScreen(document.body);
const menu = new Menu();

menu
.add('Food')
.add('Beer')
.add('Wine')
.add('Water');

root.appendChild(menu);
```

## license

MIT
