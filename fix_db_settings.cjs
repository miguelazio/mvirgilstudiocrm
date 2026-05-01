const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add DB Settings button if missing
const dbSettingsBtn = `
        <div className="lang-switcher" style={{ margin: "0 16px", marginBottom: "10px" }}>
          <button className="lang-btn" onClick={() => setModal({ type: "db_settings", data: null })} style={{ width: "100%", justifyContent: "center", color: "var(--accent)" }}>
            ⚙️ DB Settings
          </button>
        </div>
`;

if (!content.includes('type: "db_settings"')) {
    // Insert after the restore button's div
    content = content.replace(/⬆ Restore \(\.xlsx\)\"\}\s*<\/button>\s*<\/div>/, (match) => match + dbSettingsBtn);
}

fs.writeFileSync(filePath, content);
console.log("Successfully fixed DB Settings button injection.");
