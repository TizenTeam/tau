/**
 * Created by m.urbanski on 24.02.15.
 */
document.addEventListener("tauinit", function() {
	console.log("built start");
	var pageContainer = tau.widget.pagecontainer(),
		page = tau.widget.Page({
			header: "Title",
			content: "This is application built from JS",
			footer: true
		}),
		button = tau.widget.Button({inline: true, text: "absolute"}),
		button1 = tau.widget.Button({inline: true, text: "horizontal"}),
		button2 = tau.widget.Button({inline: true, text: "vertical"}),
		button3 = tau.widget.Button({inline: true, text: "linear"});

	pageContainer.element.appendChild(page.element);
	page.element.querySelector("footer").appendChild(button.element);
	page.element.querySelector("footer").appendChild(button1.element);
	page.element.querySelector("footer").appendChild(button2.element);
	page.element.querySelector("footer").appendChild(button3.element);

	button.on("click", function() {
		page.option("content", "This is after click " + button.option("text") + " " +(new Date()));
		page.refresh();
	});

	button1.on("click", function() {
		page.option("content", "This is after click " + button1.option("text") + " " +(new Date()));
		page.refresh();
	});

	button2.on("click", function() {
		page.option("content", "This is after click "  + button2.option("text") + " " + (new Date()));
		page.refresh();
	});

	button3.on("click", function() {
		page.option("content", "This is after click " + button3.option("text") + " " +(new Date()));
		page.refresh();
	});
	console.log("built finish");
	document.addEventListener("DOMContentLoaded", function() {
		document.body.appendChild(pageContainer.element);
		page.refresh();
	});
});