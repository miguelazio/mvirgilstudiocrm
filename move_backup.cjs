const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Extract the backup button block
const backupBtnRegex = /<div className="lang-switcher" style=\{\{ margin: "0 16px", marginBottom: "10px" \}\}>\s*<button className="lang-btn" onClick=\{downloadFullBackup\}[\s\S]*?<\/div>/;
const match = content.match(backupBtnRegex);

if (match) {
    const backupBtn = match[0];
    // Remove it from its current position
    content = content.replace(backupBtn, '');
    
    // Insert it before the Theme Switcher (which has marginTop: "auto")
    content = content.replace('{/* ── Theme Switcher ── */}', backupBtn + '\n        {/* ── Theme Switcher ── */}');
    
    fs.writeFileSync(filePath, content);
    console.log("Successfully moved backup button above theme switcher.");
} else {
    console.log("Could not find backup button block.");
}
