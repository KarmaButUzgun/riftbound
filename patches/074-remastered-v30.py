from pathlib import Path
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
bundle_path=root/'assets/page-F6OuavDb.js';css_path=root/'assets/riftbound.css';index_path=root/'index.html'
parts=Path(__file__).with_name('074-remastered-v30-parts');runtime_path=parts/'01-runtime.js';style_path=parts/'02-styles.css';sw_path=parts/'03-service-worker.js';icon_path=parts/'04-icon.svg'
for path in [bundle_path,css_path,index_path,runtime_path,style_path,sw_path,icon_path]:
    if not path.is_file(): raise SystemExit(f'V30 missing {path}')
bundle=bundle_path.read_text();css=css_path.read_text();index=index_path.read_text();runtime=runtime_path.read_text().strip();styles=style_path.read_text().strip();sw=sw_path.read_text().strip();icon=icon_path.read_text().strip()
marker='Riftbound Remastered V30'
if marker in bundle or '--rift-v30-marker' in css: raise SystemExit('V30 already applied')
for required in ['RIFT_V30_CERTIFICATION','RIFT_V30_BOOT_REPORT','RIFT_V30_COMPATIBILITY','RIFT_V30_RELEASE_PANEL']:
    if required not in runtime: raise SystemExit(f'V30 payload missing {required}')
export='export{xs as default};'
if bundle.count(export)!=1: raise SystemExit('V30 export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1);css=css.rstrip()+'\n\n'+styles+'\n'
if '<link rel="manifest" href="./manifest.webmanifest">' not in index:index=index.replace('</head>','  <link rel="manifest" href="./manifest.webmanifest">\n  <link rel="icon" href="./riftbound-icon.svg" type="image/svg+xml">\n  <meta name="theme-color" content="#071019">\n</head>',1)
bundle_path.write_text(bundle);css_path.write_text(css);index_path.write_text(index);(root/'riftbound-sw.js').write_text(sw+'\n');(root/'riftbound-icon.svg').write_text(icon+'\n')
(root/'manifest.webmanifest').write_text('''{"name":"Riftbound Remastered","short_name":"Riftbound","id":"./","start_url":"./","scope":"./","display":"standalone","orientation":"any","background_color":"#03070b","theme_color":"#071019","description":"A turn-based ascension RPG remastered without changing its abilities.","icons":[{"src":"./riftbound-icon.svg","sizes":"any","type":"image/svg+xml","purpose":"any maskable"}]}\n''')
print('Applied Riftbound V30 Remastered:')
print(' - definitive schema-30 migration, compatibility mode, boot certification, release health, and safe rollback metadata')
print(' - installable offline shell with conservative cache strategy and no interception of co-op API traffic')
print(' - final release panel exposes constitution, core, spatial, save, interface, arena, AI, and co-op certification')
