(() => {
const S = SIENNA, St = S.Store, t = S.t;
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = n => String(n).padStart(2, '0');
const dkey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const loc = () => (S.lang === 'cs' ? 'cs-CZ' : 'en-GB');
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const ICON = {
  home: 'M4 10.5 12 4l8 6.5V20h-5v-6H9v6H4z', reset: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM8.5 12l2.5 2.5 4.5-5',
  move: 'M14 5.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0zM7 20l3.5-6 2.5 2v4M10.5 14l1-5 3 3H18M11.5 9 8 10.5 7 13',
  leaf: 'M5 19C5 11 10 5 20 5c0 9-6 14-14 14zM5 19l7-7', drop: 'M12 3.5s6 6.6 6 10.5a6 6 0 0 1-12 0c0-3.9 6-10.5 6-10.5z',
  moon: 'M19.5 14.5A7.5 7.5 0 1 1 9.5 4.5a6 6 0 0 0 10 10z', heart: 'M12 19.5s-7-4.3-7-9.6A3.9 3.9 0 0 1 12 7.6a3.9 3.9 0 0 1 7 2.3c0 5.3-7 9.6-7 9.6z',
  pen: 'M6 4h9l3 3v13H6zM9 10h6M9 13.5h6M9 17h3.5', cycle: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z', tick: 'M6 12.5l4 4 8-9'
};
const ic = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICON[n]}"/></svg>`;
const MARK = `<svg class="mark" viewBox="0 0 100 100" aria-hidden="true"><defs><clipPath id="mk"><circle cx="40" cy="50" r="24"/></clipPath></defs><circle cx="40" cy="50" r="24" fill="#E8C1BA"/><circle cx="60" cy="50" r="24" fill="#F1D2BC"/><circle cx="60" cy="50" r="24" fill="#3B2A22" clip-path="url(#mk)"/></svg>`;
const NAV = [['home', 'home'], ['reset', 'reset'], ['movement', 'move'], ['nutrition', 'leaf'], ['recovery', 'moon'], ['cycle', 'cycle'], ['journal', 'pen']];

const day = (k = dkey()) => St.get().days[k] || { checks: {}, water: 0 };
const setDay = fn => St.update(s => { const k = dkey(); s.days[k] = s.days[k] || { checks: {}, water: 0 }; fn(s.days[k], s); });
const rday = n => St.get().reset[n] || { tasks: {}, reflection: '' };
const isDone = n => S.RESET_TASKS.every(x => rday(n).tasks[x]);
const curDay = () => { for (let i = 1; i <= 30; i++) if (!isDone(i)) return i; return 30; };
const doneCount = () => range(1, 30).filter(isDone).length;
const phaseOf = n => S.RESET_PHASES.find(p => n >= p.days[0] && n <= p.days[1]);
const dayData = n => { const a = S.RESET_DAYS[n - 1]; return { title: a[0], focus: a[1], move: a[2], nourish: a[3], hydrate: a[4], care: a[5], mind: a[6], reflect: a[7] }; };
const doy = () => { const d = new Date(); return Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 864e5); };

function pickMove() {
  const pref = (St.get().profile.movement || []);
  const list = S.MOVES.filter(m => pref.includes(m.kind.toLowerCase()));
  const l = list.length ? list : S.MOVES; return l[doy() % l.length];
}
function week() {
  const now = new Date(), mon = new Date(now); mon.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  return range(0, 6).map(i => {
    const d = new Date(mon); d.setDate(mon.getDate() + i);
    const k = dkey(d), x = St.get().days[k], n = x ? S.CHECKLIST.filter(c => x.checks[c.id]).length : 0, today = k === dkey(), fut = d > now && !today;
    return `<div class="wd${today ? ' today' : ''}${fut ? ' future' : ''}"><div class="bar"><i style="height:${n / 6 * 100}%"></i></div><span>${d.toLocaleDateString(loc(), { weekday: 'narrow' })}</span><small>${fut ? '&nbsp;' : n + '/6'}</small></div>`;
  }).join('');
}
const checkBtn = (attrs, on, title, sub, icon) => `<li><button class="check${on ? ' on' : ''}" role="checkbox" aria-checked="${!!on}" ${attrs}><span class="box">${ic('tick')}</span>${icon ? `<span class="ci">${ic(icon)}</span>` : ''}<span class="ct"><b>${title}</b><small>${sub}</small></span></button></li>`;

