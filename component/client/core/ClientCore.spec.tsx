import ClientCore from "./ClientCore";

describe("First dummy test", () => {
  it("should pass", () => {
    if (ClientCore) {
      const foo = "123";
      foo.should.be.a("string");
    }
  });
});
