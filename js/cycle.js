/* Cycle — private, local-only cycle tracking. Never synced; included only in your encrypted backup. */
(() => {
const S = SIENNA, St = S.Store, t = S.t, e = x => S.esc(x), $ = s => document.querySelector(s), CY = S.CYCLE;
Object.assign(S.STRINGS.en, {
 'nav.cycle': 'Cycle', 'cy.eyebrow': 'Private · on this device only', 'cy.lead': 'Understand your rhythm and work with it — movement, food and care for every phase.',
 'cy.private': 'Your cycle data never leaves this phone: no account, no cloud, no ads, no sharing. It is only included in your encrypted backup.', 'cy.pinHint': 'Add a PIN in Settings to lock Cycle and Journal.', 'cy.pinOn': 'Protected by your PIN.',
 'cy.setup': 'When did your last period start?', 'cy.len': 'Usual cycle length (days)', 'cy.plen': 'Usual period length (days)', 'cy.save': 'Start tracking',
 'cy.day': 'Cycle day', 'cy.phase': '{p} phase', 'cy.next': 'Next period expected around {d} · in {n} days', 'cy.nextToday': 'Your period may start any day now.', 'cy.late': 'Your period is {n} days later than expected. Cycles vary with stress, travel or illness. If you could be pregnant, consider a test; if it is often late, talk to a doctor.',
 'cy.started': 'My period started today', 'cy.ended': 'My period ended today', 'cy.logPast': 'Log a past period start', 'cy.add': 'Add',
 'cy.move': 'Move', 'cy.eat': 'Nourish', 'cy.care': 'Care', 'cy.today': 'Today', 'cy.flow': 'Flow', 'cy.symptoms': 'Symptoms', 'cy.pain': 'Pain', 'cy.severe': 'Severe pain is not something you have to just put up with — see the red flags below.',
 'cy.relief': 'Gentle pain relief', 'cy.flags': 'When to see a doctor', 'cy.history': 'Period history', 'cy.avg': 'Average cycle: {n} days', 'cy.days': '{n} days', 'cy.ongoing': 'ongoing',
 'cy.disclaimer': 'Predictions are estimates. Sienna is not a contraceptive method or a medical diagnosis.', 'cy.delete': 'Delete all cycle data', 'cy.deleteQ': 'Delete all cycle data from this device?', 'cy.remove': 'Remove'
});
const blank = () => ({ periods: [], len: 28, plen: 5, logs: {} });
const C = () => St.get().cycle || blank();
const upd = (fn, msg) => { St.update(s => { s.cycle = s.cycle || blank(); fn(s.cycle); }); S.toast(msg || t('toast.saved')); };
const diff = (a, b) => Math.round((new Date(b + 'T12:00') - new Date(a + 'T12:00')) / 864e5);
const add = (a, n) => { const d = new Date(a + 'T12:00'); d.setDate(d.getDate() + n); return S.dkey(d); };
const fmt = k => new Date(k + 'T12:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
function stats() {
  const c = C(), ps = [...c.periods].sort((a, b) => a.start < b.start ? -1 : 1); if (!ps.length) return null;
  const gaps = []; for (let i = 1; i < ps.length; i++) { const g = diff(ps[i - 1].start, ps[i].start); if (g >= 18 && g <= 60) gaps.push(g); }
  const recent = gaps.slice(-6), len = recent.length ? Math.round(recent.reduce((a, b) => a + b, 0) / recent.length) : c.len;
  const last = ps[ps.length - 1], day = diff(last.start, S.dkey()) + 1, plen = last.end ? diff(last.start, last.end) + 1 : c.plen, ovu = len - 14;
  const phase = day <= plen ? 'menstrual' : day < ovu - 1 ? 'follicular' : day <= ovu + 1 ? 'ovulatory' : 'luteal';
  return { ps, gaps, len, last, day, phase, next: add(last.start, len), late: day - len - 1, open: !last.end && day <= 10 };
}
S.cycleCard = () => { const s = stats(); if (!s) return ''; return `<a class="card cycle-mini" href="#/cycle"><span class="cy-dot ${s.phase}"></span><div><p class="eyebrow">${t('nav.cycle')} · ${t('cy.day')} ${s.day}</p><b>${t('cy.phase', { p: CY.phases[s.phase].name })}</b></div></a>`; };
const chip = (act, v, on, label) => `<button type="button" class="chip${on ? ' on' : ''}" aria-pressed="${on}" data-cy="${act}" data-val="${e(v)}">${e(label)}</button>`;
function cycle() {
  const s = stats(), c = C(), pin = (St.get().settings || {}).pin, today = S.dkey(), log = c.logs[today] || {};
  const head = `<header class="hero"><p class="eyebrow">${t('cy.eyebrow')}</p><h1 class="display">${t('nav.cycle')}</h1><p class="lead">${t('cy.lead')}</p></header>
  <section class="card private"><p>🔒 ${t('cy.private')}</p><p class="muted small">${pin ? t('cy.pinOn') : `<a class="ul" href="#/settings">${t('cy.pinHint')}</a>`}</p></section>`;
  if (!s) return head + `<section class="card"><h2 class="h2">${t('cy.setup')}</h2><input id="cystart" class="input" type="date" max="${today}" value="${add(today, -7)}">
  <label class="label" for="cylen">${t('cy.len')}</label><input id="cylen" class="input" type="number" min="18" max="60" value="${c.len}"><label class="label" for="cyplen">${t('cy.plen')}</label><input id="cyplen" class="input" type="number" min="1" max="12" value="${c.plen}">
  <button class="btn wide" data-cy="setup">${t('cy.save')}</button></section><p class="muted small">${t('cy.disclaimer')}</p>`;
  const P = CY.phases[s.phase], toNext = diff(today, s.next), pct = Math.min(1, s.day / s.len), R = 2 * Math.PI * 52;
  return head + `<section class="card cy-phase ${s.phase}"><div class="ring cy-ring"><svg viewBox="0 0 120 120"><circle class="ring-bg" cx="60" cy="60" r="52"/><circle class="ring-fg" cx="60" cy="60" r="52" stroke-dasharray="${R}" stroke-dashoffset="${R * (1 - pct)}"/></svg><div class="ring-num"><span>${t('cy.day')}</span><b>${s.day}</b></div></div>
  <div><h2 class="h2">${e(P.plain)}</h2><p class="eyebrow">${t('cy.phase', { p: P.name })}</p><p class="muted">${e(P.text)}</p></div></section>
  <p class="cy-next">${s.late > 0 ? t('cy.late', { n: s.late }) : toNext <= 0 ? t('cy.nextToday') : t('cy.next', { d: fmt(s.next), n: toNext })}</p>
  <div class="links">${s.open ? `<button class="btn ghost" data-cy="end">${t('cy.ended')}</button>` : ''}<button class="btn" data-cy="start">${t('cy.started')}</button></div>
  <section class="duo3">${['move', 'eat', 'care'].map(k => `<article class="card"><p class="eyebrow">${t('cy.' + k)}</p><p>${e(P[k])}</p></article>`).join('')}</section>
  <section class="card"><h2 class="h2">${t('cy.today')}</h2><h3 class="label">${t('cy.flow')}</h3><div class="chips">${CY.flow.map(f => chip('flow', f, log.flow === f, f[0].toUpperCase() + f.slice(1))).join('')}</div>
  <h3 class="label">${t('cy.symptoms')}</h3><div class="chips">${CY.symptoms.map(f => chip('sym', f, (log.sym || []).includes(f), f[0].toUpperCase() + f.slice(1))).join('')}</div>
  <h3 class="label">${t('cy.pain')}</h3><div class="chips">${CY.pain.map((f, i) => chip('pain', i, log.pain === i, f)).join('')}</div>${log.pain === 3 ? `<p class="okmsg">${t('cy.severe')}</p>` : ''}</section>
  <section class="card peach"><h2 class="h2">${t('cy.relief')}</h2><ul class="bullets left">${CY.relief.map(x => `<li>${e(x)}</li>`).join('')}</ul></section>
  <section class="card flags"><h2 class="h2">${t('cy.flags')}</h2><ul class="bullets left">${CY.redFlags.map(x => `<li>${e(x)}</li>`).join('')}</ul></section>
  <section class="card"><h2 class="h2">${t('cy.history')}</h2>${s.gaps.length ? `<p class="muted small">${t('cy.avg', { n: s.len })}</p>` : ''}
  <ul class="hist">${[...s.ps].reverse().map((p, i, arr) => `<li class="row"><div><span>${fmt(p.start)}${p.end ? ' – ' + fmt(p.end) : ''}</span><small>${p.end ? t('cy.days', { n: diff(p.start, p.end) + 1 }) : t('cy.ongoing')}${arr[i - 1] ? ' · ' + t('cy.days', { n: diff(p.start, arr[i - 1].start) }) + ' cycle' : ''}</small></div><button class="tlink" data-cy="del" data-val="${p.start}">${t('cy.remove')}</button></li>`).join('')}</ul>
  <label class="label" for="cypast">${t('cy.logPast')}</label><div class="row"><input id="cypast" class="input" type="date" max="${today}"><button class="btn ghost sm" data-cy="past">${t('cy.add')}</button></div></section>
  <p class="muted small">${t('cy.disclaimer')}</p><button class="btn ghost wide danger" data-cy="wipe">${t('cy.delete')}</button>`;
}
S.VIEWS.cycle = cycle;
const addStart = d => upd(c => { if (!c.periods.some(p => p.start === d)) c.periods.push({ start: d }); c.periods.sort((a, b) => a.start < b.start ? -1 : 1); });
document.addEventListener('click', ev => {
  const b = ev.target.closest('[data-cy]'); if (!b) return; const a = b.dataset.cy, v = b.dataset.val, today = S.dkey();
  if (a === 'setup') { const d = $('#cystart').value; if (!d) return; upd(c => { c.len = Math.min(60, Math.max(18, +$('#cylen').value || 28)); c.plen = Math.min(12, Math.max(1, +$('#cyplen').value || 5)); }); addStart(d); }
  else if (a === 'start') { addStart(today); upd(c => { c.logs[today] = Object.assign(c.logs[today] || {}, { flow: (c.logs[today] || {}).flow || 'medium' }); }); }
  else if (a === 'end') upd(c => { const l = c.periods[c.periods.length - 1]; if (l) l.end = today; });
  else if (a === 'past') { const d = $('#cypast').value; if (d) addStart(d); }
  else if (a === 'del') upd(c => { c.periods = c.periods.filter(p => p.start !== v); });
  else if (a === 'wipe') { if (confirm(t('cy.deleteQ'))) St.update(s => { delete s.cycle; }); }
  else upd(c => { const l = c.logs[today] = c.logs[today] || {};
    if (a === 'flow') l.flow = l.flow === v ? undefined : v;
    else if (a === 'sym') { l.sym = l.sym || []; l.sym = l.sym.includes(v) ? l.sym.filter(x => x !== v) : [...l.sym, v]; }
    else if (a === 'pain') l.pain = l.pain === +v ? undefined : +v; });
});
})();
