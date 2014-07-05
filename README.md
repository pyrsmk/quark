quark 1.3.1
===========

__Quark is now unmaintained. It was a great experience to me but now I prefer to switch to [ender](https://github.com/ender-js/Ender). If you want to continue this project, ask me, I would be honored to give you the repo. In any case, for those who would care about, I've exported the 'starter' module for ender at [ender-quarky](https://github.com/pyrsmk/ender-quarky) ;)__

Quark is a small javascript library that aims let you compose your own framework. It brings a different syntax approach than the other frameworks, like jQuery, that is a lot more intuitive and real-developer-friendly.

Basics
------

Getting nodes is handled by `$()`, which returns one and only one node, and `$$()` which returns a list of nodes. These nodes are wrapped by quark to expose several methods (like in the starter pack with `css()`, `height()`, `addClass()`, etc..., please see below). By default, the `this` keyword inside a method handled by quark points out to a node already wrapped by quark. The example below show that functionnality.

The node list returned by `$$()` is shipped with an `each` method :

```javascript
$$('.someclass').each(function(){
    // Access to the current node (with the starter pack)
    this.css('color','blue');
});
```

Quark creates dummy nodes to handle calls without sending an exception when the searched node was not found : if the node is not found and you have a call to `$('#some_node').css('background','red')`, that line won't send an exception and your script continues as well. Then, if you want to verify a node existence, please use the `found` method :

```javascript
if($('table').found){
    // <table> exists
}
```

Building its framework is possible with 5 internal functions:

- $._node : set some properties to this to automatically add methods to a node (inside the function, the keyword `this` points out to the wrapped node)
- $._selector : set the CSS selector engine
- $._creator : set the DOM node creator
- $._ready : set the ready function
- $._wrap : wrap a user function to have the `this` keyword pointing out to a quark node directly

Finally, if you need the original node from a wrapped node, just do : `$('#someid').node`.

Example
-------

Here's a full example, based on [nut](https://github.com/pyrsmk/nut), [domReady](https://github.com/ded/domready), [Gator](http://craig.is/riding/gators), [morpheus](https://github.com/ded/morpheus) and [qwest](https://github.com/pyrsmk/qwest).

```javascript
// Set the selector engine
$._selector=nut;

// Set the ready function
$._ready=domready;

// Replace the event handler (from the starter pack)
$._node.on=function(event,func){
    var el=this;
    Gator(el.node).on(event,function(e){
        return !!func.apply(el,[e]);
    });
};

// Add animation methods
$._node.animate=function(options){
    return morpheus(this.node,options);
};
$._node.fadeIn=function(duration,func){
    return morpheus(this.node,{
        duration : duration,
        opacity  : 1,
        complete : $._wrap(func,this)
    });
};
$._node.fadeOut=function(duration,func){
    return morpheus(this.node,{
        duration : duration,
        opacity  : 0,
        complete : $._wrap(func,this)
    });
};

// Add an ajax method to the front object
$.ajax=qwest;
```

```javascript
// When the DOM is ready
$(function(){
    // Animate images in .foo containers
    $('.foo').each(function(){
        this.on('click',function(e){
            $('img',this).fadeIn();
        })
    });
    // Launch a GET ajax request
    $.ajax.get('example.com',null,{type:'html'})
          .success(function(response){
              $('#info').node.innerHTML=response;
          });
})
```

Starter pack
------------

Quark is delivered with a starter version which adds many useful DOM functions and features:

- `$._creator` is already set
- all returned nodes are wrapped as well
- methods are chainable

Here's the API:

- css(name) : get a CSS property
- css(name,value) : set a CSS property
- css(object) : set a CSS property list
- html() : get HTML contents
- html(string) : set HTML contents
- text() : get text contents
- text(string) : set text contents
- attr(name) : get an attribute
- attr(name,value) : set an attribute
- data() : get the `data-foo` attribute list
- data(name) : get a data attribute
- data(name,value) : set a data attribute
- data(object) : set a data attribute list
- val() : get the value
- val(string) : set the value
- append(node) : append a node to the container
- prepend(node) : prepend a node to the container
- before(node) : add a node before it
- after(node) : add a node after it
- remove() : remove the node
- parent() : get the parent node
- previous() : get the previous node
- next() : get the next node
- children() : get node's children (return a node list via `$$`)
- addClass(string) : add a class
- removeClass(string) : remove a class
- hasClass(string) : verify if the class exist for that node
- width() : get the width
- height() : get the height
- top() : get the top offset
- left() : get the left offset
- clone() : clone the node (the returned node is wrapped)
- on(event,callback) : add one or a list of events (like `change mouseout click`); please return true to propagate the event

License
-------

Quark is under the [MIT license](http://dreamysource.mit-license.org).
