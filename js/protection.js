"use strict";

// Advanced source code protection
(function () {
    // Enhanced right-click protection against extensions
    document.addEventListener(
        "contextmenu",
        function (e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
        },
        true
    );

    // Backup context menu blocker
    document.oncontextmenu = function (e) {
        e = e || window.event;
        e.preventDefault();
        e.stopPropagation();
        return false;
    };

    // Block right mouse button specifically
    document.addEventListener(
        "mousedown",
        function (e) {
            if (e.button === 2) {
                // Right click
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return false;
            }
        },
        true
    );

    // Block mouse up for right button
    document.addEventListener(
        "mouseup",
        function (e) {
            if (e.button === 2) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        },
        true
    );

    // Detect and block extension interference
    let originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (
        type,
        listener,
        options
    ) {
        if (
            type === "contextmenu" &&
            listener.toString().indexOf("extension") > -1
        ) {
            // Block extension-based context menu listeners
            return;
        }
        return originalAddEventListener.call(this, type, listener, options);
    };

    // Monitor for DOM manipulation by extensions
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach(function (node) {
                    if (
                        node.nodeType === 1 &&
                        node.classList &&
                        (node.classList.contains("context") ||
                            node.classList.contains("menu") ||
                            (node.id && node.id.indexOf("context") > -1))
                    ) {
                        // Remove extension-injected context menus
                        node.remove();
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // Override common extension APIs
    if (window.browser && window.browser.contextMenus) {
        window.browser.contextMenus.create = function () {
            return;
        };
    }

    if (window.chrome && window.chrome.contextMenus) {
        window.chrome.contextMenus.create = function () {
            return;
        };
    }

    // Enhanced keyboard shortcut blocking
    document.addEventListener("keydown", function (e) {
        // Disable F12 (Developer Tools)
        if (e.keyCode === 123) {
            e.preventDefault();
            return false;
        }

        // Disable Ctrl+Shift+I (Developer Tools)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            return false;
        }

        // Disable Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
            e.preventDefault();
            return false;
        }

        // Disable Ctrl+Shift+C (Element inspector)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
            e.preventDefault();
            return false;
        }

        // Disable Ctrl+U (View Source)
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            return false;
        }

        // Disable Ctrl+S (Save Page)
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            return false;
        }

        // Disable Ctrl+A (Select All)
        if (e.ctrlKey && e.keyCode === 65) {
            e.preventDefault();
            return false;
        }

        // Disable Ctrl+C (Copy)
        if (e.ctrlKey && e.keyCode === 67) {
            e.preventDefault();
            return false;
        }

        // Disable Ctrl+V (Paste)
        if (e.ctrlKey && e.keyCode === 86) {
            e.preventDefault();
            return false;
        }

        // Disable Ctrl+X (Cut)
        if (e.ctrlKey && e.keyCode === 88) {
            e.preventDefault();
            return false;
        }

        // Disable Ctrl+P (Print)
        if (e.ctrlKey && e.keyCode === 80) {
            e.preventDefault();
            return false;
        }

        // Disable Ctrl+Shift+K (Firefox Console)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 75) {
            e.preventDefault();
            return false;
        }

        // Disable Ctrl+Shift+E (Firefox Network)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 69) {
            e.preventDefault();
            return false;
        }
    });

    // Silent protection - no warnings shown
    function showWarning(message) {
        // Silent mode - no visual warnings
        return;
    }

    // Advanced developer tools detection
    let devtools = {
        open: false,
        orientation: null,
    };

    let threshold = 160;

    setInterval(function () {
        if (
            window.outerHeight - window.innerHeight > threshold ||
            window.outerWidth - window.innerWidth > threshold
        ) {
            if (!devtools.open) {
                devtools.open = true;
                document.body.classList.add("dev-tools-detected");
                const warning = document.getElementById("devToolsWarning");
                if (warning) warning.style.display = "block";

                // Optional: Redirect after delay
                setTimeout(() => {
                    if (devtools.open) {
                        window.location.href = "about:blank";
                    }
                }, 5000);
            }
        } else {
            if (devtools.open) {
                devtools.open = false;
                document.body.classList.remove("dev-tools-detected");
                const warning = document.getElementById("devToolsWarning");
                if (warning) warning.style.display = "none";
            }
        }
    }, 500);

    // Enhanced text selection prevention
    document.onselectstart = function () {
        return false;
    };

    document.onmousedown = function () {
        return false;
    };

    // Disable drag and drop
    document.ondragstart = function () {
        return false;
    };

    // Disable image saving
    document.addEventListener("dragstart", function (e) {
        if (e.target.tagName === "IMG") {
            e.preventDefault();
            return false;
        }
    });

    // Clear console (silent mode)
    const clearConsole = () => {
        if (window.console && window.console.clear) {
            console.clear();
        }
        // Minimal console output
    };

    // Clear console every second
    ////setInterval(clearConsole, 1000); // Disabled for debugging // Re-enabled for production

    // Initial console clear
    clearConsole();

    // Detect if page is being loaded in frame/iframe
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }

    // Disable printing
    window.addEventListener("beforeprint", function (e) {
        e.preventDefault();
        return false;
    });

    // Monitor for suspicious activity (silent)
    let suspiciousActivity = 0;

    // Detect rapid key combinations (automation)
    let lastKeyTime = 0;
    document.addEventListener("keydown", function () {
        const now = Date.now();
        if (now - lastKeyTime < 50) {
            // Very fast typing
            suspiciousActivity++;
            // Silent monitoring - no warnings
        }
        lastKeyTime = now;
    });

    // Obfuscate source code view (enhanced)
    setTimeout(function () {
        const scripts = document.getElementsByTagName("script");
        for (let script of scripts) {
            if (script.innerHTML && !script.src) {
                // Make scripts harder to read
                const obfuscated = script.innerHTML
                    .replace(/\s+/g, " ")
                    .replace(/\/\*[\s\S]*?\*\//g, "")
                    .replace(/\/\/.*$/gm, "");
                script.innerHTML = obfuscated;
            }
        }
    }, 2000);

    // Code integrity checking
    const checkIntegrity = () => {
        const scriptCount = document.getElementsByTagName("script").length;
        const expectedCount = 8; // Adjust based on your pages

        if (scriptCount < expectedCount) {
            // Scripts may have been tampered with
            window.location.href = "about:blank";
        }
    };

    setInterval(checkIntegrity, 3000);

    // Memory cleanup to remove traces
    const cleanup = () => {
        if (window.gc) window.gc(); // Force garbage collection if available

        // Clear variables that might contain sensitive info
        for (let i = 0; i < 1000; i++) {
            window["_temp" + i] = null;
        }
    };

    setInterval(cleanup, 30000);

    // Silent detection for dev tools
    window.addEventListener("resize", function () {
        if (
            window.outerWidth - window.innerWidth > 200 ||
            window.outerHeight - window.innerHeight > 200
        ) {
            // Silent protection - no warnings
        }
    });

    // Hide source from view-source:
    if (window.location.protocol === "view-source:") {
        window.location.href = "about:blank";
    }

    // Initialize dynamic features
    document.addEventListener("DOMContentLoaded", () => {
        console.log("Advanced Protection: All systems active");
    });
})();

