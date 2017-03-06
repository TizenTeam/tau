module.exports = {
	"env": {
		"browser": true,
		"node": true
	},
	"extends": "../.eslintrc.js",
	"rules": {
		"jsdoc/require-param-description": 1,
		"require-jsdoc": ["error", {
			"require": {
				"FunctionDeclaration": true,
				"MethodDefinition": true,
				"ClassDeclaration": true,
				"ArrowFunctionExpression": true
			}
		}]
	}
};
