const RIFT_V34_HARDENING_MARKER=`Riftbound Battlefield VFX V34 Iconic Hardening`;
const RIFT_V34_SUPPLEMENTAL_ICONICS=Object.freeze({
 [`Limitless|Purple`]:`annihilation-corridor`,
 [`The World|ROADO ROLLAR DAA!`]:`falling-crush`,
 [`Star Platinum|7-Page Ora`]:`advancing-barrage`,
 [`Gold Experience|Muda Barrage`]:`advancing-barrage`,
 [`Projection Sorcery|Projection Barrage`]:`advancing-barrage`,
});
function RIFT_V34_SUPPLEMENTAL_FAMILY(profileName,moveName){return RIFT_V34_SUPPLEMENTAL_ICONICS[`${profileName||``}|${moveName||``}`]||null}
const RIFT_V34_BASE_DESCRIPTOR_FROM_TACTICAL_HARDENING=RIFT_V34_DESCRIPTOR_FROM_TACTICAL;
RIFT_V34_DESCRIPTOR_FROM_TACTICAL=function RIFT_V34_DESCRIPTOR_FROM_TACTICAL_HARDENED(tactical){
 const descriptor=RIFT_V34_BASE_DESCRIPTOR_FROM_TACTICAL_HARDENING(tactical);if(!descriptor)return descriptor;
 const family=RIFT_V34_SUPPLEMENTAL_FAMILY(tactical?.sourcePower,tactical?.moveName);if(!family)return descriptor;
 return Object.freeze({...descriptor,family,layers:[...(RIFT_V34_FAMILY_LAYERS[family]||descriptor.layers)],iconic:true});
};
const RIFT_V34_BASE_DESCRIPTOR_HARDENING=RIFT_V34_DESCRIPTOR;
RIFT_V34_DESCRIPTOR=function RIFT_V34_DESCRIPTOR_HARDENED(profileName,moveName){
 const tactical=RIFT_V33_ACTION_INDEX.get(`${profileName}|${moveName}`)||null;
 return tactical?RIFT_V34_DESCRIPTOR_FROM_TACTICAL(tactical):RIFT_V34_BASE_DESCRIPTOR_HARDENING(profileName,moveName);
};
for(const profile of RIFT_V32_CATALOG.profiles)for(const move of profile.moves){
 const family=RIFT_V34_SUPPLEMENTAL_FAMILY(profile.name,move.name);if(!family)continue;
 const descriptor=RIFT_V34_DESCRIPTOR_FROM_TACTICAL(move.tactical);if(descriptor)move.battlefieldVfx=descriptor;
}
const RIFT_V34_BASE_EMIT_HARDENING=RIFT_V34_EMIT;
RIFT_V34_EMIT=function RIFT_V34_EMIT_HARDENED(run,actor,target,action,tactical,context={}){
 const event=RIFT_V34_BASE_EMIT_HARDENING(run,actor,target,action,tactical,context);if(!event)return event;
 const family=RIFT_V34_SUPPLEMENTAL_FAMILY(tactical?.sourcePower,tactical?.moveName);if(family){event.family=family;event.layers=[...(RIFT_V34_FAMILY_LAYERS[family]||event.layers)];event.iconic=true}return event;
};
const RIFT_V34_BASE_REPORT_HARDENING=RIFT_V34_REPORT;
RIFT_V34_REPORT=function RIFT_V34_REPORT_HARDENED(){
 const base=RIFT_V34_BASE_REPORT_HARDENING(),activeSupplemental=Object.keys(RIFT_V34_SUPPLEMENTAL_ICONICS).filter(key=>{const split=key.indexOf(`|`),profile=key.slice(0,split),move=key.slice(split+1);return!!RIFT_V33_ACTION_INDEX.get(`${profile}|${move}`)}).length;
 return{...base,iconicOverrides:base.iconicOverrides+activeSupplemental,supplementalIconicOverrides:activeSupplemental};
};
globalThis.RIFTBOUND_BATTLEFIELD_VFX={...globalThis.RIFTBOUND_BATTLEFIELD_VFX,report:RIFT_V34_REPORT,descriptor:RIFT_V34_DESCRIPTOR,fromTactical:RIFT_V34_DESCRIPTOR_FROM_TACTICAL,emit:RIFT_V34_EMIT};
globalThis.RIFTBOUND_MANIFEST={...globalThis.RIFTBOUND_MANIFEST,battlefieldVfx:{...globalThis.RIFTBOUND_MANIFEST.battlefieldVfx,iconicOverrides:RIFT_V34_REPORT().iconicOverrides,supplementalIconicOverrides:RIFT_V34_REPORT().supplementalIconicOverrides}};
if(globalThis.RIFTBOUND_DIAGNOSTICS)globalThis.RIFTBOUND_DIAGNOSTICS={...globalThis.RIFTBOUND_DIAGNOSTICS,battlefieldVfx:RIFT_V34_REPORT};
