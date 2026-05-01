const fs = require('fs');
const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

const constants = `
const DEFAULT_PROJECT_TYPES = [
  "ArchViz",
  "VFX",
  "Interactive Application",
  "Interactive Webpages",
  "Immersive Projects",
  "3D Generalist"
];

const DEFAULT_PROJECT_PHASES = {
  "ArchViz": ["Modeling/Import", "Materials/Shading", "Lighting", "Rendering", "Post-Production/Compositing"],
  "VFX": ["Matchmove/Tracking", "Rotoscopy", "Modeling/Animation", "FX/Simulation", "Lighting/Rendering", "Compositing"],
  "Interactive Application": ["UI/UX Design", "Core Logic/Mechanics", "Asset Integration", "Optimization", "Testing/QA", "Deployment"],
  "Interactive Webpages": ["Wireframing", "Design/UI", "Frontend Dev", "WebGL/3D Integration", "Responsive Testing", "Launch"],
  "Immersive Projects": ["Concept/Storyboarding", "Prototyping", "Asset Creation", "Engine Implementation", "User Testing", "Final Polish"],
  "3D Generalist": ["Concept", "Modeling", "Rigging/Animation", "Texturing/Shading", "Lighting", "Rendering"]
};
`;

content = content.replace(
  'const SOFTWARE_CATEGORIES = ["dcc", "sculpt", "tex", "track", "light", "comp", "ai", "mgmt", "other"];',
  'const SOFTWARE_CATEGORIES = ["dcc", "sculpt", "tex", "track", "light", "comp", "ai", "mgmt", "other"];\n' + constants
);

const stateInit = `
  const [customProjectTypes, setCustomProjectTypes] = React.useState(() => {
    try {
      const saved = localStorage.getItem("crm_custom_project_types");
      return saved ? JSON.parse(saved) : [...DEFAULT_PROJECT_TYPES];
    } catch { return [...DEFAULT_PROJECT_TYPES]; }
  });
  const [customProjectPhases, setCustomProjectPhases] = React.useState(() => {
    try {
      const saved = localStorage.getItem("crm_custom_project_phases");
      return saved ? JSON.parse(saved) : { ...DEFAULT_PROJECT_PHASES };
    } catch { return { ...DEFAULT_PROJECT_PHASES }; }
  });

  React.useEffect(() => {
    localStorage.setItem("crm_custom_project_types", JSON.stringify(customProjectTypes));
  }, [customProjectTypes]);

  React.useEffect(() => {
    localStorage.setItem("crm_custom_project_phases", JSON.stringify(customProjectPhases));
  }, [customProjectPhases]);
`;

content = content.replace(
  'const [projects, setProjects] = React.useState([]);',
  'const [projects, setProjects] = React.useState([]);\n' + stateInit
);

content = content.replace(
  '{tab === "projects" && <button className="btn btn-primary btn-sm" onClick={() => setModal({ type: "project", data: null })}>{t.new_project}</button>}',
  `{tab === "projects" && <>
              <button className="btn btn-ghost btn-sm" onClick={() => setModal({ type: "manage_project_types", data: null })}>Manage Types & Phases</button>
              <button className="btn btn-primary btn-sm" onClick={() => setModal({ type: "project", data: null })}>{t.new_project}</button>
            </>}`
);

content = content.replace(
  '{modal.type === "project" && <ProjectModal t={t} lang={lang} data={modal.data} partners={partners} softwareCatalog={softwareCatalog} onSave={saveProject} onClose={() => setModal(null)} />}',
  '{modal.type === "project" && <ProjectModal t={t} lang={lang} data={modal.data} partners={partners} softwareCatalog={softwareCatalog} customProjectTypes={customProjectTypes} customProjectPhases={customProjectPhases} onSave={saveProject} onClose={() => setModal(null)} />}'
);

content = content.replace(
  '{modal.type === "vault_categories" && <VaultCategoriesModal t={t} dbVaultCategories={dbVaultCategories} onReload={reloadVaultCategories} onClose={() => setModal(null)} />}',
  `{modal.type === "vault_categories" && <VaultCategoriesModal t={t} dbVaultCategories={dbVaultCategories} onReload={reloadVaultCategories} onClose={() => setModal(null)} />}
            {modal.type === "manage_project_types" && <ProjectTypesManagerModal t={t} lang={lang} customProjectTypes={customProjectTypes} setCustomProjectTypes={setCustomProjectTypes} customProjectPhases={customProjectPhases} setCustomProjectPhases={setCustomProjectPhases} onClose={() => setModal(null)} />}`
);

content = content.replace(
  'function ProjectModal({ t, lang, data, partners, softwareCatalog, onSave, onClose }) {',
  'function ProjectModal({ t, lang, data, partners, softwareCatalog, customProjectTypes, customProjectPhases, onSave, onClose }) {'
);

const newProjectModalRow = `<div className="form-row">
      <div className="form-group"><label className="form-label">{t.lbl_proj_name}</label><input className="form-input" value={f.name} onChange={e => s("name", e.target.value)} /></div>
      <div className="form-group"><label className="form-label">{t.lbl_client}</label><input className="form-input" value={f.client} onChange={e => s("client", e.target.value)} /></div>
      <div className="form-group">
        <label className="form-label">Project Type</label>
        <select className="form-select" onChange={e => {
          const type = e.target.value;
          if (type && customProjectPhases[type]) {
            s("customPhases", customProjectPhases[type]);
          }
        }}>
          <option value="">Select a Type...</option>
          {customProjectTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
    </div>`;

