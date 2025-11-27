#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
python3 -c "
import glob
import subprocess

files = sorted(glob.glob('$SCRIPT_DIR/src/content/rfds/*.md'))
contents = [open(f).read() for f in files]
subprocess.run(['pbcopy'], input='\n-----\n'.join(contents).encode())
print(f'Copied {len(files)} RFDs to clipboard')
"
