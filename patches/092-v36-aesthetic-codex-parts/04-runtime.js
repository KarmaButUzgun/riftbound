function RIFT_V368_POWER_INFO(power){
  const copy=RIFT_V368_POWER_COPY[power?.name];
  return copy||{rarity:power?.rarityLabel||power?.rarity||`Unrated`,obtainment:power?.rollable===false?`Obtainable through a special in-game event.`:`Available on the Special Power wheel.`,flavor:power?.codexDescription||power?.passive||``,mechanical:power?.passive||``}
}
function RIFT_V368_POWER_RARITY(power){return RIFT_V368_POWER_INFO(power).rarity}
function RIFT_V368_POWER_PASSIVE(power){
  const text=String(power?.passive||``);
  return power?.name===`Anti-Spiral`?text.replace(` Its Chromatic wheel chance is independent of the new trainable Stat system.`,``):text
}
function RIFT_V368_PASSIVE_TITLE(item){
  const titles={'blade-ruined-king':`RUINED KING'S EDGE`,'shadow-crystal':`HOLD BREATH`,'shadow-mantle':`TRUE DARKNESS`};
  if(titles[item?.id])return titles[item.id];
  if(!item?.passiveId)return `RELIABLE COMPONENT`;
  return String(item.passiveId).replace(/^v\d+(?:\d+)?/i,``).replace(/([A-Z])/g,` $1`).trim().toUpperCase()
}
function RIFT_V368_STAND_RARITY(stand){return String(stand?.rarityLabel||stand?.rarity||`Legendary`).split(` · `)[0]}
function RIFT_V368_POWER_PROFILE_FROM(profile,power){
  const info=RIFT_V368_POWER_INFO(power),passive=RIFT_V368_POWER_PASSIVE(power)||profile.passive||``;
  const next={...profile,rarity:info.rarity,flavor:info.flavor,lore:info.flavor,mechanical:info.mechanical,obtainment:info.obtainment,passive,source:power||profile.source};
  next.searchText=[profile.searchText,info.rarity,info.flavor,info.mechanical,info.obtainment,passive].join(` `).toLowerCase();
  return next
}
function RIFT_V368_STAND_PROFILE_FROM(profile,stand){
  const obtainment=stand?.name===`Gold Experience Requiem`?`Evolve Gold Experience with the Requiem Arrow during the Floor 35 Requiem encounter.`:stand?.name===`King Crimson Requiem`?`Evolve King Crimson with the Requiem Arrow during the Floor 35 Requiem encounter.`:null;
  const next={...profile,rarity:RIFT_V368_STAND_RARITY(stand)};
  if(obtainment){next.obtainment=obtainment;next.searchText=[profile.searchText,obtainment].join(` `).toLowerCase()}
  return next
}
function RIFT_V368_HIDDEN_POWER_PROFILE(power,index){
  const raw=RIFT_V31_POWER_PROFILE(power,index);
  for(const move of raw.moves||[]){
    if(!move.tactical)try{move.tactical=RIFT_V33_CONTRACT(raw,move)}catch{}
    if(!move.battlefieldVfx&&move.tactical)try{move.battlefieldVfx=RIFT_V34_DESCRIPTOR_FROM_TACTICAL(move.tactical)}catch{}
  }
  raw.tacticalTypes=[...new Set((raw.moves||[]).map(move=>move.tactical?.type).filter(Boolean))];
  return raw
}

const RIFT_V368_BASE_CATALOG=globalThis.RIFTBOUND_CODEX?.catalog?.()||RIFT_V36_CATALOG;
const RIFT_V368_PROFILE_BY_NAME=new Map((RIFT_V368_BASE_CATALOG.profiles||[]).map(profile=>[profile.name,profile]));
const RIFT_V368_POWERS=g.map((power,index)=>RIFT_V368_POWER_PROFILE_FROM(RIFT_V368_PROFILE_BY_NAME.get(power.name)||RIFT_V368_HIDDEN_POWER_PROFILE(power,index),power));
const RIFT_V368_STANDS=h.map((stand,index)=>RIFT_V368_STAND_PROFILE_FROM(RIFT_V368_PROFILE_BY_NAME.get(stand.name)||RIFT_V31_STAND_PROFILE(stand,index),stand));
const RIFT_V368_PROFILES=[...RIFT_V368_POWERS,...RIFT_V368_STANDS],RIFT_V368_MOVES=RIFT_V368_PROFILES.flatMap(profile=>profile.moves||[]);
const RIFT_V368_CATALOG={...RIFT_V368_BASE_CATALOG,profiles:RIFT_V368_PROFILES,powers:RIFT_V368_POWERS,stands:RIFT_V368_STANDS,moves:RIFT_V368_MOVES,totals:{...RIFT_V368_BASE_CATALOG.totals,registeredPowers:g.length,visiblePowers:g.length,hiddenPowers:0,stands:h.length,profiles:RIFT_V368_PROFILES.length,moves:RIFT_V368_MOVES.length}};
RIFT_V31_BUILD_CATALOG=function RIFT_V368_BUILD_CATALOG(){return RIFT_V368_CATALOG};

