import re

html_content = open("index.html", "r", encoding="utf-8").read()

# Minify JS paths
for js_file in ["js/jquery-ui.js", "js/jquery.fancybox.js", "js/owl.js"]:
    html_content = html_content.replace(f'src="{js_file}"', f'src="{js_file.replace(".js", ".min.js")}"')

with open("test.html", "w", encoding="utf-8") as f:
    f.write(html_content)
