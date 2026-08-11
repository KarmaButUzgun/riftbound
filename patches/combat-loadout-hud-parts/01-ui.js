function RIFT_COMBAT_LOADOUT_RAIL({fighter,side,hidden=false,onAction,selectedActionId,busy=false}) {
  const inventory=Array.from({length:6},(_,slot)=>fighter?.inventory?.[slot]||null),player=side===`player`,spartan=player&&RIFT_SPARTAN_IS(fighter),state=spartan?RIFT_SPARTAN_STATE(fighter):null;
  const switchActions=spartan?La(fighter).filter(action=>action.move?.tags?.includes(`spardaWeaponSwitch`)):[],armedAction=switchActions.find(action=>action.id===selectedActionId)||null,active=hidden?null:RIFT_ACTIVE_ITEM(fighter),equipped=hidden?6:inventory.filter(Boolean).length;
  const heading=player?`YOUR LOADOUT`:fighter?.name?`TARGET · ${fighter.name}`:`SELECTED OPPONENT`,status=hidden?`ITEM INTEL HIDDEN`:spartan?armedAction?`CLICK AGAIN · ${Wa(armedAction,fighter)}`:`CURRENT · ${active?.name||`WEAPONLESS`}`:`${equipped} / 6 EQUIPPED`;
  return (0,E.jsxs)(`section`,{className:`combat-loadout-rail ${side} ${hidden?`intel-hidden`:``} ${spartan?`spartan-switch-rail`:``}`,children:[
    (0,E.jsxs)(`header`,{children:[(0,E.jsx)(`small`,{children:heading}),(0,E.jsx)(`strong`,{children:status})]}),
    (0,E.jsx)(`div`,{className:`combat-loadout-slots`,children:inventory.map((instance,slot)=>{
      const item=!hidden&&instance?RIFT_ITEM(instance.itemId):null,away=spartan&&instance?state?.unavailable?.[instance.uid]:null,switchAction=spartan&&instance?switchActions.find(action=>action.weaponUid===instance.uid):null,current=!!item&&slot===0&&item.category===`Weapon`,armed=!!switchAction&&selectedActionId===switchAction.id,selectable=!!switchAction&&!busy&&!away;
      const cooldown=!hidden&&item?.passiveId?fighter?.itemCooldowns?.[RIFT_ITEM_COOLDOWN_KEY(item)]||0:0,reforge=!hidden&&instance&&spartan?RIFT_SPARTAN_REFORGE_LEVEL(fighter,instance):0;
      const title=hidden?`Opponent item slot ${slot+1} is hidden until Weapon intel is revealed`:!item?`Slot ${slot+1} · Empty`:away?`${item.name} · ${String(away.mode).toUpperCase()} · unavailable`:current?`${item.name} · Current weapon`:switchAction?`${item.name} · ${Wa(switchAction,fighter)} · click twice to confirm`:item.name;
      return (0,E.jsxs)(`button`,{type:`button`,className:`combat-loadout-slot slot-${slot+1} ${hidden?`unknown`:item?`filled rarity-${item.rarity.toLowerCase()}`:`empty`} ${current?`current-weapon`:``} ${selectable?`weapon-selectable`:``} ${armed?`armed`:``} ${away?`weapon-away`:``}`,disabled:!selectable,onClick:()=>selectable&&onAction?.(switchAction),title,"aria-label":title,"aria-pressed":armed,children:[
        (0,E.jsx)(`small`,{children:slot+1}),hidden?(0,E.jsx)(`b`,{className:`hidden-item-glyph`,children:`?`}):(0,E.jsx)(RIFT_ITEM_ICON,{item,size:`tiny`}),(current||armed||away||cooldown||reforge>0)&&(0,E.jsx)(`em`,{children:armed?`✓`:away?`×`:current?`◆`:cooldown?cooldown:`+${reforge}`})
      ]},slot);
    })})
  ]});
}

function RIFT_COMBAT_LOADOUT_HUD({run,opponent,onAction,selectedActionId,busy=false}) {
  const target=opponent||run?.enemy,hidden=!!target&&!run?.revealed?.includes(`weapon`),encounter=run?.encounter||{};
  return (0,E.jsxs)(`div`,{className:`encounter-chip combat-loadout-hud`,style:{"--encounter":encounter.accent||`#59e5ff`},children:[
    (0,E.jsx)(RIFT_COMBAT_LOADOUT_RAIL,{fighter:run?.player,side:`player`,onAction,selectedActionId,busy}),
    (0,E.jsxs)(`section`,{className:`floor-anomaly-core`,children:[(0,E.jsx)(`small`,{children:`FLOOR ANOMALY`}),(0,E.jsx)(`strong`,{children:encounter.name||`STILL AIR`}),(0,E.jsx)(`span`,{children:encounter.description||`No anomaly. A clean duel.`})]}),
    (0,E.jsx)(RIFT_COMBAT_LOADOUT_RAIL,{fighter:target,side:`enemy`,hidden,busy:true})
  ]});
}
