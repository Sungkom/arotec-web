"""Dry-run-first additive installer: preserve sources, never overwrite/publish.

Extract the reviewed package and run this script with --target EXISTING_WEBSITE.
Use --apply only for authorized local integration. Partial additions are reported
if a filesystem error interrupts a run; existing files are never removed.
"""
from pathlib import Path, PureWindowsPath
import argparse
import hashlib
import json
import re

EXPECTED_PAYLOAD_FILES = 60
EXPECTED_SOURCE_INPUTS = 59
MANIFEST_PATH = 'seo/package-manifest.json'
RESERVED_NAMES = {'CON', 'PRN', 'AUX', 'NUL', *(f'COM{i}' for i in range(1, 10)), *(f'LPT{i}' for i in range(1, 10))}


def require(condition, message):
    if not condition:
        raise RuntimeError(message)


def digest(data):
    return hashlib.sha256(data).hexdigest()


def relative_path(raw):
    require(isinstance(raw, str) and bool(raw), 'Invalid empty/non-string path')
    win = PureWindowsPath(raw)
    require(not win.drive and not win.root and not win.anchor, 'Absolute/drive-qualified path: ' + raw)
    require('\\' not in raw and not raw.startswith('/'), 'Use portable relative forward-slash paths: ' + raw)
    parts = raw.split('/')
    require(all(part and part not in {'.', '..'} for part in parts), 'Unsafe path components: ' + raw)
    require(not re.search(r'[\x00-\x1f<>:"|?*]', raw), 'Invalid Windows path characters: ' + raw)
    require(all(not part.endswith((' ', '.')) and part.split('.')[0].upper() not in RESERVED_NAMES for part in parts), 'Reserved Windows filename: ' + raw)
    require(parts[0].casefold() not in {'.git', '.agents', '.codex', '.aws', 'cname'} and not parts[0].casefold().startswith('.env'), 'Protected/out-of-scope target path: ' + raw)
    return Path(*parts)


def contained(root, rel):
    root = Path(root).resolve(strict=True)
    path = root / relative_path(rel)
    resolved = path.resolve(strict=False)
    require(resolved.is_relative_to(root), 'Resolved path escapes root: ' + rel)
    return path


def exists_even_link(path):
    return path.exists() or path.is_symlink() or (hasattr(path, 'is_junction') and path.is_junction())


def validate_new_destination(root, rel):
    root = Path(root).resolve(strict=True)
    path = contained(root, rel)
    require(not exists_even_link(path), 'Refusing to overwrite existing target: ' + rel)
    parent = path.parent
    while parent != root:
        require(not exists_even_link(parent) or parent.is_dir(), 'Target parent is not a directory: ' + str(parent))
        require(parent.resolve(strict=False).is_relative_to(root), 'Target parent escapes root: ' + rel)
        parent = parent.parent
    return path


def load_json(path):
    return json.loads(path.read_text(encoding='utf-8'))


def validated_rows(payload, label, count):
    require(isinstance(payload, dict) and isinstance(payload.get('files'), list), 'Invalid ' + label + ' files schema')
    rows = payload['files']
    require(len(rows) == count, f'{label} count changed: expected {count}, got {len(rows)}')
    keys = set()
    for row in rows:
        require(isinstance(row, dict), 'Invalid row in ' + label)
        path = row.get('path')
        relative_path(path)
        require(isinstance(row.get('sha256'), str) and re.fullmatch(r'[0-9a-f]{64}', row['sha256']), 'Invalid SHA-256: ' + path)
        key = path.casefold()
        require(key not in keys, 'Duplicate case-insensitive file path: ' + path)
        keys.add(key)
    for key in keys:
        require(not any('/'.join(key.split('/')[:index]) in keys for index in range(1, len(key.split('/')))), 'File/directory path conflict: ' + key)
    return rows


def verify_sources(target, source_rows):
    for row in source_rows:
        path = contained(target, row['path'])
        require(path.is_file() and digest(path.read_bytes()) == row['sha256'], 'Existing source changed: ' + row['path'])


