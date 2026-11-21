#!/usr/bin/env python3
# Validates community announcement slides added to the entry HTML in a pull
# request. Reports FAIL findings for structural problems (more than one new
# announcement, missing attributes, a non-https link, title/body over the
# length limit, wrong position, curly-quote attribute delimiters) and a WARN
# (never a failure) when the pull request touches files other than the entry
# HTML.
#
# Kept separate from scripts/check-announcement.sh so the parsing and
# validation rules can be exercised directly against fixture files, without
# git or GitHub Actions. See tests/run-fixtures.sh.
#
# Attribute text is only ever read and compared as data in this script; it
# is never interpolated into a shell command.
#
# Usage:
#   check_announcement.py --base-file F --head-file F --entry-name NAME
#                          [--changed-files-file F]

import argparse
import difflib
import re
import sys

# Named constants (owner tunes these later).
TITLE_MAX_LEN = 60
BODY_MAX_LEN = 160

REQUIRED_ATTRS = ["title", "body", "link", "name"]

ATTR_RE = re.compile(r'data-([a-zA-Z-]+)="([^"]*)"')
SECTION_RE = re.compile(r'<section\b[^>]*\bdata-label="([^"]*)"', re.IGNORECASE)

# Curly double quotes (U+201C/U+201D) used as an attribute delimiter, either
# opening (right after =) or closing (right before the next attribute or the
# end of the tag). Curly quotes used as ordinary typography inside title/body
# text are left alone -- they do not sit next to a delimiter position.
CURLY_DELIM_RE = re.compile(
    r'=[“”]|[“”](?=\s*(?:/?>|data-))'
)


def read_lines(path):
    with open(path, "r", encoding="utf-8") as fh:
        return fh.read().splitlines()


def added_lines(base_lines, head_lines):
    """Returns [(1-indexed head line number, text), ...] for lines that are
    new or changed in head relative to base."""
    matcher = difflib.SequenceMatcher(None, base_lines, head_lines, autojunk=False)
    result = []
    for tag, _i1, _i2, j1, j2 in matcher.get_opcodes():
        if tag in ("insert", "replace"):
            for j in range(j1, j2):
                result.append((j + 1, head_lines[j]))
    return result


def find_announcement_zone(head_lines):
    """Returns (start_line, end_line) exclusive bounds for where a new
    announcement <section> may sit. end_line is None when there is no
    bounding section after the anchor (the announcements section is last).
    Returns (None, None) if the anchor section itself cannot be found."""
    sections = []
    for idx, line in enumerate(head_lines, start=1):
        m = SECTION_RE.search(line)
        if m:
            sections.append((idx, m.group(1)))

    anchor_pos = None
    anchor_line = None
    for pos, (line_no, label) in enumerate(sections):
        if "Announcements" in label:
            anchor_line = line_no
            anchor_pos = pos
            break

    if anchor_line is None:
        return None, None

    end_line = None
    for line_no, label in sections[anchor_pos + 1:]:
        if "Announcement" not in label:
            end_line = line_no
            break

    return anchor_line, end_line


def check_line(line_no, line_text, zone_start, zone_end, findings):
    if CURLY_DELIM_RE.search(line_text):
        findings.append(
            "FAIL [curly-quotes] line {0}: uses curly quotes (“/”) "
            "as an attribute delimiter, which breaks HTML/Babel parsing. "
            "Use straight double quotes (\").".format(line_no)
        )
        return  # Attribute parsing below is not reliable on this line.

    attrs = dict(ATTR_RE.findall(line_text))

    missing = [
        "data-" + name for name in REQUIRED_ATTRS if not attrs.get(name)
    ]
    if missing:
        findings.append(
            "FAIL [missing-attribute] line {0}: missing required "
            "attribute(s): {1}. Required: data-title, data-body, "
            "data-link, data-name.".format(line_no, ", ".join(missing))
        )

    link = attrs.get("link")
    if link and not link.startswith("https://"):
        findings.append(
            'FAIL [link-not-https] line {0}: link "{1}" does not start '
            "with https://.".format(line_no, link)
        )

    title = attrs.get("title")
    if title and len(title) > TITLE_MAX_LEN:
        findings.append(
            "FAIL [title-too-long] line {0}: title is {1} characters; "
            "the limit is {2}.".format(line_no, len(title), TITLE_MAX_LEN)
        )

    body = attrs.get("body")
    if body and len(body) > BODY_MAX_LEN:
        findings.append(
            "FAIL [body-too-long] line {0}: body is {1} characters; "
            "the limit is {2}.".format(line_no, len(body), BODY_MAX_LEN)
        )

    if zone_start is None:
        findings.append(
            "FAIL [no-announcements-section] line {0}: could not find the "
            '"Your announcements" section in the entry HTML, so the '
            "announcement's position cannot be checked.".format(line_no)
        )
    elif not (zone_start < line_no and (zone_end is None or line_no < zone_end)):
        findings.append(
            "FAIL [wrong-position] line {0}: the announcement must sit "
            'directly after the "Your announcements" section, below any '
            "announcements already there.".format(line_no)
        )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-file", required=True)
    parser.add_argument("--head-file", required=True)
    parser.add_argument("--entry-name", required=True)
    parser.add_argument("--changed-files-file", default=None)
    args = parser.parse_args()

    base_lines = read_lines(args.base_file)
    head_lines = read_lines(args.head_file)

    new_lines = [
        (n, t) for n, t in added_lines(base_lines, head_lines)
        if "data-announcement" in t
    ]

    findings = []

    if len(new_lines) > 1:
        findings.append(
            "FAIL [too-many-announcements] this pull request adds {0} new "
            "announcement elements (lines: {1}); only one announcement is "
            "allowed per pull request.".format(
                len(new_lines), ", ".join(str(n) for n, _ in new_lines)
            )
        )

    if new_lines:
        zone_start, zone_end = find_announcement_zone(head_lines)
        for line_no, line_text in new_lines:
            check_line(line_no, line_text, zone_start, zone_end, findings)

    warnings = []
    if new_lines and args.changed_files_file:
        with open(args.changed_files_file, "r", encoding="utf-8") as fh:
            changed = [line.strip() for line in fh if line.strip()]
        other_files = [f for f in changed if f != args.entry_name]
        if other_files:
            warnings.append(
                "WARN [other-files-changed] this pull request changes "
                "file(s) other than the entry HTML: {0}. Announcement "
                "pull requests should normally only touch the entry "
                "HTML.".format(", ".join(other_files))
            )

    if new_lines:
        print(
            "check-announcement: found {0} new announcement element(s) "
            "in this pull request.".format(len(new_lines))
        )
    else:
        print(
            "check-announcement: no new announcement element found in "
            "this pull request; nothing to validate."
        )

    for warning in warnings:
        print(warning)
    for finding in findings:
        print(finding)

    if findings:
        print("check-announcement: FAIL ({0} finding(s)).".format(len(findings)))
        return 1

    print(
        "check-announcement: PASS"
        + (" (with warnings above)." if warnings else ".")
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