function home() {
  const p = St.get().profile, d = day(), done = S.CHECKLIST.filter(c => d.checks[c.id]).length, pct = Math.round(done / 6 * 100);
  const h = new Date().getHours(), greet = t(h < 12 ? 'greet.morning' : h < 18 ? 'greet.afternoon' : 'greet.evening');
  const rd = curDay(), meal = S.MEALS[doy() % S.MEALS.length], mv = pickMove(), goal = p.waterGoal || 8, C = 2 * Math.PI * 52;
  return `<header class="hero"><p class="eyebrow">${esc(new Date().toLocaleDateString(loc(), { weekday: 'long', day: 'numeric', month: 'long' }))}</p>
  <h1 class="display">${greet},<br><em>${esc(p.name)}</em></h1><p class="motto">“${esc(S.MOTTOS[doy() % S.MOTTOS.length])}”</p><a class="pill" href="#/reset/${rd}">${ic('reset')}<span>${t('home.resetDay', { n: rd })}</span></a></header>
  <section class="card ring-card"><div class="ring" role="img" aria-label="${t('home.progressAria', { pct })}"><svg viewBox="0 0 120 120"><circle class="ring-bg" cx="60" cy="60" r="52"/><circle class="ring-fg" cx="60" cy="60" r="52" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - done / 6)}"/></svg><div class="ring-num"><b>${pct}<small>%</small></b><span>${t('home.today')}</span></div></div>
  <div><h2 class="h2">${t('home.ringTitle')}</h2><p class="muted">${t(done === 6 ? 'home.ringDone' : 'home.ringText', { done, total: 6 })}</p></div></section>${S.cycleCard ? S.cycleCard() : ''}
  <section><h2 class="section-title">${t('home.checklist')}</h2><p class="quick"><a href="#/movement">${t('nav.movement')}</a><a href="#/nutrition">${t('nav.nutrition')}</a><a href="#/recovery">${t('nav.recovery')}</a><a href="#/journal">${t('nav.journal')}</a><a href="#/reset/${rd}">${t('nav.reset')}</a></p><ul class="checklist">${S.CHECKLIST.map(c => checkBtn(`data-check="${c.id}"`, d.checks[c.id], t('check.' + c.id), t('check.' + c.id + '.sub'), c.icon)).join('')}</ul></section>
  <section class="card water"><div class="row"><div><h2 class="h2">${t('home.hydration')}</h2><p class="muted">${t('home.glasses', { n: d.water, goal }) + ((St.get().settings || {}).units === 'imperial' ? ` · ${d.water * 8} fl oz` : ` · ${(d.water * 0.25).toFixed(2).replace(/\.?0+$/, '')} L`)}</p></div>
  <div class="stepper"><button class="round" data-water="-1" aria-label="${t('home.waterLess')}"${d.water <= 0 ? ' disabled' : ''}>−</button><button class="round dark" data-water="1" aria-label="${t('home.waterMore')}">+</button></div></div>
  <div class="drops">${range(1, Math.max(goal, d.water)).map(i => `<span class="${i <= d.water ? 'full' : ''}">${ic('drop')}</span>`).join('')}</div></section>
  <section><h2 class="section-title">${t('home.forToday')}</h2><div class="duo">
  <a class="card feature peach" href="#/nutrition/${meal.id}"><p class="eyebrow">${t('home.meal')} · ${esc(meal.type)}</p><h3 class="h3">${esc(meal.title)}</h3><p>${esc(meal.text)}</p><p class="meta">${meal.time} min · ${meal.tags.map(esc).join(' · ')}</p></a>
  <a class="card feature blush" href="#/movement"><p class="eyebrow">${t('home.move')} · ${esc(mv.kind)}</p><h3 class="h3">${esc(mv.title)}</h3><p>${esc(mv.text)}</p><p class="meta">${mv.minutes} min · ${esc(mv.level)}</p></a></div></section>
  <section class="card"><h2 class="h2">${t('home.week')}</h2><div class="week">${week()}</div></section>`;
}
function resetView() {
  const rd = curDay(), c = doneCount(), dd = dayData(rd);
  return `<header class="hero"><p class="eyebrow">${t('reset.eyebrow')}</p><h1 class="display">${t('reset.title')}</h1><p class="lead">${t('reset.lead')}</p>${St.get().profile.resetStart ? `<p class="muted small">Started ${esc(new Date(St.get().profile.resetStart + 'T12:00').toLocaleDateString(loc(), { day: 'numeric', month: 'long', year: 'numeric' }))}</p>` : ''}</header>
  <section class="card"><div class="row"><div><p class="eyebrow">${t('reset.progress')}</p><p class="big">${c}<small>/30</small></p></div><p class="muted narrow">${t('reset.flex')}</p></div><div class="bar-h"><i style="width:${c / 30 * 100}%"></i></div></section>
  <a class="card feature blush link-card" href="#/reset/${rd}"><p class="eyebrow">${t(c === 30 ? 'reset.completeAll' : 'reset.continue')} · ${t('reset.day', { n: rd })}</p><h3 class="h3">${esc(dd.title)}</h3><p>${esc(dd.focus)}</p><span class="cta">${t('reset.open')} →</span></a>
  ${S.RESET_PHASES.map((p, i) => `<section class="phase"><div class="phase-head"><span class="num">0${i + 1}</span><div><h2 class="h2">${esc(p.name)}</h2><p class="muted">${t('reset.days', { a: p.days[0], b: p.days[1] })} · ${esc(p.intro)}</p></div></div>
  <div class="days">${range(p.days[0], p.days[1]).map(n => `<a href="#/reset/${n}" class="dchip${isDone(n) ? ' done' : ''}${n === rd ? ' cur' : ''}" aria-label="${t('reset.day', { n })}${isDone(n) ? ', ' + t('reset.done') : ''}">${n}</a>`).join('')}</div></section>`).join('')}`;
}
function dayView(n) {
  const d = dayData(n), r = rday(n), cnt = S.RESET_TASKS.filter(x => r.tasks[x]).length;
  return `<a class="back" href="#/reset">← ${t('reset.title')}</a>
  <header class="hero"><p class="eyebrow">${esc(phaseOf(n).name)} · ${t('reset.day', { n })} / 30</p><h1 class="display">${esc(d.title)}</h1><p class="lead"><em>${esc(d.focus)}</em></p></header>
  <div class="bar-h"><i style="width:${cnt / 5 * 100}%"></i></div><p class="muted small">${t('reset.tasksDone', { n: cnt })}</p>
  <ul class="checklist">${S.RESET_TASKS.map(k => checkBtn(`data-task="${k}" data-day="${n}"`, r.tasks[k], t('part.' + k), esc(d[k]))).join('')}</ul>
  ${cnt === 5 ? `<div class="card done-card">${MARK}<p>${t('reset.dayDone')}</p></div>` : ''}
  <section class="card"><p class="eyebrow">${t('part.reflect')}</p><label class="h3" for="refl">${esc(d.reflect)}</label><textarea id="refl" data-day="${n}" rows="4" placeholder="${t('reset.reflectPh')}">${esc(r.reflection)}</textarea><p class="muted small" id="saved" aria-live="polite"></p></section>
  <nav class="pager">${n > 1 ? `<a class="btn ghost" href="#/reset/${n - 1}">← ${t('reset.day', { n: n - 1 })}</a>` : '<span></span>'}${n < 30 ? `<a class="btn" href="#/reset/${n + 1}">${t('reset.day', { n: n + 1 })} →</a>` : ''}</nav>`;
}
function soon(id) {
  const rd = curDay(), icon = NAV.find(x => x[0] === id)[1];
  return `<header class="hero"><p class="eyebrow">${t('soon.eyebrow')}</p><h1 class="display">${t('nav.' + id)}</h1><p class="lead">${t('soon.' + id + '.lead')}</p></header>
  <section class="card soon"><div class="soon-mark">${ic(icon)}</div><h2 class="h2">${t('soon.title')}</h2><ul class="bullets">${t('soon.' + id + '.items').split('|').map(x => `<li>${esc(x)}</li>`).join('')}</ul></section>
  <div class="links"><a class="btn" href="#/home">${t('soon.home')}</a><a class="btn ghost" href="#/reset/${rd}">${t('soon.reset', { n: rd })}</a></div>`;
}
const ob = { step: 0, name: '', goals: [], level: 'new', movement: [], time: 20 };
function chips(group, multi) {
  return `<div class="chips">${S.ONBOARDING[group].map(v => { const on = multi ? ob[group].includes(v) : ob[group] === v; return `<button type="button" class="chip${on ? ' on' : ''}" aria-pressed="${on}" data-opt="${group}" data-val="${v}"${multi ? ' data-multi' : ''}>${t(`opt.${group}.${v}`)}</button>`; }).join('')}</div>`;
}
function onboarding() {
  if (ob.step === 0) return `<div class="ob ob-welcome">${MARK}<p class="wordmark lg">SIENNA</p><p class="eyebrow">Wellness</p><h1 class="display">${t('ob.tagline')}</h1><p class="lead">${t('ob.lead')}</p><button class="btn wide" data-ob="next">${t('ob.begin')}</button></div>`;
  if (ob.step === 1) return `<form class="ob" id="obName"><p class="eyebrow">1 / 2</p><h1 class="display">${t('ob.nameQ')}</h1><input id="name" class="input" autocomplete="given-name" maxlength="40" required placeholder="${t('ob.namePh')}" value="${esc(ob.name)}"><button class="btn wide" type="submit">${t('ob.continue')}</button></form>`;
  return `<div class="ob"><p class="eyebrow">2 / 2</p><h1 class="display">${t('ob.prefsQ')}</h1><p class="lead">${t('ob.prefsLead')}</p>
  <h2 class="label">${t('ob.goals')}</h2>${chips('goals', 1)}<h2 class="label">${t('ob.level')}</h2>${chips('level')}<h2 class="label">${t('ob.movement')}</h2>${chips('movement', 1)}<h2 class="label">${t('ob.time')}</h2>${chips('time')}
  <button class="btn wide" data-ob="finish">${t('ob.finish')}</button></div>`;
}
function render() {
  const s = St.get(), view = $('#view'), r = (location.hash.slice(2) || 'home').split('/'), sec = r[0];
  const focusSel = document.activeElement && ['data-check', 'data-task', 'data-water'].map(a => document.activeElement.hasAttribute(a) ? `[${a}="${document.activeElement.getAttribute(a)}"]` : '').join('');
  document.body.classList.toggle('onboarding', !s.profile);
  if (!s.profile) { view.innerHTML = onboarding(); return; }
  view.innerHTML = sec === 'reset' ? (r[1] ? dayView(Math.min(30, Math.max(1, +r[1] || 1))) : resetView()) : S.VIEWS && S.VIEWS[sec] ? S.VIEWS[sec](r) : home();
  document.querySelectorAll('[data-nav]').forEach(a => a.setAttribute('aria-current', a.dataset.nav === sec || (sec === 'home' && a.dataset.nav === 'home') ? 'page' : 'false'));
  if (focusSel) { const el = view.querySelector(focusSel); el && el.focus(); }
}
document.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.check) setDay(d => { d.checks[b.dataset.check] = !d.checks[b.dataset.check]; });
  else if (b.dataset.water) setDay((d, s) => { d.water = Math.max(0, Math.min(20, d.water + +b.dataset.water)); if (d.water >= (s.profile.waterGoal || 8)) d.checks.hydrate = true; });
  else if (b.dataset.task) St.update(s => { const n = b.dataset.day; s.reset[n] = s.reset[n] || { tasks: {}, reflection: '' }; s.reset[n].tasks[b.dataset.task] = !s.reset[n].tasks[b.dataset.task]; });
  else if (b.dataset.opt) { const g = b.dataset.opt, v = g === 'time' ? +b.dataset.val : b.dataset.val; if (b.hasAttribute('data-multi')) ob[g] = ob[g].includes(v) ? ob[g].filter(x => x !== v) : [...ob[g], v]; else ob[g] = v; render(); }
  else if (b.dataset.ob === 'next') { ob.step = 1; render(); $('#name').focus(); }
  else if (b.dataset.ob === 'finish') { St.update(s => { s.profile = { name: ob.name, goals: ob.goals, level: ob.level, movement: ob.movement, time: ob.time, waterGoal: 8, lang: S.lang, createdAt: Date.now(), resetStart: dkey() }; }); location.hash = '#/home'; window.scrollTo(0, 0); }
});
document.addEventListener('submit', e => { if (e.target.id === 'obName') { e.preventDefault(); ob.name = $('#name').value.trim(); if (ob.name) { ob.step = 2; render(); window.scrollTo(0, 0); } } });
let saveT;
document.addEventListener('input', e => {
  if (e.target.id !== 'refl') return; const n = e.target.dataset.day, v = e.target.value;
  St.update(s => { s.reset[n] = s.reset[n] || { tasks: {}, reflection: '' }; s.reset[n].reflection = v; }, true);
  clearTimeout(saveT); saveT = setTimeout(() => { const el = $('#saved'); if (el) el.textContent = t('reset.saved'); }, 400);
});
window.addEventListener('hashchange', () => { render(); window.scrollTo(0, 0); });
Object.assign(S, { esc, ic, dkey, setDay, range, render, curDay });
St.init(); St.subscribe(render);
$('#nav').innerHTML = `<a class="brand" href="#/home" aria-label="Sienna Wellness">${MARK}<span class="wordmark">SIENNA</span></a><div class="links-nav">${NAV.map(([id, icon]) => `<a href="#/${id}" data-nav="${id}">${ic(icon)}<span>${t('nav.' + id)}</span></a>`).join('')}</div>`;
document.documentElement.lang = S.lang;
render();
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js');
})();
