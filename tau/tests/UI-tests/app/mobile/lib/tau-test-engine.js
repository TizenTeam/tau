/*global tau, tizen */

var timerHandler = 0,
	FIRST_DELAY = 3000,
	RESPONSE_INTERVAL = 3000,
	TEST_REQUEST_DIR = "downloads",
	// path on device: /opt/usr/home/owner/media/Downloads/test-status.txt
	TEST_REQUEST_FILE_NAME = "test-request.txt",
	TEST_RESPONSE_FILE_NAME = "test-response.txt",
	dir = null,
	first = true,
	tests,
	testCase = {};

function openComm(onSuccess) {
	tizen.filesystem.resolve(TEST_REQUEST_DIR, function (resultDir) {
		// set global variable
		dir = resultDir;
		// Remove old request file
		dir.deleteFile(TEST_REQUEST_FILE_NAME);
		onSuccess();
	});
}

function getResponse(onSuccess) {
	console.log("getResponse");
	dir.listFiles(function (list) {
		var length = list.length,
			fileHandle = null,
			i;

		// important!
		// wait on request file delete
		for (i = 0; i < length; i++) {
			if (list[i].name === TEST_REQUEST_FILE_NAME) {
				console.log("Request file exists. Wait for remove file");
				fileHandle = list[i];
				break;
			}
		}

		if (fileHandle) {
			// Wait for remove request file
			setTimeout(getResponse.bind(null, onSuccess), RESPONSE_INTERVAL);
		} else {
			// IF REQUEST FILE NAME HAS BEEN DELETED THEN GET RESPONSE
			if (!fileHandle) {
				console.log("Request file not exists");
				// check if response file exists;
				for (i = 0; i < length; i++) {
					if (list[i].name === TEST_RESPONSE_FILE_NAME) {
						fileHandle = list[i];
						break;
					}
				}
			}

			if (fileHandle) {
				console.log("Read response");
				fileHandle.openStream("r",
					function (fileStream) {
						var status = fileStream.read(fileHandle.fileSize);

						fileStream.close();

						console.log("Remove response file");
						fileHandle = dir.deleteFile(TEST_RESPONSE_FILE_NAME);

						onSuccess(status);
					},
					function (err) {
						tau.log(err);
					});
			} else {
				// Wait for remove response file
				setTimeout(getResponse.bind(null, onSuccess), RESPONSE_INTERVAL);
			}
		}
	});
}

function sendRequest(status, onSuccess) {
	var fileHandle,
		length,
		i;

	dir.listFiles(function (list) {
		length = list.length;

		// check request
		for (i = 0; i < length; i++) {
			if (list[i].name === TEST_REQUEST_FILE_NAME) {
				fileHandle = list[i];
				break;
			}
		}

		if (!fileHandle) {
			fileHandle = dir.createFile(TEST_REQUEST_FILE_NAME);
		}

		fileHandle.openStream("w",
			function (fileStream) {
				fileStream.write(status);
				fileStream.close();

				// wait for response from server;
				getResponse(onSuccess);
			},
			function (err) {
				tau.log(err);
			});
	});
}

function readTextFile(file, callback) {
	var rawFile = new XMLHttpRequest();

	rawFile.overrideMimeType("application/json");
	rawFile.open("GET", file, true);
	rawFile.onreadystatechange = function () {
		if (rawFile.readyState === 4 && (rawFile.status == "200" ||
			rawFile.status === 0)) {
			callback(rawFile.responseText);
		}
	};
	rawFile.send(null);
}

function onEnd() {
	console.log("end");
}


function nextTestCase() {
	// prepare next test case
	testCase = tests.shift();

	if (testCase) {
		timerHandler = setTimeout(
			startTestCase,
			parseInt(testCase.time, 10)
		);
	} else {
		setTimeout(function () {
			sendRequest("end!", onEnd);
		}, 1000);
	}
}

function startTestCase() {
	var dir = first ? "" : "../";

	first = false;

	if (testCase) {
		tau.changePage(dir + "tests/" + testCase.name +	".html");
	} else {
		clearTimeout(timerHandler);
	}
}

function onRequestSuccess(status) {
	console.log(status);
	nextTestCase();
}

function onPageChange() {
	var path = tau.util.path.parseUrl(tau.router.history.activeState.url);

	tau.log(path.filename);
	sendRequest("take-screenshot:" + path.filename, onRequestSuccess);
}

function main() {
	readTextFile("test.txt", function (testName) {
		readTextFile("screenshots.json", function (text) {
			openComm(function () {

				tests = JSON.parse(text);
				first = true;

				if (testName) {
					tests = tests.filter(function (item) {
						return item.name === testName;
					});
				}

				document.addEventListener("pagechange", onPageChange, true);

				testCase = tests.shift();
				timerHandler = setTimeout(startTestCase, FIRST_DELAY);
			});
		});
	});
}

// start test;
main();