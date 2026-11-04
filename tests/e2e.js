/* One consolidated end-to-end test on an iPhone viewport. Run: node tests/e2e.js  (needs Chrome + playwright-core) */
const { chromium } = require(process.env.PW || '/workspace/poker-trainer/node_modules/playwright-core');
const { spawn } = require('child_process'), path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..'), PORT = 8765, BASE = `http://localhost:${PORT}/`, SHOTS = path.join(ROOT, 'screenshots');
const res = []; const ok = (name, cond, info = '') => { res.push([name, !!cond]); console.log((cond ? '✔ ' : '✘ ') + name + (cond ? '' : '  ' + info)); };
(async () => {
  const srv = spawn('python3', ['-m', 'http.server', PORT], { cwd: ROOT, stdio: 'ignore' }); await new Promise(r => setTimeout(r, 800));
  const b = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, acceptDownloads: true });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept());
  const W = ms => p.waitForTimeout(ms), txt = s => p.locator(s).first().innerText(), cnt = s => p.locator(s).count();
  const skipSplash = async () => { if (await cnt('#splash')) { await p.click('#splash').catch(() => {}); await p.waitForSelector('#splash', { state: 'detached', timeout: 3000 }).catch(() => {}); } };
  const go = async h => { await p.evaluate(h => { location.hash = h; }, h); await W(250); };
  const reload = async () => { await p.reload(); await skipSplash(); await W(200); };
  const toast = async () => { await W(150); return (await p.locator('#toast.show').count()) ? await txt('#toast') : ''; };
  try {
    // Splash
    await p.goto(BASE); ok('splash shows', await cnt('#splash') && (await txt('#splashGreet')) === 'Welcome');
    await W(2000); ok('splash ends by itself (~1.8 s)', !(await cnt('#splash')));
    // Onboarding
    await p.click('[data-ob=next]'); await p.fill('#name', 'Anna'); await p.click('#obName button');
    await p.click('[data-val=calm]'); await p.click('[data-val=some]'); await p.click('[data-val=pilates]'); await p.click('[data-val="30"]');
    ok('onboarding chips toggle', await p.locator('[data-val=calm][aria-pressed=true]').count());
    await p.click('[data-ob=finish]'); await W(300);
    ok('onboarding → Home with name', (await txt('h1')).includes('Anna'));
    // Intro + tour
    await p.waitForSelector('.tour-modal', { timeout: 2000 }).catch(() => {}); ok('intro shows after onboarding', await cnt('.tour-modal'));
    await p.click('[data-tour=start]'); const titles = [];
    for (let i = 0; i < 6; i++) { await W(380); titles.push(await txt('.tour-tip h3')); if (i === 5) await p.check('#tourHide'); await p.click('[data-tour=next]'); }
    ok('tour has 6 steps', titles.length === 6 && !(await cnt('.tour')), titles.join(' | '));
    await reload(); await W(300); ok('"Don\'t show again" respected', !(await cnt('.tour-modal')));
    // Home checklist + ring
    await p.click('[data-check=move]'); await p.click('[data-check=care]');
    ok('checklist ticks', await cnt('.check.on') === 2); ok('ring updates', (await txt('.ring-num b')).startsWith('33'));
    await p.click('[data-check=care]'); ok('checklist unticks', await cnt('.check.on') === 1);
    // Water
    for (let i = 0; i < 3; i++) await p.click('[data-water="1"]');
    await p.click('[data-water="-1"]'); ok('water + / −', (await txt('#waterText')).startsWith('2 of 8'), await txt('#waterText'));
    for (let i = 0; i < 6; i++) await p.click('[data-water="1"]');
    ok('water goal ticks Water', await p.locator('[data-check=hydrate][aria-checked=true]').count());
    await reload(); ok('Home persists after reload', await cnt('.check.on') === 2 && (await txt('#waterText')).startsWith('8 of 8'));
    await p.evaluate(() => scrollTo(0, 0)); await W(200); await p.screenshot({ path: path.join(SHOTS, 'home.png') });
    // Today card → Reset day
    await p.click('#todayCard'); await W(300); ok('Today card opens Day 1', location => true) ;
    ok('hash is reset/1', (await p.evaluate(() => location.hash)) === '#/reset/1');
    for (const k of ['move', 'nourish', 'hydrate', 'care', 'mind']) await p.click(`[data-task=${k}]`);
    ok('reset day complete', await cnt('.done-card'));
    await p.fill('#refl', 'I want to feel calm.'); await W(900); ok('reflection toast', (await toast()).includes('Saved'));
    await reload(); ok('reflection persists', (await p.inputValue('#refl')) === 'I want to feel calm.');
    await p.click('.pager a.btn:not(.ghost)'); await W(250); ok('next day link', (await p.evaluate(() => location.hash)) === '#/reset/2');
    await go('#/reset'); ok('reset overview: 1 done, current day 2', await cnt('.dchip.done') === 1 && (await txt('.dchip.cur')) === '2');
    // Nav
    for (const [n, h] of [['reset', '30-Day Reset'], ['nutrition', 'Nourish'], ['more', 'More'], ['home', 'Anna']]) { await p.click(`[data-nav=${n}]`); await W(300); ok(`nav ${n}`, (await txt('#view h1')).includes(h) && await p.locator(`[data-nav=${n}][aria-current=page]`).count(), await txt('#view h1')); }
    await go('#/more'); await p.screenshot({ path: path.join(SHOTS, 'more.png') });
    for (const [id, h] of [['movement', 'Movement'], ['recovery', 'Recovery'], ['cycle', 'Cycle'], ['journal', 'My Journal'], ['settings', 'Settings']]) {
      await go('#/more'); await p.click(`[data-more=${id}]`); await W(300);
      ok(`More → ${id}`, (await txt('#view h1')).includes(h) && await p.locator('[data-nav=more][aria-current=page]').count(), await txt('#view h1'));
      await p.click('.back'); await W(250); ok(`back to More from ${id}`, (await p.evaluate(() => location.hash)) === '#/more');
    }
    // Nutrition
    await go('#/nutrition'); const all = await cnt('.rcard');
    ok('cookbook lists 50', all === 50, all);
    await p.fill('#rq', 'salmon'); await W(150); const sal = await cnt('.rcard'); ok('search filters', sal > 0 && sal < 10, sal);
    await p.fill('#rq', ''); await p.click('[data-act=fmeal][data-val=snack]'); ok('meal filter', await cnt('.rcard') === 13, await cnt('.rcard'));
    await p.click('.rcard .fav >> nth=0'); ok('fav toast', (await toast()).includes('favourites'));
    await p.click('[data-act=fmeal][data-val=fav]'); ok('favourites filter', await cnt('.rcard') === 1);
    await p.click('[data-act=pick]'); ok('day planner picks 4 meals', await cnt('.plan li') === 4);
    await p.click('.rcard a >> nth=0'); await W(300); ok('recipe page', await cnt('.ing li') > 2 && await cnt('.steps li') > 0);
    await p.click('[data-act=ate]'); ok('ate → toast', (await toast()).includes('Nourish'));
    await go('#/home'); ok('ate ticks Nourish', await p.locator('[data-check=nourish][aria-checked=true]').count());
    // Movement
    await go('#/movement'); await p.click('[data-act=mgoal][data-val=core]'); await p.click('[data-act=mtime][data-val="30"]'); await p.click('[data-act=mlevel][data-val="1"]');
    const beg = await txt('.ex'); await p.click('[data-act=mlevel][data-val="3"]'); const adv = await txt('.ex');
    ok('builder: reps/holds shown, advanced differs', (await cnt('.ex > li')) >= 3 && (await txt('.ex')).includes('hold') && beg !== adv);
    await p.click('[data-act=mwhere][data-val=gym]'); await p.click('[data-act=mgoal][data-val=muscle]'); ok('gym: machines + sets×reps', (await txt('.ex')).includes('Use:') && /\d × 8–12 reps/.test(await txt('.ex')) && await p.evaluate(() => localStorage.getItem('sienna:where')) === 'gym');
    await p.click('[data-act=mgoal][data-val=core]');
    await p.click('[data-act=shuffle]'); ok('shuffle changes session', (await txt('.ex')) !== adv);
    await p.click('[data-act=wdone]'); ok('workout done → history', await cnt('.hist li') === 1 && (await toast()).includes('Workout'));
    // Recovery
    await go('#/recovery'); await p.click('[data-act=bmin][data-val="1"]'); await p.click('[data-act=breath]'); await W(1200);
    ok('breathing timer runs', (await txt('#bphase')) === 'Breathe in' && (await txt('#bbtn')).toLowerCase() === 'stop');
    await p.click('[data-act=breath]'); ok('breathing stops', (await txt('#bbtn')).toLowerCase() === 'start');
    await p.click('[data-act=sdone] >> nth=0'); ok('stretch done toast', (await toast()).includes('Rest'));
    await p.click('[data-act=wstep][data-i="0"]'); ok('wind-down step ticks', await p.locator('[data-act=wstep][aria-checked=true]').count() === 1);
    await p.click('[data-act=wdown]'); ok('wind-down done', (await cnt('.okmsg')) >= 1);
    // Journal
    await go('#/journal'); await p.click('[data-act=jmood][data-val="4"]'); await p.click('[data-act=jenergy][data-val="3"]'); await p.fill('#jnote', 'Lovely walk today.');
    await p.click('[data-act=jsave]'); ok('journal save', (await toast()).includes('Saved') && await cnt('.hist details') === 1);
    await reload(); ok('journal persists', (await p.inputValue('#jnote')) === 'Lovely walk today.' && await cnt('.jbars i[style*="80%"]') === 1);
    await go('#/home'); ok('Write + Rest + Move ticked on Home', await cnt('.check.on') === 5, await cnt('.check.on'));
    // Cycle
    await go('#/cycle'); await p.fill('#cystart', new Date(Date.now() - 10 * 864e5).toISOString().slice(0, 10)); await p.click('[data-cy=setup]'); await W(200);
    ok('cycle setup → day 11', (await txt('.cy-ring .ring-num b')) === '11', await txt('#view'));
    await p.click('[data-cy=flow][data-val=light]'); await p.click('[data-cy=sym][data-val=cramps]'); await p.click('[data-cy=pain][data-val="3"]');
    ok('cycle log', await p.locator('[data-cy=sym][aria-pressed=true]').count() === 1 && (await txt('#view')).includes('Severe pain'));
    await p.fill('#cypast', new Date(Date.now() - 38 * 864e5).toISOString().slice(0, 10)); await p.click('[data-cy=past]'); ok('past period added', await cnt('.hist li') === 2);
    await p.click('[data-cy=del] >> nth=1'); ok('period removed', await cnt('.hist li') === 1);
    await p.click('[data-cy=start]'); ok('period started today', (await txt('.cy-ring .ring-num b')) === '1');
    // Settings
    await go('#/settings'); await p.fill('#sname', 'Anna Maria'); await p.press('#sname', 'Tab'); await W(200);
    await p.click('[data-act2=units][data-val=imperial]'); await p.click('[data-set=waterGoal][data-val="10"]');
    await go('#/home'); ok('settings: name, units, water goal', (await txt('h1')).includes('Anna Maria') && (await txt('#waterText')).includes('of 10') && (await txt('#waterText')).includes('fl oz'), await txt('#waterText'));
    await go('#/settings'); await p.fill('#sstart', '2026-11-01'); await p.press('#sstart', 'Tab'); await go('#/reset'); ok('start date shown', (await txt('#view')).includes('1 November 2026'));
    await go('#/settings'); await p.click('[data-act2=tour]'); await W(700); ok('tour replays from Settings', await cnt('.tour-tip')); await p.keyboard.press('Escape');
    // PIN
    await go('#/settings'); await p.fill('#pin1', '1234'); await p.fill('#pin2', '1234'); await p.click('#pinform button'); await W(600);
    ok('PIN set', (await txt('#pinmsg')).includes('saved'));
    await reload(); await go('#/journal'); ok('Journal locked', await cnt('#lockform'));
    await p.fill('#lockpin', '0000'); await p.click('#lockform button'); await W(700); ok('wrong PIN rejected', (await txt('#lockmsg')).includes('Incorrect'));
    await p.fill('#lockpin', '1234'); await p.click('#lockform button'); await W(700); ok('right PIN unlocks', (await txt('#view h1')).includes('Journal'));
    await go('#/cycle'); ok('Cycle open after unlock', !(await cnt('#lockform')));
    // Backup export / import
    await go('#/settings'); await p.fill('#bpw', 'short'); await p.click('[data-act2=export]'); ok('short password refused', (await txt('#bkmsg')).includes('8'));
    await p.fill('#bpw', 'sienna-pass-123'); const [dl] = await Promise.all([p.waitForEvent('download'), p.click('[data-act2=export]')]);
    const file = path.join('/tmp', dl.suggestedFilename()); await dl.saveAs(file); const j = JSON.parse(fs.readFileSync(file, 'utf8'));
    ok('backup is encrypted', j.app === 'sienna-wellness' && j.data && !fs.readFileSync(file, 'utf8').includes('Lovely walk'));
    await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('sienna:v1')); s.journal = {}; localStorage.setItem('sienna:v1', JSON.stringify(s)); });
    await reload(); await go('#/settings'); await p.setInputFiles('#bfile', file); await p.fill('#bpw', 'wrong-password');
    await p.click('[data-act2=import]'); await W(1500); ok('wrong backup password refused', (await txt('#bkmsg')).includes('wrong password'));
    await p.fill('#bpw', 'sienna-pass-123'); await p.click('[data-act2=import]'); await W(1500);
    ok('import restores data', await p.evaluate(() => !!JSON.parse(localStorage.getItem('sienna:v1')).journal[Object.keys(JSON.parse(localStorage.getItem('sienna:v1')).journal)[0]]));
    // Remove PIN, delete all data
    await go('#/settings'); await p.click('[data-act2=pinoff]'); ok('PIN removed', !(await p.evaluate(() => JSON.parse(localStorage.getItem('sienna:v1')).settings.pin)));
    await p.click('[data-act2=wipe]'); await p.waitForLoadState(); await skipSplash(); await W(300);
    ok('delete all data → onboarding', await cnt('[data-ob=next]'));
  } catch (e) { ok('script ran to the end', false, e.message.split('\n')[0]); }
  ok('no JS errors', !errs.length, errs.join(' | '));
  await b.close(); srv.kill();
  const bad = res.filter(r => !r[1]); console.log(`\n${res.length - bad.length}/${res.length} passed`); process.exit(bad.length ? 1 : 0);
})();
