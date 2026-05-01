const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// Find the block from "// ── Predefined Project Types and Phases" up to the end of SEEDED_PHASES object
const startPattern = '// ── Predefined Project Types and Phases';
const endPattern = '  ]\n};\n';

const startIdx = content.indexOf(startPattern);
if (startIdx !== -1) {
  const endIdx = content.indexOf(endPattern, startIdx);
  if (endIdx !== -1) {
    const fullEnd = endIdx + endPattern.length;
    const block = content.slice(startIdx, fullEnd);
    
    // Remove it from current location
    content = content.slice(0, startIdx) + content.slice(fullEnd);
    
    // Insert after fonts/imports (after const T = ...)
    const insertAnchor = 'const T = {';
    const insertIdx = content.indexOf(insertAnchor);
    if (insertIdx !== -1) {
      content = content.slice(0, insertIdx) + block + '\n\n' + content.slice(insertIdx);
      fs.writeFileSync('src/App.jsx', content);
      console.log('Fixed! Moved constants to top.');
    } else {
      console.log('Error: Could not find insert anchor.');
    }
  } else {
    console.log('Error: Could not find end of constants block.');
  }
} else {
  console.log('Error: Could not find start of constants block.');
}
