function RIFT_V35_INSTALL_BUILD_GUIDES(){
 try{
  if(typeof RIFT_V16_BUILD_GUIDES!==`object`||!RIFT_V16_BUILD_GUIDES)return false;
  const clone=(...sources)=>{for(const source of sources){const guide=RIFT_V16_BUILD_GUIDES[source];if(guide?.core?.length===6)return P(guide)}return null};
  const ruined=clone(`War Devil Hybrid`,`Cursed Child`,`Super Strength`);
  if(ruined){
   const displaced=ruined.core[0];
   const candidates=[displaced,...(ruined.alternatives?.[displaced]||[]),...ruined.core.slice(1)].filter(id=>id&&id!==`blade-ruined-king`);
   ruined.core[0]=`blade-ruined-king`;
   ruined.alternatives={...(ruined.alternatives||{}),[`blade-ruined-king`]:[...new Set(candidates)].slice(0,2)};
   ruined.v35Identity=`Possession skirmisher · BORK pressure · hybrid execution`;
   RIFT_V16_BUILD_GUIDES[RIFT_V35_RUINED]=ruined;
  }
  const unshackled=clone(`All For One`,`Cursed Child`,`Limitless`);
  if(unshackled){unshackled.v35Identity=`AP spell thief · chain engage · stolen-Ult scaling`;RIFT_V16_BUILD_GUIDES[RIFT_V35_UNSHACKLED]=unshackled}
  const ragegod=clone(`Super Strength`,`Aura Accumulation`);
  if(ragegod){ragegod.v35Identity=`AS neutral power · AP-scaled Berserker eruption · hybrid recommended`;RIFT_V16_BUILD_GUIDES[RIFT_V35_RAGEGOD]=ragegod}
  return [RIFT_V35_RUINED,RIFT_V35_UNSHACKLED,RIFT_V35_RAGEGOD].every(name=>RIFT_V16_BUILD_GUIDES[name]?.core?.length===6);
 }catch{return false}
}
const RIFT_V35_GUIDES_INSTALLED=RIFT_V35_INSTALL_BUILD_GUIDES();
globalThis.RIFTBOUND_MANIFEST={...globalThis.RIFTBOUND_MANIFEST,schemaVersion:35,release:`V35 · Sovereigns of Ruin`,counts:{...globalThis.RIFTBOUND_MANIFEST.counts,items:globalThis.RIFTBOUND_MANIFEST.items?.length||globalThis.RIFTBOUND_MANIFEST.counts?.items,powers:g.length,legendary:globalThis.RIFTBOUND_MANIFEST.items?.filter(item=>item.rarity===`Legendary`).length||globalThis.RIFTBOUND_MANIFEST.counts?.legendary,mythical:globalThis.RIFTBOUND_MANIFEST.items?.filter(item=>item.rarity===`Mythical`).length||globalThis.RIFTBOUND_MANIFEST.counts?.mythical},preservation:{...globalThis.RIFTBOUND_MANIFEST.preservation,constitutionHash:RIFT_V35_EXPECTED_HASH,baseConstitutionHash:`7598b438`,existingAbilitiesPreserved:true},codex:{...globalThis.RIFTBOUND_MANIFEST.codex,version:35,registeredPowers:RIFT_V35_CATALOG.totals.registeredPowers,visiblePowers:RIFT_V35_CATALOG.totals.visiblePowers,profiles:RIFT_V35_CATALOG.totals.profiles,displayedMoves:RIFT_V35_CATALOG.totals.moves,constitutionHash:RIFT_V35_EXPECTED_HASH,abilityChanges:RIFT_V35_CATALOG.abilityChanges,previewPatch:`V35`,previewCoverage:RIFT_V35_CATALOG.totals.moves,previewFallbacks:0},v35:{title:`Sovereigns of Ruin`,powers:[RIFT_V35_RUINED,RIFT_V35_UNSHACKLED,RIFT_V35_RAGEGOD],item:`Blade of The Ruined King`,ragegodGate:`Clear Floor 10 with Super Strength`,takeoverTurns:5,wrathTurns:5,durabilityHp:true,damageBurstCompression:true,bossItemCurve:true,buildGuides:RIFT_V35_GUIDES_INSTALLED,wamuuItems:3,allForOneItems:6}};
if(globalThis.RIFTBOUND_DIAGNOSTICS)globalThis.RIFTBOUND_DIAGNOSTICS={...globalThis.RIFTBOUND_DIAGNOSTICS,version:35,v35:RIFT_V35_REPORT};
if(typeof window!==`undefined`){const boot=()=>{document.documentElement.classList.add(`riftbound-v35`);RIFT_V35_INSTALL_TAKEOVER_PROMPT();setInterval(RIFT_V35_SYNC_DOM,180);RIFT_V35_SYNC_DOM();const release=document.getElementById(`rift-v30-release-toggle`);if(release){release.textContent=`V35`;release.title=`Sovereigns of Ruin · Viego · Sylas · Ragegod`}};document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,boot,{once:true}):boot()}
