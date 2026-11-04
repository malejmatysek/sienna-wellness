/* Nutrition, Movement, Recovery and Journal views. Registered as SIENNA.VIEWS; helpers come from app.js. */
(() => {
const S = SIENNA, St = S.Store, t = S.t;
Object.assign(S.STRINGS.en, {
 'meal.all': 'All', 'meal.breakfast': 'Breakfast', 'meal.lunch': 'Lunch', 'meal.dinner': 'Dinner', 'meal.snack': 'Snack', 'tag.all': 'All tags', 'tag.fav': '♥ Saved',
 'nut.eyebrow': 'The Sienna cookbook', 'nut.lead': 'Simple, high-protein meals made from real food. Feel full, strong and full of energy — no dieting.',
 'nut.pickTitle': 'What should I eat today?', 'nut.pickLead': 'A balanced day of meals, picked for you.', 'nut.pickBtn': 'Plan my day', 'nut.repick': 'Pick again', 'nut.planTotal': 'About {kcal} kcal · {p} g protein for the day',
 'nut.search': 'Search recipes or ingredients', 'nut.none': 'No recipes match — try another filter.', 'nut.protein': 'protein', 'nut.fav': 'Save to favourites', 'nut.count': '{n} recipes',
 'nut.ingredients': 'Ingredients', 'nut.steps': 'Method', 'nut.ate': 'I ate this today', 'nut.ated': 'Eat well ticked for today ✓', 'nut.min': 'minutes', 'nut.back': 'Cookbook',
 'mov.eyebrow': 'Workout builder', 'mov.title': 'Movement', 'mov.lead': 'Choose where, goal, time and level. We make the workout for you.', 'mov.where': 'Where', 'where.home': 'Home (no equipment)', 'where.gym': 'Gym', 'mov.load': 'Choose a weight where the last 1–2 reps feel hard but your form stays clean.', 'mov.loadHome': 'Move slowly (3 s down) and go close to failure: the last 1–2 reps should feel hard, form stays clean.', 'mov.sets': '{s} × {r} reps · rest {rest} s', 'mov.holds': '{s} × {h} s hold · rest {rest} s', 'mov.perside': ' / side', 'mov.use': 'Use: {eq}',
 'mov.goal': 'Goal', 'mov.time': 'Time', 'mov.level': 'Level', 'goal.sculpt': 'Tone & endurance', 'goal.muscle': 'Build & tone', 'goal.strength': 'Strength', 'goal.core': 'Core & Pilates', 'goal.cardio': 'Cardio burn', 'goal.mobility': 'Mobility',
 'lvl.1': 'Beginner', 'lvl.2': 'Intermediate', 'lvl.3': 'Advanced', 'mov.session': 'Your session', 'mov.warm': 'Warm-up · 3 min: marching, arm circles, hip rolls', 'mov.cool': 'Cool-down · 2 min: easy stretching and slow breaths',
 'mov.rounds': 'Repeat ×{n} rounds · {w}s work / {r}s rest', 'mov.shuffle': 'Shuffle', 'mov.done': 'Mark session done', 'mov.doneToday': 'Session done today — Move is ticked ✓', 'mov.history': 'Recent sessions', 'mov.noHistory': 'Your finished sessions will appear here.',
 'rec.eyebrow': 'Rest is progress', 'rec.title': 'Recovery', 'rec.lead': 'Rest helps your body get stronger. Breathe, stretch and sleep well.',
 'rec.breath': 'Breathing timer', 'rec.breathLead': 'Inhale 4 · hold 4 · exhale 6', 'rec.start': 'Start', 'rec.stop': 'Stop', 'rec.in': 'Breathe in', 'rec.hold': 'Hold', 'rec.out': 'Breathe out', 'rec.ready': 'Ready when you are', 'rec.breathDone': 'Beautiful. Recover is ticked.',
 'rec.stretch': 'Stretch routines', 'rec.stretchDone': 'Done', 'rec.wind': 'Evening wind-down', 'rec.windLead': 'Ten calm minutes before sleep.', 'rec.windDone': 'Mark wind-down done', 'rec.windDoneOk': 'Wind-down done tonight ✓', 'rec.sleep': 'Sleep tips', 'rec.recovered': 'Recover is ticked for today ✓',
 'jr.eyebrow': 'A quiet place for you', 'jr.title': 'My Journal', 'jr.today': 'Today', 'jr.mood': 'Mood', 'jr.energy': 'Energy', 'jr.note': 'What is on your mind?', 'jr.save': 'Save entry', 'jr.saved': 'Saved — Reflect is ticked ✓',
 'jr.chart': 'Your week', 'jr.history': 'Past entries', 'jr.weekLead': 'How many things you ticked off each day.', 'jr.none': 'Your entries will appear here.', 'jr.reflections': 'Reset reflections',
 'mood.1': 'Low', 'mood.2': 'Meh', 'mood.3': 'Okay', 'mood.4': 'Good', 'mood.5': 'Glowing', 'energy.1': 'Drained', 'energy.2': 'Tired', 'energy.3': 'Steady', 'energy.4': 'Energised', 'energy.5': 'Vibrant'
});
const e = x => S.esc(x), $ = s => document.querySelector(s), ic = (...a) => S.ic(...a);
const today = () => S.dkey(), d0 = () => St.get().days[today()] || { checks: {} };
const tick = id => S.setDay(d => { d.checks[id] = true; });
const MEALS = ['breakfast', 'lunch', 'dinner', 'snack'];
const ui = { meal: 'all', tag: 'all', q: '', where: localStorage.getItem('sienna:where') || 'home', goal: 'muscle', time: 20, level: 1, seed: 1, bmin: 3, breath: null };
const chipRow = (act, vals, cur, label) => `<div class="chips scroll">${vals.map(v => `<button type="button" class="chip${String(cur) === String(v) ? ' on' : ''}" aria-pressed="${String(cur) === String(v)}" data-act="${act}" data-val="${v}">${label(v)}</button>`).join('')}</div>`;
const shuffle = (arr, seed) => { const a = [...arr]; let x = seed * 7919 % 233280; for (let i = a.length - 1; i > 0; i--) { x = (x * 9301 + 49297) % 233280; const j = Math.floor(x / 233280 * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const fmtDate = k => new Date(k + 'T12:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

/* ---------- Nutrition ---------- */
const favs = () => St.get().favs || [];
function rcard(x) { const f = favs().includes(x.id); return `<li class="card rcard"><a href="#/nutrition/${x.id}"><p class="eyebrow">${t('meal.' + x.meal)} · ${x.time} min</p><h3 class="h3">${e(x.title)}</h3><p class="meta">${x.kcal} kcal · ${x.protein} g ${t('nut.protein')}</p><p class="tags">${x.tags.map(e).join(' · ')}</p></a><button class="fav${f ? ' on' : ''}" data-act="fav" data-id="${x.id}" aria-pressed="${f}" aria-label="${t('nut.fav')}">${ic('heart')}</button></li>`; }
function filtered() { const q = ui.q.toLowerCase(); return S.RECIPES.filter(x => (ui.meal === 'all' || (ui.meal === 'fav' ? favs().includes(x.id) : x.meal === ui.meal)) && (!q || [x.title, x.text, ...x.ingredients, ...x.tags].join(' ').toLowerCase().includes(q))); }
const rlist = () => { const l = filtered(); return `<p class="muted small">${t('nut.count', { n: l.length })}</p><ul class="rlist">${l.length ? l.map(rcard).join('') : `<li class="muted">${t('nut.none')}</li>`}</ul>`; };
function planBlock() {
  const p = (St.get().plans || {})[today()];
  if (!p) return `<button class="btn wide" data-act="pick">${t('nut.pickBtn')}</button>`;
  const xs = MEALS.map(m => S.RECIPES.find(r => r.id === p[m]));
  return `<ul class="plan">${xs.map(x => `<li><a href="#/nutrition/${x.id}"><span class="eyebrow">${t('meal.' + x.meal)}</span><b>${e(x.title)}</b><small>${x.kcal} kcal · ${x.protein} g</small></a></li>`).join('')}</ul>
  <p class="muted small">${t('nut.planTotal', { kcal: xs.reduce((a, x) => a + x.kcal, 0), p: xs.reduce((a, x) => a + x.protein, 0) })}</p><button class="btn ghost wide" data-act="pick">${t('nut.repick')}</button>`;
}
function nutrition(r) {
  if (r[1]) return recipe(S.RECIPES.find(x => x.id === r[1]) || S.RECIPES[0]);
  const tags = [...new Set(S.RECIPES.flatMap(x => x.tags))];
  return `<header class="hero"><p class="eyebrow">${t('nut.eyebrow')}</p><h1 class="display">${t('nav.nutrition')}</h1><p class="lead">${t('nut.lead')}</p></header>
  <section class="card blush"><h2 class="h2">${t('nut.pickTitle')}</h2><p class="muted">${t('nut.pickLead')}</p>${planBlock()}</section>
  <section><input id="rq" class="input search" type="search" placeholder="${t('nut.search')}" value="${e(ui.q)}" aria-label="${t('nut.search')}">
  ${chipRow('fmeal', ['all', ...MEALS, 'fav'], ui.meal, v => v === 'fav' ? t('tag.fav') : t('meal.' + v))}
  <div id="rlist">${rlist()}</div></section>`;
}
function recipe(x) {
  const f = favs().includes(x.id), ate = d0().checks.nourish;
  return `<a class="back" href="#/nutrition">← ${t('nut.back')}</a>
  <header class="hero"><p class="eyebrow">${t('meal.' + x.meal)}</p><h1 class="display">${e(x.title)}</h1><p class="lead">${e(x.text)}</p></header>
  <div class="stats"><div><b>${x.time}</b><span>${t('nut.min')}</span></div><div><b>${x.kcal}</b><span>kcal</span></div><div><b>${x.protein} g</b><span>${t('nut.protein')}</span></div></div>
  <p class="tags">${x.tags.map(e).join(' · ')}</p>
  <div class="links"><button class="btn ghost" data-act="fav" data-id="${x.id}" aria-pressed="${f}">${f ? '♥ Saved' : '♡ ' + t('nut.fav')}</button><button class="btn" data-act="ate"${ate ? ' disabled' : ''}>${ate ? t('nut.ated') : t('nut.ate')}</button></div>
  <section class="card"><h2 class="h2">${t('nut.ingredients')}</h2><ul class="ing">${x.ingredients.map(i => `<li>${e(i)}</li>`).join('')}</ul></section>
  <section class="card"><h2 class="h2">${t('nut.steps')}</h2><ol class="steps">${x.steps.map(i => `<li>${e(i)}</li>`).join('')}</ol></section>`;
}

/* ---------- Movement ---------- */
// Evidence-based dosing (ACSM 2009; Schoenfeld 2017/2021): sets by level, reps, rest seconds.
const RX = { strength: { sets: [3, 4, 4], reps: [4, 6], rest: 150, restHome: 90, homeReps: [6, 10] }, muscle: { sets: [3, 3, 4], reps: [8, 12], rest: 75, homeReps: [10, 15] },
  sculpt: { sets: [2, 3, 3], reps: [12, 15], rest: 50 }, core: { sets: [2, 3, 3], reps: [10, 15], rest: 45, hold: [20, 30, 45] }, mobility: { sets: [2, 2, 2], reps: [8, 10], rest: 20, hold: [30, 45, 60] } };
function build() {
  const lv = ui.level, g = ui.goal, ok = S.EXERCISES.filter(x => x.level <= lv && (x.where === ui.where || (ui.where === 'gym' && ['core', 'cardio', 'mobility'].includes(g) && x.where === 'home')));
  const fit = ok.filter(x => x.goals.includes(g));
  let picks = shuffle(fit.filter(x => x.where === ui.where), ui.seed + lv * 13).concat(shuffle(fit.filter(x => x.where !== ui.where), ui.seed));
  if (lv > 1) picks.sort((a, b) => (a.where === ui.where ? 0 : 1) - (b.where === ui.where ? 0 : 1) || b.level - a.level);
  const main = ui.time * 60 - 300;
  if (g === 'cardio') {
    const n = ui.time <= 10 ? 4 : ui.time <= 20 ? 5 : 6, [w, r] = [[30, 30], [40, 20], [45, 15]][lv - 1];
    picks = picks.slice(0, n); return { picks, w, r, rounds: Math.max(1, Math.round(main / (n * (w + r)))) };
  }
  const rx = RX[g], home = ui.where === 'home', reps = home && rx.homeReps ? rx.homeReps : rx.reps, rest = home && rx.restHome ? rx.restHome : rx.rest;
  const sets = rx.sets[lv - 1];
  const work = x => x.hold ? (rx.hold || [20, 30, 40])[lv - 1] : Math.round((reps[0] + reps[1]) / 2 * (home && g !== 'sculpt' ? 4.5 : 3.5));
  const per = sets * (40 + rest) + 30;
  let n = Math.max(3, Math.min(8, Math.round(main / per)));
  picks = picks.slice(0, n);
  return { picks, sets, reps, rest, home, rx, work };
}
function movement() {
  const s = build(), hist = (St.get().workouts || []).slice(-5).reverse(), done = (St.get().workouts || []).some(x => x.date === today());
  return `<header class="hero"><p class="eyebrow">${t('mov.eyebrow')}</p><h1 class="display">${t('mov.title')}</h1><p class="lead">${t('mov.lead')}</p></header>
  <section class="card"><h2 class="label">${t('mov.where')}</h2>${chipRow('mwhere', ['home', 'gym'], ui.where, v => t('where.' + v))}<h2 class="label">${t('mov.goal')}</h2>${chipRow('mgoal', S.WORKOUT_GOALS, ui.goal, v => t('goal.' + v))}
  <h2 class="label">${t('mov.time')}</h2>${chipRow('mtime', [10, 20, 30, 45], ui.time, v => v + ' min')}<h2 class="label">${t('mov.level')}</h2>${chipRow('mlevel', [1, 2, 3], ui.level, v => t('lvl.' + v))}</section>
  <section class="card blush session"><p class="eyebrow">${t('mov.session')} · ${ui.time} min · ${t('lvl.' + ui.level)}</p><h2 class="h2">${t('goal.' + ui.goal)}</h2>
  <p class="muted small">${t('mov.warm')}</p>${s.rounds ? `<p class="rounds">${t('mov.rounds', { n: s.rounds, w: s.w, r: s.r })}</p>` : (['strength', 'muscle', 'sculpt'].includes(ui.goal) ? `<p class="rounds">${t(s.home ? 'mov.loadHome' : 'mov.load')}</p>` : '')}
  <ol class="ex">${s.picks.map(x => `<li><div class="exrow"><span><b>${e(x.name)}</b><small>${e(x.cue)}</small>${s.rounds ? '' : `<em class="rx">${x.hold ? t('mov.holds', { s: s.sets, h: s.work(x), rest: s.rest }) : t('mov.sets', { s: s.sets, r: s.reps[0] + '–' + s.reps[1], rest: s.rest })}</em>`}${x.eq ? `<small class="eq">${t('mov.use', { eq: e(x.eq) })}</small>` : ''}</span></div>${(h => h ? `<details class="howto"><summary aria-label="${t('mov.how')}: ${e(x.name)}">?</summary><div class="howbody"><p><b>${t('mov.works')}</b> ${e(h.works)}</p><ol>${h.steps.map(z => `<li>${e(z)}</li>`).join('')}</ol><p><b>${t('mov.easier')}</b> ${e(h.easier)}</p></div></details>` : '')((S.HOWTO || {})[x.id])}</li>`).join('')}</ol><p class="muted small">${t('mov.cool')}</p>
  <div class="links"><button class="btn ghost" data-act="shuffle">${t('mov.shuffle')}</button><button class="btn" data-act="wdone">${t('mov.done')}</button></div>${done ? `<p class="okmsg">${t('mov.doneToday')}</p>` : ''}</section>
  <section class="card"><h2 class="h2">${t('mov.history')}</h2>${hist.length ? `<ul class="hist">${hist.map(h => `<li><span>${fmtDate(h.date)}</span><b>${t('goal.' + h.goal)}</b><small>${h.time} min · ${t('lvl.' + h.level)}</small></li>`).join('')}</ul>` : `<p class="muted">${t('mov.noHistory')}</p>`}</section>`;
}

/* ---------- Recovery ---------- */
function recovery() {
  const rec = d0().checks.recover, wd = (St.get().wind || {})[today()] || [], wdone = (St.get().windDone || {})[today()];
  return `<header class="hero"><p class="eyebrow">${t('rec.eyebrow')}</p><h1 class="display">${t('rec.title')}</h1><p class="lead">${t('rec.lead')}</p>${rec ? `<p class="okmsg">${t('rec.recovered')}</p>` : ''}</header>
  <section class="card breath"><h2 class="h2">${t('rec.breath')}</h2><p class="muted">${t('rec.breathLead')}</p>
  <div class="bwrap"><div id="bcircle" class="bcircle"></div><p id="bphase" class="bphase" aria-live="polite">${t('rec.ready')}</p><p id="btime" class="muted small">${ui.bmin}:00</p></div>
  ${chipRow('bmin', [1, 3, 5], ui.bmin, v => v + ' min')}<button class="btn wide" data-act="breath" id="bbtn">${t(ui.breath ? 'rec.stop' : 'rec.start')}</button></section>
  <section><h2 class="section-title">${t('rec.stretch')}</h2><div class="duo">${S.STRETCHES.map(x => `<article class="card"><h3 class="h3">${e(x.name)}</h3><p class="muted small">${Math.round(x.moves.reduce((a, m) => a + m[1], 0) / 60)} min</p><ol class="steps sm">${x.moves.map(m => `<li>${e(m[0])} · ${m[1]}s</li>`).join('')}</ol><button class="btn ghost wide" data-act="sdone" data-id="${x.id}">${t('rec.stretchDone')}</button></article>`).join('')}</div></section>
  <section class="card peach"><h2 class="h2">${t('rec.wind')}</h2><p class="muted">${t('rec.windLead')}</p><ul class="checklist">${S.WINDDOWN.map((w, i) => `<li><button class="check${wd[i] ? ' on' : ''}" role="checkbox" aria-checked="${!!wd[i]}" data-act="wstep" data-i="${i}"><span class="box">${ic('tick')}</span><span class="ct"><small>${e(w)}</small></span></button></li>`).join('')}</ul>
  ${wdone ? `<p class="okmsg">${t('rec.windDoneOk')}</p>` : `<button class="btn wide" data-act="wdown">${t('rec.windDone')}</button>`}</section>
  <section class="card"><h2 class="h2">${t('rec.sleep')}</h2><ul class="bullets left">${S.SLEEP_TIPS.map(x => `<li>${e(x)}</li>`).join('')}</ul></section>`;
}
function stopBreath() { clearInterval(ui.breath); ui.breath = null; const b = $('#bbtn'); if (b) b.textContent = t('rec.start'); const c = $('#bcircle'); if (c) c.className = 'bcircle'; }
function breath() {
  if (ui.breath) return stopBreath();
  const total = ui.bmin * 60, start = Date.now(); $('#bbtn').textContent = t('rec.stop');
  ui.breath = setInterval(() => {
    const el = $('#bphase'), c = $('#bcircle'); if (!el) return stopBreath();
    const s = (Date.now() - start) / 1000;
    if (s >= total) { stopBreath(); tick('recover'); S.toast(t('rec.breathDone')); return; }
    const k = s % 14, ph = k < 4 ? 'in' : k < 8 ? 'hold' : 'out';
    el.textContent = t('rec.' + ph); c.className = 'bcircle' + (ph === 'out' ? '' : ' grow');
    const left = Math.ceil(total - s); $('#btime').textContent = Math.floor(left / 60) + ':' + String(left % 60).padStart(2, '0');
  }, 200);
}

/* ---------- Journal ---------- */
function journal() {
  const J = St.get().journal || {}, cur = J[today()] || {};
  if (ui.jfor !== today()) Object.assign(ui, { jfor: today(), jm: cur.mood || 0, je: cur.energy || 0, jn: cur.note || '', jsaved: false });
  const scale = (act, key, val) => `<div class="scale">${[1, 2, 3, 4, 5].map(v => `<button type="button" class="sc${val === v ? ' on' : ''}" aria-pressed="${val === v}" data-act="${act}" data-val="${v}"><i style="--s:${v}"></i><span>${t(key + '.' + v)}</span></button>`).join('')}</div>`;
  const days = S.range(0, 6).map(i => { const d = new Date(); d.setDate(d.getDate() - 6 + i); return S.dkey(d); });
  const keys = Object.keys(J).sort().reverse();
  const refl = S.range(1, 30).filter(n => (St.get().reset[n] || {}).reflection);
  return `<header class="hero"><p class="eyebrow">${t('jr.eyebrow')}</p><h1 class="display">${t('jr.title')}</h1><p class="lead">${e(new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }))}</p></header>
  <section class="card"><h2 class="label">${t('jr.mood')}</h2>${scale('jmood', 'mood', ui.jm)}<h2 class="label">${t('jr.energy')}</h2>${scale('jenergy', 'energy', ui.je)}
  <label class="label" for="jnote">${t('jr.note')}</label><textarea id="jnote" rows="5">${e(ui.jn)}</textarea>
  <button class="btn wide" data-act="jsave"${ui.jm && ui.je ? '' : ' disabled'}>${t('jr.save')}</button>${ui.jsaved ? `<p class="okmsg">${t('jr.saved')}</p>` : ''}</section>
  <section class="card"><h2 class="h2">${t('jr.chart')}</h2><div class="jchart">${days.map(k => { const x = J[k] || {}; return `<div><div class="jbars"><i class="m" style="height:${(x.mood || 0) * 20}%"></i><i class="en" style="height:${(x.energy || 0) * 20}%"></i></div><span>${new Date(k + 'T12:00').toLocaleDateString('en-GB', { weekday: 'narrow' })}</span></div>`; }).join('')}</div>
  <p class="legend"><i class="m"></i>${t('jr.mood')} <i class="en"></i>${t('jr.energy')}</p></section>
  <section class="card"><h2 class="h2">${t('home.week')}</h2><p class="muted small">${t('jr.weekLead')}</p><div class="week">${S.weekHTML()}</div></section>
  <section class="card"><h2 class="h2">${t('jr.history')}</h2>${keys.length ? `<ul class="hist">${keys.map(k => `<li><details><summary><span>${fmtDate(k)}</span><b>${t('mood.' + J[k].mood)} · ${t('energy.' + J[k].energy)}</b></summary><p>${e(J[k].note) || '—'}</p></details></li>`).join('')}</ul>` : `<p class="muted">${t('jr.none')}</p>`}</section>
  ${refl.length ? `<section class="card"><h2 class="h2">${t('jr.reflections')}</h2><ul class="hist">${refl.map(n => `<li><a href="#/reset/${n}"><span>${t('reset.day', { n })}</span><small>${e(St.get().reset[n].reflection.slice(0, 120))}</small></a></li>`).join('')}</ul></section>` : ''}`;
}

S.VIEWS = { nutrition, movement, recovery, journal };
document.addEventListener('click', ev => {
  const b = ev.target.closest('[data-act]'); if (!b) return; const a = b.dataset.act, v = b.dataset.val;
  if (a === 'fav') { let added; St.update(s => { s.favs = s.favs || []; const i = s.favs.indexOf(b.dataset.id); added = i < 0; added ? s.favs.push(b.dataset.id) : s.favs.splice(i, 1); }); S.toast(added ? 'Saved to favourites ♥' : 'Removed from favourites'); }
  else if (a === 'fmeal') { ui.meal = v; S.render(); } else if (a === 'ftag') { ui.tag = v; S.render(); }
  else if (a === 'pick') St.update(s => { s.plans = s.plans || {}; const p = {}; MEALS.forEach(m => { const pool = S.RECIPES.filter(x => x.meal === m); p[m] = pool[Math.floor(Math.random() * pool.length)].id; }); s.plans[today()] = p; });
  else if (a === 'ate') { tick('nourish'); S.toast('Eat well ticked ✓'); }
  else if (a === 'mwhere') { ui.where = v; localStorage.setItem('sienna:where', v); S.render(); } else if (a === 'mgoal') { ui.goal = v; S.render(); } else if (a === 'mtime') { ui.time = +v; S.render(); } else if (a === 'mlevel') { ui.level = +v; S.render(); }
  else if (a === 'shuffle') { ui.seed++; S.render(); }
  else if (a === 'wdone') { const s = build(); St.update(st => { st.workouts = st.workouts || []; st.workouts.push({ date: today(), at: Date.now(), goal: ui.goal, time: ui.time, level: ui.level, ids: s.picks.map(x => x.id) }); }); tick('move'); S.toast('Workout saved ✓'); }
  else if (a === 'bmin') { if (!ui.breath) { ui.bmin = +v; S.render(); } } else if (a === 'breath') breath();
  else if (a === 'sdone') { St.update(s => { s.stretchLog = s.stretchLog || []; s.stretchLog.push({ date: today(), id: b.dataset.id }); }); tick('recover'); S.toast('Rest ticked ✓'); }
  else if (a === 'wstep') St.update(s => { s.wind = s.wind || {}; const w = s.wind[today()] = s.wind[today()] || []; w[b.dataset.i] = !w[b.dataset.i]; });
  else if (a === 'wdown') { St.update(s => { s.windDone = s.windDone || {}; s.windDone[today()] = true; }); tick('recover'); S.toast('Rest ticked ✓'); }
  else if (a === 'jmood') { ui.jm = +v; S.render(); } else if (a === 'jenergy') { ui.je = +v; S.render(); }
  else if (a === 'jsave') { St.update(s => { s.journal = s.journal || {}; s.journal[today()] = { mood: ui.jm, energy: ui.je, note: ui.jn, at: Date.now() }; }); ui.jsaved = true; tick('journal'); S.toast(t('toast.saved')); }
});
document.addEventListener('input', ev => {
  if (ev.target.id === 'rq') { ui.q = ev.target.value; $('#rlist').innerHTML = rlist(); }
  if (ev.target.id === 'jnote') ui.jn = ev.target.value;
});
window.addEventListener('hashchange', () => { if (ui.breath) stopBreath(); });
})();
