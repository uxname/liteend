describe('Array', () => {
    describe('#indexOf()', () => {
        test('should return -1 when the value is not present', () => {
            // eslint-disable-next-line no-magic-numbers
            expect([1, 2, 3].indexOf(4)).toEqual(-1);
        });
    });
});
