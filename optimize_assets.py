import os
import glob
import re

base_dir = "/Users/meetshah/Documents/meet/old_scuba"

js_to_minify = [
    "js/jquery-ui.js",
    "js/jquery.fancybox.js",
    "js/owl.js",
]

css_to_defer_keywords = [
    "cookieconsent.min.css",
    "font-awesome.min.css",
    "fonts.googleapis.com", 
    "fontawesome-all.css",
    "animate.css",
    "hover.css",
    "owl.css",
    "jquery.fancybox.min.css"
]

def optimize_html():
    html_files = glob.glob(os.path.join(base_dir, "*.html"))
    for file_path in html_files:
        if "index_old_ref" in file_path or "index_working" in file_path or "original" in file_path or "backup" in file_path or "test" in file_path:
            continue
        
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        original_content = content

        # 1. Update JS to minified versions
        for js_file in js_to_minify:
            min_js = js_file.replace(".js", ".min.js")
            content = content.replace(f'src="{js_file}"', f'src="{min_js}"')
            content = content.replace(f"src='{js_file}'", f"src='{min_js}'")

        # 2. Add defer to .js files (using regex to find <script src="...js"></script> and add defer if not tracking pixels)
        # But this is risky if jquery.js is deferred. 
        # Actually, let's ONLY defer specific non-critical scripts, or just the ones we minified!
        # Deferring jquery.js or owl.js might break the page. 
        # Wait, the previous optimizations deferred jquery.js causing a potential issue.
        # Let's defer only the 3 minified scripts.
        js_to_defer = [
            "js/jquery-ui.min.js",
            "js/jquery.fancybox.min.js",
            "js/owl.min.js",
            "js/appear.js",
            "js/wow.js",
            "js/scrollbar.js",
            "js/validate.js",
            "js/element-in-view.js",
            "js/custom-script.js"
        ]
        for js_file in js_to_defer:
            content = re.sub(rf'(<script\s+[^>]*?)(src=["\']{js_file}["\'])([^>]*?>)', r'\1\2 defer\3', content)

        # 3. Optimize non-critical CSS (Preload pattern)
        # <link href="..." rel="stylesheet" /> -> <link rel="preload" as="style" href="..." onload="this.onload=null;this.rel='stylesheet'" />
        for kw in css_to_defer_keywords:
            # We look for `<link ... href="...kw..." ...>` with `rel="stylesheet"`
            pattern = re.compile(rf'(<link[^>]*?href=["\'][^"\']*?{re.escape(kw)}[^"\']*?["\'][^>]*?)rel=["\']stylesheet["\']([^>]*?>)')
            content = pattern.sub(r'\1rel="preload" as="style" onload="this.onload=null;this.rel=\'stylesheet\'"\2', content)

            # Some might have rel="stylesheet" before href
            pattern2 = re.compile(rf'(<link[^>]*?)rel=["\']stylesheet["\']([^>]*?href=["\'][^"\']*?{re.escape(kw)}[^"\']*?["\'][^>]*?>)')
            content = pattern2.sub(r'\1rel="preload" as="style" onload="this.onload=null;this.rel=\'stylesheet\'"\2', content)

        # 4. Wrap Analytics/FB/GTM inline scripts (GTM-KRT96J8 and fbevents.js)
        # Using a more robust regex that relies on the closing </script> tag instead of arbitrary internal text.
        
        # GTM
        if "GTM-KRT96J8" in content and "setTimeout" not in content.split("GTM-KRT96J8")[0][-150:]:
            content = re.sub(
                r'(<script[^>]*?>)([\s\S]*?GTM-KRT96J8[\s\S]*?)(</script>)',
                r'\1\n      document.addEventListener("DOMContentLoaded", function() {\n        setTimeout(function() {\n\2\n        }, 3500);\n      });\n    \3',
                content, count=1
            )

        # FB Pixel
        if "fbevents.js" in content and "setTimeout" not in content.split("fbevents.js")[0][-150:]:
            content = re.sub(
                r'(<script[^>]*?>)([\s\S]*?fbevents\.js[\s\S]*?)(</script>)',
                r'\1\n      document.addEventListener("DOMContentLoaded", function() {\n        setTimeout(function() {\n\2\n        }, 3500);\n      });\n    \3',
                content, count=1
            )


        if content != original_content:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Optimized {os.path.basename(file_path)}")

if __name__ == "__main__":
    optimize_html()
