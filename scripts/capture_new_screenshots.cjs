const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const distDir = path.resolve(__dirname, '../dist');
const screenshotsDir = path.resolve(__dirname, '../docs/screenshots');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Simple static server
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  let filePath = path.join(distDir, reqPath);

  if (!fs.existsSync(filePath)) {
    filePath = path.join(distDir, 'index.html');
  }

  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading file');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

const PORT = 4173;

server.listen(PORT, async () => {
  console.log(`Static server running on http://localhost:${PORT}`);

  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    console.log('Navigating to app...');
    await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle0', timeout: 30000 });

    // Wait a brief moment for animations
    await new Promise((r) => setTimeout(r, 1500));

    // Screenshot 1: Judge Demo Mode Banner & Nav
    console.log('Capturing 06_judge_demo_mode.png...');
    await page.screenshot({
      path: path.join(screenshotsDir, '06_judge_demo_mode.png'),
      fullPage: false,
    });

    // Screenshot 2: Click on Judge Quick Tour
    const tourBtn = await page.$('#judge-tour-btn');
    if (tourBtn) {
      console.log('Opening Judge Quick Tour modal...');
      await tourBtn.click();
      await new Promise((r) => setTimeout(r, 600));
      console.log('Capturing 07_soroban_gas_simulation.png...');
      await page.screenshot({
        path: path.join(screenshotsDir, '07_soroban_gas_simulation.png'),
      });
      // Close modal by clicking backdrop
      const backdrop = await page.$('.modal-backdrop');
      if (backdrop) await backdrop.click();
      await new Promise((r) => setTimeout(r, 400));
    }

    // Screenshot 3: Dispute & Milestone Governance
    console.log('Capturing 08_dispute_arbitration.png...');
    await page.screenshot({
      path: path.join(screenshotsDir, '08_dispute_arbitration.png'),
      fullPage: false,
    });

    // Screenshot 4: Ecosystem & SEP Showcase section
    console.log('Scrolling to Ecosystem Showcase...');
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await new Promise((r) => setTimeout(r, 800));

    console.log('Capturing 09_ecosystem_sep_showcase.png...');
    await page.screenshot({
      path: path.join(screenshotsDir, '09_ecosystem_sep_showcase.png'),
      fullPage: false,
    });

    await browser.close();
    console.log('Screenshots captured successfully!');
  } catch (err) {
    console.error('Puppeteer capture error:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});
