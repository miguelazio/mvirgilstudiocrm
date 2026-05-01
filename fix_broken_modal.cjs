const fs = require('fs');
const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

const newFunction = `function ProjectTypesModal({ t, lang, dbProjectTypes, dbProjectPhases, onReload, setModal, onClose }) {
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
      {lang === 'pt' ? "Gerir os tipos de projetos disponíveis e as suas etapas." : "Manage available project types and their phases."}
    </p>

    <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: "50vh", overflowY: "auto", paddingRight: 5 }}>
      {types.map((pt, i) => {
        const phaseCount = dbProjectPhases.filter(ph => ph.project_type === pt.key).length;
        return (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", background: "var(--surface)", padding: 8, borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 9, color: "var(--muted)" }}>KEY</label>
              <input className="form-input" style={{ fontSize: 12, height: 26 }} value={pt.key} onChange={e => {
                const updated = [...types]; updated[i] = {...updated[i], key: e.target.value}; setTypes(updated);
              }} />
            </div>
            <div style={{ flex: 1.5 }}>
              <label style={{ fontSize: 9, color: "var(--muted)" }}>LABEL (EN/PT)</label>
              <div style={{ display: 'flex', gap: 4 }}>
                <input className="form-input" style={{ fontSize: 11, height: 24 }} value={pt.label_en} onChange={e => {
                  const updated = [...types]; updated[i] = {...updated[i], label_en: e.target.value}; setTypes(updated);
                }} />
                <input className="form-input" style={{ fontSize: 11, height: 24 }} value={pt.label_pt} onChange={e => {
                  const updated = [...types]; updated[i] = {...updated[i], label_pt: e.target.value}; setTypes(updated);
                }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 80 }}>
              <span style={{ fontSize: 10, color: "var(--muted)" }}>{phaseCount} {lang === 'pt' ? 'Etapas' : 'Phases'}</span>
              <button className="btn btn-ghost" style={{ fontSize: 9, padding: '2px 4px', height: 'auto', marginTop: 2, color: 'var(--accent)' }} onClick={() => setModal({ type: 'manage_phases', data: null })}>
                {lang === 'pt' ? 'Gerir' : 'Manage'}
              </button>
            </div>
            <button className="btn btn-ghost" style={{ color: "var(--danger)", padding: "4px 8px" }} onClick={() => deleteType(pt.id, i)}>✕</button>
          </div>
        );
      })}
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

// Find where ProjectTypesModal starts
const startIndex = content.indexOf('function ProjectTypesModal');
if (startIndex !== -1) {
  content = content.substring(0, startIndex) + newFunction;
  fs.writeFileSync(path, content, 'utf8');
  console.log('Fixed ProjectTypesModal');
} else {
  console.log('Could not find ProjectTypesModal to fix');
}
