function onPageShow(e) {

	var contentElement = document.getElementById("append-example-content"),
		sampleBox,
		button1 = tau.widget.Button(),
		button2 = tau.widget.Button(),
		button3 = tau.widget.Button(),
		button4 = tau.widget.Button();

	button1.value("Button 1");
	button2.value("Button 2");
	button3.value("Button 3");
	button4.value("Button 4");


	sampleBox = tau.widget.Box({layout: "linear"});

	contentElement.appendChild(sampleBox.getContainer());
	sampleBox.append([button1,
		button2,
		button3,
		button4]);

}

document.getElementById("append-example-page").addEventListener('pageshow', onPageShow);


