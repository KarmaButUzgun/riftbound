function RIFT_SPARTAN_RESOURCE_DOCK({fighter,masked=false}) {
  const state=RIFT_SPARTAN_STATE(fighter);if(!state)return null;
  const weapons=RIFT_SPARTAN_EQUIPPED_WEAPONS(fighter),active=RIFT_ACTIVE_ITEM(fighter);
  return (0,E.jsxs)(`section`,{className:`spartan-resource-dock kind-${state.kind}`,children:[
    state.kind===`human`&&(0,E.jsxs)(E.Fragment,{children:[
      (0,E.jsx)(Ms,{label:`FLAIR · ${state.style.toUpperCase()}${state.empowered?` · NEXT MOVE EMPOWERED`:``}`,value:state.flair,max:100,color:`flair`,masked}),
      (0,E.jsxs)(`div`,{className:`spartan-style-readout`,children:[(0,E.jsx)(`small`,{children:`ACTIVE STYLE`}),(0,E.jsx)(`strong`,{children:masked?`UNKNOWN`:state.style.toUpperCase()}),(0,E.jsx)(`span`,{children:state.style===`Trickster`?`TAUNT FLAIR + DODGE`:state.style===`Royal Guard`?`GUARD CONTROL + POSTURE`:state.style===`Swordmaster`?`CLOSE DAMAGE SCALING`:`RANGED STRIKE + DISTANCE DAMAGE`})]})
    ]}),
    state.kind===`devil`&&(0,E.jsxs)(`div`,{className:`devil-combo-resource`,children:[
      (0,E.jsxs)(`header`,{children:[(0,E.jsx)(`small`,{children:`DEVIL COMBO`}),(0,E.jsxs)(`strong`,{children:[masked?`?`:state.comboBars,` / 4 BARS`]}),(0,E.jsx)(`em`,{children:state.comboBars>=4?`MAXIMUM · YAMATO JUDGEMENT`:state.comboBars>=3?`MOVE 3 + BONUS SWITCH`:state.comboBars>=2?`MOVE 2 + LIFESTEAL`:state.comboBars>=1?`MOVE 1 NO COOLDOWN`:`LAND AN ABILITY`})]}),
      (0,E.jsx)(`div`,{className:`combo-segments`,children:Array.from({length:4},(_,index)=>(0,E.jsx)(`i`,{className:index<state.comboBars?`filled`:``},index))})
    ]}),
    (0,E.jsxs)(`div`,{className:`spartan-weapon-rack`,children:[
      (0,E.jsxs)(`header`,{children:[(0,E.jsx)(`small`,{children:`THREE WEAPON SLOTS · SIX TOTAL INVENTORY`}),(0,E.jsx)(`strong`,{children:active?`CURRENT · ${active.name}`:`CURRENT · WEAPONLESS`}),(0,E.jsx)(`em`,{children:state.devTrigger?`${state.devTrigger.kind.toUpperCase()} DEVIL TRIGGER · ${state.devTrigger.turns}T`:`HUMAN FORM`})]}),
      (0,E.jsx)(`div`,{children:[0,1,2].map(slot=>{const entry=weapons.find(weapon=>weapon.slot===slot),away=entry&&state.unavailable[entry.instance.uid];return(0,E.jsxs)(`span`,{className:`${slot===0?`current`:``} ${entry?`filled`:`empty`} ${away?`away`:``}`,children:[(0,E.jsx)(`small`,{children:`W${slot+1}`}),(0,E.jsx)(`b`,{children:entry?.item.glyph||`∅`}),(0,E.jsx)(`em`,{children:away?String(away.mode).toUpperCase():entry?.item.name||`OPEN`})]},slot)})})
    ]})
  ]});
}

