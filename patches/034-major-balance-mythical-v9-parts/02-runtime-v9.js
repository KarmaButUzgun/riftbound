 enemies can leave the territory.`,glyph:`域`,type:`special`,cost:0,move:{name:`Open Domain Toggle`,description:`Toggle barrier geometry.`,cost:0,power:0,destruction:0,tags:[`v9OpenDomainToggle`,`bonusAction`,`selfCast`]}});
if(fighter.supplementalPowers?.some(p=>p.name===`One For All Prime`))actions.push({id:`v9-ofa-prime-toggle`,slot:91,name:`Switch · One For All Prime`,description:`Bonus action. Swap between your original Special Power and One For All Prime moves.`,glyph:`美`,type:`special`,cost:0,move:{name:`OFA Prime Switch`,description:`Switch active moveset without replacing the original power.`,cost:0,power:0,destruction:0,tags:[`v9OfaPrimeToggle`,`bonusAction`,`selfCast`]}});
return actions};


const RIFT_V9_BASE_RS=rs;
rs=function RIFT_V9_RS(run,side,action,ctx={}){const attacker=ctx.attacker||(side===`player`?run.player:run.enemy),target=ctx.target||(side===`player`?run.enemy:run.player),tags=action?.move?.tags||[];
const actorId=ctx.actorId||RIFT_ACTOR_ID_FOR_FIGHTER(run,attacker)||side;
if(action?.type===`ultimate`&&attacker?.power?.name===`Speedster`&&action?.name===`Time Portal`){const line=(run.v9UltimateTimeline||[]).filter(x=>x.seq&&(run.combatSnapshots||[]).some(s=>s.seq===x.seq));
if(line.length<3){G(run,`TIME PORTAL // Fewer than three prior Ultimate activations exist in retained combat history.`,`system`);
return}const targetSnap=line[line.length-3];
attacker.ultimate=0;
RIFT_MASTER_OF_TIME(run,actorId,targetSnap.seq);
run.v9UltimateTimeline=(run.v9UltimateTimeline||[]).filter(x=>x.seq<=targetSnap.seq);
G(run,`SPEEDSTER REWIND // ${attacker.name} returns the battle to the state of the third-most-recent Ultimate activation (${targetSnap.name}).`,`mythic`);
return}if(action?.type===`ultimate`&&action?.name!==`Time Portal`){const snap=RIFT_RECORD_SNAPSHOT(run,actorId,`ULTIMATE ACTIVATION · ${action.name}`);
if(snap){run.v9UltimateTimeline=[...(run.v9UltimateTimeline||[]),{seq:snap.seq,name:action.name,actorId}].slice(-32)}}if(tags.includes(`v9OpenDomainToggle`)){attacker.statuses.openDomain=attacker.statuses.openDomain?0:1;
attacker.statuses.bonusWindow=1;
G(run,`OPEN DOMAIN // Barrier ${attacker.statuses.openDomain?`opened: range expands and escape becomes possible`:`closed: range contracts and containment returns`}.`,`mythic`);
return}if(tags.includes(`v9OfaPrimeToggle`)){attacker.activeSupplementalPower=attacker.activeSupplementalPower===`One For All Prime`?null:`One For All Prime`;
attacker.statuses.bonusWindow=1;
G(run,`ONE FOR ALL PRIME // Active moveset switched as a bonus action.`,`mythic`);
return}if(tags.includes(`rikaFullManifest`)&&RIFT_CURSED_CHILD(attacker)&&(attacker.statuses.rikaSummon||0)<100){G(run,`FULL RIKA LOCKED // Partial Rika damage has filled ${Math.round(attacker.statuses.rikaSummon||0)} / 100 of the Summon Bar.`,`system`);
return}if(tags.includes(`mimicCursedSpeech`)&&RIFT_DOMAIN_ACTIVE(run,RIFT_ACTOR_ID_FOR_FIGHTER(run,attacker))){G(run,`AUTHENTIC MUTUAL LOVE // Cursed Speech cannot be engraved or cast while the domain is active.`,`system`);
return}if(tags.includes(`faux100Blitz`)&&action?.aim?.target){const actorId=ctx.actorId||RIFT_ACTOR_ID_FOR_FIGHTER(run,attacker)||side,origin=W(run,actorId),dest=Wi(run.battlefield,action.aim.target,Ft(run,actorId).map(e=>e.position));
run.battlefield.features.filter(feature=>feature.destructible&&feature.integrity>0&&dt(feature.position,origin,dest)<=feature.radius+3).forEach(feature=>Io(run,feature,attacker,999,`Faux 100% speedblitz`));
ki(run,actorId,dest);
run.battlefield.effectEchoes.push({id:`faux-v9-${F()}`,className:`ofa-faux100-v9`,shape:`line`,motion:`burst`,origin:{...origin},target:{...dest},radius:5,accent:`#57ff79`,secondary:`#d8ffe0`,tertiary:`#0c2f18`,turns:2});
G(run,`FAUX 100% · SPEEDBLITZ // ${attacker.name} becomes the projectile, ripping from (${origin.x.toFixed(0)},${origin.y.toFixed(0)}) to (${dest.x.toFixed(0)},${dest.y.toFixed(0)}) through the environment.`,`mythic`)}if(attacker?.power?.name===`Devil of Sparta`&&action?.name===`Judgement Cut`&&attacker.devilHybrid?.transformed)action.move.tags=[...new Set([...(action.move.tags||[]),`causality`,`spardaCausalJudgement`])];
return RIFT_V9_BASE_RS(run,side,action,ctx)};

