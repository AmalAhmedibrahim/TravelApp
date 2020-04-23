const validateCity = require("../client/js/validateCity");

describe('test validateCity', () => {
    test('It should return true', () => {
        const result = validateCity.validateCity("Cairo");
        expect(result).toBe(true);

    });
});

describe('test validateCity', () => {
    test('It should return false', () => {
        const result = validateCity.validateCity("123");
        expect(result).toBe(false);

    });
});