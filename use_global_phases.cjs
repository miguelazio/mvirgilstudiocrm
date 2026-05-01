const fs = require('fs');
const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Update useEffect to fetch phases from global_project_phases instead of project_types jsonb
const oldEffect = `  React.useEffect(() => {
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

const newEffect = `  React.useEffect(() => {
    if (!session) return;
    
    // Load Types
    supabase.from('project_types').select('*').then(({ data, error }) => {
      if (!error && data && data.length > 0) {
        setCustomProjectTypes(data.map(d => d.key));
      }
    });

    // Load Phases from global_project_phases
    supabase.from('global_project_phases').select('*').order('sort_order', { ascending: true }).then(({ data, error }) => {
      if (!error && data) {
        const phasesObj = {};
        data.forEach(d => {
          const type = d.project_type || 'VFX';
          if (!phasesObj[type]) phasesObj[type] = [];
          phasesObj[type].push(d.label_en);
        });
        setCustomProjectPhases(phasesObj);
      }
    });
  }, [session]);`;

if (content.includes(oldEffect)) {
    content = content.replace(oldEffect, newEffect);
}

// 2. Update ProjectTypesManagerModal to sync with global_project_phases
// We need to rewrite addType, addPhase, deletePhase, and movePhase inside the modal.

const oldManagerModalStart = `function ProjectTypesManagerModal({ t, lang, customProjectTypes, setCustomProjectTypes, customProjectPhases, setCustomProjectPhases, onClose }) {`;
const oldManagerModalEnd = `    <div className="modal-footer" style={{ marginTop: 24 }}>
      <button className="btn btn-ghost" onClick={onClose} disabled={loading}>{t.cancel || "Close"}</button>
    </div>
  </>;
}`;

const newManagerModalCode = `function ProjectTypesManagerModal({ t, lang, customProjectTypes, setCustomProjectTypes, customProjectPhases, setCustomProjectPhases, onClose }) {
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
      
      // 1. Insert Type
      const { error: typeErr } = await supabase.from('project_types').insert([{ key: typeKey, label_en: typeKey, label_pt: typeKey }]);
      
      if (!typeErr) {
        // 2. Insert Default Phases into global_project_phases
        const phaseRows = phases.map((p, idx) => ({
          label_en: p,
          label_pt: p,
          project_type: typeKey,
          sort_order: idx
        }));
        await supabase.from('global_project_phases').insert(phaseRows);

        setCustomProjectTypes([...customProjectTypes, typeKey]);
        setCustomProjectPhases({ ...customProjectPhases, [typeKey]: phases });
        setNewType("");
      } else {
        alert("Supabase Error: " + typeErr.message);
      }
      setLoading(false);
    }
  };

  const deleteType = async (type) => {
    if (window.confirm("Delete project type: " + type + "?")) {
      setLoading(true);
      // Delete type
      const { error: typeErr } = await supabase.from('project_types').delete().eq('key', type);
      // Delete phases
      await supabase.from('global_project_phases').delete().eq('project_type', type);
      
      if (!typeErr) {
        setCustomProjectTypes(customProjectTypes.filter(t => t !== type));
        const newPhases = { ...customProjectPhases };
        delete newPhases[type];
        setCustomProjectPhases(newPhases);
        if (selectedType === type) setSelectedType(customProjectTypes.find(t => t !== type) || "");
      }
      setLoading(false);
    }
  };

  const addPhase = async () => {
    if (newPhase.trim() && selectedType) {
      setLoading(true);
      const phases = customProjectPhases[selectedType] || [];
      const updatedPhases = [...phases, newPhase.trim()];
      
      // Insert new phase into global_project_phases
      const { error } = await supabase.from('global_project_phases').insert([{
        label_en: newPhase.trim(),
        label_pt: newPhase.trim(),
        project_type: selectedType,
        sort_order: phases.length
      }]);
      
      if (!error) {
        setCustomProjectPhases({ ...customProjectPhases, [selectedType]: updatedPhases });
        setNewPhase("");
      } else {
        alert("Supabase Error: " + error.message + "\\n\\nDid you run the SQL script to add the project_type column?");
      }
      setLoading(false);
    }
  };

  const deletePhase = async (idx) => {
    if (selectedType) {
      setLoading(true);
      const phases = [...(customProjectPhases[selectedType] || [])];
      const phaseName = phases[idx];
      phases.splice(idx, 1);
      
      // Delete from global_project_phases
      const { error } = await supabase.from('global_project_phases').delete().eq('project_type', selectedType).eq('label_en', phaseName);
      
      if (!error) {
        // Re-index remaining phases in DB
        for (let i = 0; i < phases.length; i++) {
          await supabase.from('global_project_phases').update({ sort_order: i }).eq('project_type', selectedType).eq('label_en', phases[i]);
        }
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
    
    const p1 = phases[idx];
    const p2 = phases[idx + dir];
    
    phases[idx] = p2;
    phases[idx + dir] = p1;
    
    setLoading(true);
    // Update sort_orders in DB
    await supabase.from('global_project_phases').update({ sort_order: idx }).eq('project_type', selectedType).eq('label_en', p2);
    await supabase.from('global_project_phases').update({ sort_order: idx + dir }).eq('project_type', selectedType).eq('label_en', p1);
    
    setCustomProjectPhases({ ...customProjectPhases, [selectedType]: phases });
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

// Use regex to replace the entire component
const fullRegex = /function ProjectTypesManagerModal[\s\S]*?modal-footer[\s\S]*?<\/div>[\s\S]*?<\/?>;\n\}/;
content = content.replace(fullRegex, newManagerModalCode);

fs.writeFileSync(path, content, 'utf8');
console.log('App.jsx updated to use global_project_phases table');
