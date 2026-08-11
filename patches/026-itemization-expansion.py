from pathlib import Path
import re
import sys

root=Path(sys.argv[1])
bundle_path=root/'assets/page-F6OuavDb.js'
css_path=root/'assets/riftbound.css'
parts=Path(__file__).with_name('itemization-expansion-parts')
runtime_path=parts/'01-runtime.js'
ui_path=parts/'02-ui.js'
styles_path=parts/'03-styles.css'
for path in (bundle_path,css_path,runtime_path,ui_path,styles_path):
    if not path.is_file(): raise SystemExit(f'Itemization Expansion: missing {path}')

bundle=bundle_path.read_text(); css=css_path.read_text(); runtime=runtime_path.read_text().strip(); ui=ui_path.read_text().strip(); styles=styles_path.read_text().strip()
marker='/* Riftbound Itemization Expansion · catalog, passives, stat model */'
if not runtime.startswith(marker): raise SystemExit('Itemization Expansion: runtime payload invalid')
if not ui.startswith('/* Riftbound Itemization Expansion · designed icons'): raise SystemExit('Itemization Expansion: UI payload invalid')
if not styles.startswith('/* Riftbound Itemization Expansion · icon art'): raise SystemExit('Itemization Expansion: style payload invalid')
if marker in bundle: raise SystemExit('Itemization Expansion: already applied')

legend_section=runtime.split('const legends = [',1)[1].split('  ];',1)[0]
legend_count=len(re.findall(r'^\s*\[`[^`]+`,`[^`]+`,',legend_section,re.M))
if legend_count!=32: raise SystemExit(f'Itemization Expansion: expected exactly 32 new Legendaries, found {legend_count}')

split_marker='/* Runtime passive hooks. All high-frequency triggers are explicitly action-gated. */'
catalog_code,hook_code=runtime.split(split_marker,1)
catalog_code=catalog_code.replace('const RIFT_ITEMIZATION_EXPANSION_VERSION = 3;','').strip()
catalog_injection='\n'+catalog_code+'\nRIFT_ITEMIZATION_REWORK_CATALOG(items,add);\n'
anchor='  const byId = new Map(items.map(item => [item.id, item]));'
if bundle.count(anchor)!=1: raise SystemExit(f'Itemization Expansion: catalog freeze anchor expected once, found {bundle.count(anchor)}')
bundle=bundle.replace(anchor,catalog_injection+'\n'+anchor,1)

if bundle.count('const RIFT_BUILD_EXPANSION_VERSION = 2;')!=1: raise SystemExit('Itemization Expansion: Build Expansion version anchor missing')
bundle=bundle.replace('const RIFT_BUILD_EXPANSION_VERSION = 2;','const RIFT_BUILD_EXPANSION_VERSION = 3;',1)

late_anchor='function Ea('
if bundle.count(late_anchor)!=1: raise SystemExit(f'Itemization Expansion: late runtime anchor expected once, found {bundle.count(late_anchor)}')
late='const RIFT_ITEMIZATION_EXPANSION_VERSION=3;\n'+split_marker+'\n'+hook_code.strip()+'\n'+ui+'\n'
bundle=bundle.replace(late_anchor,late+late_anchor,1)

old_intro='Stats train themselves slowly through use. Stat XP automatically converts into permanent levels when a threshold is reached. Player Level earns Skill Points, which can be invested into any uncapped stat for an immediate level.'
new_intro='Stats train themselves slowly through use. Level-Up Caps only limit natural/stat-progression upgrades. Item bonuses are equipment and may push Effective Stats freely above those caps. Player Level earns Skill Points for uncapped natural stats.'
if old_intro not in bundle: raise SystemExit('Itemization Expansion: Stat Menu intro anchor missing')
bundle=bundle.replace(old_intro,new_intro,1)
old_strong='(0,E.jsx)(`strong`,{children:RIFT_ITEM_STAT_BONUS(w.player,e)?`${Br(e,t)} · ITEMS → ${Br(e,Y(w.player,e))}`:Br(e,t)})'
new_strong='(0,E.jsx)(`strong`,{children:RIFT_ITEM_STAT_BONUS(w.player,e)?`BASE ${Br(e,t)} · ITEMS ${RIFT_ITEM_STAT_BONUS(w.player,e)>0?`+`:``}${RIFT_ITEM_STAT_BONUS(w.player,e)} · EFFECTIVE ${Br(e,Y(w.player,e))}`:`BASE ${Br(e,t)} · EFFECTIVE ${Br(e,Y(w.player,e))}`})'
if bundle.count(old_strong)!=1: raise SystemExit(f'Itemization Expansion: stat breakdown anchor expected once, found {bundle.count(old_strong)}')
bundle=bundle.replace(old_strong,new_strong,1)
if '`MAX CAP `' not in bundle: raise SystemExit('Itemization Expansion: stat cap label anchor missing')
bundle=bundle.replace('`MAX CAP `','`LEVEL-UP CAP `',1)

bundle=bundle.replace('target.rarity === `Legendary` && RIFT_OWNS_ITEM(fighter,target.id)','[`Legendary`,`Mythical`].includes(target.rarity) && RIFT_OWNS_ITEM(fighter,target.id)',1)

if '/* Riftbound Itemization Expansion · icon art and fast Armory UX */' in css: raise SystemExit('Itemization Expansion: CSS already present')
css=css.rstrip()+'\n\n'+styles+'\n'
bundle_path.write_text(bundle);css_path.write_text(css)
print('Applied Riftbound Itemization Expansion:')
print(' - exactly 32 new fiction-reference Legendary items with distinct build hooks')
print(' - expanded Common, Uncommon, and Epic recipe vocabulary')
print(' - reworked existing Common/Uncommon/Epic identity while preserving Rebellion')
print(' - explicit per-action/per-ability/per-turn passive trigger labels and guarded procs')
print(' - all item portraits use designed non-text silhouette artwork')
print(' - hover tooltips and live recipe inspection across the Armory')
print(' - recipe components support guarded double-click direct purchasing')
print(' - Stat Menu separates Base, Level-Up Cap, Item Bonus, and Effective Stat')
print(' - item bonuses remain uncapped equipment contributions to combat comparisons')
