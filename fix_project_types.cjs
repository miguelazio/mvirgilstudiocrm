const fs = require('fs');
const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');
const N = '\r\n'; // Using \r\n as we found earlier

// 1. i18n
content = content.replace(
  'manage_project_phases: "Manage Phases",',
  'manage_project_phases: "Manage Phases", manage_project_types: "Manage Project Types",'
);
content = content.replace(
  'manage_project_phases: "Gerir Etapas",',
  'manage_project_phases: "Gerir Etapas", manage_project_types: "Gerir Tipos de Projeto",'
);

// 2. Add State and Reload
const stateStr = `  const [dbProjectPhases, setDbProjectPhases] = useState([]);`;
const newStateStr = `  const [dbProjectPhases, setDbProjectPhases] = useState([]);
  const [dbProjectTypes, setDbProjectTypes] = useState(DEFAULT_PROJECT_TYPES);`;
if (content.includes(stateStr)) {
  content = content.replace(stateStr, newStateStr);
}

const loadDataStr = `      supabase.from('global_project_phases').select('*').order('sort_order').then(({ data, error }) => { if (!error && data) setDbProjectPhases(data.map(d => ({ ...d, project_type: d.project_type || 'VFX' }))) });`;
const newLoadDataStr = `      supabase.from('global_project_phases').select('*').order('sort_order').then(({ data, error }) => { if (!error && data) setDbProjectPhases(data.map(d => ({ ...d, project_type: d.project_type || 'VFX' }))) });
      supabase.from('project_types').select('*').then(({ data, error }) => { if (!error && data && data.length > 0) setDbProjectTypes(data) });`;
if (content.includes(loadDataStr)) {
  content = content.replace(loadDataStr, newLoadDataStr);
}

const reloadPhasesStr = `  const reloadProjectPhases = async () => {`;
const newReloadTypesStr = `  const reloadProjectTypes = async () => {
    const { data } = await supabase.from('project_types').select('*');
    if (data && data.length > 0) setDbProjectTypes(data);
  };

  const reloadProjectPhases = async () => {`;
if (content.includes(reloadPhasesStr)) {
  content = content.replace(reloadPhasesStr, newReloadTypesStr);
}

// 3. Update button
const managePhasesBtn = `<button className="btn btn-ghost btn-sm" onClick={() => setModal({ type: "manage_phases", data: null })}>{t.manage_project_phases}</button>`;
const newButtons = `<button className="btn btn-ghost btn-sm" onClick={() => setModal({ type: "manage_project_types", data: null })}>{t.manage_project_types}</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setModal({ type: "manage_phases", data: null })}>{t.manage_project_phases}</button>`;
if (content.includes(managePhasesBtn)) {
  content = content.replace(managePhasesBtn, newButtons);
}

// 4. Project Card Types
content = content.replace(
  'const typeObj = DEFAULT_PROJECT_TYPES.find(t2 => t2.key === pType);',
  'const typeObj = dbProjectTypes.find(t2 => t2.key === pType);'
);

// 5. Update Modal calls
const projModalCall = `<ProjectModal t={t} lang={lang} data={modal.data} partners={partners} softwareCatalog={softwareCatalog} dbProjectPhases={dbProjectPhases} onSave={saveProject} onClose={() => setModal(null)} />`;
const newProjModalCall = `<ProjectModal t={t} lang={lang} data={modal.data} partners={partners} softwareCatalog={softwareCatalog} dbProjectPhases={dbProjectPhases} dbProjectTypes={dbProjectTypes} onSave={saveProject} onClose={() => setModal(null)} />`;
if (content.includes(projModalCall)) {
  content = content.replace(projModalCall, newProjModalCall);
}

const projPhasesModalCall = `{modal.type === "manage_phases" && <ProjectPhasesModal t={t} lang={lang} dbProjectPhases={dbProjectPhases} onReload={reloadProjectPhases} onClose={() => setModal(null)} />}`;
const newModalsCall = `{modal.type === "manage_phases" && <ProjectPhasesModal t={t} lang={lang} dbProjectPhases={dbProjectPhases} dbProjectTypes={dbProjectTypes} onReload={reloadProjectPhases} onClose={() => setModal(null)} />}
            {modal.type === "manage_project_types" && <ProjectTypesModal t={t} lang={lang} dbProjectTypes={dbProjectTypes} onReload={reloadProjectTypes} onClose={() => setModal(null)} />}`;
if (content.includes(projPhasesModalCall)) {
  content = content.replace(projPhasesModalCall, newModalsCall);
}

