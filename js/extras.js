/* Settings, encrypted backup (AES-GCM + PBKDF2), PIN lock, intro + guided tour. Loaded after app.js. */
(() => {
const S = SIENNA, St = S.Store, t = S.t, e = x => S.esc(x), $ = s => document.querySelector(s);
Object.assign(S.STRINGS.en, {
 'tour.more.x': 'Workouts, rest, your private cycle tracker, your journal and settings — all in one list.',
 'tour.more.t': 'More',
 'tour.nourish.x': 'Recipes for every meal. Search, save your favourites, or let us plan your day.',
 'tour.nourish.t': 'Food',
 'nav.settings': 'Settings', 'set.eyebrow': 'Make it yours', 'set.profile': 'Profile & preferences', 'set.name': 'Name', 'set.water': 'Daily water goal (glasses)',
 'set.reset': '30-Day Reset', 'set.start': 'Start date', 'set.restart': 'Restart the reset from Day 1', 'set.restartQ': 'Clear all 30-Day Reset progress and reflections and start again today?',
 'set.units': 'Units', 'unit.metric': 'Metric (L)', 'unit.imperial': 'Imperial (fl oz)',
 'set.pin': 'PIN lock', 'set.pinLead': 'Lock your Cycle and Journal with a PIN. They re-lock whenever you leave the app. The PIN keeps others out on this device; your backup file is separately encrypted.', 'set.pinOn': 'PIN lock is on for Cycle and Journal.', 'set.pinNew': 'New PIN (4–8 digits)', 'set.pinRepeat': 'Repeat PIN', 'set.pinSave': 'Set PIN', 'set.pinRemove': 'Remove PIN', 'set.pinBad': 'PINs must match and be 4–8 digits.', 'set.pinSaved': 'PIN saved.',
 'set.tour': 'Tutorial', 'set.tourShow': 'Show the intro when the app opens', 'set.tourReplay': 'Replay tutorial',
 'set.backup': 'Encrypted backup', 'set.backupLead': 'Your data lives only on this device. Export an encrypted file (AES-256-GCM, password via PBKDF2) and keep it safe — without the password it cannot be opened.',
 'set.pw': 'Backup password (min. 8 characters)', 'set.export': 'Export backup', 'set.import': 'Import backup', 'set.file': 'Backup file', 'set.pwShort': 'Use a password of at least 8 characters.', 'set.exported': 'Backup downloaded.', 'set.importQ': 'Replace all data on this device with this backup?', 'set.imported': 'Backup restored.', 'set.importBad': 'Could not open the file — wrong password or not a Sienna backup.', 'set.noFile': 'Choose a backup file first.',
 'set.account': 'Account', 'set.accountSoon': 'Sign in / Create account — coming soon', 'set.accountLead': 'Accounts will sync Sienna across your devices. The planned privacy model:',
 'set.acc1': 'Everyday data (profile, checklist, hydration, workouts, favourites) is stored securely and recoverable with your email login.', 'set.acc2': 'Your Journal and cycle data will be end-to-end encrypted on your device — not even Sienna can read them.', 'set.acc3': 'You will receive a personal recovery key for that encrypted data. Without it, it cannot be restored.', 'set.acc4': 'Until then, everything stays on this device. Use the encrypted backup above.',
 'set.danger': 'Delete all data on this device', 'set.dangerQ': 'Delete everything on this device? This cannot be undone.',
 'lock.title': 'Private space', 'lock.pin': 'Enter your PIN', 'lock.open': 'Unlock', 'lock.bad': 'Incorrect PIN. Try again.',
 'intro.title': 'Welcome to Sienna', 'intro.text': 'Your calm space for movement, nourishment, recovery and care. Let us show you around — it takes less than a minute.', 'intro.tour': 'Take the tour', 'intro.skip': 'Not now', 'intro.hide': 'Don\'t show again',
 'tour.next': 'Next', 'tour.back': 'Back', 'tour.done': 'Finish', 'tour.skip': 'Skip', 'tour.step': 'Step {i} of {n}',
 'tour.ring.t': 'Today\'s progress', 'tour.ring.x': 'This circle fills up as you tick things off your list today.',
 'tour.check.t': 'Today\'s list', 'tour.check.x': 'Six small things for a good day. Tap one to tick it. The list starts fresh every morning.',
 'tour.water.t': 'Water', 'tour.water.x': 'Tap + each time you drink a glass of water.',
 'tour.reset.t': 'Reset', 'tour.reset.x': 'Your 30-day programme. Each day has a few small steps. If you miss a day, nothing is lost.',
 'tour.sections.t': 'Your sections', 'tour.sections.x': 'Movement builds workouts for your goal and level. Nutrition is the cookbook. Recovery has breathing, stretching and wind-down. My Journal tracks mood and energy.',
 'tour.cycle.t': 'Cycle', 'tour.cycle.x': 'Private, on-device cycle tracking. See your phase — menstrual, follicular, ovulatory or luteal — with movement, food and care tips, pain relief and when to see a doctor. Never uploaded.', 'tour.settings.t': 'Settings', 'tour.settings.x': 'Edit your preferences, set a PIN, make an encrypted backup and replay this tour any time.'
});
const enc = new TextEncoder(), dec = new TextDecoder(), C = crypto.subtle;
const b64 = u => { let s = ''; const a = new Uint8Array(u); for (let i = 0; i < a.length; i += 32768) s += String.fromCharCode.apply(null, a.subarray(i, i + 32768)); return btoa(s); };
const ub64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
const rnd = n => crypto.getRandomValues(new Uint8Array(n));
const pbkdf = async (pw, salt, iter) => C.importKey('raw', enc.encode(pw), 'PBKDF2', false, ['deriveKey', 'deriveBits']).then(k => ({ k, salt, iter }));
async function aesKey(pw, salt, iter) { const { k } = await pbkdf(pw); return C.deriveKey({ name: 'PBKDF2', salt, iterations: iter, hash: 'SHA-256' }, k, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']); }
async function pinHash(pin, salt) { const { k } = await pbkdf(pin); return b64(await C.deriveBits({ name: 'PBKDF2', salt, iterations: 150000, hash: 'SHA-256' }, k, 256)); }
const cfg = () => St.get().settings || {};
const setCfg = (o, silent) => St.update(s => { s.settings = Object.assign(s.settings || {}, o); }, silent);
const msg = (id, txt) => { const el = $('#' + id); if (el) el.textContent = txt; };

/* ---------- Settings view ---------- */
function chips(group, multi) {
  const p = St.get().profile;
  return `<div class="chips">${S.ONBOARDING[group].map(v => { const on = multi ? (p[group] || []).includes(v) : p[group] === v; return `<button type="button" class="chip${on ? ' on' : ''}" aria-pressed="${on}" data-set="${group}" data-val="${v}"${multi ? ' data-multi' : ''}>${t(`opt.${group}.${v}`)}</button>`; }).join('')}</div>`;
}
function settings() {
  const p = St.get().profile, c = cfg(), start = p.resetStart || S.dkey(new Date(p.createdAt || Date.now()));
  return `<header class="hero"><p class="eyebrow">${t('set.eyebrow')}</p><h1 class="display">${t('nav.settings')}</h1></header>
  <section class="card"><h2 class="h2">${t('set.profile')}</h2><label class="label" for="sname">${t('set.name')}</label><input id="sname" class="input" maxlength="40" value="${e(p.name)}" autocomplete="given-name">
  <h3 class="label">${t('ob.goals')}</h3>${chips('goals', 1)}<h3 class="label">${t('ob.level')}</h3>${chips('level')}<h3 class="label">${t('ob.movement')}</h3>${chips('movement', 1)}<h3 class="label">${t('ob.time')}</h3>${chips('time')}
  <h3 class="label">${t('set.water')}</h3><div class="chips">${[6, 8, 10, 12].map(v => `<button type="button" class="chip${(p.waterGoal || 8) === v ? ' on' : ''}" aria-pressed="${(p.waterGoal || 8) === v}" data-set="waterGoal" data-val="${v}">${v}</button>`).join('')}</div>
  <h3 class="label">${t('set.units')}</h3><div class="chips">${['metric', 'imperial'].map(v => `<button type="button" class="chip${(c.units || 'metric') === v ? ' on' : ''}" aria-pressed="${(c.units || 'metric') === v}" data-act2="units" data-val="${v}">${t('unit.' + v)}</button>`).join('')}</div></section>
  <section class="card"><h2 class="h2">${t('set.reset')}</h2><label class="label" for="sstart">${t('set.start')}</label><input id="sstart" class="input" type="date" value="${start}">
  <button class="btn ghost wide" data-act2="restart">${t('set.restart')}</button></section>
  <section class="card"><h2 class="h2">${t('set.pin')}</h2><p class="muted">${t('set.pinLead')}</p>${c.pin ? `<p class="okmsg">${t('set.pinOn')}</p><button class="btn ghost wide" data-act2="pinoff">${t('set.pinRemove')}</button>` : ''}
  <form id="pinform"><label class="label" for="pin1">${t('set.pinNew')}</label><input id="pin1" class="input" type="password" inputmode="numeric" pattern="[0-9]{4,8}" autocomplete="new-password"><label class="label" for="pin2">${t('set.pinRepeat')}</label><input id="pin2" class="input" type="password" inputmode="numeric" autocomplete="new-password"><button class="btn wide" type="submit">${t('set.pinSave')}</button><p class="muted small" id="pinmsg" aria-live="polite"></p></form></section>
  <section class="card"><h2 class="h2">${t('set.tour')}</h2><label class="toggle"><input type="checkbox" id="stour"${c.hideTour ? '' : ' checked'}> ${t('set.tourShow')}</label><button class="btn ghost wide" data-act2="tour">${t('set.tourReplay')}</button></section>
  <section class="card"><h2 class="h2">${t('set.backup')}</h2><p class="muted">${t('set.backupLead')}</p><label class="label" for="bpw">${t('set.pw')}</label><input id="bpw" class="input" type="password" autocomplete="new-password">
  <button class="btn wide" data-act2="export">${t('set.export')}</button><label class="label" for="bfile">${t('set.file')}</label><input id="bfile" class="input" type="file" accept=".sienna,application/json">
  <button class="btn ghost wide" data-act2="import">${t('set.import')}</button><p class="muted small" id="bkmsg" aria-live="polite"></p></section>
  <section class="card blush"><h2 class="h2">${t('set.account')}</h2><div class="soon-card"><b>${t('set.accountSoon')}</b></div><p class="muted">${t('set.accountLead')}</p><ul class="bullets left">${[1, 2, 3, 4].map(i => `<li>${t('set.acc' + i)}</li>`).join('')}</ul></section>
  <button class="btn ghost wide danger" data-act2="wipe">${t('set.danger')}</button>`;
}
S.VIEWS.settings = settings;

async function exportBackup() {
  const pw = $('#bpw').value; if (pw.length < 8) return msg('bkmsg', t('set.pwShort'));
  const salt = rnd(16), iv = rnd(12), iter = 310000, key = await aesKey(pw, salt, iter);
  const ct = await C.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(JSON.stringify(St.get())));
  const blob = new Blob([JSON.stringify({ app: 'sienna-wellness', format: 1, kdf: 'PBKDF2-SHA256', iter, salt: b64(salt), iv: b64(iv), data: b64(ct), created: new Date().toISOString() })], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `sienna-backup-${S.dkey()}.sienna`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  msg('bkmsg', t('set.exported')); S.toast(t('set.exported'));
}
async function importBackup() {
  const f = $('#bfile').files[0], pw = $('#bpw').value; if (!f) return msg('bkmsg', t('set.noFile'));
  try {
    const j = JSON.parse(await f.text()); if (j.app !== 'sienna-wellness') throw 0;
    const key = await aesKey(pw, ub64(j.salt), j.iter), data = JSON.parse(dec.decode(await C.decrypt({ name: 'AES-GCM', iv: ub64(j.iv) }, key, ub64(j.data))));
    if (!data || typeof data !== 'object' || !('reset' in data)) throw 0;
    if (!confirm(t('set.importQ'))) return;
    St.update(s => { Object.keys(s).forEach(k => delete s[k]); Object.assign(s, data); }); S.toast(t('set.imported'));
  } catch (err) { msg('bkmsg', t('set.importBad')); }
}
document.addEventListener('click', ev => {
  const b = ev.target.closest('[data-set],[data-act2]'); if (!b) return; const v = b.dataset.val;
  if (b.dataset.set) { setTimeout(() => S.toast(t('toast.saved')), 0); const g = b.dataset.set, val = g === 'time' || g === 'waterGoal' ? +v : v; St.update(s => { const p = s.profile; if (b.hasAttribute('data-multi')) { p[g] = p[g] || []; p[g] = p[g].includes(val) ? p[g].filter(x => x !== val) : [...p[g], val]; } else p[g] = val; }); return; }
  const a = b.dataset.act2;
  if (a === 'units') { setCfg({ units: v }); S.toast(t('toast.saved')); }
  else if (a === 'restart') { if (confirm(t('set.restartQ'))) St.update(s => { s.reset = {}; s.profile.resetStart = S.dkey(); }); }
  else if (a === 'pinoff') { setCfg({ pin: null }); S.toast(t('toast.saved')); }
  else if (a === 'tour') startTour(0);
  else if (a === 'export') exportBackup().catch(() => msg('bkmsg', t('set.importBad')));
  else if (a === 'import') importBackup();
  else if (a === 'wipe') { if (confirm(t('set.dangerQ'))) { localStorage.removeItem(St.key); location.hash = ''; location.reload(); } }
});
document.addEventListener('change', ev => {
  const id = ev.target.id;
  if (id === 'sname' && ev.target.value.trim()) { St.update(s => { s.profile.name = ev.target.value.trim(); }); S.toast(t('toast.saved')); }
  if (id === 'sstart' && ev.target.value) { St.update(s => { s.profile.resetStart = ev.target.value; }); S.toast(t('toast.saved')); }
  if (id === 'stour') setCfg({ hideTour: !ev.target.checked }, true);
  if (id === 'tourHide' || id === 'introHide') setCfg({ hideTour: ev.target.checked }, true);
});
document.addEventListener('submit', async ev => {
  if (ev.target.id === 'pinform') { ev.preventDefault(); const a = $('#pin1').value, b = $('#pin2').value;
    if (!/^\d{4,8}$/.test(a) || a !== b) return msg('pinmsg', t('set.pinBad'));
    const salt = rnd(16); setCfg({ pin: { salt: b64(salt), hash: await pinHash(a, salt) } }); msg('pinmsg', t('set.pinSaved')); S.toast(t('set.pinSaved')); }
  if (ev.target.id === 'lockform') { ev.preventDefault(); const pin = cfg().pin, v = $('#lockpin').value;
    if (await pinHash(v, ub64(pin.salt)) === pin.hash) { unlocked = true; S.render(); } else { msg('lockmsg', t('lock.bad')); $('#lockpin').value = ''; } }
});

/* ---------- PIN lock ---------- */
let unlocked = false;
const guard = view => r => (cfg().pin && !unlocked) ? `<form id="lockform" class="ob ob-welcome lockview">${$('.brand .mark').outerHTML}<h1 class="display">${t('lock.title')}</h1><p class="lead">${t('nav.' + view.key)}</p><label class="label" for="lockpin">${t('lock.pin')}</label><input id="lockpin" class="input pin" type="password" inputmode="numeric" autocomplete="off"><button class="btn wide" type="submit">${t('lock.open')}</button><p class="muted small" id="lockmsg" aria-live="assertive"></p></form>` : view(r);
for (const k of ['cycle', 'journal']) { const v = S.VIEWS[k]; v.key = k; S.VIEWS[k] = guard(v); }
document.addEventListener('visibilitychange', () => { if (document.hidden && unlocked) { unlocked = false; S.render(); } });
function lock() {
  unlocked = false; const d = document.createElement('div'); d.id = 'lock'; d.className = 'lock';
  d.innerHTML = `<form id="lockform" class="ob ob-welcome">${$('.brand .mark').outerHTML}<p class="wordmark lg">SIENNA</p><h1 class="display">${t('lock.title')}</h1><label class="label" for="lockpin">${t('lock.pin')}</label><input id="lockpin" class="input pin" type="password" inputmode="numeric" autocomplete="off" autofocus><button class="btn wide" type="submit">${t('lock.open')}</button><p class="muted small" id="lockmsg" aria-live="assertive"></p></form>`;
  document.body.appendChild(d); setTimeout(() => $('#lockpin') && $('#lockpin').focus(), 50);
}

/* ---------- Intro + guided tour ---------- */
const STEPS = [['.ring-card', 'ring'], ['.checklist', 'check'], ['.water', 'water'], ['[data-nav=reset]', 'reset'], ['[data-nav=nutrition]', 'nourish'], ['[data-nav=more]', 'more']];
let shown = false, layer = null, cur = 0;
function overlay(html) { endTour(); layer = document.createElement('div'); layer.className = 'tour'; layer.innerHTML = html; document.body.appendChild(layer); return layer; }
function endTour() { if (layer) layer.remove(); layer = null; }
function maybeIntro() {
  if (shown || !St.get().profile || cfg().hideTour) return; shown = true;
  overlay(`<div class="tour-modal" role="dialog" aria-modal="true" aria-labelledby="introT">${$('.brand .mark').outerHTML}<h2 class="display" id="introT">${t('intro.title')}</h2><p class="lead">${t('intro.text')}</p>
  <button class="btn wide" data-tour="start">${t('intro.tour')}</button><button class="btn ghost wide" data-tour="end">${t('intro.skip')}</button><label class="toggle"><input type="checkbox" id="introHide"> ${t('intro.hide')}</label></div>`);
}
function startTour(i) { if (location.hash !== '#/home') location.hash = '#/home'; setTimeout(() => step(i), 250); }
function step(i) {
  cur = i; const [sel, k] = STEPS[i], el = $(sel); if (!el) return endTour();
  el.scrollIntoView({ block: 'center' });
  overlay(`<div class="tour-spot"></div><div class="tour-tip" role="dialog" aria-modal="true" aria-labelledby="tipT"><p class="eyebrow">${t('tour.step', { i: i + 1, n: STEPS.length })}</p><h3 class="h3" id="tipT">${t('tour.' + k + '.t')}</h3><p>${t('tour.' + k + '.x')}</p>
  ${i === STEPS.length - 1 ? `<label class="toggle"><input type="checkbox" id="tourHide"${cfg().hideTour ? ' checked' : ''}> ${t('intro.hide')}</label>` : ''}
  <div class="tour-btns"><button class="tlink" data-tour="end">${t('tour.skip')}</button>${i ? `<button class="btn ghost sm" data-tour="back">${t('tour.back')}</button>` : ''}<button class="btn sm" data-tour="next">${t(i === STEPS.length - 1 ? 'tour.done' : 'tour.next')}</button></div></div>`);
  const sp0 = layer.querySelector('.tour-spot'), tp0 = layer.querySelector('.tour-tip');
  if (lastPos) { Object.assign(sp0.style, lastPos.sp); tp0.style.top = lastPos.top; } else tp0.style.visibility = 'hidden';
  requestAnimationFrame(place); setTimeout(place, 320); layer.querySelector('[data-tour=next]').focus();
}
function place() {
  if (!layer || !layer.querySelector('.tour-spot')) return; const el = $(STEPS[cur][0]); if (!el) return;
  const r = el.getBoundingClientRect(), sp = layer.querySelector('.tour-spot'), tip = layer.querySelector('.tour-tip'), pad = 8;
  Object.assign(sp.style, { left: r.left - pad + 'px', top: r.top - pad + 'px', width: r.width + pad * 2 + 'px', height: r.height + pad * 2 + 'px' });
  const th = tip.offsetHeight, below = r.bottom + pad + 14;
  tip.style.top = (below + th < innerHeight - 10 ? below : Math.max(10, r.top - pad - 14 - th)) + 'px'; tip.style.visibility = '';
  lastPos = { sp: { left: sp.style.left, top: sp.style.top, width: sp.style.width, height: sp.style.height }, top: tip.style.top };
}
let lastPos = null;
document.addEventListener('click', ev => {
  const b = ev.target.closest('[data-tour]'); if (!b) return; const a = b.dataset.tour;
  if (a === 'start') step(0); else if (a === 'end') endTour();
  else if (a === 'next') cur < STEPS.length - 1 ? step(cur + 1) : endTour(); else if (a === 'back') step(cur - 1);
});
document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && layer) endTour(); });
addEventListener('resize', place); addEventListener('scroll', place, { passive: true });
St.subscribe(() => maybeIntro());
S.startTour = startTour;
S.render(); S.afterSplash(maybeIntro);
})();
