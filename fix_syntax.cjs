const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Fix the corrupted vault_categories line and the broken pt object
content = content.replace(/vault_categories: \{ [\s\S]*?Other: "Outros"[\s\S]*?none: "Nenhum"/, 
    'vault_categories: { Boilerplates: "Boilerplates", MoneyShots: "Money Shots", CaseStudies: "Estudos de Caso", Contracts: "Contratos", Renders: "Renders", References: "Referências", Other: "Outros" },\n    none: "Nenhum"');

// Ensure the closing of pt object is clean
// I'll search for the messed up structure and fix it.
content = content.replace(/lbl_manage_phases: "Gerir Etapas",\s*\},\s*\},/, 'lbl_manage_phases: "Gerir Etapas",\n  },');

fs.writeFileSync(filePath, content);
console.log("Fixed syntax error in App.jsx.");
