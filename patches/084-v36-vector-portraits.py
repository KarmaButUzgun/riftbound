from pathlib import Path
import shutil,sys
root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
parts=Path(__file__).with_name('083-shadows-converge-v36-parts')
for name in ['shadow-crystal','shadow-mantle']:
    source=parts/f'{name}.svg'
    if not source.is_file(): raise SystemExit(f'V36 vector portrait missing: {source}')
    shutil.copyfile(source,root/'assets'/f'v36-{name}.svg')
print('Installed V36 authored vector portraits.')
