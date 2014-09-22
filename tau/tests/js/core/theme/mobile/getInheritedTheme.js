module("ej.jqm.engine", {});

test ("getInheritedTheme - theme by data-role" , function () {
	var list = document.getElementById("elem1"),
		button1 = document.getElementById("elem2"),
		button2 = document.getElementById("elem3");

	equal(list.getAttribute("data-theme"), "l", "Reading attribute.");
	equal(ej.theme.getInheritedTheme(list), "l", "Get inherited theme");

	equal(button1.getAttribute("data-theme"), null, "Reading attribute.");
	equal(ej.theme.getInheritedTheme(button1), "x", "Get inherited theme");

	equal(button2.getAttribute("data-theme"), "b", "Reading attribute.");
	equal(ej.theme.getInheritedTheme(button2), "b", "Get inherited theme");
});
test ("getInheritedTheme - theme by class" , function () {
	var list = document.getElementById("elem4"),
		button1 = document.getElementById("elem5"),
		button2 = document.getElementById("elem6");

	equal(list.getAttribute("data-theme"), null, "Reading attribute.");
	equal(ej.theme.getInheritedTheme(list), "x", "Get inherited theme");

	equal(button1.getAttribute("data-theme"), null, "Reading attribute.");
	equal(ej.theme.getInheritedTheme(button1), "c", "Get inherited theme");

	equal(button2.getAttribute("data-theme"), "b", "Reading attribute.");
	equal(ej.theme.getInheritedTheme(button2), "b", "Get inherited theme");
});