// Dynamic Code Generation System (Global scope)
window.generateDynamicCode = () => {
    const funcs = ["check", "verify", "secure", "protect"];
    const randomFunc = funcs[Math.floor(Math.random() * funcs.length)];
    const randomVar = "var_" + Math.random().toString(36).substr(2, 8);

    console.log(
        `🔧 Creating dynamic function: ${randomFunc} as ${randomVar}`
    );

    // Create dynamic function
    window[randomVar] = new Function(`
      return function ${randomFunc}() {
        console.log('Protection: Dynamic layer active - ${randomFunc}');
        return true;
      };
    `)();

    console.log(`✅ Dynamic function ${randomVar} created and stored`);

    // Execute and cleanup after 5 seconds
    setTimeout(() => {
        try {
            console.log(`🚀 Executing ${randomVar}...`);
            window[randomVar]();
            delete window[randomVar];
            console.log(`🗑️ Cleaned up ${randomVar}`);
        } catch (e) {
            console.log(`❌ Error with ${randomVar}:`, e);
        }
    }, 5000);
};

// Initialize dynamic features
document.addEventListener("DOMContentLoaded", () => {
    window.generateDynamicCode();
    setInterval(window.generateDynamicCode, 10000);
    console.log("Advanced Protection: All systems active");

    // Make function available globally for debugging
    window.debugGenerateDynamicCode = generateDynamicCode;
    console.log(
        "🔍 Debug: Type 'debugGenerateDynamicCode()' in console to manually trigger"
    );
});
