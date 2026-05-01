const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove the separate div and move buttons into the main button group
const oldButtons = `<div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
              <button className={\`btn btn-sm \${!showDrafts ? 'btn-primary' : 'btn-ghost'}\`} onClick={() => setShowDrafts(false)}>{t.pipeline}</button>
              <button className={\`btn btn-sm \${showDrafts ? 'btn-primary' : 'btn-ghost'}\`} onClick={() => setShowDrafts(true)}>{t.drafts}</button>
            </div>`;

const newButtons = `
              <div className="btn-group" style={{ display: "flex", gap: 10, marginRight: 20, borderRight: "1px solid var(--border)", paddingRight: 20 }}>
                <button className={\`btn btn-sm \${!showDrafts ? 'btn-primary' : 'btn-ghost'}\`} onClick={() => setShowDrafts(false)}>{t.pipeline}</button>
                <button className={\`btn btn-sm \${showDrafts ? 'btn-primary' : 'btn-ghost'}\`} onClick={() => setShowDrafts(true)}>{t.drafts}</button>
              </div>
`;

content = content.replace(oldButtons, newButtons);

fs.writeFileSync(filePath, content);
console.log("Horizontally aligned Pipeline/Draft buttons in topbar.");