function RIFT_SPARTAN_CINEMATIC({fighter}) {
  const scene=fighter?.statuses?.spardaCinematic;if(!scene)return null;const state=RIFT_SPARTAN_STATE(fighter),judgement=scene.kind===`judgement`;
  return (0,E.jsxs)(`div`,{className:`sparda-cinematic ${scene.kind} ${state?.kind||``}`,"aria-live":`polite`,children:[
    (0,E.jsx)(`div`,{className:`cinematic-rift`}),(0,E.jsx)(`div`,{className:`cinematic-wing left`}),(0,E.jsx)(`div`,{className:`cinematic-wing right`}),(0,E.jsx)(`div`,{className:`cinematic-horn left`}),(0,E.jsx)(`div`,{className:`cinematic-horn right`}),(0,E.jsx)(`div`,{className:`cinematic-blade`}),(0,E.jsx)(`div`,{className:`cinematic-cuts`,children:Array.from({length:judgement?16:8},(_,index)=>(0,E.jsx)(`i`,{},index))}),
    (0,E.jsxs)(`span`,{children:[(0,E.jsx)(`small`,{children:judgement?`TIME STOP · QUEUED IMPACTS · SHEATHE`:`SPARTAN BLOOD · TRUE DEMONIC FORM`}),(0,E.jsx)(`strong`,{children:scene.title}),(0,E.jsx)(`em`,{children:scene.subtitle})]})
  ]});
}

function RIFT_SPARTAN_MODEL({fighter}) {
  const state=RIFT_SPARTAN_STATE(fighter);if(!state)return null;const active=RIFT_ACTIVE_ITEM(fighter),trigger=state.devTrigger;
  return (0,E.jsxs)(`div`,{className:`sparda-anatomy ${trigger?`transformed ${trigger.kind}`:`human-form`} style-${qt(state.style)}`,"aria-hidden":`true`,children:[
    trigger&&(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(`i`,{className:`devil-wing left`}),(0,E.jsx)(`i`,{className:`devil-wing right`}),(0,E.jsx)(`i`,{className:`devil-horn left`}),(0,E.jsx)(`i`,{className:`devil-horn right`}),(0,E.jsx)(`i`,{className:`devil-armor chest`}),(0,E.jsx)(`i`,{className:`devil-armor hip`}),(0,E.jsx)(`i`,{className:`devil-claw left`}),(0,E.jsx)(`i`,{className:`devil-claw right`})]}),
    (0,E.jsx)(`i`,{className:`sparda-coat`}),(0,E.jsx)(`i`,{className:`sparda-weapon-model item-${active?.id||`none`}`}),(0,E.jsx)(`i`,{className:`sparda-aura-ring`})
  ]});
}