const RIFT_V9_BASE_SUMMON_RIKA=RIFT_SUMMON_RIKA;
RIFT_SUMMON_RIKA=function RIFT_V9_SUMMON_RIKA(run,fighter,actorId,full){if(full&&(fighter.statuses.rikaSummon||0)<100)return null;
const out=RIFT_V9_BASE_SUMMON_RIKA(run,fighter,actorId,full);
if(full)fighter.statuses.rikaSummon=0;
return out};

const RIFT_V9_BASE_RIKA_PROC=RIFT_KATANA_PROC;
RIFT_KATANA_PROC=function RIFT_V9_RIKA_PROC(run,attacker,target,bound){if(bound?.move?.tags?.includes(`stun`))return G(run,`AUTHENTIC MUTUAL LOVE // The katana rejects a copied stun technique.`,`system`),0;
return RIFT_V9_BASE_RIKA_PROC(run,attacker,target,bound)};

RIFT_DOMAIN_PULSE=function RIFT_V9_DOMAIN_PULSE(run,fighter,actorId){let domain=RIFT_DOMAIN_ACTIVE(run,actorId);
if(!domain)return;
RIFT_PREP_CURSED_CHILD(fighter);
let mimic=RIFT_MIMIC_BY_ID(fighter,fighter.statuses.authenticLoveSureHitId)||fighter.mimicryInventory[0],owner=U(run,actorId),targets=H(run).filter(x=>x.id!==actorId&&x.fighter.hp>0&&(!owner||x.team!==owner.team)&&Dt(domain,W(run,x.id)));
if(mimic&&!mimic.move?.tags?.includes(`stun`)&&mimic.id!==`cursed-speech`){let pow=Math.max(.72,mimic.move.power||1.45),base=(27+Y(fighter,`ap`)*4.8)*pow;
targets.forEach(x=>go(run,fighter,x.fighter,base,!0,[...(mimic.move.tags||[]),`magic`,`guaranteedHit`,`infinityBypass`,`ignoreDefenseHax`,`domainSureHit`,`noCounter`]));
targets.length&&G(run,`AUTHENTIC MUTUAL LOVE · SURE-HIT // ${mimic.name} resolves on ${targets.length} hostile${targets.length===1?``:`s`}.`,`mythic`)}else if(mimic)G(run,`DOMAIN ENGRAVING REJECTED // Cursed Speech and stun techniques cannot become Authentic Mutual Love's sure-hit.`,`system`);
let katana=RIFT_ROLL_KATANA(fighter);
if(katana?.move?.tags?.includes(`stun`))katana=null;
fighter.statuses.authenticLoveWeapon=katana;
domain.turns=Math.max(0,(domain.turns||1)-1);
domain.turns<=0&&Bo(run,domain,`expired`)};

const RIFT_V9_BASE_ITEM_OUT=RIFT_ITEM_OUTGOING;
RIFT_ITEM_OUTGOING=function RIFT_V9_ITEM_OUT(run,attacker,target,amount,tags=[]){let value=RIFT_V9_BASE_ITEM_OUT(run,attacker,target,amount,tags);
const ids=RIFT_ITEM_INSTANCES(attacker).map(x=>RIFT_ITEM(x.itemId)?.passiveId);
const itemAction=attacker.statuses?.riftItemActionType;
if(ids.includes(`sukunaFinger`)&&RIFT_DAMAGE_SCALING(run,attacker,tags).mode===`AP`)value*=1.3;