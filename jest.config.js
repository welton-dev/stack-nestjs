module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>/src'],
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest',
			{
				tsconfig: 'tsconfig.test.json',
			},
		],
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	collectCoverageFrom: [
		'src/**/*.{ts,tsx}',
		'!src/**/*.d.ts',
		'!src/example/**/*',
		'!src/tests/**/*',
		'!src/**/*.spec.ts',
		'!src/**/*.test.ts'
	],
	coverageDirectory: 'coverage',
	testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
	verbose: true,
	testPathIgnorePatterns: ['/node_modules/', '/dist/', '/src/example/'],
};
