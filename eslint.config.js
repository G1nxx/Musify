// eslint.config.js
import eslint from '@eslint/js'
import globals from 'globals'

export default [
	eslint.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		ignores: [
			'**/node_modules/',
			'**/dist/',
			'**/build/',
			'**/coverage/',
			'**/.next/',
			'**/out/',
			'**/.expo/',
			'**/android/',
			'**/ios/',
			'**/*.d.ts',
			'**/__generated__/**',
			'**/assets/**',
			'**/bin/**',
			'**/fastlane/**',
			'**/kotlin/providers/**',
			'**/vendored/**',
		],
	},
]
