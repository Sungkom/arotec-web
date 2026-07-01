from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
CSS_FILES = [
    ROOT / "assets/css/styles.css",
    ROOT / "assets/css/exposome-story.css",
    ROOT / "assets/css/longevity-story.css",
    ROOT / "assets/css/customized-commerce.css",
    ROOT / "assets/css/exposome.css",
]
JS_FILES = [
    ROOT / "assets/js/site.js",
    ROOT / "assets/js/exposome-story.js",
    ROOT / "assets/js/longevity-story.js",
    ROOT / "assets/js/customized-commerce.js",
    ROOT / "assets/js/members.js",
    ROOT / "assets/js/admin-members.js",
    ROOT / "assets/js/detail-gallery.js",
    ROOT / "assets/js/exposome.js",
]


def minify_css(css: str) -> str:
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    css = re.sub(r"\s+", " ", css)
    css = re.sub(r"\s*([{}:;,>~+])\s*", r"\1", css)
    css = css.replace(";}", "}")
    return css.strip()


def minify_js(source: str) -> str:
    # Keep JavaScript syntax untouched. The project uses long template strings,
    # URLs, regex literals, and multilingual text, so safe line compaction is
    # preferable to a brittle parser-free minifier.
    return "\n".join(line.strip() for line in source.splitlines() if line.strip())


def write_minified(paths, minifier):
    for path in paths:
        if not path.exists():
            continue
        target = path.with_name(f"{path.stem}.min{path.suffix}")
        target.write_text(minifier(path.read_text(encoding="utf-8")), encoding="utf-8")
        print(f"{path.relative_to(ROOT)} -> {target.relative_to(ROOT)} ({target.stat().st_size:,} bytes)")


if __name__ == "__main__":
    write_minified(CSS_FILES, minify_css)
    write_minified(JS_FILES, minify_js)
