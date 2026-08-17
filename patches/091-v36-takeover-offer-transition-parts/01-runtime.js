/* V36.7 · preserve an accepted floor-clear Takeover through the actual next-floor cleanup. */
const RIFT_V367_FLOOR_STATUS_KEYS=new Set([`apBuff`,`speedBuff`,`skillBuff`,`spiralEvolutions`,`faJin`,`ofaInherited`,`weaponDestroyed`,`symbolEvolved`,`immenseRegen`,`v35Takeover`]);

function RIFT_V367_PREPARE_NEXT_FLOOR_PLAYER(fighter){
 if(!fighter)return fighter;
 const prior=fighter.statuses||{};
 fighter.statuses=Object.fromEntries(Object.entries(prior).filter(([key])=>RIFT_V367_FLOOR_STATUS_KEYS.has(key)));
 if(fighter.statuses.v35Takeover){
  fighter.statuses.v35OriginalPower=RIFT_V35_RUINED;
  RIFT_V365_ENFORCE_TAKEOVER_IDENTITY(fighter);
 }
 return fighter;
}

if(globalThis.RIFTBOUND_V35)globalThis.RIFTBOUND_V35={...globalThis.RIFTBOUND_V35,hotfix:{...globalThis.RIFTBOUND_V35.hotfix,offerTransitionHotfix:`36.7`,takeoverOfferCarriesIntoNextFloor:true}};
globalThis.RIFTBOUND_V36_7={version:`36.7`,takeoverOfferCarriesIntoNextFloor:true,nextFloorCleanupPreservesTakeover:true,identityPower:RIFT_V35_RUINED,borrowedSlots:[5,6,7],heartbreakerSlot:8};
globalThis.RIFTBOUND_MANIFEST={...globalThis.RIFTBOUND_MANIFEST,v36:{...globalThis.RIFTBOUND_MANIFEST.v36,hotfix:`36.7`,takeoverOfferCarriesIntoNextFloor:true,nextFloorCleanupPreservesTakeover:true,takeoverIdentityStable:true,takeoverLiveDeck:true,takeoverBorrowedSlots:[5,6,7],heartbreakerSlot:8}};
