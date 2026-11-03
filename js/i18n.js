/* UI strings. Add a "cs" block with the same keys to translate; t() falls back to English. */
window.SIENNA = window.SIENNA || {};
SIENNA.STRINGS = { en: {
 'nav.home': 'Home', 'nav.reset': '30-Day Reset', 'nav.movement': 'Movement', 'nav.nutrition': 'Nutrition', 'nav.recovery': 'Recovery', 'nav.journal': 'My Journal',
 'greet.morning': 'Good morning', 'greet.afternoon': 'Good afternoon', 'greet.evening': 'Good evening',
 'home.resetDay': 'Balance Reset · Day {n} of 30', 'home.today': 'today', 'home.progressAria': 'Today {pct}% complete',
 'home.ringTitle': 'Your balance today', 'home.ringText': '{done} of {total} rituals done. Small steps count.', 'home.ringDone': 'Every ritual done. Beautifully balanced.',
 'home.checklist': 'Daily rituals', 'home.hydration': 'Hydration', 'home.glasses': '{n} of {goal} glasses',
 'home.waterLess': 'Remove a glass', 'home.waterMore': 'Add a glass', 'home.forToday': 'For today', 'home.meal': 'Meal', 'home.move': 'Movement', 'home.week': 'This week',
 'check.move': 'Move', 'check.move.sub': '20 minutes you enjoy', 'check.nourish': 'Nourish', 'check.nourish.sub': 'A balanced, colourful plate',
 'check.hydrate': 'Hydrate', 'check.hydrate.sub': 'Reach your water goal', 'check.recover': 'Recover', 'check.recover.sub': 'Stretch, breathe or rest',
 'check.care': 'Self-care', 'check.care.sub': 'Ten minutes just for you', 'check.journal': 'Reflect', 'check.journal.sub': 'One honest line',
 'part.focus': 'Focus', 'part.move': 'Movement', 'part.nourish': 'Nourish', 'part.hydrate': 'Hydration', 'part.care': 'Self-care', 'part.mind': 'Mindset', 'part.reflect': 'Reflection',
 'reset.eyebrow': 'The signature program', 'reset.title': '30-Day Reset', 'reset.lead': 'Thirty gentle days to reset your rhythm — movement, nourishment, recovery and care, without extremes.',
 'reset.progress': 'Days completed', 'reset.flex': 'Missed a day? Nothing resets. Continue whenever you are ready.',
 'reset.continue': 'Continue', 'reset.completeAll': 'Reset complete', 'reset.day': 'Day {n}', 'reset.open': 'Open day', 'reset.days': 'Days {a}–{b}', 'reset.done': 'completed',
 'reset.tasksDone': '{n} of 5 done', 'reset.dayDone': 'Day complete. Be proud of yourself — see you tomorrow.', 'reset.reflectPh': 'Write freely. Only you can see this.', 'reset.saved': 'Saved',
 'soon.eyebrow': 'Coming next', 'soon.title': 'We are crafting this space', 'soon.home': 'Back to today', 'soon.reset': 'Continue Day {n}',
 'soon.movement.lead': 'Pilates, yoga and strength for every level — built around your time.', 'soon.movement.items': 'Workout library by type and level|Workout builder: choose style, level and minutes|Workout history saved on your device',
 'soon.nutrition.lead': 'Simple, nourishing recipes for busy days — no diets, no counting.', 'soon.nutrition.items': 'Cookbook with search and filters|Recipe pages with ingredients and steps|Favourites you can save',
 'soon.recovery.lead': 'Rest is part of the plan. Stretching, breathwork and better sleep.', 'soon.recovery.items': 'Guided stretching and mobility|Breathing exercises|Evening wind-down rituals',
 'soon.journal.lead': 'A quiet place for your thoughts, moods and small wins.', 'soon.journal.items': 'Daily journal entries|Mood and energy check-ins|Your 30-Day Reset reflections in one place',
 'ob.tagline': 'Feel good. Look good. Live balanced.', 'ob.lead': 'A calmer, healthier rhythm — without extremes.', 'ob.begin': 'Begin',
 'ob.nameQ': 'What should we call you?', 'ob.namePh': 'Your first name', 'ob.continue': 'Continue', 'ob.prefsQ': 'Make it yours', 'ob.prefsLead': 'Choose what matters to you. You can change it any time.',
 'ob.goals': 'What would you love more of?', 'ob.level': 'How often do you move now?', 'ob.movement': 'Movement you enjoy', 'ob.time': 'Time for yourself each day', 'ob.finish': 'Start my balance',
 'opt.goals.energy': 'Energy', 'opt.goals.routine': 'Routine', 'opt.goals.move': 'Movement', 'opt.goals.eat': 'Better eating', 'opt.goals.calm': 'Calm', 'opt.goals.confidence': 'Confidence',
 'opt.level.new': 'Just starting', 'opt.level.some': 'Sometimes', 'opt.level.regular': 'Regularly',
 'opt.movement.pilates': 'Pilates', 'opt.movement.yoga': 'Yoga', 'opt.movement.strength': 'Strength', 'opt.movement.walking': 'Walking',
 'opt.time.10': '10 min', 'opt.time.20': '20 min', 'opt.time.30': '30+ min'
} };
SIENNA.lang = 'en';
SIENNA.t = (k, v = {}) => String((SIENNA.STRINGS[SIENNA.lang] || {})[k] ?? SIENNA.STRINGS.en[k] ?? k).replace(/\{(\w+)\}/g, (_, x) => v[x] ?? '');
