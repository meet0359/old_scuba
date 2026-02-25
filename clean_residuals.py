import os
import glob
import re

base_dir = "/Users/meetshah/Documents/meet/old_scuba"
html_files = glob.glob(os.path.join(base_dir, "*.html"))

for file_path in html_files:
    if "backup" in file_path or "original" in file_path or "working" in file_path or "test" in file_path or "ref" in file_path:
        continue
        
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    original_content = content

    # 1. Clean the duplicated head of the setTimeout wrapper
    content = re.sub(
        r'(?:[ \t]*document\.addEventListener\("DOMContentLoaded", function\(\) \{\n[ \t]*setTimeout\(function\(\) \{\n*){2,}',
        '      document.addEventListener("DOMContentLoaded", function() {\n        setTimeout(function() {\n',
        content
    )
    content = re.sub(
        r'<script>\s*document\.addEventListener\("DOMContentLoaded", function\(\) \{\s*setTimeout\(function\(\) \{\s*document\.addEventListener\("DOMContentLoaded", function\(\) \{\s*setTimeout\(function\(\) \{',
        '<script>\n      document.addEventListener("DOMContentLoaded", function() {\n        setTimeout(function() {',
        content
    )

    # 2. Clean the duplicated tail of the setTimeout wrapper
    content = re.sub(
        r'(?:\n*[ \t]*\}, 3500\);\n[ \t]*\}\);){2,}',
        '\n        }, 3500);\n      });',
        content
    )
    
    # 3. Clean up the incredibly broken onload injected previously
    content = content.replace(
        'onload="this.onload=null;this.rel="preload" as="style" onload="this.onload=null;this.rel=\\\'stylesheet\\\'""', 
        'onload="this.onload=null;this.rel=\'stylesheet\'"'
    )
    content = content.replace(
        'onload="this.onload=null;this.rel="preload" as="style" onload="this.onload=null;this.rel=\'stylesheet\'""', 
        'onload="this.onload=null;this.rel=\'stylesheet\'"'
    )
    # just in case
    content = re.sub(
        r'onload="this\.onload=null;this\.rel="preload" as="style" onload="this\.onload=null;this\.rel=\\?[\'"]stylesheet\\?[\'"]""',
        'onload="this.onload=null;this.rel=\'stylesheet\'"',
        content
    )

    
    if content != original_content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Cleaned up {os.path.basename(file_path)}")
