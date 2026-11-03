/* Movement + recovery content data. */
window.SIENNA = window.SIENNA || {};
SIENNA.WORKOUT_GOALS = ['sculpt', 'strength', 'core', 'cardio', 'mobility'];
// [id, name, goals, level 1-3, cue]
SIENNA.EXERCISES = [
 ['squat','Bodyweight squat',['sculpt','strength'],1,'Sit back into your heels, chest proud.'],
 ['glute-bridge','Glute bridge',['sculpt','core'],1,'Press through heels, squeeze glutes at the top.'],
 ['reverse-lunge','Reverse lunge',['sculpt','strength'],1,'Step back softly, front knee over ankle.'],
 ['wall-pushup','Incline push-up',['strength'],1,'Hands on a bench or wall, body in one line.'],
 ['dead-bug','Dead bug',['core'],1,'Lower back stays heavy on the mat.'],
 ['bird-dog','Bird dog',['core','mobility'],1,'Reach long, keep hips level.'],
 ['march','High-knee march',['cardio'],1,'Light and rhythmic, swing your arms.'],
 ['step-jack','Step jack',['cardio'],1,'Step out wide, arms overhead — no jumping.'],
 ['cat-cow','Cat-cow',['mobility'],1,'Move slowly with your breath.'],
 ['world-greatest','World\'s greatest stretch',['mobility'],1,'Lunge, rotate and reach to the sky.'],
 ['side-leg','Side-lying leg lift',['sculpt'],1,'Long leg, toes forward, slow lowering.'],
 ['clamshell','Clamshell',['sculpt'],1,'Keep feet together, open from the hip.'],
 ['sumo-squat','Sumo squat pulse',['sculpt','strength'],2,'Wide stance, knees track over toes.'],
 ['pushup','Knee or full push-up',['strength','core'],2,'Lower with control, elbows at 45°.'],
 ['plank','Forearm plank',['core'],2,'Long line from head to heels, breathe.'],
 ['side-plank','Side plank',['core','sculpt'],2,'Stack hips, lift tall through the waist.'],
 ['hundred','Pilates hundred',['core'],2,'Pump the arms, chin gently tucked.'],
 ['skater','Skater',['cardio','sculpt'],2,'Leap side to side, land softly.'],
 ['mountain-climber','Mountain climber',['cardio','core'],2,'Hips low, knees drive to chest.'],
 ['single-leg-bridge','Single-leg bridge',['sculpt','strength'],2,'Hips stay level as you lift.'],
 ['split-squat','Bulgarian split squat',['strength','sculpt'],3,'Back foot on a chair, sink straight down.'],
 ['jump-squat','Jump squat',['cardio','strength'],3,'Explode up, land quietly in a squat.'],
 ['burpee','Burpee',['cardio','strength'],3,'Smooth tempo — step back if you need.'],
 ['plank-reach','Plank shoulder tap + reach',['core','strength'],3,'Hips still as you tap and reach.'],
 ['pistol-box','Box single-leg squat',['strength','mobility'],3,'Sit to a chair on one leg, stand with control.']
].map(([id, name, goals, level, cue]) => ({ id, name, goals, level, cue }));
SIENNA.STRETCHES = [
 { id: 'morning', name: 'Morning mobility', moves: [['Cat-cow', 45], ['Thread the needle', 60], ['Low lunge, each side', 60], ['Forward fold', 45], ['Standing side bend', 45]] },
 { id: 'desk', name: 'Desk reset', moves: [['Neck rolls', 40], ['Chest opener', 45], ['Seated twist, each side', 60], ['Hip flexor stretch', 60], ['Wrist circles', 30]] },
 { id: 'evening', name: 'Evening release', moves: [['Child\'s pose', 60], ['Supine twist, each side', 60], ['Figure-four stretch', 60], ['Happy baby', 45], ['Legs up the wall', 120]] }
];
SIENNA.WINDDOWN = ['Dim the lights and put your phone on charge outside the bedroom.', 'Make a warm, caffeine-free tea.', 'Two minutes of slow breathing: in for 4, out for 6.', 'Gentle stretch: child\'s pose and a supine twist.', 'Write down one good thing from today.'];
SIENNA.SLEEP_TIPS = ['Keep a regular bedtime — even at weekends, within an hour.', 'Get morning daylight for 10 minutes to set your body clock.', 'Stop caffeine after 2 pm.', 'Keep your bedroom cool, dark and quiet.', 'Eat dinner 2–3 hours before bed.', 'If you can\'t sleep after 20 minutes, get up and read in dim light.'];
