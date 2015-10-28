var $ = quark.$,
	$$ = quark.$$;

QUnit.test('Ready', function(assert) {
	var done = assert.async();
	assert.expect(1);
	$(function() {
		assert.ok(true);
		done();
	});
});

QUnit.test('Create one node', function(assert) {
	assert.expect(2);
	var el = $('<span>1</span>');
	assert.ok(typeof el == 'object' && el.quarked, 'Quarked node');
	assert.ok(el.node.nodeName == 'SPAN', 'Is a SPAN');
});

QUnit.test('Create several nodes', function(assert) {
	assert.expect(4);
	var els = $$('<span>1</span><span>2</span>');
	assert.ok(typeof els == 'object' && 'length' in els, 'Is an array');
	assert.ok(els.length == 2, 'Has two nodes');
	assert.ok(els[0].quarked && els[1].quarked, 'Quarked nodes');
	assert.ok(els[0].node.nodeName == 'SPAN' && els[1].node.nodeName == 'SPAN', 'Are SPANs');
	
});

QUnit.test('Get one element',function(assert) {
	assert.expect(4);
	var el = $('.test');
	assert.ok(typeof el == 'object' && el.quarked, 'Quarked node');
	assert.ok(typeof el.findOne == 'function', 'findOne() is defined');
	assert.ok(typeof el.findAll == 'function', 'findAll() is defined');
	el = $('.notfound');
	assert.ok(el.node === null, 'Not found');
});

QUnit.test('Get several elements',function(assert) {
	assert.expect(7);
	var els = $$('.test');
	assert.ok(typeof els == 'object' && 'length' in els, 'Is an array');
	assert.ok(els.length == 3, 'Has three nodes');
	assert.ok(els[0].quarked && els[1].quarked && els[2].quarked, 'Quarked nodes');
	assert.ok(typeof els[0].findOne == 'function' && typeof els[1].findOne == 'function' && typeof els[2].findOne == 'function', 'findOne() is defined');
	assert.ok(typeof els[0].findAll == 'function' && typeof els[1].findAll == 'function' && typeof els[2].findAll == 'function', 'findAll() is defined');
	els = $$('.notfound');
	assert.ok(typeof els == 'object' && 'length' in els && els.length == 0, 'Not found');
	els = $$('.test', true);
	assert.ok(!('quarked' in els[0]) && !('quarked' in els[1]) && !('quarked' in els[2]), 'Normal nodes');
});

QUnit.test('forEach()',function(assert) {
	var done = assert.async();
	assert.expect(9);
	var i = 0;
	$$('.test').forEach(function(j) {
		assert.ok(i++ == j, 'forEach() : Valid index');
		assert.ok(typeof this == 'object' && this.quarked, 'forEach() : Valid element');
		assert.ok(this.node.nodeName == 'DIV', 'forEach() : is a DIV');
		if(j == 2) {
			done();
		}
	});
});

QUnit.test('findOne()', function(assert) {
	assert.expect(3);
	var el = $('.test').findOne('span');
	assert.ok(typeof el == 'object' && el.quarked, 'Quarked node');
	assert.ok(el.node.nodeName == 'SPAN', 'Is a SPAN');
	el = $('.test').findOne('a');
	assert.ok(el.node === null, 'Not found');
});

QUnit.test('findAll()', function(assert) {
	assert.expect(5);
	var els = $$('.test').findAll('span');
	assert.ok(typeof els == 'object' && 'length' in els, 'Is an array');
	assert.ok(els.length == 3, 'Has three nodes');
	assert.ok(els[0].quarked && els[1].quarked && els[2].quarked, 'Quarked nodes');
	assert.ok(els[0].node.nodeName == 'SPAN' && els[1].node.nodeName == 'SPAN' && els[2].node.nodeName == 'SPAN', 'Are SPANs');
	els = $$('.test').findAll('a');
	assert.ok(typeof els[0] == 'object' && 'length' in els[0] && els[0].length == 0 && typeof els[1] == 'object' && 'length' in els[1] && els[1].length == 0 && typeof els[2] == 'object' && 'length' in els[2] && els[2].length == 0, 'Not found');
});

QUnit.start();