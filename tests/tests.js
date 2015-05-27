window.$ = quark.$;
window.$$ = quark.$$;

$(function() {

	test('$()', function() {
		expect(7);
		ok($('#tests').node, 'Selector');
		ok($('#tests').findOne('.test').node, 'findOne');
		ok($('#tests').findAll('.test').length == 3, 'findAll');
		ok($('#tests').node.children.length == 3, 'Has 3 children');
		ok($('<div>').node.tagName == 'DIV', 'DIV created');
		ok($($('#tests')).node, 'Node passed');
		ok(!$('#pwet').findOne('.pwet'), 'Dummy node');
	});

	test('$$()', function() {
		expect(9);
		ok($$('.test').length == 3, 'Found 3 nodes');
		$$('.test').forEach(function() {
			ok(true, 'forEach');
		});
		ok($$('<div>')[0].node.tagName == 'DIV', 'DIV created');
		ok($$($$('.test')).length == 3, '3 nodes passed');
		ok(!$$('.pwet').findOne('.pwet').findOne('.pwet').node, 'Dummy node');
		ok($$('.test').findOne('span').length == 3 && $$('.test').findOne('span')[0].node.tagName == 'SPAN', 'Concatenate results with findOne');
		ok($$('.test').findAll('span').length == 3 && $$('.test').findAll('span')[0].node.tagName == 'SPAN', 'Concatenate results with findAll');
	});

});
