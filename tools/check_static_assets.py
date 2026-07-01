from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
FILES = (
    list(ROOT.glob("*.html"))
    + list((ROOT / "pages").glob("*.html"))
    + list((ROOT / "assets/css").glob("*.css"))
)

PATTERNS = [
    re.compile(r"""(?:href|src)=["']([^"']+)["']"""),
    re.compile(r"""url\(["']?([^"')]+)["']?\)"""),
]


def is_local_asset(ref: str) -> bool:
    return bool(ref) and not ref.startswith(("http:", "https:", "data:", "#", "mailto:", "tel:"))


def main() -> int:
    missing = []
    for file_path in FILES:
        source = file_path.read_text(encoding="utf-8", errors="ignore")
        for pattern in PATTERNS:
            for match in pattern.finditer(source):
                ref = match.group(1).split("#", 1)[0].split("?", 1)[0]
                if not is_local_asset(ref) or ref.endswith(".html"):
                    continue
                resolved = (file_path.parent / ref).resolve()
                if not resolved.exists():
                    missing.append((file_path.relative_to(ROOT), ref))

    print(f"missing_count {len(missing)}")
    for file_path, ref in missing:
        print(f"{file_path} -> {ref}")
    return 1 if missing else 0


if __name__ == "__main__":
    raise SystemExit(main())
