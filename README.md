# ⏱️ TimeSkip

TimeSkip is a native Spicetify extension that gives you precise control over your playlist curation and music discovery. It adds a customizable control button directly to your upper topbar layout next to the marketplace cart icon, allowing you to sample and skip tracks automatically after a specific time duration threshold.

## ✨ Features

- **Automated Skipping:** Focus on discovery by letting your client queue automatically advance after listening.
- **Dynamic Popup Customizer:** Click the topbar icon to quickly change listening thresholds in real-time.
- **Accurate State Indicator:** The button switches colors and symbols instantly to confirm if the engine is running or in standby.
- **Theme-Agnostic Design:** Inherits your default application layout variables, fonts, borders, and dark-mode styles right out-of-the-box.

## 🚀 Installation

Ensure you have [Spicetify](https://spicetify.app) installed on your system.

1. Download `timeskip.js` and move it to your Spicetify Extensions directory:
   - **Windows:** `%userprofile%\.spicetify\Extensions\`
   - **macOS/Linux:** `~/.spicetify/Extensions/`
2. Open your terminal or PowerShell and run the configuration commands:
   ```bash
   spicetify config extensions timeskip.js
   spicetify apply
   ```

## ⚙️ How to Use

- **Left-Click the Icon:** Toggle the automated TimeSkip countdown engine ON (Bright Green) or OFF (Default Gray/White).
- **Adjust Timing:** Click the "Set Limit" option row inside the dropdown panel to customize your duration in seconds via a prompt box.

---

### ⚠️ Attributions Disclaimer
The actual extension source engine code and implementation parameters were programmed manually by the repository owner. Artificial Intelligence (AI) assistance was utilized strictly for drafting, structuring, and formatting the documentation layout inside this `README.md` asset page.
