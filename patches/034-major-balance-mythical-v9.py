from pathlib import Path
import sys
root=Path(sys.argv[1]); bundle_path=root/'assets/page-F6OuavDb.js'; css_path=root/'assets/riftbound.css'
parts=Path(__file__).with_name('034-major-balance-mythical-v9-parts')
runtime_parts=sorted(parts.glob('*-runtime-v9.js'))
if not runtime_parts: raise SystemExit('V9 runtime parts missing')
runtime='\n'.join(p.read_text().strip('\n') for p in runtime_parts)
styles=(parts/'05-styles-v9.css').read_text().strip(); mythics=(parts/'06-mythical-catalog-v9.js').read_text().strip()
bundle=bundle_path.read_text(); css=css_path.read_text()
marker='/* Riftbound Major Balance + Mythical Expansion V9 */'
if marker in bundle: raise SystemExit('V9 already applied')

def replace_once(text,old,new,label):
    count=text.count(old)
    if count!=1: raise SystemExit(f'V9 {label}: expected once, found {count}')
    return text.replace(old,new,1)

anchor='RIFT_ITEMIZATION_REWORK_CATALOG(items,add);'
if bundle.count(anchor)!=1: raise SystemExit(f'V9 catalog anchor count {bundle.count(anchor)}')
bundle=bundle.replace(anchor,mythics+'\n'+anchor,1)

repls=[
('passive:`+2 Speed tiers, a larger movement reserve, and superior stride efficiency.`','passive:`Chronal Runner: +2 Speed tiers, a larger movement reserve, superior stride efficiency, and a true Ultimate-history rewind.`','Speedster passive'),
('m(`Time Portal`,`Rewind everything except yourself to three turns ago.`,100,0,0,[`allEnergy`,`rewind`])','m(`Time Portal`,`Restore the complete combat state tied to the third-most-recent prior Ultimate activation. Permanent rewards and inventory progression remain outside the rewind.`,100,0,0,[`allEnergy`,`rewindUltimate3`,`causality`])','Speedster Ultimate'),
('passive:`Resist blindness, illusions, and shadow effects.`','passive:`Photon Body: resist blindness, illusions, and shadow effects. Normal Movement Points are doubled.`','Light passive'),
('if(e.boss&&e.player.power.name===`Decay`&&!e.symbolTrial){','if(e.boss&&e.player.power.name===`Decay`&&!e.symbolTrial&&RIFT_V9_META().afo50){','Symbol of Fear progression gate'),
('e.pochita.alive&&!e.pochita.heart&&ra(e,s),ei(e),','e.pochita.alive&&!e.pochita.heart&&!e.pochita.rejected&&(e.pochita.accepted?ra(e,s):(e.pochita.pendingChoice=1,e.player.statuses.pochitaChoicePending=1)),ei(e),','Pochita opt-in encounter'),
('e.player.supplementalPowers=[...kn(e.player).filter(e=>e.name!==`One For All`),P(t)],e.player.activeSupplementalPower=`One For All`,e.player.flight=!0,e.player.ultimate=0,e.player.lastMove=null,','e.player.power=P(t),e.player.supplementalPowers=[],e.player.activeSupplementalPower=null,e.player.flight=!0,e.player.ultimate=0,e.player.lastMove=null,','base OFA exclusivity'),
('G(e,`SUCCESSION // ${e.player.name} accepts the fading torch without surrendering ${n}. ONE FOR ALL is added as a switchable second Special Power for the remainder of the run.`,`mythic`)','G(e,`SUCCESSION // ${e.player.name} accepts the fading torch. ${n} is released completely; ONE FOR ALL becomes the sole normal Special Power.`,`mythic`)','base OFA history'),
('let r=Y(i,`ap`),s=Y(a,`durability`);h.includes(`pierce`)&&(s=0)','let r=Y(i,`ap`),s=Y(a,`durability`);if(h.includes(`shrineAdaptiveCleave`)){let k=RIFT_ACTOR_ID_FOR_FIGHTER(e,i)||i.name,p=Math.min(70,(a.statuses.cleaveAdaptation?.[k]||0)+10);s*=1-p/100}h.includes(`pierce`)&&(s=0)','Cleave adaptive penetration'),
('+(t.move?.tags?.includes(`domainAdvantage`)?13:0)+(Vn(e)?4:0)','+(t.move?.tags?.includes(`domainAdvantage`)?13:0)+(RIFT_HAS_PASSIVE(e,`openDomain`)?16:0)+(Vn(e)?4:0)','Open Domain clash advantage'),
('go(run,fighter,entry.fighter,RIFT_SPARTAN_RAW(fighter,entry.fighter,.22),true,[`physical`,`magic`,`hybrid`,`weapon`,`spardaJudgementCut`,`spardaWeapon:${RIFT_SPARTAN_WEAPON_IDS.yamato}`,`noCounter`])','go(run,fighter,entry.fighter,RIFT_SPARTAN_RAW(fighter,entry.fighter,.22),true,[`physical`,`magic`,`hybrid`,`weapon`,`spardaJudgementCut`,`spardaWeapon:${RIFT_SPARTAN_WEAPON_IDS.yamato}`,`noCounter`,...(state.devTrigger?[`causality`,`spardaCausalJudgement`]:[])])','Devil Trigger Judgement Cut causality'),
]
for old,new,label in repls: bundle=replace_once(bundle,old,new,label)

export='export{xs as default};'
if bundle.count(export)!=1: raise SystemExit('V9 export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1)
css=css.rstrip()+'\n\n'+styles+'\n'
bundle_path.write_text(bundle); css_path.write_text(css)
print(f'Applied Riftbound Major Balance + Mythical Expansion V9 ({len(runtime_parts)} runtime parts)')
