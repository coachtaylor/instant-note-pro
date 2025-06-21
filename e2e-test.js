const puppeteer = require("puppeteer");
const path = require("path");
const http = require("http");
const fs = require("fs");

const EXTENSION_PATH = path.join(__dirname, "build/chrome-mv3-dev");
const TEST_PAGE_PATH = path.join(__dirname, "test-notifications.html");
const TEST_PAGE_URL = "http://localhost:8080/test-notifications.html";

// Simple HTTP server to serve the test page
const server = http.createServer((req, res) => {
  fs.readFile(TEST_PAGE_PATH, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});

async function runTest() {
  console.log("🚀 Starting End-to-End Test...");
  
  server.listen(8080, async () => {
    console.log("🌐 HTTP server started on port 8080.");
    console.log(`📂 Loading extension from: ${EXTENSION_PATH}`);
    console.log(`📄 Opening test page: ${TEST_PAGE_URL}`);

    let browser;
    try {
      browser = await puppeteer.launch({
        headless: "new",
        args: [
          `--disable-extensions-except=${EXTENSION_PATH}`,
          `--load-extension=${EXTENSION_PATH}`,
        ],
      });

      const page = await browser.newPage();
      await page.goto(TEST_PAGE_URL, { waitUntil: "networkidle0" });

      console.log("🧪 Test Step: Select text on the page");
      await page.evaluate(() => {
        const p = document.querySelector(".highlight-text");
        const range = document.createRange();
        range.selectNodeContents(p);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      });

      // Wait for the tooltip to appear
      await page.waitForSelector(".instant-note-pro-tooltip", { timeout: 2000 });
      console.log("✅ Tooltip appeared successfully.");

      console.log("🧪 Test Step: Click the 'Save Note' tooltip");
      await page.click(".instant-note-pro-tooltip");

      console.log("🧪 Test Step: Check for success notification...");
      await page.waitForSelector(".instant-note-pro-success", { timeout: 2000 });
      
      const notificationText = await page.$eval(".instant-note-pro-success > span", el => el.textContent);
      
      if (notificationText === "Note Saved!") {
        console.log(`✅ Success! Notification found with text: "${notificationText}"`);
      } else {
        throw new Error(`Notification text was "${notificationText}", but expected "Note Saved!"`);
      }

      console.log("🎉 Test Passed!");

    } catch (error) {
      console.error("❌ Test Failed:", error.message);
      process.exitCode = 1; // Set exit code to 1 on failure
    } finally {
      if (browser) {
        await browser.close();
      }
      console.log("🛑 Stopping HTTP server.");
      server.close();
    }
  });
}

runTest(); 