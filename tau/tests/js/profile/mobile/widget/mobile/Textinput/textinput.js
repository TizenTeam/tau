/**
 * Created by m.urbanski on 16.06.14.
 */
var tauConfig = {
	"autorun": false
};

test("input type=text" , function () {
	var input = document.getElementById('name');

	//after build
	tau.widget.TextInput(input);

	equal("true", "true", "Input widget is created");
	equal(input.getAttribute('data-tau-bound'), "TextInput", "Input widget is created");
	ok(input.classList.contains('ui-input-text'), 'Input has ui-input-text class');
	ok(input.classList.contains('ui-body-s'), 'Input has ui-body-s class');
});

test("input type=textarea" , function () {
	var input1 = document.getElementById('textarea');

	//after build
	tau.widget.TextInput(input1);
	equal(input1.getAttribute('data-tau-bound'), "TextInput", "Input widget is created");
	ok(input1.classList.contains('ui-input-text'), 'Input has ui-input-text class');
	ok(input1.classList.contains('ui-body-s'), 'Input has ui-body-s class');
});

test("input type=password" , function () {
	var input2 = document.getElementById('password');

	//after build
	tau.widget.TextInput(input2);
	equal(input2.getAttribute('data-tau-bound'), "TextInput", "Input widget is created");
	ok(input2.classList.contains('ui-input-text'), 'Input has ui-input-text class');
	ok(input2.classList.contains('ui-body-s'), 'Input has ui-body-s class');
});

test("input type=number" , function () {
	var input3 = document.getElementById('number');

	//after build
	tau.widget.TextInput(input3);
	equal(input3.getAttribute('data-tau-bound'), "TextInput", "Input widget is created");
	ok(input3.classList.contains('ui-input-text'), 'Input has ui-input-text class');
	ok(input3.classList.contains('ui-body-s'), 'Input has ui-body-s class');
});

test("input type=email" , function () {
	var input4 = document.getElementById('email');

	//after build
	tau.widget.TextInput(input4);
	equal(input4.getAttribute('data-tau-bound'), "TextInput", "Input widget is created");
	ok(input4.classList.contains('ui-input-text'), 'Input has ui-input-text class');
	ok(input4.classList.contains('ui-body-s'), 'Input has ui-body-s class');
});

test("input type=url" , function () {
	var input5 = document.getElementById('url');

	//after build
	tau.widget.TextInput(input5);
	equal(input5.getAttribute('data-tau-bound'), "TextInput", "Input widget is created");
	ok(input5.classList.contains('ui-input-text'), 'Input has ui-input-text class');
	ok(input5.classList.contains('ui-body-s'), 'Input has ui-body-s class');
});

test("input type=tel" , function () {
	var input6 = document.getElementById('tel');

	//after build
	tau.widget.TextInput(input6);
	equal(input6.getAttribute('data-tau-bound'), "TextInput", "Input widget is created");
	ok(input6.classList.contains('ui-input-text'), 'Input has ui-input-text class');
	ok(input6.classList.contains('ui-body-s'), 'Input has ui-body-s class');
});

test("input type=time" , function () {
	var input7 = document.getElementById('time');

	//after build
	tau.widget.TextInput(input7);
	equal(input7.getAttribute('data-tau-bound'), "TextInput", "Input widget is created");
	ok(input7.classList.contains('ui-input-text'), 'Input has ui-input-text class');
	ok(input7.classList.contains('ui-body-s'), 'Input has ui-body-s class');
});

test("input type=date" , function () {
	var input8 = document.getElementById('date');

	//after build
	tau.widget.TextInput(input8);
	equal(input8.getAttribute('data-tau-bound'), "TextInput", "Input widget is created");
	ok(input8.classList.contains('ui-input-text'), 'Input has ui-input-text class');
	ok(input8.classList.contains('ui-body-s'), 'Input has ui-body-s class');
});

test("input type=month" , function () {
	var input9 = document.getElementById('month');

	//after build
	tau.widget.TextInput(input9);
	equal(input9.getAttribute('data-tau-bound'), "TextInput", "Input widget is created");
	ok(input9.classList.contains('ui-input-text'), 'Input has ui-input-text class');
	ok(input9.classList.contains('ui-body-s'), 'Input has ui-body-s class');
});

