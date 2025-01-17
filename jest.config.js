module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>/src', '<rootDir>/tests'],
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest',
			{
				tsconfig: 'tsconfig.test.json',
			},
		],
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!example/**/*', '!tests/**/*', '!**/*.spec.ts', '!**/*.test.ts'],
	coverageDirectory: 'coverage',
	coverageReporters: ['lcov', 'text', 'text-summary'],
	testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
	verbose: true,
	testPathIgnorePatterns: ['/node_modules/', '/dist/', '/example/'],
};
