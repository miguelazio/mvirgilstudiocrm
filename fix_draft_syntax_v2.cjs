const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove the extra closing brace at line 1009
content = content.replace(/\n\s*\}\)\;\s*\}\)\;\n\s*\<div className=\"filters\"\>/, '\n\n            <div className="filters">');
// Try a simpler replace if that fails
content = content.replace('            )}\n            )}\n\n            <div className="filters">', '            <div className="filters">');
// Even simpler
content = content.replace('            )}\n            )}', '            )}');

// 2. Fix nested ternary
content = content.replace(') : (\n\n            {viewMode === "table" ? (', ') : viewMode === "table" ? (');

fs.writeFileSync(filePath, content);
console.log("Applied more aggressive manual syntax fixes to App.jsx.");
