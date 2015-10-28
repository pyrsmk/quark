/*! quark 2.1.0 (https://github.com/pyrsmk/quark) */

/*
	Retrieve only one node

	Parameters
		String, Object, Function spec

	Return
		Object
*/
var $ = function(spec) {
	var quark;
	// Readiness
	if(typeof spec == 'function') {
		return $._whenReady(spec);
	}
	else if(typeof spec == 'string') {
		// Create new node
		if(/</.test(spec)) {
			quark = node2quark($._createNodes(spec)[0]);
		}
		// Get node
		else {
			quark = node2quark($._selectNode(spec));
		}
	}
	else {
		quark = node2quark(spec);
	}
	// Convert and return node
	return quark;
},

/*
	Retrieve a list of nodes

	Parameters
		String, Array spec
		Boolean raw

	Return
		Object
*/
$$ = function(spec, raw) {
	var quarks = [],
		i, j;
	raw = (typeof raw == 'undefined' ? false : !!raw);
	quarks.quarked = true;
	if(typeof spec == 'string') {
		// Create new nodes
		if(/</.test(spec)) {
			spec = $._createNodes(spec);
		}
		// Get nodes
		else{
			spec = $._selectNodes(spec);
		}
	}
	// Convert nodes
	if((typeof spec == 'object') && ('length' in spec)) {
		for(i = 0, j = spec.length; i < j; ++i) {
			quarks.push(!raw ? node2quark(spec[i]) : spec[i]);
		}
	}
	// Add global methods
	for(i in $._nodeMethods) {
		quarks[i] = function(quarks, method) {
			return function() {
				var results = [], results2, i, j, k, l;
				for(i = 0, j = quarks.length; i < j; ++i) {
					results.push(method.apply(quarks[i], arguments));
				}
				if(results.length) {
					// Quark nodes detected, return them
					if((typeof results[0] == 'object') && ('length' in results[0]) && results[0].length) {
						if('quarked' in results[0][0]) {
							results2 = [];
							for(i = 0, j = results.length; i < j; ++i) {
								for(k = 0, l = results[i].length; k < l; ++k) {
									results2.push(results[i][k]);
								}
							}
							return $$(results2);
						}
					}
					else if((typeof results[0] == 'object') && ('quarked' in results[0])) {
						results2 = [];
						for(i = 0, j = results.length; i < j; ++i) {
							results2.push(results[i]);
						}
						return $$(results2);
					}
					// Return the first result
					return results[0];
				}
				// No returned value, return $$()
				return quarks;
			};
		}(quarks, $._nodeMethods[i]);
	}
	// Add the 'forEach' method
	quarks.forEach = function(quarks) {
		return function(func) {
			var i = -1;
			while(quarks[++i]) {
				func.apply(quarks[i], [i]);
			}
			return quarks;
		};
	}(quarks);
	// Return nodes
	return quarks;
},

/*
	Convert regular node to quark

	Parameters
		Object node

	Return
		Object
*/
node2quark = function(node) {
	var quark = {node: null, quarked: true}, i;
	// Create a dummy node
	if((typeof node != 'object') || (node === null)) {
		var func = function(){};
		for(i in $._nodeMethods){
			quark[i] = func;
		}
	}
	// Create quark node
	else if(!('quarked' in node)) {
		quark.node = node;
		for(i in $._nodeMethods) {
			quark[i] = function(quark, method) {
				return function() {
					return method.apply(quark, arguments);
				};
			}(quark, $._nodeMethods[i]);
		}
	}
	else {
		quark = node;
	}
	return quark;
};

// Define default methods

$._whenReady = function(func) {
	if(document.readyState == 'complete') {
		func();
	}
	else {
		document.addEventListener('DOMContentLoaded', func);
	}
};

$._selectNode = function(selector) {
	return document.querySelector(selector);
};

$._selectNodes = function(selector) {
	return document.querySelectorAll(selector);
};

$._createNode = function(html) {
	var node = document.createElement('div'),
		nodelist = [];
	node.innerHTML = html;
	return node.firstChild;
};

$._createNodes = function(html) {
	var node = document.createElement('div'),
		nodelist = [];
	node.innerHTML = html;
	node = node.firstChild;
	nodelist.push(node);
	while(node = node.nextSibling) {
		nodelist.push(node);
	}
	return nodelist;
};

$._nodeMethods = {
	findOne: function(selector) {
		if('querySelector' in this.node) {
			return $(this.node.querySelector(selector));
		}
		else {
			return $();
		}
	},
	findAll: function(selector) {
		if('querySelectorAll' in this.node) {
			return $$(this.node.querySelectorAll(selector));
		}
		else {
			return $$([]);
		}
	}
};

// Export
return {
	$ : $,
	$$ : $$
};
