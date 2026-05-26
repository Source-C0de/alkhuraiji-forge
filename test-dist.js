const { serve } = require("serve");
const puppeteer = require("puppeteer");

const server = serve(__dirname + "/dist", { port: 5000 });

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.goto('http://localhost:5000');
  await new Promise(r => setTimeout(r, 2000));
  
  const content = await page.content();
  console.log("HTML length:", content.length);
  
  await browser.close();
  process.exit(0);
})();
