from pathlib import Path
import sys
# Test/deploy workspaces run from repository root. This bridge only adjusts the
# ephemeral verifier-preparation entrypoint; it never touches built game assets.
repo=Path.cwd()
wrapper=repo/'scripts'/'prepare-v35-verifier-compat.mjs'
if wrapper.is_file():
    text=wrapper.read_text()
    additions=[]
    for post in sorted((repo/'scripts').glob('prepare-v36-post*-compat.mjs')):
        line=f"await import('./{post.name}');"
        if line not in text: additions.append(line)
    if additions:
        wrapper.write_text(text.rstrip()+'\n'+'\n'.join(additions)+'\n')
        print(f"V36 CI bridge chained {len(additions)} post-compat module(s).")
    else:
        print('V36 CI bridge: post-compat modules already chained or none present.')
else:
    print('V36 CI bridge: verifier preparer not present in this build context; skipped.')
