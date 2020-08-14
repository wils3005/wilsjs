import * as server from ".";
import ws from "ws";

describe("handleConnection", () => {
  it("does not throw", () => {
    expect(() =>
      server.handleConnection(new ws("http://localhost:8080"))
    ).not.toThrow();
  });
});
