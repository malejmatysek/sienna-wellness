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
 'mov.goal': 'Goal', 'mov.time': 'Time', 'mov.level': 'Level', 'goal.sculpt': 'Tone', 'goal.muscle': 'Build & tone', 'goal.full': 'Full body', 'goal.legs': 'Legs & booty', 'goal.upper': 'Upper body', 'goal.core': 'Core', 'goal.yoga': 'Yoga & mobility', 'goal.cardio': 'Cardio', 'goal.strength': 'Strength',  'goal.mobility': 'Mobility',
 'lvl.1': 'Beginner', 'lvl.2': 'Intermediate', 'lvl.3': 'Advanced', 'mov.session': 'Your session', 'mov.warm': 'Warm-up 3 min + 1 light set of the first move', 'mov.cool': 'Cool-down · 2 min: easy stretching and slow breaths',
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
const ui = { meal: 'all', tag: 'all', q: '', where: localStorage.getItem('sienna:where') || 'home', goal: 'full', time: 20, level: 1, seed: 1, bmin: 3, breath: null };
const chipRow = (act, vals, cur, label) => `<div class="chips scroll">${vals.map(v => `<button type="button" class="chip${String(cur) === String(v) ? ' on' : ''}" aria-pressed="${String(cur) === String(v)}" data-act="${act}" data-val="${v}">${label(v)}</button>`).join('')}</div>`;
const shuffle = (arr, seed) => { const a = [...arr]; let x = seed * 7919 % 233280; for (let i = a.length - 1; i > 0; i--) { x = (x * 9301 + 49297) % 233280; const j = Math.floor(x / 233280 * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const fmtDate = k => new Date(k + 'T12:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

/* ---------- Nutrition ---------- */
const favs = () => St.get().favs || [];
function rcard(x) { const f = favs().includes(x.id); return `<li class="card rcard"><details><summary><b class="rt">${e(x.title)}</b><span class="meta">${x.time} min · ${x.kcal} kcal · ${x.protein} g ${t('nut.protein')}</span></summary><div class="rbody"><p class="muted small">${e(x.text)}</p><ul class="ing">${x.ingredients.map(i => `<li>${e(i)}</li>`).join('')}</ul><ol class="steps sm">${x.steps.map(i => `<li>${e(i)}</li>`).join('')}</ol><a class="tlink" href="#/nutrition/${x.id}">Open recipe →</a></div></details><button class="fav${f ? ' on' : ''}" data-act="fav" data-id="${x.id}" aria-pressed="${f}" aria-label="${t('nut.fav')}">${ic('heart')}</button></li>`; }
function filtered() { const q = ui.q.toLowerCase(); return S.RECIPES.filter(x => (ui.meal === 'all' || (ui.meal === 'fav' ? favs().includes(x.id) : x.meal === ui.meal)) && (!q || [x.title, x.text, ...x.ingredients, ...x.tags].join(' ').toLowerCase().includes(q))); }
const rlist = () => { const l = filtered(); return `<ul class="rlist">${l.length ? l.map(rcard).join('') : `<li class="muted">${t('nut.none')}</li>`}</ul>`; };
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
  return `<header class="hero"><h1 class="display">${t('nav.nutrition')}</h1></header>
  <section class="card blush"><h2 class="h2">${t('nut.pickTitle')}</h2>${planBlock()}</section>
  <section><input id="rq" class="input search" type="search" placeholder="${t('nut.search')}" value="${e(ui.q)}" aria-label="${t('nut.search')}">
  ${chipRow('fmeal', ['all', ...MEALS, 'fav'], ui.meal, v => v === 'fav' ? t('tag.fav') : t('meal.' + v))}
  <div id="rlist">${rlist()}</div></section>`;
}
function recipe(x) {
  const f = favs().includes(x.id), ate = d0().checks.nourish;
  return `<a class="back" href="#/nutrition">← ${t('nut.back')}</a>
  <header class="hero keep"><p class="eyebrow">${t('meal.' + x.meal)}</p><h1 class="display">${e(x.title)}</h1><p class="lead">${e(x.text)}</p></header>
  <div class="stats"><div><b>${x.time}</b><span>${t('nut.min')}</span></div><div><b>${x.kcal}</b><span>kcal</span></div><div><b>${x.protein} g</b><span>${t('nut.protein')}</span></div></div>
  <p class="tags">${x.tags.map(e).join(' · ')}</p>
  <div class="links"><button class="btn ghost" data-act="fav" data-id="${x.id}" aria-pressed="${f}">${f ? '♥ Saved' : '♡ ' + t('nut.fav')}</button><button class="btn" data-act="ate"${ate ? ' disabled' : ''}>${ate ? t('nut.ated') : t('nut.ate')}</button></div>
  <section class="card"><h2 class="h2">${t('nut.ingredients')}</h2><ul class="ing">${x.ingredients.map(i => `<li>${e(i)}</li>`).join('')}</ul></section>
  <section class="card"><h2 class="h2">${t('nut.steps')}</h2><ol class="steps">${x.steps.map(i => `<li>${e(i)}</li>`).join('')}</ol></section>`;
}

/* ---------- Movement ---------- */
// Coach logic (ACSM 2009 progression model; Schoenfeld 2017/2021): compounds first, accessories next, core last.
const COMPOUND = ['squat', 'hinge', 'glute', 'lunge', 'push', 'pull', 'vpush', 'vpull'];
const PLAN = {
  full: ['squat', 'hinge|glute', 'push', 'pull|vpull', 'core', 'lunge', 'vpush|push', 'vpull|pull', 'glute|hinge', 'core', 'pullacc|shoulders', 'arms', 'gluteacc'],
  legs: ['squat', 'glute', 'hinge', 'lunge', 'gluteacc', 'legacc|gluteacc', 'lunge|squat', 'gluteacc', 'calf', 'core'],
  upper: ['push', 'pull', 'vpush|push', 'vpull|pull', 'shoulders|pullacc', 'arms', 'arms', 'pullacc', 'push', 'core'],
  core: ['core', 'core', 'core', 'core', 'core', 'pullacc', 'core', 'core', 'core', 'core']
};
// [sets, reps, rest] by level for compound / accessory; core reps or hold seconds
const DOSE = { 1: { c: [2, '12–15', 60], a: [2, '12–15', 45], k: [2, '10–12', 30, 20] }, 2: { c: [3, '10–12', 75], a: [3, '12', 60], k: [3, '12', 40, 30] }, 3: { c: [4, '6–10', 120], a: [3, '10–12', 60], k: [3, '15', 45, 45] } };
const TIPS = { full: 'Big lifts first while you are fresh. Rest fully between sets.', legs: 'Push through your heels and pause 1 s at the top of every glute move.', upper: 'Shoulder blades back and down on every press and row.', core: 'Ribs down and breathe out on the effort. Quality over speed.', yoga: 'Move with your breath. Never force a stretch.', cardio: 'Work hard, then really rest. Low-impact options are fine.' };
function build() {
  const lv = ui.level, g = ui.goal, rnd = (l, k = 0) => shuffle(l, ui.seed * 7 + lv * 13 + k), short = ui.time <= 10;
  const pool = S.EXERCISES.filter(x => x.level <= lv && (g === 'yoga' ? x.where === 'yoga' : x.where !== 'yoga' && (x.where === ui.where || (ui.where === 'gym' && x.where === 'home' && !COMPOUND.includes(x.pat) || (ui.where === 'gym' && ['lunge'].includes(x.pat) && x.where === 'home')))));
  const pref = l => lv === 1 ? l.sort((a, b) => a.level - b.level) : l.sort((a, b) => b.level - a.level || (a.where === ui.where ? -1 : 1));
  if (g === 'yoga') {
    const br = [5, 7, 9][lv - 1], secs = x => br * 5 * (x.side ? 2 : 1) + 10, main = ui.time * 60;
    const last = pool.find(x => x.id === 'y-savasana'), rest = rnd(pool.filter(x => x !== last));
    const picks = []; let used = secs(last);
    for (const x of rest) if (used + secs(x) <= main) { picks.push(x); used += secs(x); }
    picks.sort((a, b) => a.stage - b.stage); picks.push(last);
    return { picks, rx: x => x.id === 'y-savasana' ? Math.max(2, Math.round((main - used) / 60) + 2) + ' min' : `${br} breaths${x.side ? ' / side' : ''}`, est: ui.time };
  }
  if (g === 'cardio') {
    const n = { 10: 4, 20: 5, 30: 6, 45: 8, 60: 8 }[ui.time], [w, r] = [[30, 30], [40, 20], [45, 15]][lv - 1], cand = rnd(pool.filter(x => x.pat === 'cardio'));
    const lo = cand.filter(x => !x.jump), hi = cand.filter(x => x.jump), picks = [];
    while (picks.length < n && (lo.length || hi.length)) { const x = (picks.length % 2 ? hi.shift() : lo.shift()) || lo.shift() || hi.shift(); picks.push(x); }
    const rounds = Math.max(2, Math.round((ui.time * 60 - 300) / (picks.length * (w + r) + 60)));
    return { picks, rounds, w, r, est: Math.round((300 + rounds * (picks.length * (w + r) + 60)) / 60) };
  }
  const D = DOSE[lv], dose = x => x.pat === 'core' ? D.k : COMPOUND.includes(x.pat) ? D.c : D.a;
  const scale = d => short ? [2, d[1], Math.round(d[2] * .6), d[3]] : ui.time <= 20 ? [Math.min(d[0], 2), d[1], d[2], d[3]] : ui.time >= 60 ? [d[0] + (d === D.k ? 0 : 1), d[1], d[2], d[3]] : d;
  const secOf = x => { const d = scale(dose(x)); return d[0] * (45 * (x.side ? 1.6 : 1) + d[2]) + 30; };
  const main = ui.time * 60 - (short ? 180 : 300), plan = PLAN[g], picks = [], used = new Set();
  const pick = slot => { for (const pt of slot.split('|')) { const x = pref(rnd(pool.filter(y => y.pat === pt && !used.has(y.id)), picks.length))[0]; if (x) return x; } };
  let t = 0;
  for (let i = 0; i < plan.length; i++) {
    const x = pick(plan[i]); if (!x) continue;
    const need = g === 'full' ? 5 : 3;
    if (picks.length >= need && t + secOf(x) > main * 1.08) break;
    picks.push(x); used.add(x.id); t += secOf(x);
  }
  const rank = x => x.pat === 'core' ? 2 : COMPOUND.includes(x.pat) ? 0 : 1;
  if (g !== 'core') picks.sort((a, b) => rank(a) - rank(b));
  const home = ui.where === 'home';
  return { picks, est: Math.max(ui.time - 5, Math.round((t + (short ? 180 : 300)) / 60)), rx: x => { const [sets, reps, rest, hold] = scale(dose(x)); return `${sets} × ${x.hold ? hold + ' s' : reps}${x.side ? ' / side' : ''} · rest ${rest} s`; }, home };
}
const exRow = (x, rx) => `<li><details class="exd"><summary><b>${e(x.name)}</b><span class="rx">${rx}</span></summary><div class="howbody"><p class="muted small">${e(x.cue)}${x.eq ? ' · ' + e(x.eq) : ''}</p>${(h => h ? `<p><b>${t('mov.works')}</b> ${e(h.works)}</p><ol>${h.steps.map(z => `<li>${e(z)}</li>`).join('')}</ol><p><b>${t('mov.easier')}</b> ${e(h.easier)}</p>` : '')((S.HOWTO || {})[x.id])}</div></details></li>`;
function movement() {
  const s = build(), hist = (St.get().workouts || []).slice(-5).reverse(), done = (St.get().workouts || []).some(x => x.date === today()), g = ui.goal;
  const tip = g === 'yoga' || g === 'cardio' ? TIPS[g] : (ui.where === 'gym' ? 'Pick a weight where the last 1–2 reps feel hard but form stays clean.' : 'Lower slowly (3 s) and stop 1–2 reps before failure.');
  return `<header class="hero"><h1 class="display">${t('mov.title')}</h1></header>
  <section class="card tight">${g === 'yoga' ? '' : chipRow('mwhere', ['home', 'gym'], ui.where, v => t('where.' + v))}${chipRow('mgoal', S.WORKOUT_GOALS, g, v => t('goal.' + v))}
  ${chipRow('mtime', [10, 20, 30, 45, 60], ui.time, v => v + ' min')}${chipRow('mlevel', [1, 2, 3], ui.level, v => t('lvl.' + v))}</section>
  <section class="card blush session tight"><p class="eyebrow">≈ ${s.est} min · ${t('lvl.' + ui.level)}${g === 'yoga' ? '' : ' · ' + t('where.' + ui.where)}</p><h2 class="h2">${t('goal.' + g)}</h2>
  <p class="tip">${tip}</p>${s.rounds ? `<p class="rounds">${t('mov.rounds', { n: s.rounds, w: s.w, r: s.r })}</p>` : ''}
  <ol class="ex">${g === 'yoga' || g === 'cardio' ? '' : `<li class="wu">${t('mov.warm')}</li>`}${s.picks.map(x => exRow(x, s.rx ? s.rx(x) : '')).join('')}</ol>
  <details class="coach"><summary>Coach tips</summary><ul><li>${TIPS[g]}</li><li>Progress: when every set feels easy, add 1–2 reps or a little weight next time.</li><li>Rest is part of the plan: ${ui.level === 3 ? '2 min after heavy compounds' : '60–90 s'}, less for core.</li><li>Train each muscle 2× a week for best results.</li></ul></details>
  <div class="links"><button class="btn ghost" data-act="shuffle">${t('mov.shuffle')}</button><button class="btn" data-act="wdone">${t('mov.done')}</button></div>${done ? `<p class="okmsg">${t('mov.doneToday')}</p>` : ''}</section>
  ${hist.length ? `<section class="card tight"><h2 class="h3">${t('mov.history')}</h2><ul class="hist">${hist.map(h => `<li><span>${fmtDate(h.date)}</span><b>${t('goal.' + h.goal)}</b><small>${h.time} min</small></li>`).join('')}</ul></section>` : ''}`;
}

/* ---------- Recovery ---------- */
function recovery() {
  const rec = d0().checks.recover, wd = (St.get().wind || {})[today()] || [], wdone = (St.get().windDone || {})[today()];
  return `<header class="hero"><h1 class="display">${t('rec.title')}</h1>${rec ? `<p class="okmsg">${t('rec.recovered')}</p>` : ''}</header>
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
  return `<header class="hero"><h1 class="display">${t('jr.title')}</h1><p class="lead">${e(new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }))}</p></header>
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
