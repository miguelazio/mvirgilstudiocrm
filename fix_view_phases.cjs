const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

content = content.replace(
  'function ProjectTypesModal({ t, lang, onClose }) {',
  'function ProjectTypesModal({ t, lang, onClose, setModal }) {'
);

content = content.replace(
  '<button className="btn btn-ghost btn-sm" onClick={() => seedPhases(type.key)}>View Phases</button>',
  '<button className="btn btn-ghost btn-sm" onClick={() => setModal({ type: "manage_phases", data: type.key })}>View Phases</button>'
);

content = content.replace(
  'function ProjectPhasesModal({ t, lang, onClose }) {',
  'function ProjectPhasesModal({ t, lang, onClose, initialType }) {'
);

content = content.replace(
  'const [selectedType, setSelectedType] = React.useState(DEFAULT_PROJECT_TYPES[0]?.key || \'\');',
  'const [selectedType, setSelectedType] = React.useState(initialType || DEFAULT_PROJECT_TYPES[0]?.key || \'\');'
);

content = content.replace(
  '{modal.type === "manage_project_types" && <ProjectTypesModal t={t} lang={lang} onClose={() => setModal(null)} />}',
  '{modal.type === "manage_project_types" && <ProjectTypesModal t={t} lang={lang} onClose={() => setModal(null)} setModal={setModal} />}'
);

content = content.replace(
  '{modal.type === "manage_phases" && <ProjectPhasesModal t={t} lang={lang} onClose={() => setModal(null)} />}',
  '{modal.type === "manage_phases" && <ProjectPhasesModal t={t} lang={lang} onClose={() => setModal(null)} initialType={modal.data} />}'
);

fs.writeFileSync('src/App.jsx', content);
console.log('Fixed View Phases button mapping');
