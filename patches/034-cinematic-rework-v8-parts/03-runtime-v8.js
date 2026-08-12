  'Symbol of Fear::Evolution':RIFT_CINEMATIC_V8_P('symbol-evolution','final-war-city','final-war-shigaraki','finger-mass','body-singularity','finger-bloom','#bca4ff','#6be8ff','THE BODY GROWS PAST THE QUIRK THAT CREATED IT',['CRACK','FINGERS','SYMBOL']),
  'One For All::Inheritance':RIFT_CINEMATIC_V8_P('ofa-inheritance','vestige-hall','deku','embers','inherit','green-lightning','#69ff8e','#fff36c','EIGHT EMBERS TURN TOWARD THE NINTH',['VESTIGES','TORCH','NINTH']),
  "One For All Prime::Nana's Inheritance":RIFT_CINEMATIC_V8_P('ofa-prime-inheritance','vestige-sky','nana-successor','torch','inherit-prime','symbol-rise','#fff26d','#5be8ff','THE SEVENTH BEARER HANDS OVER A COMPLETED TORCH',['NANA','EMBERS','SYMBOL']),
  'All For One::Cultivation':RIFT_CINEMATIC_V8_P('afo-cultivation','dark-laboratory','all-for-one','quirk-seed','implant','black-veins','#a997ff','#ff658c','A STOLEN GROWTH FACTOR TAKES ROOT',['PALM','SEED','CULTIVATE']),
  'Biomancy::Perfect Organism':RIFT_CINEMATIC_V8_ULTIMATES['Biomancy::Perfect Organism'],
  'Reactive Evolution::Apex Form':RIFT_CINEMATIC_V8_ULTIMATES['Reactive Evolution::Apex Form'],
  'Ki Warrior::Transform':RIFT_CINEMATIC_V8_ULTIMATES['Ki Warrior::Transform']
};
const RIFT_CINEMATIC_V8_YORU=e=>e&&(e.power===`War Devil Hybrid`&&e.move===`I LOVE AMERICA!`||e.power===`WAR · Yoru`&&e.move===`World War`);
function RIFT_CINEMATIC_V8_PROFILE(e){
  const key=`${e.power}::${e.move}`;
  if(RIFT_CINEMATIC_V8_TRANSFORMATIONS[key])return RIFT_CINEMATIC_V8_TRANSFORMATIONS[key];
  if(RIFT_CINEMATIC_V8_ULTIMATES[key])return RIFT_CINEMATIC_V8_ULTIMATES[key];
  const move=(e.move||``).toLowerCase(),power=(e.power||``).toLowerCase();
  if(move===`hybrid transformation`||move===`horseman descent`){
    if(power.includes(`chainsaw`))return RIFT_CINEMATIC_V8_P('chainsaw-transformation','night-street','denji','starter-cord','hybrid-transform','chainsaw-emerge','#ff3a35','#f3d4aa','THE STARTER CORD PULLS A DEVIL THROUGH HUMAN SKIN',['CORD','BLOOD','CHAINSAWS']);
    if(power.includes(`bomb`))return RIFT_CINEMATIC_V8_P('bomb-transformation','industrial-street','reze','neck-pin','hybrid-transform','bomb-head','#ff6f3b','#ffe07e','THE PIN COMES FREE AND THE GIRL BECOMES THE BOMB',['PIN','FLASH','HYBRID']);
    if(power.includes(`war`)||power.includes(`yoru`))return RIFT_CINEMATIC_V8_P('war-transformation','ruined-city','yoru','war-gauntlets','horseman-transform','crosshair','#ff5160','#ded7c5','SCARS, OWNERSHIP AND WAR SETTLE INTO ONE BODY',['SCAR','WEAPON','WAR']);
    if(power.includes(`control`)||power.includes(`makima`))return RIFT_CINEMATIC_V8_P('control-transformation','red-sky-city','control-horseman','chains','horseman-transform','chain-crown','#e54a55','#f2d4ca','EVERY LESSER HEARTBEAT FINDS ITS PLACE BENEATH THE HAND',['GAZE','CHAINS','CONTROL']);
    return RIFT_CINEMATIC_V8_P('devil-hybrid-transformation','night-city','devil-hybrid','devil-core','hybrid-transform','devil-body',e.accent||'#df4864','#8065ff','HUMAN ANATOMY MAKES ROOM FOR A DEVIL',['TRIGGER','REWRITE','HYBRID']);
  }
  if(move.includes(`pochita`))return RIFT_CINEMATIC_V8_P('pochitas-heart','hospital-night','human-host','starter-cord','heart-fusion','second-heart','#ff3b38','#f0d7b6','A SECOND HEART STARTS ITS ENGINE',['HEART','CORD','REVIVE']);
  if(move.startsWith(`vessel of`))return RIFT_CINEMATIC_V8_P('vessel-awakening','hospital-night','human-host','devil-core','vessel-fusion','devil-mark',e.accent||'#d95774','#8065ff','A DEVIL SETTLES INTO THE EMPTY RHYTHM',['WOUND','HEART','VESSEL']);
  if(move===`legendary limitbreak`)return RIFT_CINEMATIC_V8_P('legendary-limitbreak','mountain-sky','warrior','aura','limitbreak','sky-column',e.accent||'#ffd75a','#75e8ff','THE OLD LIMIT STAYS ON THE GROUND',['BREATHE','BREAK','RISE']);
  if(move===`warrior ascension`)return RIFT_CINEMATIC_V8_P('warrior-ascension','mountain-sky','warrior','aura','ascend','sky-column',e.accent||'#f2d56b','#ff8d58','THE BODY CATCHES UP TO THE WILL',['CENTER','ASCEND','WARRIOR']);
  return RIFT_CINEMATIC_V8_P('riftbound-finality','ruined-arena','fighter','weapon','finisher','terrain-break',e.accent||'#59e5ff','#9b70ff','THE FIGHTER ENDS THE EXCHANGE WITH A REAL ATTACK',['READY','COMMIT','IMPACT']);
}
function RIFT_CINEMATIC_V8_INDEX(i){return{'--v8-i':i,'--v8-m2':i%2,'--v8-m3':i%3,'--v8-m4':i%4,'--v8-m5':i%5,'--v8-m6':i%6,'--v8-m7':i%7,'--v8-m8':i%8,'--v8-m9':i%9,'--v8-m10':i%10,'--v8-m12':i%12,'--v8-m18':i%18}}
function RIFT_CINEMATIC_V8_ARRAY(cls,count){return(0,E.jsx)(`div`,{className:cls,"aria-hidden":`true`,children:Array.from({length:count},(_,i)=>(0,E.jsx)(`i`,{style:RIFT_CINEMATIC_V8_INDEX(i)},i))})}
function RIFT_CINEMATIC_V8_ACTOR(profile,side){return(0,E.jsxs)(`div`,{className:`v8-actor subject-${profile.subject} ${side||``}`,"aria-hidden":`true`,children:[(0,E.jsx)(`i`,{className:`v8-body`}),(0,E.jsx)(`i`,{className:`v8-head`}),(0,E.jsx)(`i`,{className:`v8-hair`}),(0,E.jsx)(`i`,{className:`v8-face`}),(0,E.jsx)(`i`,{className:`v8-torso`}),(0,E.jsx)(`i`,{className:`v8-arm left`}),(0,E.jsx)(`i`,{className:`v8-arm right`}),(0,E.jsx)(`i`,{className:`v8-leg left`}),(0,E.jsx)(`i`,{className:`v8-leg right`}),(0,E.jsx)(`i`,{className:`v8-costume`}),(0,E.jsx)(`i`,{className:`v8-prop prop-${profile.prop}`}),(0,E.jsx)(`i`,{className:`v8-prop-secondary prop-${profile.prop}`}),(0,E.jsx)(`i`,{className:`v8-aura`})]})}
function RIFT_CINEMATIC_V8_SCENE({scene:e}){
  const p=RIFT_CINEMATIC_V8_PROFILE(e),duration=ln(e.power,e.move),form=e.form?qt(e.form):`none`;
  return(0,E.jsxs)(`div`,{className:`ultimate-cutscene cinematic-v8 profile-${p.id} stage-${p.stage} action-${p.action} impact-${p.impact} scene-${e.side} form-${form}`,style:{'--fx':e.accent||p.primary,'--v8-primary':e.accent||p.primary,'--v8-secondary':p.secondary,'--v8-duration':`${duration}ms`},role:`status`,`aria-live`:`assertive`,children:[
    (0,E.jsx)(`div`,{className:`v8-camera-shutter`}),(0,E.jsx)(`div`,{className:`v8-stage`}),(0,E.jsx)(`div`,{className:`v8-horizon`}),(0,E.jsx)(`div`,{className:`v8-ground`}),(0,E.jsx)(`div`,{className:`v8-landmark landmark-${p.stage}`}),
    RIFT_CINEMATIC_V8_ARRAY(`v8-world-pieces`,12),RIFT_CINEMATIC_V8_ACTOR(p,`attacker`),(0,E.jsxs)(`div`,{className:`v8-target target-${p.impact}`,"aria-hidden":`true`,children:[(0,E.jsx)(`i`,{}),(0,E.jsx)(`b`,{}),(0,E.jsx)(`span`,{})]}),
    RIFT_CINEMATIC_V8_ARRAY(`v8-action action-${p.action}`,20),RIFT_CINEMATIC_V8_ARRAY(`v8-impact impact-${p.impact}`,16),RIFT_CINEMATIC_V8_ARRAY(`v8-debris`,18),