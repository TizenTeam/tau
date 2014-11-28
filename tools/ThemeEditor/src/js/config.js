/*
	This is Theme Editor configuration file
 */
/**
 * @property {Object} BadgeConfig
 * Configuration for a badge
 * @property {string} BadgeConfig.name
 * Displayed name of badge
 * @property {number} BadgeConfig.displayWidth
 * Number of physical vertical pixels of screen. This number can not be equal with vertical number of CSS pixel
 * @property {number} BadgeConfig.displayHeight
 * Number of physical horizontal pixels of screen. This number can not be equal with horizontal number of CSS pixel
 * @property {number} BadgeConfig.pixelRatio
 * Pixel ratio describes number of physical pixels, from which the CSS pixel is build.
 * CSS resolution is calculated by multiplying the physical resolution and pixel ratio
 * @property {number} BadgeConfig.width CSS width of badge viewport based on pixel ratio and displayWidth
 * @property {number} BadgeConfig.height CSS width of badge viewport based on pixel ratio and displayHeight
 */
/**
 * Configuration of app
 * @property {Object} properties
 */
var properties = {
	/**
	 * @property {string} root
	 * Root path of theme editor
	 */
	root: undefined,
	/**
	 * @property {string} workspaceElementId
	 * HTML Element ID of workspace container. Workspace is a container for badges
	 * it's responsible for view zooming
	 */
	workspaceElementId: "workspace",
	/**
	 * @property {string} appSelectElementId
	 * HTML Select Element ID of application list.
	 */
	appSelectElementId: "appSelect",
	/**
	 * @property {Array} appList
	 * List of apps available to preview.
	 */
	appList: [
		{
			name: "WearableWidgetSample",
			path: "../../../tau/demos/SDK/WearableWidgetSample/",
			selected: true
		}
	]
	/**
	 * @property {BadgeConfig[]} devList
	 * List of devices presets available to choose and apply to view.
	 * This property is loaded from profile json: ./json/<profile>config.json
	 *
	 * @example
	 *
	 * devList: [
		 {
			name: "360 x 480",
			displayWidth: 360,
			displayHeight: 480,
			pixelRatio: 1
		},
		 {
			name: "320 x 320",
			displayWidth: 320,
			displayHeight: 320,
			pixelRatio: 1
		}
	 ],
	 */
	/**
	 * @property {number} maxBadgeCount
	 * Maximum number of badge instances
	 */
	/**
	 * @property {BadgeConfig[]} badges
	 * List of badges added on startup.
	 */
	/**
	 * @property {BdageConfig} defaultBadge
	 * Default settings of badge
	 */

	/**
	 * @property {Object} previewProperties
	 * Contains init properties for BadgePreview object
	 * This property is loaded from profile json: ./json/<profile>config.json
	 *
	 * @example
	 *
	 * previewProperties: {
	 * 	maxBadgeCount: 5,
	 * 	badges: [
			{
				name: "360 x 480",
				displayWidth: 360,
				displayHeight: 480,
				pixelRatio: 1
			}
		],
		defaultBadge: {
			name: "360 x 480",
			displayWidth: 360,
			displayHeight: 480,
			pixelRatio: 1
		}
	 * }
	 */
};
