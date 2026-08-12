from pathlib import Path
import base64
import gzip

parts=Path(__file__).with_name('044-elemental-cursed-child-v13-parts')
for encoded_name, output_name in [
    ('01-runtime-v13.js.gz.b64','01-runtime-v13.js'),
    ('02-styles-v13.css.gz.b64','02-styles-v13.css'),
]:
    encoded=(parts/encoded_name).read_text().strip()
    decoded=gzip.decompress(base64.b64decode(encoded)).decode('utf-8')
    (parts/output_name).write_text(decoded)
print('Prepared V13 runtime/style payloads for patch 044.')
