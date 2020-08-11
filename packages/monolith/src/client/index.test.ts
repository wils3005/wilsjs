import puppeteer from "puppeteer";

describe("puppeteer thing", () => {
  it("foo", () => {
    return new Promise((done) => {
      const f1 = async () => {
        const browser = await puppeteer.launch({
          headless: false,
        });

        const page = await browser.newPage();
        await page.goto("https://pandaportal.co");
        await browser.close();
        return page;
      };

      expect(f1()).toMatch("google");
      done();
    });
  });
});
