const mock = jest.genMockFromModule("zod");

Object.assign(mock, {
  string: jest.fn(function (this: unknown) {
    return this;
  }),
});

export default mock;
