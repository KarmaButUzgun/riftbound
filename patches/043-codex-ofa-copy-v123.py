from pathlib import Path
import sys
root=Path(sys.argv[1]); bundle_path=root/'assets/page-F6OuavDb.js'
if not bundle_path.is_file(): raise SystemExit(f'V12.3: missing {bundle_path}')
bundle=bundle_path.read_text(); marker='/* Riftbound Codex OFA Copy V12.3 */'
if marker in bundle: raise SystemExit('V12.3 already applied')

def once(text, old, new, label):
    c=text.count(old)
    if c!=1: raise SystemExit(f'V12.3 {label}: expected once, found {c}')
    return text.replace(old,new,1)

base_passive='passive:`Inherited only from All Might after a boss. SMASH replaces Strike. Vestiges resist soul attacks, Danger Sense improves dodging while enemy intel is scarce, and Float grants flight and knockback resistance. Its free Smokescreen toggle drains Energy each turn to flood the battle in progressively heavier purple smoke and lower enemy accuracy; inside Heavy Smoke, Danger Sense operates at full strength regardless of intel. Fa Jin and Gearshift combine into explosive power at the risk of catastrophic recoil.`'
base_copy=base_passive+',codexDescription:`One For All as carried by the ninth bearer. Its stockpiled Might is joined by the vestiges and their inherited Quirks: Float, Danger Sense, Smokescreen, Blackwhip, Fa Jin, and Gearshift. The kit is built around mobility, restraint, stored motion, and stacking Gearshift into Faux 100%, with recoil as the price for forcing the accumulated power past safe limits.`'
bundle=once(bundle,base_passive,base_copy,'base OFA codex copy')

prime_passive='passive:`Might greatly improves physical Speed, strength, and durability while doubling the movement reserve. Rest becomes Go Beyond, Plus Ultra!, accelerating stamina recovery and empowering the next turn. United States of Smash is available only at critical health and burns this inherited power out forever after use.`'
prime_copy=prime_passive+',codexDescription:`One For All at All Might’s prime. Instead of centering the vestige toolkit, Prime expresses the stockpiled power as overwhelming raw Might: a doubled movement reserve and a Smash arsenal built to dominate space through Detroit, Delaware, and Wyoming Smash. United States of Smash is the critical-health final blow and permanently burns out this supplemental Prime inheritance after release.`'
bundle=once(bundle,prime_passive,prime_copy,'Prime OFA codex copy')

bundle=once(bundle,'(0,E.jsx)(`p`,{children:e.passive})','(0,E.jsx)(`p`,{children:e.codexDescription||e.passive})','Codex powers description renderer')

export='export{xs as default};'
if bundle.count(export)!=1: raise SystemExit('V12.3 export seam changed')
bundle=bundle.replace(export,marker+'\n'+export,1)
bundle_path.write_text(bundle)
print('Applied V12.3: One For All and One For All Prime now have distinct Codex-specific descriptions with gameplay passives unchanged.')
