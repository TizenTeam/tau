/*global tau, tizen */

var timerHandler = 0,
	FIRST_DELAY = 3000,
	TEST_STATUS_DIR = "downloads",
	// path on device: /opt/usr/home/owner/media/Downloads/test-status.txt
	TEST_STATUS_FILE_NAME = "test-status.txt";

function writeTestStatus(status) {
	tizen.filesystem.resolve(TEST_STATUS_DIR, function (dir) {
		var fileHandle,
			length,
			i;

		dir.listFiles(function (list) {
			length = list.length;

			for (i = 0; i < length; i++) {
				if (list[i].name === TEST_STATUS_FILE_NAME) {
					fileHandle = list[i];
				}
			}

			if (!fileHandle) {
				fileHandle = dir.createFile(TEST_STATUS_FILE_NAME);
			}

			fileHandle.openStream("w",
				function onSuccess(fileStream) {
					fileStream.write(status);
					fileStream.close();
				},
				function onEror(err) {
					tau.log(err);
				});
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

function onPageChange() {
	var path = tau.util.path.parseUrl(tau.router.history.activeState.url);

	tau.log(path.filename);
	writeTestStatus(path.filename);
}

readTextFile("test.txt", function (testName) {
	readTextFile("screenshots.json", function (text) {
		var tests = JSON.parse(text),
			testCase = {},
			first = true,
			startTestCase = function () {
				var dir = first ? "" : "../";

				first = false;


				if (testCase) {
					tau.changePage(dir + "tests/" + testCase.name +	".html");

					// prepare next test case
					testCase = tests.shift();
					if (testCase) {
						timerHandler = setTimeout(
							startTestCase,
							parseInt(testCase.time, 10)
						);
					}
				} else {
					clearTimeout(timerHandler);
				}
			};

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
