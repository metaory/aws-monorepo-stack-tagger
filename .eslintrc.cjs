module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	extends: 'xo',
	overrides: [
	],
	globals: {
		region: 'readonly',
		chalk: 'readonly',
		log: 'readonly',
		env: 'readonly',
		argv: 'readonly',
		YAML: 'readonly',
		$: 'readonly',
	},
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	rules: {
		'no-await-in-loop': 0,
		'capitalized-comments': 0,
	},
};
