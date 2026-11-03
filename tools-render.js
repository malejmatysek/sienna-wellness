/* Renders PNG icons + iOS splash screens from the SVG mark, and a Home screenshot. node tools-render.js */
const { chromium } = require('/workspace/poker-trainer/node_modules/playwright-core');
const fs = require('fs'), path = require('path'), D = __dirname;
const sym = fs.readFileSync(path.join(D, 'icons/symbol.svg'), 'utf8');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage();
  const draw = async (w, h, scale, file, word) => {
    await p.setViewportSize({ width: w, height: h });
    await p.setContent(`<style>@font-face{font-family:C;src:url(file://${D}/fonts/cormorant.ttf)}body{margin:0;width:${w}px;height:${h}px;background:#F7F0E4;display:flex;flex-direction:column;align-items:center;justify-content:center}svg{width:${w * scale}px;height:${w * scale}px}p{font:500 ${w * .075}px C;letter-spacing:.34em;padding-left:.34em;color:#3B2A22;margin:0}</style>${sym}${word ? '<p>SIENNA</p>' : ''}`);
    await p.waitForTimeout(150); await p.screenshot({ path: path.join(D, 'icons', file) });
  };
  for (const [s, f] of [[180, 'apple-touch-icon.png'], [192, 'icon-192.png'], [512, 'icon-512.png']]) await draw(s, s, 1.18, f);
  await draw(512, 512, .9, 'icon-maskable-512.png');
  for (const [w, h] of [[1179, 2556], [1170, 2532], [1290, 2796]]) await draw(w, h, .42, `splash-${w}x${h}.png`, 1);
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  const q = await ctx.newPage(); const errs = []; q.on('pageerror', e => errs.push(e.message));
  await q.goto('file://' + D + '/index.html');
  await q.click('[data-ob=next]'); await q.fill('#name', 'Sienna'); await q.click('#obName button');
  await q.click('[data-val=calm]'); await q.click('[data-val=pilates]'); await q.click('[data-ob=finish]');
  await q.click('[data-check=move]'); await q.click('[data-check=nourish]'); await q.click('[data-water="1"]'); await q.click('[data-water="1"]'); await q.click('[data-water="1"]');
  await q.reload(); await q.waitForTimeout(400);
  console.log('persisted checks:', await q.locator('.check.on').count(), '| ring:', await q.locator('.ring-num b').innerText(), '| errors:', errs);
  await q.screenshot({ path: path.join(D, 'screenshots/home.png'), fullPage: true });
  await b.close();
})();
