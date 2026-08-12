from pathlib import Path
import base64
import gzip

parts=Path(__file__).with_name('047-btd-v14-parts')
for encoded_name, output_name in [
    ('01-runtime-v14.js.gz.b64','01-runtime-v14.js'),
    ('02-styles-v14.css.gz.b64','02-styles-v14.css'),
]:
    encoded=(parts/encoded_name).read_text().strip()
    decoded=gzip.decompress(base64.b64decode(encoded)).decode('utf-8')
    (parts/output_name).write_text(decoded)
print('Prepared BTD V14 runtime/style payloads for patch 047.')
