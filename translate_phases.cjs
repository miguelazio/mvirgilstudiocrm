const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add keys to T.en
const enKeys = `    none: "None",
    manage_types_phases: "Manage Project Types & Phases",
    lbl_project_types: "Project Types",
    lbl_manage_phases: "Manage Phases",
`;
content = content.replace('    none: "None",', enKeys);

// Add keys to T.pt
const ptKeys = `    none: "Nenhum",
    manage_types_phases: "Gerir Tipos e Etapas de Projeto",
    lbl_project_types: "Tipos de Projeto",
    lbl_manage_phases: "Gerir Etapas",
`;
// Find end of pt object (it ends before "  },")
// Wait, I need to be careful with where it ends.
// Let's find the line before the closing brace of pt.
content = content.replace(/lbl_company_studio: \"Empresa \/ Estúdio\"[\s\S]*?\},/, (match) => {
    return match.replace('},', ptKeys + '  },');
});

// Update ProjectTypesManagerModal title
content = content.replace('<div className="modal-title">Manage Project Types & Phases</div>', '<div className="modal-title">{t.manage_types_phases}</div>');

// Update tabs in ProjectTypesManagerModal
content = content.replace("'>Project Types</button>", "'>{t.lbl_project_types}</button>");
content = content.replace("'>Manage Phases</button>", "'>{t.lbl_manage_phases}</button>");

fs.writeFileSync(filePath, content);
console.log("Successfully translated Project Types & Phases manager.");
