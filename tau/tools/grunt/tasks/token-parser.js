/*jslint nomen: true, plusplus: true */
/*global module, require, __dirname */
(function () {
	"use strict";

	var sep = require("path").sep,
		tokenRules = require(__dirname + sep + "token-rules.js"),
		renderTemplates = require(__dirname + sep + "token-templates.js");

	/**
	 * Matches tokens (and tokens as whole blocks) in given lines of text
	 * The lines argument may be changed after running this method.
	 * @param {string} tokenName
	 * @param {Array<string>} lines
	 * @param {string} line
	 * @returns {object}
	 */
	function matchToken(tokenName, lines, line) {
		var parts,
			token;

		parts = line.match(tokenRules[tokenName].start);

		if (parts) {
			token = {
				type: tokenName,
				data: parts[0]
			};

			// If we expect that a token may be a block
			if (!!tokenRules[tokenName].end) {
				// Go to end of matching block
				while (lines.length > 0) {
					line = lines.pop();
					if (line.match(tokenRules[tokenName].end)) {
						// Push it back to lines
						lines.push(line);
						break;
					}
					token.data += "\n" + line;
				}
			}

			return token;
		}

		return null;
	}

	/**
	 * Returns all matched tokens within given string
	 * @param {string} markdownString
	 * @returns {Array<Object>}
	 */
	function findTokens(markdownString) {
		var lines = markdownString.split("\n").reverse(),
			line,
			token,
			tokens = [],
			tokenNames = Object.keys(tokenRules),
			tokenFound;

		while (lines.length > 0) {
			line = lines.pop();
			tokenFound = false;

			// for each defined token check if it exists in code
			// this may alter the lines array
			tokenNames.forEach(function (tokenName) {
				var matchedToken = matchToken(tokenName, lines, line);

				if (matchedToken) {
					tokens.push(matchedToken);
					tokenFound = true;
				}
			});

			// Tokens not matched by the block above are considered as normal text
			if (!tokenFound) {
				token = {
					type: "text",
					data: line
				};
				tokens.push(token);
			}
		}

		return tokens;
	}

	/**
	 * Renders given tokens with templates defined in `renderTemplates`
	 * @param {Array<Object>} tokens
	 * @param {string} profile
	 * @returns {string}
	 */
	function renderTokens(tokens, profile) {
		var buffer = "";

		// Render all tokens and concat the output to buffer
		tokens.forEach(function (token) {
			buffer += renderTemplates[token.type](token.data, profile) + "\n";
		});

		return buffer;
	}

	/**
	 * Finds tokens in given strings and renders them into new string with proper
	 * structure
	 * @param {string} markdownString
	 * @param {string} profile
	 * @returns {string}
	 */
	function reformatComment(markdownString, profile) {
		var tokens = findTokens(markdownString);

		return renderTokens(tokens, profile);
	}

	module.exports = {
		parse: reformatComment
	};
}());