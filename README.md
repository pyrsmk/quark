quark 2.1.2
===========

Quark is a small javascript library that aims to let you compose your own framework from scratch. It brings a different syntax than the other frameworks which is a lot more intuitive and browser-friendly.

Quark is an alternative to [Ender](http://enderjs.com) without all the building process and a lot of overhead.

Installation
------------

```
npm install pyrsmk-quark
bower install pyrsmk-quark
jam install pyrsmk-quark
```

As Ender, you'll need to install third-party libraries to add ajax, animations, etc... But it has a basic support for readiness, node selection and creation.

Quick examples
--------------

```js
var $ = quark.$,
	$$ = quark.$$;
```

```js
$('.foo .bar').data('state', 'ok');
```

```js
$$('.comments').css('background', 'red');
```

Note that `data()` and `css()` methods are available by installing [quarky](https://github.com/pyrsmk/quarky) (that we're strongly to advise you to install).

Basics
------

Unlike jQuery-like libraries, each node is wrapped by quark and all methods (like `css()`) are available. Even into the methods themselves (like `on()` in quarky). But you can access to the base node with :

```js
var node = $('.foo').node;
```

If you need to verify if a node has already been wrapped or not, you can test for :

```js
if('quarked' in somenode) {
	// the node is wrapped
}
```

Quark has a heavy fault tolerance when searched nodes do not exist. Imagine, you have some blog comments that are not there for any reason, then that line won't crash anything :

```js
$('.comments').css('color', 'green');
```

Readiness
---------

Quark implements a basic ready function that should work in most browsers :

```js
$(function() {
	// Run some tasks when the DOM is ready
});
```

Selecting nodes
---------------

`$()` will return one wrapped node.

`$$()` will return a list of wrapped. A `forEach()` method has been added to iterate over the nodes.

```js
$$('.comments').forEach(function(index) {
	// index is the index of the current node in the list
	console.log(index);
	// the this keyword points to the current node
	this.css('background', 'red');
});
```

If you want to retrieve an array of nodes instead of an array of wrapped nodes, set `true` as second argument (really useful when some library expects an array of nodes) :

```js
var nodes = $$('.comments', true);
```

Creating nodes
--------------

You can create on node by calling `$()`. The returned node is wrapped as well :

```js
$('body').append($('<div>'));
```

You can create several nodes too :

```js
var nodes = $$('<div>1</div><div>2</div><div>3</div>');

nodes.css('display', 'inline');

$('body').append(nodes);
```

Calling node methods
--------------------

Quark is shipped with two base methods : `findOne()` and `findAll()`.

```js
// Find only one .bar node in .foo nodes
$('.foo').findOne('.bar');
// Find all .bar nodes in .foo nodes
$('.foo').findAll('.bar');
```

Calling node methods on `$$()` will apply the method to each node, as expected. But note that if the method is returning a value then `$$()` will return an array of all returned values. Per example :

```js
// Return an array of all .bar nodes found in each .foo node
$$('.foo').findAll('.bar');
```

Writing extensions
------------------

Writing extensions is simple, you just have to write code like the example below and release your library on NPM with a `quark` tag (so it can easily be found).

Here's the API :

- $._whenReady(function) : takes a function that verifies if the DOM is ready or not
- $._selectNode(selector) : takes a function to select one node
- $._selectNodes(selector) : takes a function to select several nodes
- $._createNode(html) : takes a function to create one node
- $._createNodes(html) : takes a function to create several nodes
- $._nodeMethods : is an object and accepts new methods that will be appended to nodes by quark

Example
-------

Here's a full example, based on [quarky](https://github.com/pyrsmk/quarky), [nut](https://github.com/pyrsmk/nut), [domReady](https://github.com/ded/domready), [morpheus](https://github.com/ded/morpheus) and [qwest](https://github.com/pyrsmk/qwest). First, we configure our framework :

```javascript
var $ = quark.$,
	$$ = quark.$$;

// Set the selector engine
$._selectNode = function(selector) {
	return nut(selector)[0];
};
$._selectNodes = nut;

// Set the ready function
$._whenReady = domready;

// Add animation methods
$._nodeMethods.animate = function(options) {
    return morpheus(this.node, options);
};
$._nodeMethods.fadeIn = function(duration, func) {
	var node = this;
    return morpheus(this.node, {
        duration : duration,
        opacity  : 1,
        complete : function() {
			func.call(node);
		}
    });
};
$._nodeMethods.fadeOut = function(duration, func) {
	var node = this;
    return morpheus(this.node, {
        duration : duration,
        opacity  : 0,
        complete : function() {
			func.call(node);
		}
    });
};

// Add an ajax method to the front object
$.ajax = qwest;
```

Now that the framework is set, we can use it :

```javascript
// When the DOM is ready
$(function() {
    // Animate images in .foo containers
	this.on('click', function() {
		this.findAll('img').fadeIn();
	});
    // Run a GET ajax request
    $.ajax.get('example.com')
          .then(function(xhr, response) {
              $('#info').html(response);
          });
});
```

License
-------

Quark is published under the [MIT license](http://dreamysource.mit-license.org).