// 6. ProjectModal signature and implementation
content = content.replace(
  'function ProjectModal({ t, lang, data, partners, softwareCatalog, dbProjectPhases, onSave, onClose })',
  'function ProjectModal({ t, lang, data, partners, softwareCatalog, dbProjectPhases, dbProjectTypes, onSave, onClose })'
);
content = content.replace(
  `{DEFAULT_PROJECT_TYPES.map(pt => <option key={pt.key} value={pt.key}>{lang === 'pt' ? pt.label_pt : pt.label_en}</option>)}`,
  `{dbProjectTypes.map(pt => <option key={pt.key} value={pt.key}>{lang === 'pt' ? pt.label_pt : pt.label_en}</option>)}`
);

// 7. ProjectPhasesModal signature and implementation
content = content.replace(
  'function ProjectPhasesModal({ t, lang, dbProjectPhases, onReload, onClose }) {',
  'function ProjectPhasesModal({ t, lang, dbProjectPhases, dbProjectTypes, onReload, onClose }) {'
);
content = content.replace(
  `{DEFAULT_PROJECT_TYPES.map(pt => <option key={pt.key} value={pt.key}>{lang === 'pt' ? pt.label_pt : pt.label_en}</option>)}`,
  `{dbProjectTypes.map(pt => <option key={pt.key} value={pt.key}>{lang === 'pt' ? pt.label_pt : pt.label_en}</option>)}`
);

// 8. Add ProjectTypesModal
const typesModalCode = `
function ProjectTypesModal({ t, lang, dbProjectTypes, onReload, onClose }) {
  const [types, setTypes] = useState(dbProjectTypes || []);
  const [loading, setLoading] = useState(false);

  const saveAll = async () => {
    setLoading(true);
    try {
      for (let i = 0; i < types.length; i++) {
        const pt = types[i];
        const payload = { key: pt.key, label_en: pt.label_en, label_pt: pt.label_pt };
        if (pt.id) {
          await supabase.from('project_types').update(payload).eq('id', pt.id);
        } else {
          await supabase.from('project_types').insert([payload]);
        }
      }
      await onReload();
      onClose();
    } catch (e) {
      alert("Error saving project types: " + e.message + "\\n\\nPlease ensure you have created the project_types table in Supabase.");
    }
    setLoading(false);
  };

  const deleteType = async (id, index) => {
    if (id) {
      const { error } = await supabase.from('project_types').delete().eq('id', id);
      if (error) {
        alert("Error deleting: " + error.message);
        return;
      }
    }
    setTypes(types.filter((_, i) => i !== index));
  };

  const addType = () => {
    setTypes([...types, { key: 'NewType', label_en: 'New Type', label_pt: 'Novo Tipo' }]);
  };

  return <>
    <div className="modal-title">{t.manage_project_types}</div>
    <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>
      {lang === 'pt' ? "Gerir os tipos de projetos disponíveis." : "Manage available project types."}
    </p>

    <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: "50vh", overflowY: "auto", paddingRight: 5 }}>
      {types.map((pt, i) => (
        <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", background: "var(--surface)", padding: 8, borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 9, color: "var(--muted)" }}>KEY (Internal)</label>
            <input className="form-input" style={{ fontSize: 12, height: 26 }} value={pt.key} onChange={e => {
              const updated = [...types]; updated[i] = {...updated[i], key: e.target.value}; setTypes(updated);
            }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 9, color: "var(--muted)" }}>EN</label>
            <input className="form-input" style={{ fontSize: 12, height: 26 }} value={pt.label_en} onChange={e => {
              const updated = [...types]; updated[i] = {...updated[i], label_en: e.target.value}; setTypes(updated);
            }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 9, color: "var(--muted)" }}>PT</label>
            <input className="form-input" style={{ fontSize: 12, height: 26 }} value={pt.label_pt} onChange={e => {
              const updated = [...types]; updated[i] = {...updated[i], label_pt: e.target.value}; setTypes(updated);
            }} />
          </div>
          <button className="btn btn-ghost" style={{ color: "var(--danger)", padding: "4px 8px", marginTop: 14 }} onClick={() => deleteType(pt.id, i)}>✕</button>
        </div>
      ))}
    </div>

    <button className="btn btn-ghost" style={{ width: "100%", marginTop: 12, border: "1px dashed var(--border)" }} onClick={addType}>
      + {lang === 'pt' ? "Adicionar Tipo" : "Add Type"}
    </button>

    <div className="modal-footer" style={{ marginTop: 24 }}>
      <button className="btn btn-ghost" onClick={onClose} disabled={loading}>{t.cancel}</button>
      <button className="btn btn-primary" onClick={saveAll} disabled={loading}>{loading ? '...' : t.save}</button>
    </div>
  </>;
}
`;

content += typesModalCode.split('\n').join(N);

fs.writeFileSync(path, content, 'utf8');
console.log('Project Types update applied successfully.');
