const fs = require('fs');
const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Update state initialization to load from Supabase instead of localStorage
const oldStateInit = `  const [customProjectTypes, setCustomProjectTypes] = React.useState(() => {
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
  }, [customProjectPhases]);`;

const newStateInit = `  const [customProjectTypes, setCustomProjectTypes] = React.useState([...DEFAULT_PROJECT_TYPES]);
  const [customProjectPhases, setCustomProjectPhases] = React.useState({ ...DEFAULT_PROJECT_PHASES });

  React.useEffect(() => {
    if (!session) return;
    supabase.from('project_types').select('*').then(({ data, error }) => {
      if (!error && data && data.length > 0) {
        setCustomProjectTypes(data.map(d => d.key));
        const phasesObj = {};
        data.forEach(d => { phasesObj[d.key] = d.phases || []; });
        setCustomProjectPhases(phasesObj);
      }
    });
  }, [session]);`;

if (content.includes(oldStateInit)) {
  content = content.replace(oldStateInit, newStateInit);
} else {
  console.log("Could not find oldStateInit block.");
}

// 2. Replace ProjectTypesManagerModal to include DB sync
const oldManagerModalRegex = /function ProjectTypesManagerModal\(\{ t, lang, customProjectTypes, setCustomProjectTypes, customProjectPhases, setCustomProjectPhases, onClose \}\) \{[\s\S]*?return <>[\s\S]*?<\/>;\n\}/;

const newManagerModal = `function ProjectTypesManagerModal({ t, lang, customProjectTypes, setCustomProjectTypes, customProjectPhases, setCustomProjectPhases, onClose }) {
  const [activeTab, setActiveTab] = React.useState('types');
  const [newType, setNewType] = React.useState("");
  const [selectedType, setSelectedType] = React.useState(customProjectTypes[0] || "");
  const [newPhase, setNewPhase] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const addType = async () => {
    const typeKey = newType.trim();
    if (typeKey && !customProjectTypes.includes(typeKey)) {
      setLoading(true);
      const phases = ["Concept", "Delivery"];
      
      const { error } = await supabase.from('project_types').insert([{ key: typeKey, label_en: typeKey, label_pt: typeKey, phases }]);
      
      if (!error) {
        setCustomProjectTypes([...customProjectTypes, typeKey]);
        setCustomProjectPhases({ ...customProjectPhases, [typeKey]: phases });
        setNewType("");
      } else {
        alert("Supabase Error: " + error.message);
      }
      setLoading(false);
    }
  };

  const deleteType = async (type) => {
    if (window.confirm("Delete project type: " + type + "?")) {
      setLoading(true);
      const { error } = await supabase.from('project_types').delete().eq('key', type);
      
      if (!error) {
        setCustomProjectTypes(customProjectTypes.filter(t => t !== type));
        const newPhases = { ...customProjectPhases };
        delete newPhases[type];
        setCustomProjectPhases(newPhases);
        if (selectedType === type) setSelectedType(customProjectTypes.find(t => t !== type) || "");
      } else {
        alert("Supabase Error: " + error.message);
      }
      setLoading(false);
    }
  };

  const addPhase = async () => {
    if (newPhase.trim() && selectedType) {
      setLoading(true);
      const phases = customProjectPhases[selectedType] || [];
      const updatedPhases = [...phases, newPhase.trim()];
      
      const { error } = await supabase.from('project_types').update({ phases: updatedPhases }).eq('key', selectedType);
      
      if (!error) {
        setCustomProjectPhases({ ...customProjectPhases, [selectedType]: updatedPhases });
        setNewPhase("");
      } else {
        alert("Supabase Error: " + error.message);
      }
      setLoading(false);
    }
  };

  const deletePhase = async (idx) => {
    if (selectedType) {
      setLoading(true);
      const phases = [...(customProjectPhases[selectedType] || [])];
      phases.splice(idx, 1);
      
      const { error } = await supabase.from('project_types').update({ phases }).eq('key', selectedType);
      
      if (!error) {
        setCustomProjectPhases({ ...customProjectPhases, [selectedType]: phases });
      } else {
        alert("Supabase Error: " + error.message);
      }
      setLoading(false);
    }
  };

  const movePhase = async (idx, dir) => {
    if (!selectedType) return;
    const phases = [...(customProjectPhases[selectedType] || [])];
    if (idx + dir < 0 || idx + dir >= phases.length) return;
    const temp = phases[idx];
    phases[idx] = phases[idx + dir];
    phases[idx + dir] = temp;
    
    setLoading(true);
    const { error } = await supabase.from('project_types').update({ phases }).eq('key', selectedType);
    
    if (!error) {
      setCustomProjectPhases({ ...customProjectPhases, [selectedType]: phases });
    } else {
      alert("Supabase Error: " + error.message);
    }
    setLoading(false);
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
          <input className="form-input" placeholder="New Project Type..." value={newType} onChange={e => setNewType(e.target.value)} onKeyDown={e => e.key === 'Enter' && addType()} disabled={loading} />
          <button className="btn btn-primary" onClick={addType} disabled={loading}>{loading ? '...' : 'Add'}</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: "40vh", overflowY: "auto" }}>
          {customProjectTypes.map(type => (
            <div key={type} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface)", padding: "8px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
              <span>{type}</span>
              <button className="btn btn-ghost btn-sm" style={{ color: "var(--danger)" }} onClick={() => deleteType(type)} disabled={loading}>✕</button>
            </div>
          ))}
        </div>
      </div>
    )}

    {activeTab === 'phases' && (
      <div>
        <div className="form-group">
          <label className="form-label">Select Project Type</label>
          <select className="form-select" value={selectedType} onChange={e => setSelectedType(e.target.value)} disabled={loading}>
            {customProjectTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        
        {selectedType && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input className="form-input" placeholder="New Phase Name..." value={newPhase} onChange={e => setNewPhase(e.target.value)} onKeyDown={e => e.key === 'Enter' && addPhase()} disabled={loading} />
              <button className="btn btn-primary" onClick={addPhase} disabled={loading}>{loading ? '...' : 'Add Phase'}</button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: "35vh", overflowY: "auto" }}>
              {(customProjectPhases[selectedType] || []).map((phase, idx, arr) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface)", padding: "8px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 10, color: "var(--muted)", fontWeight: "bold" }}>{idx + 1}</span>
                    <span>{phase}</span>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="btn btn-ghost btn-sm" disabled={idx === 0 || loading} onClick={() => movePhase(idx, -1)}>↑</button>
                    <button className="btn btn-ghost btn-sm" disabled={idx === arr.length - 1 || loading} onClick={() => movePhase(idx, 1)}>↓</button>
                    <button className="btn btn-ghost btn-sm" style={{ color: "var(--danger)" }} onClick={() => deletePhase(idx)} disabled={loading}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )}

    <div className="modal-footer" style={{ marginTop: 24 }}>
      <button className="btn btn-ghost" onClick={onClose} disabled={loading}>{t.cancel || "Close"}</button>
    </div>
  </>;
}`;

content = content.replace(oldManagerModalRegex, newManagerModal);

fs.writeFileSync(path, content, 'utf8');
console.log('App.jsx synced for Supabase storage');
