import re

with open("css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

# Make the loader icon center itself better via CSS flexbox instead of just background-position: center center
css = css.replace(
""".preloader .icon {
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    z-index: 5;
    background-color: rgba(0, 0, 0, 0);
    background-position: center center;
    background-repeat: no-repeat;""",
""".preloader .icon {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    z-index: 5;
    background-color: transparent;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;"""
)

with open("css/style.css", "w", encoding="utf-8") as f:
    f.write(css)

