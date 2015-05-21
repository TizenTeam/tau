/**
 * Created by m.urbanski on 16.06.14.
 */
var tauConfig = {
	"autorun": false
};
module("profile/mobile/widget/mobile/Textinput");

test ( "input type=text" , function () {
	var input = document.getElementById('name');

	//after build
	$(input).textinput();

	equal("true", "true", "Input widget is created");
	equal(input.getAttribute('data-tau-bound'), "TextInput", "Input widget is created");
	ok(input.classList.contains('ui-input-text'), 'Input has ui-input-text class');
	ok(input.classList.contains('ui-body-s'), 'Input has ui-body-s class');
});
test ( "input type=textarea" , function () {
	var input1 = document.getElementById('textarea');

	//after build
	$(input1).textinput();
	equal(input1.getAttribute('data-tau-bound'), "TextInput", "Input widget is created");
	ok(input1.classList.contains('ui-input-text'), 'Input has ui-input-text class');
	ok(input1.classList.contains('ui-body-s'), 'Input has ui-body-s class');
});

test ( "input type=password" , function () {
	var input2 = document.getElementById('password');

	//after build
	$(input2).textinput();
	equal(input2.getAttribute('data-tau-bound'), "TextInput", "Input widget is created");
	ok(input2.classList.contains('ui-input-text'), 'Input has ui-input-text class');
	ok(input2.classList.contains('ui-body-s'), 'Input has ui-body-s class');
});

test ( "input type=number" , function () {
	var input3 = document.getElementById('number');

	//after build
	$(input3).textinput();
	equal(input3.getAttribute('data-tau-bound'), "TextInput", "Input widget is created");
	ok(input3.classList.contains('ui-input-text'), 'Input has ui-input-text class');
	ok(input3.classList.contains('ui-body-s'), 'Input has ui-body-s class');
});

test ( "input type=email" , function () {
	var input4 = document.getElementById('email');

	//after build
	$(input4).textinput();
	equal(input4.getAttribute('data-tau-bound'), "TextInput", "Input widget is created");
	ok(input4.classList.contains('ui-input-text'), 'Input has ui-input-text class');
	ok(input4.classList.contains('ui-body-s'), 'Input has ui-body-s class');
});

test ( "input type=url" , function () {
	var input5 = document.getElementById('url');

	//after build
	$(input5).textinput();
	equal(input5.getAttribute('data-tau-bound'), "TextInput", "Input widget is created");
	ok(input5.classList.contains('ui-input-text'), 'Input has ui-input-text class');
	ok(input5.classList.contains('ui-body-s'), 'Input has ui-body-s class');
});

test ( "input type=tel" , function () {
	var input6 = document.getElementById('tel');

	//after build
	$(input6).textinput();
	equal(input6.getAttribute('data-tau-bound'), "TextInput", "Input widget is created");
	ok(input6.classList.contains('ui-input-text'), 'Input has ui-input-text class');
	ok(input6.classList.contains('ui-body-s'), 'Input has ui-body-s class');
});

test ( "input type=time" , function () {
	var input7 = document.getElementById('time');

	//after build
	$(input7).textinput();
	equal(input7.getAttribute('data-tau-bound'), "TextInput", "Input widget is created");
	ok(input7.classList.contains('ui-input-text'), 'Input has ui-input-text class');
	ok(input7.classList.contains('ui-body-s'), 'Input has ui-body-s class');
});

test ( "input type=date" , function () {
	var input8 = document.getElementById('date');

	//after build
	$(input8).textinput();
	equal(input8.getAttribute('data-tau-bound'), "TextInput", "Input widget is created");
	ok(input8.classList.contains('ui-input-text'), 'Input has ui-input-text class');
	ok(input8.classList.contains('ui-body-s'), 'Input has ui-body-s class');
});

test ( "input type=month" , function () {
	var input9 = document.getElementById('month');

	//after build
	$(input9).textinput();
	equal(input9.getAttribute('data-tau-bound'), "TextInput", "Input widget is created");
	ok(input9.classList.contains('ui-input-text'), 'Input has ui-input-text class');
	ok(input9.classList.contains('ui-body-s'), 'Input has ui-body-s class');
});

test ( "input type=week" , function () {
	var input10 = document.getElementById('week');

	//after build
	$(input10).textinput();
	equal(input10.getAttribute('data-tau-bound'), "TextInput", "Input widget is created");
	ok(input10.classList.contains('ui-input-text'), 'Input has ui-input-text class');
	ok(input10.classList.contains('ui-body-s'), 'Input has ui-body-s class');
});

test ( "input type=datetime" , function () {
	var input11 = document.getElementById('datetime');

	//after build
	$(input11).textinput();
	equal(input11.getAttribute('data-tau-bound'), "TextInput", "Input widget is created");
	ok(input11.classList.contains('ui-input-text'), 'Input has ui-input-text class');
	ok(input11.classList.contains('ui-body-s'), 'Input has ui-body-s class');
});

test ( "input type=color" , function () {
	var input12 = document.getElementById('color');

	//after build
	$(input12).textinput();
	equal(input12.getAttribute('data-tau-bound'), "TextInput", "Input widget is created");
	ok(input12.classList.contains('ui-input-text'), 'Input has ui-input-text class');
	ok(input12.classList.contains('ui-body-s'), 'Input has ui-body-s class');
});

test ( "input type=search" , function () {
	var input13 = document.getElementById('sear');
	equal("true", "true", "Input widget is created");

	//after build
	$(input13).textinput();
	equal(input13.getAttribute('data-tau-bound'), "TextInput", "Input widget is created");
	ok(input13.classList.contains('ui-input-text'), 'Input has ui-input-text class');
	ok($(input13).hasClass('ui-body-s'), 'Input has ui-body-s class');

});

test("textinput - Enabled state", function () {
	var input14 = document.getElementById('enab');

	//after build
	$(input14).textinput();
	equal(input14.getAttribute('data-tau-bound'), "TextInput", "textinput widget is created");
	ok(!input14.classList.contains('ui-state-disabled'), 'textinput hasn\'t ui-state-disabled class');
	ok(!input14.getAttribute('disabled'), 'textinput hasn\'t disabled attribute');

});

test("textinput - Disabled state", function () {
	var input15 = document.getElementById('disa');

	//after build
	$(input15).textinput();
	equal(input15.getAttribute('data-tau-bound'), "TextInput", "textinput widget is created");
	ok(input15.classList.contains('ui-state-disabled'), 'textinput has ui-state-disabled class');
	ok(input15.getAttribute('disabled'), 'textinput has disabled attribute');

});

test("textinput - focus on enabled", function () {
	var input16 = document.getElementById('focuse');

	//after build
	$(input16).textinput();
	$(input16).focus();

	equal(input16.getAttribute('data-tau-bound'), "TextInput", "textinput widget is created");
	ok(input16.classList.contains('ui-focus'), 'textinput has ui-focus class');
});

test("textinput - focus on disabled", function () {
	var input17 = document.getElementById('focusd');

	//after build
	$(input17).textinput();
	$(input17).focus();

	equal(input17.getAttribute('data-tau-bound'), "TextInput", "textinput widget is created");
	ok(!input17.classList.contains('ui-focus'), "textinput dosn't have ui-focus class");
});
