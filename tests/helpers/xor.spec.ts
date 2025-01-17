import { xor } from '../../src/helpers/xor';

describe('xor', () => {
	it('should return true when exactly one argument is true', () => {
		expect(xor(true, false)).toBe(true);
		expect(xor(false, true)).toBe(true);
	});

	it('should return false when both arguments are true', () => {
		expect(xor(true, true)).toBe(false);
	});

	it('should return false when both arguments are false', () => {
		expect(xor(false, false)).toBe(false);
	});

	it('should handle truthy/falsy values', () => {
		expect(xor(Boolean(1), false)).toBe(true);
		expect(xor(Boolean(0), true)).toBe(true);
		expect(xor(Boolean(''), Boolean(null))).toBe(false);
		expect(xor(Boolean(undefined), Boolean([]))).toBe(true);
	});
});
