const fs = require('fs');
const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// Update the container
content = content.replace(
    /gap: '10px', padding: '0 16px 24px'/g,
    "gap: '12px', padding: '0 16px 28px'"
);

// Update SVG size
content = content.replace(
    /width: '32px', height: '32px'/g,
    "width: '40px', height: '40px'"
);

// Update gap in inner div
content = content.replace(
    /gap: '10px', minWidth: 0/g,
    "gap: '12px', minWidth: 0"
);

// Update MIGUEL VIRGÍLIO font size
content = content.replace(
    /fontSize: '11px', fontWeight: 800, letterSpacing: '0.2px'/g,
    "fontSize: '13px', fontWeight: 800, letterSpacing: '0.2px'"
);

// Update STUDIO font size and letter spacing
content = content.replace(
    /fontSize: '9px', fontWeight: 700, letterSpacing: '2.5px'/g,
    "fontSize: '10px', fontWeight: 700, letterSpacing: '3px'"
);

fs.writeFileSync(path, content);
console.log('Scale up complete');
