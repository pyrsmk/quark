quark 2.0.0
===========

Quark is a small javascript library that aims to let you compose your own framework from scratch. It brings a different syntax approach than the other frameworks, like jQuery, that is a lot more intuitive and browser-friendly.

Quark is an alternative to [ender](http://enderjs.com) without all the building process and a lot of overhead.

Installation
------------

Quark supports AMD/CommonJS and fits well with Browserify/Webpack.

```
jam install pyrsmk-quark
bower install pyrsmk-quark
npm install pyrsmk-quark --save-dev
```

You can pick up the minified source file directly from github too ;)

Basics
------

For all examples, we're using this configuration :

```js
var quark = require('pyrsmk-quark');

window.$ = quark.$;
window.$$ = quark.$$;
```

Because quark is modular, the `$` and `$$` variables aren't set globally, but as you can see you can define them yourself easily.

So! Let's begin!

Here's how we can retrieve nodes :

```js
// Return one and only one node
$('.someclass');

// Return a list of nodes
$$('.someclass');

// Access to the real node; it's like $('#someid')[0] in jQuery
$('#someid').node;

// Create a node
$('<ul>');
```

To apply some tasks to a list of nodes, you can call, for example, the `css()` method and all nodes in the list will be affected, like with jQuery.

There's also a `forEach()` method if you want to apply some specific tasks to, let's say, a node :

```js
$$('.someclass').forEach(function(i) {
	// Display the index of the current node
	console.log('node : '+i);
	// Modify the text property of each node
	// Note that the 'this' keyword refers to the same node as in the list (yeah, the wrapped one with all the methods and shit)
	this.node.text = 'test';
});
```

It can happen that your selector does not find anything on purpose (or not, but that's your problem). Per example, you have a blog post and want to apply some things on the comments. Those comments can not exist at all but you don't want that your script crashes or make many tests to verify if those comments are here or not. Quark handles that for you automatically by creating dummy nodes. Then, any call to a node method (like `css()`) won't blow up anything.

```js
// No comment exists? Just don't care.
$$('.comment').css('color','red');
```

If needed, you can verify if the nodes have been found like this :

```js
// A node has been found
if($('table').node) {
    // some tasks
}
// Several nodes have been found
if($$('.comment').length) {
    // some tasks
}
```

Last note. When calling a method on `$$()`, results can be returned. Since the method will be called on all nodes registered on `$$()`, only the first result will be returned (as many frameworks indeed). But if those results are quark nodes then all of them will be concatenated into a single list. It's really useful with `findOne()` and `findAll()` per example.

Let's dig in!
-------------

In the last chapter, we have seen how quark is working but, at this time, we don't have any DOM methods, specific selector engine or readiness library inside it. Quark is delivered with a very concise support for recent browsers only. Here's the API to define your own libraries/methods inside quark :

- $._whenReady(function) : takes a function that verifies if the DOM is ready or not
- $._selectNode(selector) : takes a function to select one node
- $._selectNodes(selector) : takes a function to select several nodes
- $._createNodes(html) : takes a function to create one or several nodes
- $._nodeMethods : is an object and accepts new methods that will be appended to nodes by quark

Example
-------

Here's a full example, based on [quarky](https://github.com/pyrsmk/quark-quarky) (already configured to append DOM methods to quark), [nut](https://github.com/pyrsmk/nut), [domReady](https://github.com/ded/domready), [morpheus](https://github.com/ded/morpheus) and [qwest](https://github.com/pyrsmk/qwest). First, we configure our framework :

```javascript
var $ = require('pyrsmk-quark').$,
	$$ = require('pyrsmk-quark').$$,
	nut = require('nut'),
	domready = require('domready'),
	morpheus = require('morpheus'),
	qwest = require('qwest');

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
    $('.foo').forEach(function() {
        this.on('click', function() {
            this.findAll('img').fadeIn();
        });
    });
    // Launch a GET ajax request
    $.ajax.get('example.com')
          .then(function(response) {
              $('#info').html(response);
          });
})
```

Write extensions
----------------

Writing "extensions" is simple, you just have to write code like the example above and release your library on NPM with a `quark` tag (so it can be easily found). Please note that your library must be valid as a module so it can be required and browserified.

License
-------

Quark is published under the [MIT license](http://dreamysource.mit-license.org).
