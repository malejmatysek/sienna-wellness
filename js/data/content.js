/* Daily content data — checklist, sample meals, sample movement, onboarding options. */
window.SIENNA = window.SIENNA || {};
SIENNA.CHECKLIST = [
  { id: 'move', icon: 'move' }, { id: 'nourish', icon: 'leaf' }, { id: 'hydrate', icon: 'drop' },
  { id: 'recover', icon: 'moon' }, { id: 'care', icon: 'heart' }, { id: 'journal', icon: 'pen' }
];
SIENNA.MEALS = [
  { id: 'oats', title: 'Berry overnight oats', time: 10, type: 'Breakfast', tags: ['Vegetarian', 'Prep ahead'], text: 'Oats, Greek yoghurt, chia, berries and a drizzle of honey.' },
  { id: 'bowl', title: 'Salmon & greens bowl', time: 20, type: 'Lunch', tags: ['High protein'], text: 'Baked salmon, quinoa, avocado, cucumber and a lemon-tahini dressing.' },
  { id: 'lentil', title: 'Creamy lentil soup', time: 30, type: 'Dinner', tags: ['Vegan', 'Batch cook'], text: 'Red lentils, carrot, ginger and coconut milk — cosy and filling.' },
  { id: 'toast', title: 'Avocado egg toast', time: 10, type: 'Breakfast', tags: ['Quick'], text: 'Sourdough, smashed avocado, soft egg, chilli flakes and lemon.' },
  { id: 'chicken', title: 'Mediterranean chicken tray', time: 35, type: 'Dinner', tags: ['High protein', 'One pan'], text: 'Chicken, peppers, courgette, olives and herbs roasted on one tray.' },
  { id: 'smoothie', title: 'Peach glow smoothie', time: 5, type: 'Snack', tags: ['Quick', 'Vegetarian'], text: 'Peach, banana, kefir, oats and a pinch of cinnamon.' },
  { id: 'chickpea', title: 'Chickpea crunch salad', time: 15, type: 'Lunch', tags: ['Vegan', 'Quick'], text: 'Chickpeas, tomato, cucumber, feta-style crumble and herbs.' }
];
SIENNA.MOVES = [
  { id: 'pilates-core', title: 'Pilates core flow', minutes: 20, kind: 'Pilates', level: 'Beginner', text: 'Breathing, bridges, dead bugs, toe taps and a gentle side plank.' },
  { id: 'walk', title: 'Mindful outdoor walk', minutes: 25, kind: 'Walking', level: 'All levels', text: 'Easy pace with three 1-minute brisk intervals and slow breathing.' },
  { id: 'yoga', title: 'Morning yoga stretch', minutes: 15, kind: 'Yoga', level: 'All levels', text: 'Cat-cow, low lunge, forward fold and child\'s pose.' },
  { id: 'strength', title: 'Full body strength', minutes: 25, kind: 'Strength', level: 'Intermediate', text: 'Squats, reverse lunges, push-ups and rows — 3 calm rounds.' },
  { id: 'restore', title: 'Restorative stretch', minutes: 15, kind: 'Recovery', level: 'All levels', text: 'Supported hip opener, twist and legs-up-the-wall.' }
];
SIENNA.ONBOARDING = {
  goals: ['energy', 'routine', 'move', 'eat', 'calm', 'confidence'],
  level: ['new', 'some', 'regular'],
  movement: ['pilates', 'yoga', 'strength', 'walking'],
  time: [10, 20, 30]
};
