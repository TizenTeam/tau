module.exports = {
	"env": {
		"browser": true,
		"node": true
	},
	"extends": "../.eslintrc.js",
	"rules": {
		"jsdoc/check-param-names": 1,
		"jsdoc/check-tag-names": 1,
		"jsdoc/check-types": 1,
		"jsdoc/newline-after-description": 0,
		"jsdoc/require-description-complete-sentence": 0,
		"jsdoc/require-hyphen-before-param-description": 0,
		"jsdoc/require-param": 1,
		"jsdoc/require-param-description": 0,
		"jsdoc/require-param-type": 1,
		"jsdoc/require-returns-description": 0,
		"jsdoc/require-returns-type": 1
	},
	"plugins": ["jsdoc"]
};
