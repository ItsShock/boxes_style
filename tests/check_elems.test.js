const Differencify = require("differencify");
const differencify = new Differencify({ mismatchThreshold: 0 });
let urlToTest = "http://127.0.0.1:8080/";

describe("Zadanie", () => {
  const timeout = 30000;
  let page;

  beforeAll(async () => {
    await differencify.launchBrowser({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const target = differencify.init({ chain: false });
    page = await target.newPage();
    await page.goto(urlToTest);
    await page.waitFor(1000);
  }, timeout);
  afterAll(async () => {
    await differencify.cleanup();
  });

  it("Dodano div", async () => {
    const div = await page.$eval("div", elem => !!elem);
    expect(div).toBe(true);
  }, timeout);

  it("Szerokość równa 90%", async () => {
    await page.setViewport({width: 1000, height: 1000});
    const div = await page.$eval("div", elem => getComputedStyle(elem).width === "885.594px");

    expect(div).toBe(true);
  }, timeout);

  it("Ma 3 divy w środku po 1/3 szerokości", async () => {
    const divs = await page.$$eval("div div", elems => {
      return getComputedStyle(elems[0]).width === "295.156px"
        && getComputedStyle(elems[1]).width === "295.156px"
        && getComputedStyle(elems[2]).width === "295.156px";
    });
    expect(divs).toBe(true);
  }, timeout);
});
