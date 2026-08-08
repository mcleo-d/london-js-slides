#!/usr/bin/env python3
# Replaces curly/smart double-quote pairs (“ and ”) with straight
# double quotes, but ONLY when they appear as JSX attribute delimiters in the
# pattern ='...' (i.e. an equals sign followed by a curly-open quote, some
# content, then a curly-close quote).  Content-string typography inside JSX
# children or JS strings is left completely untouched.
#
# Conservative scope rationale: curly quotes inside JSX attribute values break
# the JSX parser in Babel.  Curly quotes in rendered text are intentional
# typography that must be preserved.
#
# Usage:
#   python3 fix-curly-quotes.py [--check] [files ...]
#
#   --check  Report replacements but do not write files (exit 1 if any found).
#   files    Defaults to all .js and .jsx files found under the current dir.
#
# Idempotent: running twice produces the same result; the second pass reports
# zero replacements because no curly-quote attribute delimiters remain.

import re
import sys
import os

CURLY_OPEN  = '“'  # left double quotation mark
CURLY_CLOSE = '”'  # right double quotation mark

# Matches   ='...'   where the quotes are curly double quotes.
# Capture group 1 = the attribute value content (may be empty).
PATTERN = re.compile(
    r'=' + re.escape(CURLY_OPEN) + r'([^' + re.escape(CURLY_CLOSE) + r']*)' + re.escape(CURLY_CLOSE)
)


def fix_file(path: str, check_only: bool) -> int:
    with open(path, 'r', encoding='utf-8') as fh:
        original = fh.read()

    replaced, count = PATTERN.subn(lambda m: '="' + m.group(1) + '"', original)

    if count and not check_only:
        with open(path, 'w', encoding='utf-8') as fh:
            fh.write(replaced)

    return count


def collect_files(args):
    extensions = {'.js', '.jsx'}
    paths = []
    for arg in args:
        if os.path.isfile(arg):
            paths.append(arg)
        elif os.path.isdir(arg):
            for root, _dirs, files in os.walk(arg):
                for name in files:
                    if os.path.splitext(name)[1] in extensions:
                        paths.append(os.path.join(root, name))
    return paths


def main():
    args = sys.argv[1:]
    check_only = '--check' in args
    if check_only:
        args.remove('--check')

    if not args:
        args = ['.']

    files = collect_files(args)
    if not files:
        print('fix-curly-quotes: no .js/.jsx files found', file=sys.stderr)
        sys.exit(0)

    total = 0
    for path in sorted(files):
        count = fix_file(path, check_only)
        if count:
            action = 'would fix' if check_only else 'fixed'
            print(f'{path}: {action} {count} replacement(s)')
            total += count
        else:
            print(f'{path}: 0 replacements')

    if check_only and total:
        print(f'\nTotal: {total} replacement(s) needed -- commit blocked', file=sys.stderr)
        sys.exit(1)
    else:
        print(f'\nTotal: {total} replacement(s)')


if __name__ == '__main__':
    main()
