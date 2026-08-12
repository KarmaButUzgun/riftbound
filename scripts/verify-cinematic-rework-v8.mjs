import fs from 'node:fs';

const bundle=fs.readFileSync('_site/assets/page-F6OuavDb.js','utf8');
const css=fs.readFileSync('_site/assets/riftbound.css','utf8');
const jsMarker='/* Riftbound Cinematic Rework V8 · literal canon-authentic ultimates and transformations */';
const cssMarker='/* Riftbound Cinematic Rework V8 · Yoru-quality literal cinematic staging */';
const fail=message=>{throw new Error(`Cinematic Rework V8: ${message}`)};
const requireText=(text,needle,label)=>{if(!text.includes(needle))fail(`${label} missing: ${needle}`)};
requireText(bundle,jsMarker,'JS marker');
requireText(css,cssMarker,'CSS marker');
if(bundle.indexOf(jsMarker)<bundle.indexOf('function Ds({scene:e})'))fail('V8 runtime must be injected after the production Ds renderer so Yoru can be preserved exactly');
requireText(bundle,'const RIFT_CINEMATIC_V8_BASE_Ds=Ds;','approved Yoru renderer capture');
requireText(bundle,'if(RIFT_CINEMATIC_V8_YORU(e))return RIFT_CINEMATIC_V8_BASE_Ds({scene:e});','exact Yoru delegation');
requireText(bundle,'Ds=function RIFT_CINEMATIC_V8_Ds','production cinematic override');
requireText(bundle,'RIFT_SPARTAN_CINEMATIC=function RIFT_SPARTAN_CINEMATIC_V8','Spartan cinematic override');
requireText(bundle,'RIFT_REQUIEM_OVERLAY=function RIFT_REQUIEM_OVERLAY_V8','Requiem cinematic override');

const mapStart=bundle.indexOf('const RIFT_CINEMATIC_V8_ULTIMATES={');
const mapEnd=bundle.indexOf('const RIFT_CINEMATIC_V8_TRANSFORMATIONS=',mapStart);
if(mapStart<0||mapEnd<0)fail('ultimate profile map boundaries missing');
const mapSource=bundle.slice(mapStart,mapEnd);
const actual=[...mapSource.matchAll(/'([^']+::[^']+)':RIFT_CINEMATIC_V8_P/g)].map(match=>match[1]);
const expected=[
'Stand Manifestation::Stand Covenant','Super Strength::Great Power','Speedster::Time Portal','Pyrokinesis::Inferno','Cryokinesis::Absolute Zero','Electrokinesis::Thunder God','Aerokinesis::Worldstorm','Earthshaping::Continental Rupture','Hydrokinesis::Primordial Ocean','Telekinesis::Telekinetic Compression','Shadow Manipulation::Shadow Burial','Light Manipulation::Heaven’s Lance','Biomancy::Perfect Organism','Decay::Let it all be destroyed.','Gravity Manipulation::Event Horizon','Spatial Manipulation::Dimensional Severance','Soul Manipulation::Soul Exile','Chronostasis::Stopped World','Fate Manipulation::Inevitable End','Concept Erasure::Erase Being','Reactive Evolution::Apex Form','Cosmic Dominion::End of All Things','Sonokinesis::World Symphony','Alchemy::Philosopher’s Sun','Blood Sorcery::Scarlet Eclipse','Ferrokinetics::Iron Tempest','Runeweaving::World Formula','Beast Pact::The Wild Hunt','Dream Dominion::Waking End','Void Hunger::Eventide Maw','Shrine::Malevolent Shrine','Cursed Child::Authentic Mutual Love','Rika Manifestation::Pure Love','Ki Warrior::Transform','Limitless::Infinite Void','Spiral Being::Giga Drill Break','Anti-Spiral::Infinity Big Bang Storm','One For All::Faux 100%','One For All Prime::United States of Smash','Projection Sorcery::Time Cell Moon Palace','Bomb Hybrid::Oppenheimer','Chainsaw Hybrid::I WANT TO HAVE S**','True Chainsaw Man::Forget','War Devil Hybrid::I LOVE AMERICA!','All For One::All For Me','Symbol of Fear::Omni-Factor Unleash','Star Platinum::7-Page Ora','Star Platinum::Za Warudo!','The World::Za Warudo!','King Crimson::A Man, A City','Soft & Wet::Go Beyond','Gold Experience::Delay Punch','Gold Experience Requiem::Infinite Death Loop','King Crimson Requiem::Master of Time'];
const missing=expected.filter(key=>!actual.includes(key));
const extra=actual.filter(key=>!expected.includes(key));
if(actual.length!==expected.length||missing.length||extra.length)fail(`expected ${expected.length} exact current Ultimate profiles; got ${actual.length}; missing=[${missing.join(', ')}], extra=[${extra.join(', ')}]`);
if(new Set(actual).size!==actual.length)fail('duplicate Ultimate profile key');

