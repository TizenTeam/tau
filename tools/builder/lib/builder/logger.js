/*global JavaImporter, JavaAdapter, java, require, exports */
(function (exports) {
	JavaImporter(
		java.util.logging.Logger,
		java.util.logging.Level,
		java.util.logging.Formatter,
		java.util.logging.ConsoleHandler,
		java.lang.String
	);
	var LoggerClass = java.util.logging.Logger,
		Level = java.util.logging.Level,
		Formatter = java.util.logging.Formatter,
		Logger = LoggerClass.getLogger("builder"),
		ConsoleHandler = java.util.logging.ConsoleHandler,
		handler = new ConsoleHandler();

	exports.info = function (message) {
		Logger.info(message);
	};

	exports.warning = function (message, error) {
		Logger.warning(message + (error ? ": " + error.message : ""));
	};

	exports.error = function (message, error) {
		Logger.severe(message + (error ? ": " + error.message : ""));
	};

	exports.config = function (message) {
		Logger.config(message);
	};

	exports.setLevel = function (level) {
		switch (level) {
		case "all":
			Logger.setLevel(Level.ALL);
			break;
		case "warning":
			Logger.setLevel(Level.WARNING);
			break;
		case "config":
			Logger.setLevel(Level.CONFIG);
			break;
		case "error":
			Logger.setLevel(Level.ERROR);
			break;
		case "info":
			Logger.setLevel(Level.INFO);
			break;
		}
	};

	handler.setFormatter(new Formatter({
		format: function (record) {
			return record.getLevel() + ": " + record.getMessage() + "\r\n";
		}
	}));

	Logger.setLevel(Level.INFO);
	Logger.setUseParentHandlers(false);
	Logger.addHandler(handler);
}(exports));
