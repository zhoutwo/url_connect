import * as chai from "chai";

import ClientCore from "./ClientCore";

chai.should();

describe("First dummy test", () => {
  it("should pass", () => {
    if (ClientCore) {
      const foo = "123";
      foo.should.be.a("string");
    }
  });
});
