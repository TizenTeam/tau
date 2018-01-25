function onPageShow(ev) {

	var sampleBox = tau.engine.getBinding("append-example-box"),
		button1 = tau.widget.Button(),
		button2 = tau.widget.Button(),
		button3 = tau.widget.Button(),
		button4 = tau.widget.Button();

	sampleBox.append(button1);
	sampleBox.append(button2);
	sampleBox.append(button3);
	sampleBox.append(button4);

}

document.addEventListener('pageshow', onPageShow);


