import { generateId } from "../ids";

describe('generateId', () => {
    it('should return a string of length 10 when called with no arguments', () => {
        expect(generateId()).toHaveLength(10);
    });
    it('should return a string of appropriate length when called with an argument', () => {
        expect(generateId(5)).toHaveLength(5);
        expect(generateId(20)).toHaveLength(20);
        expect(generateId(100)).toHaveLength(100);
    });
});
