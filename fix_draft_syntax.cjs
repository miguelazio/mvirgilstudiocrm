const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove the extra closing brace at line 1009
content = content.replace('            )}\n\n            <div className="filters">', '            <div className="filters">');

// 2. Fix the nested ternary logic around line 1080
// Current:
// ) : (
//
// {viewMode === "table" ? (
//
// Should be:
// ) : viewMode === "table" ? (

content = content.replace(') : (\n\n            {viewMode === "table" ? (', ') : viewMode === "table" ? (');

// 3. Fix the closing of the ternary at the end of the pipeline section.
// The original code had:
//   </div>
// )}
// I need to make sure it now ends with ) : (
//   // Kanban view content
// ))}
// I'll search for the end of the pipeline section.
// It ends with the </div> of the kanban view.

// Actually, I'll just rewrite the whole pipeline return block to be safe.
// This is too fragile with regex.

fs.writeFileSync(filePath, content);
console.log("Applied manual syntax fixes to App.jsx.");
