/*jslint browser: true, white: true */
/*global window */

(function(window) {
	'use strict';

	var DeviceViewer = function() {
		/**
		 * Configuration of Theme Editor
		 */
		this.config = {
			/**
			 * Configuration of properties/variables that can be changed by editor
			 */
			themeProperties: {},
			/**
			 * URL to preview page - used by badge
			 */
			previewUrl: '',
			/**
			 * workspace {HTMLElement} workspace container
			 */
			workspace: null,
            /**
             * appSelect {HTMLElement} select with application list ready to preview
             */
            appSelect: null,
			/**
			 * cssVariablePanel {HTMLElement} left panel container
			 */
			cssVariablePanel: null,
			/**
			 * root {string} Root path of Device Viewer
			 */
			root: ''
		};

		/**
		 * Holds all css variables that could by changed
		 */
		this.cssVariables = {};

		// Imports
		this.badgePreview = {}; //deviceViewer.badgePreview.js
		return this;
	};

	DeviceViewer.prototype.resolvePath = function (rootPath, queryPath) {
		var rootPieces,
			queryPieces,
			path = [],
			relative,
			queryPathMatch,
			rootPathMatch,
			i;

		// Check if queryPath is relative or absolute path
		relative = !(/^[a-z]+:\/\//.test(queryPath));

		rootPieces = rootPath.split('/');
		queryPieces = queryPath.split('/');

		rootPathMatch = rootPath.match(/https?:\/\/[^\/]+/);
		queryPathMatch = queryPath.match(/https?:\/\/[^\/]+/);

		// Check if paths are in the same domain
		if (relative !== true && rootPathMatch && queryPathMatch && rootPathMatch[0] !== queryPathMatch[0]) {
			return queryPath;
		}

		// Omit last element (file name)
		rootPieces.pop();

		if (relative) {
			for (i = 0; i < queryPieces.length; i += 1) {
				if (queryPieces[i] === '..') {
					// Go back
					rootPieces.pop();
					// Remove first element
					queryPieces.shift();
					i -= 1;
				}
			}
			return rootPieces.join('/') + '/' + queryPieces.join('/');
		}

		// Find common pieces
		for (i = 0; i < rootPieces.length; i += 1) {
			if (rootPieces[i] !== queryPieces[i]) {
				if (rootPieces[i] === '..') {
					path.pop();
				} else {
					path.push('..');
				}
			}
		}
		return path.concat(queryPieces.splice(i - path.length)).join('/');
	};

	/**
	 * Shows an alert
	 * @method alert
	 * @param {string} message
	 */
	DeviceViewer.prototype.alert = function(message) {
		// TODO: do it more cool
		window.alert(message);
	};

	/**
	 * Setup properties and initialize theme editor.
	 * @method init
	 * @param {Object} properties
	 */
	DeviceViewer.prototype.init = function(properties) {
		var config = this.config;

        // Prepare config
		config.root = properties.root || window.location.href.replace(/[^\/]+\.html?$/, '');
		config.workspace = document.getElementById(properties.workspaceElementId || "workspace");
        config.appSelect = document.getElementById(properties.appSelectElementId || 'appSelect');
		config.previewUrl = config.appSelect.value;

        // Ready to go, let's init Badge Preview!
		this.badgePreview.init();
	};

	window.deviceViewer = new DeviceViewer();
}(window));