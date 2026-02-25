import os
import glob
import re

base_dir = "/Users/meetshah/Documents/meet/old_scuba"

def remove_protection():
    html_files = glob.glob(os.path.join(base_dir, "*.html"))
    for file_path in html_files:
        if "index_old_ref" in file_path or "index_working" in file_path or "original" in file_path or "backup" in file_path or "test" in file_path:
            continue
        
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        original_content = content

        # Remove protection.js tag anywhere
        content = re.sub(r'<script[^>]*src=["\']js/protection\.js["\'][^>]*>\s*</script>', '', content)
        
        # Remove CSS link
        content = re.sub(r'<link[^>]*href=["\']css/protection\.css["\'][^>]*>', '', content)

        # Remove devToolsWarning cleanly (matches until its specific closing comment or just removes the whole block if we can)
        content = re.sub(r'<div class="dev-tools-warning" id="devToolsWarning">.*?</div>\s*</div>', '', content, flags=re.DOTALL)
        content = re.sub(r'<div class="dev-tools-warning" id="devToolsWarning">.*?</div>', '', content, flags=re.DOTALL)

        # Remove protectionOverlay cleanly
        content = re.sub(r'<div id="protectionOverlay"[\s\S]*?</div>\s*</div>', '', content)
        
        # Fix stray closing divs at the very end of body that might have been left over
        content = re.sub(r'<!-- Anti-copy protection overlay -->\s*</div>\s*</body>', '<!-- Anti-copy protection overlay -->\n</body>', content)
        content = re.sub(r'<!-- Anti-copy protection overlay -->\s*</div>\s*</div>\s*</body>', '<!-- Anti-copy protection overlay -->\n</body>', content)

        if content != original_content:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Removed protection from {os.path.basename(file_path)}")

if __name__ == "__main__":
    remove_protection()