RIFT_V31_PROFILE_STAGE=function RIFT_V368_PROFILE_STAGE({profile,move,onMove}){
  const power=profile.kind===`power`;
  return RIFT_V31_JS(`main`,{className:`v31-profile-stage`,style:{"--entry":profile.accent},children:[
    RIFT_V31_JS(`section`,{className:`v31-profile-hero`,children:[
      RIFT_V31_JS(`div`,{className:`v31-profile-sigil`,"aria-hidden":`true`,children:[RIFT_V31_J(`i`,{}),RIFT_V31_J(`i`,{}),RIFT_V31_J(`i`,{}),RIFT_V31_J(`b`,{children:profile.glyph})]}),
      RIFT_V31_JS(`div`,{className:`v31-profile-copy`,children:[RIFT_V31_JS(`small`,{children:[profile.kindLabel.toUpperCase(),` · `,profile.rarity]}),RIFT_V31_J(`h2`,{children:profile.name}),RIFT_V31_J(`p`,{className:`v368-flavor-copy`,children:power?profile.flavor||profile.lore:profile.lore}),RIFT_V31_J(`div`,{className:`v31-role-row`,children:profile.roles.map(role=>RIFT_V31_J(`span`,{children:role},role))})]}),
      RIFT_V31_JS(`div`,{className:`v31-profile-facts`,children:[RIFT_V31_JS(`span`,{children:[RIFT_V31_J(`small`,{children:`DAMAGE`}),RIFT_V31_J(`strong`,{children:profile.damageTypes.join(` / `)})]}),RIFT_V31_JS(`span`,{children:[RIFT_V31_J(`small`,{children:`RARITY`}),RIFT_V31_J(`strong`,{children:profile.rarity})]}),RIFT_V31_JS(`span`,{children:[RIFT_V31_J(`small`,{children:`TECHNIQUES`}),RIFT_V31_J(`strong`,{children:profile.moves.length})]})]})
    ]}),
    power&&RIFT_V31_JS(`section`,{className:`v368-power-summary`,children:[RIFT_V31_JS(`span`,{children:[RIFT_V31_J(`small`,{children:`MECHANICAL DESCRIPTION`}),RIFT_V31_J(`strong`,{children:`HOW IT PLAYS`})]}),RIFT_V31_J(`p`,{children:profile.mechanical})]}),
    profile.obtainment&&RIFT_V31_JS(`section`,{className:`v368-obtainment-card`,children:[RIFT_V31_JS(`span`,{children:[RIFT_V31_J(`small`,{children:`OBTAINMENT`}),RIFT_V31_J(`strong`,{children:profile.rarity})]}),RIFT_V31_J(`p`,{children:profile.obtainment})]}),
    RIFT_V31_JS(`section`,{className:`v31-passive-card`,children:[RIFT_V31_JS(`span`,{children:[RIFT_V31_J(`small`,{children:profile.kind===`stand`?`STAND PASSIVE`:`PASSIVE`}),RIFT_V31_J(`strong`,{children:profile.kind===`stand`?profile.personality||`Linked manifestation`:profile.name})]}),RIFT_V31_J(`p`,{children:profile.passive})]}),
    RIFT_V31_J(RIFT_V31_ABILITY_RAIL,{profile,selectedMoveId:move.id,onSelect:onMove})
  ]})
};

globalThis.RIFTBOUND_CODEX={...globalThis.RIFTBOUND_CODEX,release:`Rift Codex`,build:RIFT_V31_BUILD_CATALOG,catalog:()=>RIFT_V368_CATALOG,filter:criteria=>RIFT_V31_FILTER_CATALOG(RIFT_V368_CATALOG,criteria),profile:value=>RIFT_V368_CATALOG.profiles.find(profile=>profile.id===value||profile.name===value)||null,move:value=>RIFT_V368_CATALOG.moves.find(move=>move.id===value||move.name===value)||null};

function RIFT_V368_CLEAN_DOM(){
  try{document.getElementById(`rift-v30-release-root`)?.remove()}catch{}
}
if(typeof document!==`undefined`){document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,RIFT_V368_CLEAN_DOM,{once:true}):RIFT_V368_CLEAN_DOM()}

globalThis.RIFTBOUND_V36_8={version:`36.8`,aestheticCopy:true,powerDescriptions:Object.keys(RIFT_V368_POWER_COPY).length,rarities:[`Common`,`Uncommon`,`Rare`,`Epic`,`Legendary`,`Mythic`,`Calamity`,`Chromatic`,`Unique`]};
globalThis.RIFTBOUND_MANIFEST={...globalThis.RIFTBOUND_MANIFEST,v36:{...globalThis.RIFTBOUND_MANIFEST.v36,hotfix:`36.8`,aestheticCodex:true,cleanRarityLabels:true,powerFlavorMechanicalCopy:true}};