for(const token of [
  "'forget','hell-street','hero-of-hell','chainsaws','hero-blitz','devour'",
  "'authentic-mutual-love','yuta-domain','yuta','rika-katanas','domain-open','sure-hit'",
  "'time-cell-moon-palace','moon-palace','naoya','frame-rule','domain-open','cell-frame'",
  "'go-beyond','morioh-street','josuke-sw','go-beyond-bubble','impossible-bubble','logic-hole'",
  "'malevolent-shrine','sukuna-domain','sukuna','shrine','slash-domain','dismember'",
  "'infinite-void','infinite-void','gojo','hand-sign','domain-open','information-flood'",
  "'faux-100','city-corridor','deku','blackwhip','ofa-blitz','blitz-impact'",
  "'united-states-smash','kamino-ruins','all-might','fist','united-smash','tornado-crater'",
  "'omni-factor-unleash','final-war-city','final-war-shigaraki','finger-mass','factor-barrage','quirk-cataclysm'",
  "'infinity-big-bang-storm','anti-space','anti-spiral','galaxies','big-bang-compress','universe-burst'"
]) requireText(bundle,token,'literal scene profile');

for(const transformation of ['Symbol of Fear::Evolution','One For All::Inheritance',"One For All Prime::Nana's Inheritance",'All For One::Cultivation','hybrid transformation','horseman descent','pochita','vessel of','legendary limitbreak','warrior ascension'])requireText(bundle,transformation,'transformation coverage');
requireText(bundle,'judgement-cut-v8','literal Judgement Cut scene');
requireText(bundle,'vergil-trigger-v8','literal Vergil Devil Trigger scene');
requireText(bundle,'dante-trigger-v8','literal Dante Devil Trigger scene');
requireText(bundle,'ger-evolution','literal GER evolution state');
requireText(bundle,'kcr-evolution','literal KCR evolution state');
requireText(bundle,'className:`requiem-cinematic requiem-cinematic-v8 requiem-v8-${kind}`','Requiem state-specific staging');
requireText(bundle,'requiem-v8-arrow','physical Requiem Arrow scene');

const v8Renderer=bundle.slice(bundle.indexOf('function RIFT_CINEMATIC_V8_SCENE'),bundle.indexOf('Ds=function RIFT_CINEMATIC_V8_Ds'));
for(const legacy of ['(0,E.jsx)(Es,','(0,E.jsx)(Cs,','(0,E.jsx)(ws,','cinematic-rings','cinematic-particles'])if(v8Renderer.includes(legacy))fail(`V8 renderer still depends on abstract legacy layer: ${legacy}`);
if(css.slice(css.indexOf(cssMarker)).includes('.war-nuclear-cinema'))fail('V8 stylesheet must not override the approved Yoru nuclear cutscene');

for(const selector of ['.profile-forget','.profile-authentic-mutual-love','.profile-time-cell-moon-palace','.profile-go-beyond','.profile-malevolent-shrine','.profile-infinite-void','.profile-faux-100','.profile-united-states-smash','.profile-omni-factor-unleash','.profile-star-platinum-ora','.profile-the-world-time-stop','.profile-a-man-a-city','.profile-infinite-death-loop','.profile-master-of-time','.judgement-cut-v8','.requiem-cinematic-v8'])requireText(css,selector,'distinct cinematic CSS');
const profileSelectors=new Set([...css.slice(css.indexOf(cssMarker)).matchAll(/\.profile-([a-z0-9-]+)/g)].map(match=>match[1]));
if(profileSelectors.size<53)fail(`expected explicit composition selectors for every non-Yoru Ultimate profile; found ${profileSelectors.size}`);
requireText(css,'@media(prefers-reduced-motion:reduce)','reduced-motion safety');
if(/var\(--v8-i\)%\d/.test(css))fail('invalid CSS modulo expression remains in V8 stylesheet');
if(/\b(?:cos|sin)\(/.test(css.slice(css.indexOf(cssMarker))))fail('unsupported trigonometric positioning remains in V8 stylesheet');

console.log(`Cinematic Rework V8 verified: ${actual.length} current Ultimate profiles are literal and distinct, Yoru stays untouched, and transformation/Requiem/Sparda cinematics use the new staging system.`);
