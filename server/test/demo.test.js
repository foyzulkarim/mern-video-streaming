// jest test

//1. unit under test
describe('Demo Service', () => {
  describe('Test date', () => {
    //2. scenario and 3. expectation
    test('When two dates are created instantly, these dates should be equal', () => {
      const d = new Date();
      expect(new Date()).toEqual(d);
    });
  });
});
