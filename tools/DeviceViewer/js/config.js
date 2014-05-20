/*
	This is Device Viewer configuration file
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
	 * Root path of device viewer
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
			path: "../../tau/demos/WearableWidgetSample/",
			selected: true
		},
		{
			name: "WatchOnWeb",
			path: "../../tau/demos/WatchOnWeb/index.html"
		},
		{
			name: "WeatherDemo",
			path: "../../tau/demos/WeatherDemo/index.html"
		},
		{
			name: "Fallback",
			path: "../../tau/demos/Fallback/index.html"
		},
		{
			name: "TemplateBasic",
			path: "../../tau/demos/TemplateBasic/index.html"
		},
		{
			name: "TemplateList",
			path: "../../tau/demos/TemplateList/index.html"
		}
	],
	/**
	 * @property {BadgeConfig[]} devList
	 * List of devices presets available to choose and apply to view
	 */
	devList: [
		{
			name: "Gear Fit",
			displayWidth: 432,
			displayHeight: 128,
			pixelRatio: 1
		},
		{
			name: "Gear 2",
			displayWidth: 320,
			displayHeight: 320,
			pixelRatio: 1
		},
		{
			name: "Gear 3",
			displayWidth: 360,
			displayHeight: 480,
			pixelRatio: 1
		},
		{
			name: "Galaxy S2",
			displayWidth: 480,
			displayHeight: 800,
			pixelRatio: 1.5
		},
		{
			name: "Galaxy S3",
			displayWidth: 720,
			displayHeight: 1280,
			pixelRatio: 2
		},
		{
			name: "Galaxy S4",
			displayWidth: 1920,
			displayHeight: 1080,
			pixelRatio: 3
		},
		{
			name: "HD",
			displayWidth: 1280,
			displayHeight: 720,
			pixelRatio: 1
		},
		{
			name: "Full HD",
			displayWidth: 1920,
			displayHeight: 1080,
			pixelRatio: 1
		}
	],
	/**
	 * @property {Object} previewProperties
	 * Contains init properties for BadgePreview object
	 */
	previewProperties: {
		/**
		 * @property {number} maxBadgeCount
		 * Maximum number of badge instances
		 */
		maxBadgeCount: 5,
		/**
		 * @property {BadgeConfig[]} badges
		 * List of badges added on Device Viewer startup.
		 */
		badges: [
			{
				name: 'Gear 2',
				displayWidth: 320,
				displayHeight: 320,
				pixelRatio: 1
			},
			{
				name: 'Gear 3',
				displayWidth: 360,
				displayHeight: 480,
				pixelRatio: 1
			}
		],
		/**
		 * @property {BdageConfig} defaultBadge
		 * Default settings of badge
		 */
		defaultBadge: {
			name: 'Gear 3',
			displayWidth: 360,
			displayHeight: 480,
			pixelRatio: 1
		}
	}
};
