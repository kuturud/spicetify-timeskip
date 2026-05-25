(function preview30NativeFinalEditionFixed() {
    if (!Spicetify.Player || !Spicetify.Platform) {
        setTimeout(preview30NativeFinalEditionFixed, 300);
        return;
    }

    let isEnabled = localStorage.getItem("p30_enabled") === "true";
    let playDuration = parseInt(localStorage.getItem("p30_duration")) || 30;
    let trackInterval = null;

    const ICON_ON = `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="display:block; filter:none !important;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>`; 
    const ICON_OFF = `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="display:block; filter:none !important;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>`;   

    function runSkipperEngine() {
        if (trackInterval) clearInterval(trackInterval);
        if (!isEnabled) return;

        const triggerTime = playDuration * 1000;
        trackInterval = setInterval(() => {
            if (!isEnabled) {
                clearInterval(trackInterval);
                return;
            }
            if (Spicetify.Player.getProgress() >= triggerTime) {
                clearInterval(trackInterval);
                Spicetify.Player.next();
            }
        }, 300);
    }

    Spicetify.Player.addEventListener("songchange", () => {
        if (isEnabled) runSkipperEngine();
    });

    function injectUI() {
        if (document.getElementById("p30-native-btn")) return;

        let cartElement = document.querySelector('a[href="/marketplace"]') || document.querySelector('.marketplace-topbar-button');
        if (!cartElement) {
            const allButtons = document.querySelectorAll('button, a');
            for (let target of allButtons) {
                if (target.textContent.toLowerCase().includes('marketplace') || (target.title && target.title.toLowerCase().includes('marketplace'))) {
                    cartElement = target;
                    break;
                }
            }
        }

        const parentContainer = cartElement ? cartElement.parentElement : (document.querySelector(".main-topBar-container") || document.querySelector("header"));
        if (!parentContainer) {
            setTimeout(injectUI, 500);
            return;
        }

        const btn = document.createElement("button");
        btn.id = "p30-native-btn";
        btn.title = "TimeSkip Controls"; // Updated to match your custom manifest name
        btn.style.cssText = `
            background: transparent !important;
            border: none !important;
            cursor: pointer !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 40px !important;
            height: 40px !important;
            margin-right: 12px !important;
            padding: 0 !important;
            position: relative !important;
            vertical-align: middle !important;
            opacity: 1 !important;
            filter: none !important;
            transition: transform 0.2s ease, color 0.2s ease;
        `;

        const dropdown = document.createElement("div");
        dropdown.id = "p30-native-drop";
        dropdown.style.cssText = `
            display: none;
            position: fixed;
            background: #282828 !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
            border-radius: 6px !important;
            padding: 6px !important;
            width: 220px !important;
            box-shadow: 0 10px 30px rgba(0,0,0,0.6) !important;
            z-index: 999999999 !important;
            flex-direction: column;
            font-family: var(--font-family, sans-serif);
            pointer-events: auto !important;
        `;

        dropdown.innerHTML = `
            <div id="p30-act-toggle" style="display:flex; flex-direction:column; padding:10px; border-radius:4px; cursor:pointer; transition: background 0.2s; pointer-events: auto !important;">
                <div style="display:flex; justify-content:space-between; width:100%; align-items:center; font-size:13px; font-weight:700; color:#ffffff; pointer-events: none;">
                    <span>TimeSkip Mode</span>
                    <span id="p30-lbl-toggle" style="margin-left:auto;">OFF</span>
                </div>
                <div style="font-size:11px; color:#b3b3b3; font-weight:400; margin-top:3px; opacity:0.6; text-align:left; pointer-events: none;">Enable automated quick playlist and song scanning.</div>
            </div>
            <div style="height:1px; background:rgba(255,255,255,0.06); margin:4px 6px;"></div>
            <div id="p30-act-time" style="display:flex; flex-direction:column; padding:10px; border-radius:4px; cursor:pointer; transition: background 0.2s; pointer-events: auto !important;">
                <div style="display:flex; justify-content:space-between; width:100%; align-items:center; font-size:13px; font-weight:700; color:#ffffff; pointer-events: none;">
                    <span>Set Duration</span>
                    <span id="p30-lbl-time" style="margin-left:auto; color:#b3b3b3;">30s</span>
                </div>
                <div style="font-size:11px; color:#b3b3b3; font-weight:400; margin-top:3px; opacity:0.6; text-align:left; pointer-events: none;">Adjust exactly how many seconds each track plays.</div>
            </div>
        `;
        
        document.body.appendChild(dropdown);

        const rows = dropdown.querySelectorAll('#p30-act-toggle, #p30-act-time');
        rows.forEach(row => {
            row.addEventListener('mouseenter', () => row.style.background = 'rgba(255,255,255,0.08)');
            row.addEventListener('mouseleave', () => row.style.background = 'transparent');
        });

        function syncUI() {
            btn.innerHTML = isEnabled ? ICON_ON : ICON_OFF;
            btn.style.color = isEnabled ? "var(--spice-button-active, #1db954)" : "var(--spice-accent, #ffffff)";

            const lblToggle = document.getElementById("p30-lbl-toggle");
            const lblTime = document.getElementById("p30-lbl-time");
            if (lblToggle) {
                lblToggle.textContent = isEnabled ? "ON" : "OFF";
                lblToggle.style.color = isEnabled ? "var(--spice-button-active, #1db954)" : "#b3b3b3";
            }
            if (lblTime) lblTime.textContent = `${playDuration}s`;
        }

        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const isHidden = dropdown.style.display !== "flex";
            if (isHidden) {
                const rect = btn.getBoundingClientRect();
                dropdown.style.top = `${rect.bottom + 6}px`;
                dropdown.style.left = `${rect.left}px`;
                dropdown.style.display = "flex";
            } else {
                dropdown.style.display = "none";
            }
        });

        dropdown.querySelector("#p30-act-toggle").addEventListener("click", (e) => {
            e.stopPropagation();
            isEnabled = !isEnabled;
            localStorage.setItem("p30_enabled", isEnabled);
            syncUI();
            runSkipperEngine();
        });

        dropdown.querySelector("#p30-act-time").addEventListener("click", (e) => {
            e.stopPropagation();
            dropdown.style.display = "none";
            const res = prompt("Enter playback limit in seconds:", playDuration);
            if (res) {
                playDuration = Math.max(1, parseInt(res) || 30);
                localStorage.setItem("p30_duration", playDuration);
                syncUI();
                if (isEnabled) runSkipperEngine();
            }
        });

        document.addEventListener("click", () => { dropdown.style.display = "none"; });
        window.addEventListener("resize", () => { dropdown.style.display = "none"; });

        if (cartElement) {
            parentContainer.insertBefore(btn, cartElement);
        } else {
            parentContainer.appendChild(btn);
        }
        syncUI();
    }

    injectUI();
    if (isEnabled) runSkipperEngine();
})();