test("input type=week" , function () {
	var input10 = document.getElementById('week');

	//after build
	tau.widget.TextInput(input10);
	equal(input10.getAttribute('data-tau-bound'), "TextInput", "Input widget is created");
	ok(input10.classList.contains('ui-input-text'), 'Input has ui-input-text class');
	ok(input10.classList.contains('ui-body-s'), 'Input has ui-body-s class');
});

test("input type=datetime" , function () {
	var input11 = document.getElementById('datetime');

	//after build
	tau.widget.TextInput(input11);
	equal(input11.getAttribute('data-tau-bound'), "TextInput", "Input widget is created");
	ok(input11.classList.contains('ui-input-text'), 'Input has ui-input-text class');
	ok(input11.classList.contains('ui-body-s'), 'Input has ui-body-s class');
});

test("input type=color" , function () {
	var input12 = document.getElementById('color');

	//after build
	tau.widget.TextInput(input12);
	equal(input12.getAttribute('data-tau-bound'), "TextInput", "Input widget is created");
	ok(input12.classList.contains('ui-input-text'), 'Input has ui-input-text class');
	ok(input12.classList.contains('ui-body-s'), 'Input has ui-body-s class');
});

test("input type=search" , function () {
	var input13 = document.getElementById('search');
	equal("true", "true", "Input widget is created");

	//after build
	tau.widget.TextInput(input13);
	equal(input13.getAttribute('data-tau-bound'), "TextInput", "Input widget is created");
	ok(input13.classList.contains('ui-input-text'), 'Input has ui-input-text class');
	ok(input13.classList.contains('ui-body-s'), 'Input has ui-body-s class');

});

test("textinput - Enabled state", function () {
	var input14 = document.getElementById('enabled');

	//after build
	tau.widget.TextInput(input14);
	equal(input14.getAttribute('data-tau-bound'), "TextInput", "textinput widget is created");
	ok(!input14.classList.contains('ui-state-disabled'), 'textinput hasn\'t ui-state-disabled class');
	ok(!input14.getAttribute('disabled'), 'textinput hasn\'t disabled attribute');

});

test("textinput - Disabled state", function () {
	var input15 = document.getElementById('disabled');

	//after build
	tau.widget.TextInput(input15);
	equal(input15.getAttribute('data-tau-bound'), "TextInput", "textinput widget is created");
	ok(input15.classList.contains('ui-state-disabled'), 'textinput has ui-state-disabled class');
	ok(input15.getAttribute('disabled'), 'textinput has disabled attribute');

});

test("textinput - value get/set", function () {
	var input18 = document.getElementById('getset');

	//after build
	var textInput = tau.widget.TextInput(input18);

	equal(textInput.value(), "default value", "textinput initial value not read");
	textInput.value('tEsT 1');
	equal(textInput.value(), "tEsT 1", "textinput value set");
});

test("getLabel, setLabel - label does not exist on startup", function () {
	var input17 = document.getElementById("focusd"),
		widget,
		labelText = "label_text",
		label,
		parentId = "inputParentId";

	//after build
	widget = tau.widget.TextInput(input17);

	equal(widget.getLabel(), null, "Input doesn`t have label");

	label = input17.parentNode.querySelector("label[for='" + input17.id + "']");
	ok(label === null, "Input doesn't have label - direct check");

	widget.setLabel(labelText);

	equal(widget.getLabel(), labelText, "Label added");

	// check if label is put in a proper place
	input17.parentElement.id = parentId;
	label = input17.parentNode.querySelector("#" + parentId + " > label[for='" + input17.id + "']");
	ok(label !== null, "Label is set as a child of input parent");
});

test("getLabel, setLabel - label exists on startup", function () {
	var input16 = document.getElementById("focuse"),
		widget,
		labelText = "label_text";

	//after build
	widget = tau.widget.TextInput(input16);

	ok(widget.getLabel() != null, "Input has label");

	widget.setLabel(labelText);

	equal(widget.getLabel(), labelText, "Label properly set");
});
