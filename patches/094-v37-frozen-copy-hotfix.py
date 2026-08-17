from pathlib import Path
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
bundle_path=root/'assets/page-F6OuavDb.js'
if not bundle_path.is_file(): raise SystemExit('V37.1 bundle missing')
bundle=bundle_path.read_text()
old="if(typeof RIFT_V368_POWER_COPY===`object`)RIFT_V368_POWER_COPY[RIFT_V37_POWER_NAME]={rarity:`Epic`,obtainment:`Available on the Special Power wheel.`,flavor:`One clap is enough to make position stop belonging to anyone. Turn allies, enemies, debris and a stupid little pebble into the same tactical question: who should be standing there instead?`,mechanical:`A high-skill support/control power built around battlefield-wide position swaps, cursed-energy object anchors, a three-turn moving pebble, ally damage setup, a five-turn Frenzie state and a triple-swap Black Flash primer.`};"
new="const RIFT_V37_POWER_COPY=Object.freeze({rarity:`Epic`,obtainment:`Available on the Special Power wheel.`,flavor:`One clap is enough to make position stop belonging to anyone. Turn allies, enemies, debris and a stupid little pebble into the same tactical question: who should be standing there instead?`,mechanical:`A high-skill support/control power built around battlefield-wide position swaps, cursed-energy object anchors, a three-turn moving pebble, ally damage setup, a five-turn Frenzie state and a triple-swap Black Flash primer.`});const RIFT_V37_BASE_POWER_INFO=RIFT_V368_POWER_INFO;RIFT_V368_POWER_INFO=function RIFT_V37_POWER_INFO(power){return power?.name===RIFT_V37_POWER_NAME?RIFT_V37_POWER_COPY:RIFT_V37_BASE_POWER_INFO(power)};"
if bundle.count(old)!=1: raise SystemExit(f'V37.1 frozen-copy seam expected once, found {bundle.count(old)}')
bundle=bundle.replace(old,new,1)
old_count='powerDescriptions:Object.keys(RIFT_V368_POWER_COPY||{}).length,catalog:()=>RIFT_V37_CATALOG'
new_count='powerDescriptions:g.length,catalog:()=>RIFT_V37_CATALOG'
if bundle.count(old_count)!=1: raise SystemExit(f'V37.1 power-description seam expected once, found {bundle.count(old_count)}')
bundle=bundle.replace(old_count,new_count,1)
bundle_path.write_text(bundle)
print('Applied V37.1 frozen-copy hotfix: V36.8 copy registry stays immutable while Boogie Woogie receives authored V37 copy through the live lookup layer.')