function RIFT_INVENTORY_MANAGER({run,onCommit}) {
  const [selected,setSelected]=(0,r.useState)(0),[feedback,setFeedback]=(0,r.useState)(null),fighter=run.player;
  RIFT_NORMALIZE_FIGHTER_BUILD(fighter);const spartan=RIFT_SPARTAN_IS(fighter),state=RIFT_SPARTAN_STATE(fighter);
  const commitResult=result=>{setFeedback(result);if(result.ok){try{window.setTimeout(()=>setFeedback(null),2200)}catch{}}return result};
  const act=(kind,slot,target)=>{const next=P(run);let result;if(kind===`sell`)result=RIFT_SELL_ITEM(next,slot);else if(kind===`reforge`)result=RIFT_SPARTAN_REFORGE(next,next.player.inventory[slot]?.uid);else result=RIFT_MOVE_ITEM(next.player,slot,target);if(result.ok){onCommit(next);if(kind===`move`)setSelected(target)}return commitResult(result)};
  const selectedInstance=fighter.inventory[selected],selectedItem=selectedInstance?RIFT_ITEM(selectedInstance.itemId):null,reforge=selectedInstance?RIFT_SPARTAN_REFORGE_LEVEL(fighter,selectedInstance):0,reforgeCost=selectedInstance?RIFT_SPARTAN_REFORGE_COST(fighter,selectedInstance.uid):0;
  return (0,E.jsxs)(`section`,{className:`rift-inventory-manager shop-inventory-dock ${spartan?`spartan-inventory`:``}`,children:[
    (0,E.jsxs)(`header`,{children:[(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`small`,{children:spartan?`SPARTAN BLOOD · THREE WEAPONS / THREE GEAR`:`CURRENT BUILD`}),(0,E.jsx)(`strong`,{children:`SIX-SLOT LOADOUT`})]}),(0,E.jsx)(`em`,{children:spartan?`WEAPON I IS CURRENT · SWITCHING USES COMBAT ACTIONS`:`SLOT 0 ACCEPTS WEAPONS ONLY`})]}),
    feedback&&(0,E.jsxs)(`div`,{className:`spartan-inventory-feedback ${feedback.ok?`success`:`failure`}`,children:[(0,E.jsx)(`b`,{children:feedback.ok?`✓`:`!`}),(0,E.jsx)(`span`,{children:feedback.message||feedback.reason})]}),
    (0,E.jsx)(`div`,{className:`rift-inventory-grid`,children:fighter.inventory.map((instance,slot)=>{const item=instance?RIFT_ITEM(instance.itemId):null,cd=item?.passiveId?fighter.itemCooldowns?.[RIFT_ITEM_COOLDOWN_KEY(item)]||0:0,away=instance&&state?.unavailable?.[instance.uid],level=instance?RIFT_SPARTAN_REFORGE_LEVEL(fighter,instance):0,label=spartan&&slot<3?`WEAPON ${[`I`,`II`,`III`][slot]}${slot===0?` · CURRENT`:``}`:slot===0?`0 · WEAPON`:`SLOT ${slot}`;return(0,E.jsxs)(`button`,{type:`button`,className:`inventory-slot ${slot===0?`weapon-slot`:``} ${spartan&&slot<3?`spartan-weapon-slot`:``} ${selected===slot?`selected`:``} ${item?`rarity-${item.rarity.toLowerCase()}`:`empty`} ${away?`weapon-away`:``}`,onClick:()=>setSelected(slot),children:[(0,E.jsx)(`small`,{children:label}),(0,E.jsx)(RIFT_ITEM_ICON,{item,size:`tiny`}),(0,E.jsx)(`strong`,{children:item?.name||`EMPTY`}),(0,E.jsx)(`em`,{children:away?`${String(away.mode).toUpperCase()} · UNAVAILABLE`:level?`REFORGE +${level}`:cd?`${cd}T COOLDOWN`:item?.rarity||`OPEN`})]},slot)})}),
    !selectedItem?(0,E.jsx)(`p`,{className:`inventory-hint`,children:spartan&&selected<3?`Open Spartan weapon slot. Carrying three weapons leaves only three slots for armor, relics, and utility.`:selected===0?`Equip a weapon here to unlock the weapon action.`:`Open gear slot.`}):(0,E.jsxs)(`div`,{className:`inventory-controls spartan-inventory-controls`,children:[
      (0,E.jsxs)(`span`,{children:[(0,E.jsx)(`b`,{children:selectedItem.name}),(0,E.jsx)(`small`,{children:RIFT_ITEM_STAT_TEXT(selectedItem)}),(0,E.jsxs)(`em`,{children:[`REFORGE `,reforge,` / 5 · INVESTED `,selectedInstance.invested||selectedItem.price,` ◆`]})]}),
      selected>0&&selectedItem.category===`Weapon`&&(0,E.jsx)(`button`,{type:`button`,onClick:()=>act(`move`,selected,0),disabled:spartan&&!!state?.unavailable?.[selectedInstance.uid],children:`MAKE CURRENT`}),
      !spartan&&selected===0&&(0,E.jsx)(`button`,{type:`button`,disabled:!fighter.inventory.slice(1).some(slot=>!slot),onClick:()=>{const free=fighter.inventory.findIndex((slot,index)=>index>0&&!slot);free>0&&act(`move`,0,free)},children:`UNEQUIP`}),
      selected>0&&(0,E.jsx)(`button`,{type:`button`,onClick:()=>act(`move`,selected,selected-1),disabled:spartan&&(selected===3||selectedItem.category===`Weapon`&&selected-1>2),children:`← MOVE`}),
      selected<5&&(0,E.jsx)(`button`,{type:`button`,onClick:()=>act(`move`,selected,selected+1),disabled:spartan&&(selected===2||selectedItem.category!==`Weapon`&&selected+1<3),children:`MOVE →`}),
      spartan&&(0,E.jsx)(`button`,{type:`button`,className:`reforge`,onClick:()=>act(`reforge`,selected),disabled:reforge>=5||run.shards<reforgeCost||!!state?.unavailable?.[selectedInstance.uid],title:reforge>=5?`Maximum reforge reached`:state?.unavailable?.[selectedInstance.uid]?`Recover this weapon before reforging it`:`Improve stats, weapon force, and compatible passive output`,children:reforge>=5?`REFORGE MAX +5`:`REFORGE +${reforge+1} · ${reforgeCost} ◆`}),
      (0,E.jsx)(`button`,{type:`button`,className:`sell`,onClick:()=>act(`sell`,selected),disabled:!!state?.unavailable?.[selectedInstance.uid],children:`SELL · ${Math.max(1,Math.floor((selectedInstance.invested||selectedItem.price)*.6))} ◆`})
    ]})
  ]});
}