// Replace the ProjectName / Client row which might span multiple lines with \r\n or \n
const regexRow = /<div className="form-row">\s*<div className="form-group"><label className="form-label">\{t\.lbl_proj_name\}<\/label><input className="form-input" value=\{f\.name\} onChange=\{e => s\("name", e\.target\.value\)\} \/><\/div>\s*<div className="form-group"><label className="form-label">\{t\.lbl_client\}<\/label><input className="form-input" value=\{f\.client\} onChange=\{e => s\("client", e\.target\.value\)\} \/><\/div>\s*<\/div>/;
content = content.replace(regexRow, newProjectModalRow);

const managerModalCode = `
function ProjectTypesManagerModal({ t, lang, customProjectTypes, setCustomProjectTypes, customProjectPhases, setCustomProjectPhases, onClose }) {
  const [activeTab, setActiveTab] = React.useState('types');
  const [newType, setNewType] = React.useState("");
  const [selectedType, setSelectedType] = React.useState(customProjectTypes[0] || "");
  const [newPhase, setNewPhase] = React.useState("");

  const addType = () => {
    if (newType.trim() && !customProjectTypes.includes(newType.trim())) {
      setCustomProjectTypes([...customProjectTypes, newType.trim()]);
      setCustomProjectPhases({ ...customProjectPhases, [newType.trim()]: ["Concept", "Delivery"] });
      setNewType("");
    }
  };

  const deleteType = (type) => {
    if (window.confirm("Delete project type: " + type + "?")) {
      setCustomProjectTypes(customProjectTypes.filter(t => t !== type));
      const newPhases = { ...customProjectPhases };
      delete newPhases[type];
      setCustomProjectPhases(newPhases);
      if (selectedType === type) setSelectedType(customProjectTypes.find(t => t !== type) || "");
    }
  };

  const addPhase = () => {
    if (newPhase.trim() && selectedType) {
      const phases = customProjectPhases[selectedType] || [];
      setCustomProjectPhases({ ...customProjectPhases, [selectedType]: [...phases, newPhase.trim()] });
      setNewPhase("");
    }
  };

  const deletePhase = (idx) => {
    if (selectedType) {
      const phases = [...(customProjectPhases[selectedType] || [])];
      phases.splice(idx, 1);
      setCustomProjectPhases({ ...customProjectPhases, [selectedType]: phases });
    }
  };

  const movePhase = (idx, dir) => {
    if (!selectedType) return;
    const phases = [...(customProjectPhases[selectedType] || [])];
    if (idx + dir < 0 || idx + dir >= phases.length) return;
    const temp = phases[idx];
    phases[idx] = phases[idx + dir];
    phases[idx + dir] = temp;
    setCustomProjectPhases({ ...customProjectPhases, [selectedType]: phases });
  };

  return <>
    <div className="modal-title">Manage Project Types & Phases</div>
    <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
      <button className={\`btn btn-sm \${activeTab === 'types' ? 'btn-primary' : 'btn-ghost'}\`} onClick={() => setActiveTab('types')}>Project Types</button>
      <button className={\`btn btn-sm \${activeTab === 'phases' ? 'btn-primary' : 'btn-ghost'}\`} onClick={() => setActiveTab('phases')}>Manage Phases</button>
    </div>

    {activeTab === 'types' && (
      <div>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input className="form-input" placeholder="New Project Type..." value={newType} onChange={e => setNewType(e.target.value)} onKeyDown={e => e.key === 'Enter' && addType()} />
          <button className="btn btn-primary" onClick={addType}>Add</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: "40vh", overflowY: "auto" }}>
          {customProjectTypes.map(type => (
            <div key={type} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface)", padding: "8px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
              <span>{type}</span>
              <button className="btn btn-ghost btn-sm" style={{ color: "var(--danger)" }} onClick={() => deleteType(type)}>✕</button>
            </div>
          ))}
        </div>
      </div>
    )}

    {activeTab === 'phases' && (
      <div>
        <div className="form-group">
          <label className="form-label">Select Project Type</label>
          <select className="form-select" value={selectedType} onChange={e => setSelectedType(e.target.value)}>
            {customProjectTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        
        {selectedType && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input className="form-input" placeholder="New Phase Name..." value={newPhase} onChange={e => setNewPhase(e.target.value)} onKeyDown={e => e.key === 'Enter' && addPhase()} />
              <button className="btn btn-primary" onClick={addPhase}>Add Phase</button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: "35vh", overflowY: "auto" }}>
              {(customProjectPhases[selectedType] || []).map((phase, idx, arr) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface)", padding: "8px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 10, color: "var(--muted)", fontWeight: "bold" }}>{idx + 1}</span>
                    <span>{phase}</span>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="btn btn-ghost btn-sm" disabled={idx === 0} onClick={() => movePhase(idx, -1)}>↑</button>
                    <button className="btn btn-ghost btn-sm" disabled={idx === arr.length - 1} onClick={() => movePhase(idx, 1)}>↓</button>
                    <button className="btn btn-ghost btn-sm" style={{ color: "var(--danger)" }} onClick={() => deletePhase(idx)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )}

    <div className="modal-footer" style={{ marginTop: 24 }}>
      <button className="btn btn-ghost" onClick={onClose}>{t.cancel || "Close"}</button>
    </div>
  </>;
}
`;

content += '\n' + managerModalCode;

fs.writeFileSync(path, content, 'utf8');
console.log('Done.');
