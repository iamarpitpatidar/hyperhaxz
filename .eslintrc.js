module.exports = {
	root: true,
	"env": {
		"browser": true,
		"es6": true,
		"node": true
	},
	"extends": "eslint:recommended",
	"parserOptions": {
		"sourceType": "module"
	},
	"rules": {
		"indent": [
			"warn",
			"tab"
		],
		"quotes": [
			"warn",
			"double"
		],
		"semi": [
			"error",
			"always"
		],
		"no-var": [
			"error"
		],
		"no-console": [
			"off"
		],
		"no-unused-vars": [
			"off"
		],
		"no-mixed-spaces-and-tabs": [
			"warn"
		]
	}
};