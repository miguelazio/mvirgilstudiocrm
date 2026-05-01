const fs = require('fs');
const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// Update prop passing in App.jsx
content = content.replace(
  'onReload={reloadProjectTypes} setModal={setModal}',
  'onReload={reloadProjectTypes} reloadPhases={reloadProjectPhases} setModal={setModal}'
);

// Update function signature
content = content.replace(
  'function ProjectTypesModal({ t, lang, dbProjectTypes, dbProjectPhases, onReload, setModal, onClose })',
  'function ProjectTypesModal({ t, lang, dbProjectTypes, dbProjectPhases, onReload, reloadPhases, setModal, onClose })'
);

fs.writeFileSync(path, content, 'utf8');
console.log('ProjectTypesModal props updated to include reloadPhases');