def prepare_install(bundle, target):
    bundle = Path(bundle).resolve(strict=True)
    target = Path(target).resolve(strict=True)
    require(bundle.is_dir() and target.is_dir() and bundle != target, 'Use an existing separate website folder')
    manifest_file = contained(bundle, MANIFEST_PATH)
    require(manifest_file.is_file(), 'Missing sealed package manifest')
    manifest_bytes = manifest_file.read_bytes()
    rows = validated_rows(json.loads(manifest_bytes.decode('utf-8')), 'Package payload', EXPECTED_PAYLOAD_FILES)
    require(MANIFEST_PATH.casefold() not in {row['path'].casefold() for row in rows}, 'Manifest must be sealed separately, not self-hashed')
    source_file = contained(bundle, 'seo/source-input-hashes.json')
    source_rows = validated_rows(load_json(source_file), 'Source inputs', EXPECTED_SOURCE_INPUTS)
    verify_sources(target, source_rows)
    expected = {row['path'] for row in rows} | {MANIFEST_PATH}
    actual = {path.relative_to(bundle).as_posix() for path in bundle.rglob('*') if path.is_file()}
    require(actual == expected, 'Package file set differs from manifest: ' + json.dumps({'extra': sorted(actual - expected), 'missing': sorted(expected - actual)}))
    additions = []
    for row in rows:
        src = contained(bundle, row['path'])
        require(src.is_file(), 'Missing package file: ' + row['path'])
        data = src.read_bytes()
        require(digest(data) == row['sha256'], 'Package hash mismatch: ' + row['path'])
        if 'bytes' in row:
            require(type(row['bytes']) is int and row['bytes'] == len(data), 'Package byte count mismatch: ' + row['path'])
        validate_new_destination(target, row['path'])
        additions.append({'path': row['path'], 'data': data, 'sha256': row['sha256']})
    validate_new_destination(target, MANIFEST_PATH)
    additions.append({'path': MANIFEST_PATH, 'data': manifest_bytes, 'sha256': digest(manifest_bytes)})
    return {'bundle': bundle, 'target': target, 'source_rows': source_rows, 'additions': additions, 'file_set': expected}


def verify_bundle_unchanged(plan):
    actual = {path.relative_to(plan['bundle']).as_posix() for path in plan['bundle'].rglob('*') if path.is_file()}
    require(actual == plan['file_set'], 'Sealed package file set changed')
    for row in plan['additions']:
        require(contained(plan['bundle'], row['path']).read_bytes() == row['data'], 'Sealed package changed: ' + row['path'])


def apply_install(plan, on_added=None):
    verify_bundle_unchanged(plan)
    verify_sources(plan['target'], plan['source_rows'])
    for row in plan['additions']:
        validate_new_destination(plan['target'], row['path'])
    for row in plan['additions']:
        dest = validate_new_destination(plan['target'], row['path'])
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest = validate_new_destination(plan['target'], row['path'])
        with dest.open('xb') as handle:
            handle.write(row['data'])
        require(dest.read_bytes() == row['data'], 'Written file mismatch: ' + row['path'])
        if on_added:
            on_added({'path': row['path'], 'bytes': len(row['data']), 'sha256': row['sha256']})
    verify_bundle_unchanged(plan)
    verify_sources(plan['target'], plan['source_rows'])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--target', required=True)
    parser.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    plan = prepare_install(Path(__file__).resolve().parents[1], args.target)
    print(json.dumps({'mode': 'apply' if args.apply else 'dry-run', 'target': str(plan['target']), 'newFiles': len(plan['additions']), 'sourceInputsMatched': len(plan['source_rows']), 'overwrites': False, 'commitOrPublish': False}, ensure_ascii=False))
    if args.apply:
        apply_install(plan)
        print('Added reviewed new files only. Existing files, Git and deployment were not changed.')


if __name__ == '__main__':
    main()
