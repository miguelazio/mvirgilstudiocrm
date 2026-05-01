const fs = require('fs');
const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Fix ProjectModal signature: defaultPhases -> dbProjectPhases
content = content.replace(
  'function ProjectModal({ t, lang, data, partners, softwareCatalog, defaultPhases, onSave, onClose })',
  'function ProjectModal({ t, lang, data, partners, softwareCatalog, dbProjectPhases, onSave, onClose })'
);

// 2. Add project_type to default project state in ProjectModal
content = content.replace(
  'customTasks: {}, customPhases: null };',
  'customTasks: {}, customPhases: null, project_type: "VFX" };'
);

// 3. Add project_type to the return spread in ProjectModal
content = content.replace(
  'customTasks: base.customTasks || {}, customPhases: base.customPhases || null };',
  'customTasks: base.customTasks || {}, customPhases: base.customPhases || null, project_type: base.project_type || "VFX" };'
);

// 4. Fix phase computation in ProjectModal (the line that references f.project_type)
// Find the old computation and replace
content = content.replace(
  "const typePhases = dbProjectPhases.filter(ph => (ph.project_type || 'General') === f.project_type);\n  const defaultPhases = typePhases.length > 0 ? typePhases.map(ph => lang === 'pt' ? ph.label_pt : ph.label_en) : t.project_phases;\n  const projectPhases = f.customPhases || defaultPhases;",
  "const typePhases = dbProjectPhases.filter(ph => (ph.project_type || 'VFX') === f.project_type);\n  const defaultPhases = typePhases.length > 0 ? typePhases.map(ph => lang === 'pt' ? ph.label_pt : ph.label_en) : (DEFAULT_TYPE_PHASES[f.project_type] || t.project_phases);\n  const projectPhases = f.customPhases || defaultPhases;"
);

// 5. Add Project Type selector before Phase selector in the form
// Find the phase label line and insert project type selector before it
const phaseLabel = `<div className="form-group"><label className="form-label">{t.lbl_phase}</label>`;
const phaseLabelIdx = content.indexOf(phaseLabel);
if (phaseLabelIdx > -1) {
  const projectTypeSelector = `<div className="form-group"><label className="form-label">Project Type</label>
        <select className="form-select" value={f.project_type} onChange={e => { s("project_type", e.target.value); s("customPhases", null); s("phase", 0); }}>
          {DEFAULT_PROJECT_TYPES.map(pt => <option key={pt.key} value={pt.key}>{lang === 'pt' ? pt.label_pt : pt.label_en}</option>)}
        </select>
      </div>

      `;
  content = content.substring(0, phaseLabelIdx) + projectTypeSelector + content.substring(phaseLabelIdx);
  console.log('Inserted project type selector');
} else {
  console.log('WARNING: Could not find phase label to insert project type selector');
}

// 6. Update ProjectPhasesModal to support project types
const oldPhasesModal = `function ProjectPhasesModal({ t, lang, dbProjectPhases, onReload, onClose }) {
  const [phases, setPhases] = useState(dbProjectPhases || []);
  const [loading, setLoading] = useState(false);

  const saveAll = async () => {
    setLoading(true);
    try {
      for (let i = 0; i < phases.length; i++) {
        const ph = phases[i];
        if (ph.id) {
          await supabase.from('global_project_phases').update({ label_en: ph.label_en, label_pt: ph.label_pt, sort_order: i }).eq('id', ph.id);
        } else {
          await supabase.from('global_project_phases').insert([{ label_en: ph.label_en, label_pt: ph.label_pt, sort_order: i }]);
        }
      }
      await onReload();
      onClose();
    } catch (e) {
      alert("Error saving phases: " + e.message + "\\n\\nPlease ensure you have created the global_project_phases table in Supabase.");
    }
    setLoading(false);
  };

  const deletePhase = async (id, index) => {
    if (id) {
      const { error } = await supabase.from('global_project_phases').delete().eq('id', id);
      if (error) {
        alert("Error deleting: " + error.message);
        return;
      }
    }
    setPhases(phases.filter((_, i) => i !== index));
  };

  const addPhase = () => {
    setPhases([...phases, { label_en: 'New Phase', label_pt: 'Nova Fase' }]);
  };`;

const newPhasesModal = `function ProjectPhasesModal({ t, lang, dbProjectPhases, onReload, onClose }) {
  const [allPhases, setAllPhases] = useState(dbProjectPhases || []);
  const [currentType, setCurrentType] = useState("VFX");
  const [loading, setLoading] = useState(false);

  const phases = allPhases.filter(p => (p.project_type || 'VFX') === currentType);

  const saveAll = async () => {
    setLoading(true);
    try {
      for (let i = 0; i < phases.length; i++) {
        const ph = phases[i];
        if (ph.id) {
          await supabase.from('global_project_phases').update({ label_en: ph.label_en, label_pt: ph.label_pt, sort_order: i, project_type: currentType }).eq('id', ph.id);
        } else {
          await supabase.from('global_project_phases').insert([{ label_en: ph.label_en, label_pt: ph.label_pt, sort_order: i, project_type: currentType }]);
        }
      }
      await onReload();
      onClose();
    } catch (e) {
      alert("Error saving phases: " + e.message + "\\n\\nPlease ensure you have created the global_project_phases table in Supabase.");
    }
    setLoading(false);
  };

  const deletePhase = async (id, index) => {
    if (id) {
      const { error } = await supabase.from('global_project_phases').delete().eq('id', id);
      if (error) {
        alert("Error deleting: " + error.message);
        return;
      }
    }
    setAllPhases(allPhases.filter(p => p !== phases[index]));
  };

  const addPhase = () => {
    setAllPhases([...allPhases, { label_en: 'New Phase', label_pt: 'Nova Fase', project_type: currentType }]);
  };`;

if (content.includes(oldPhasesModal)) {
  content = content.replace(oldPhasesModal, newPhasesModal);
  console.log('Updated ProjectPhasesModal function body');
} else {
  console.log('WARNING: Could not find old ProjectPhasesModal body');
}

// 7. Update the ProjectPhasesModal JSX to add type selector
const oldPhasesJSX = `<div className="modal-title">{t.manage_project_phases}</div>
    <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>
      {lang === 'pt' ? "Estas são as etapas padrão para os novos projetos." : "These are the default phases for new projects."}
    </p>

    <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: "60vh", overflowY: "auto", paddingRight: 5 }}>`;

const newPhasesJSX = `<div className="modal-title">{t.manage_project_phases}</div>
    <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>
      {lang === 'pt' ? "Gerir as etapas por tipo de projeto." : "Manage phases by project type."}
    </p>

    <div className="form-group" style={{ marginBottom: 16 }}>
      <label className="form-label">Project Type</label>
      <select className="form-select" value={currentType} onChange={e => setCurrentType(e.target.value)}>
        {DEFAULT_PROJECT_TYPES.map(pt => <option key={pt.key} value={pt.key}>{lang === 'pt' ? pt.label_pt : pt.label_en}</option>)}
      </select>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: "50vh", overflowY: "auto", paddingRight: 5 }}>`;

if (content.includes(oldPhasesJSX)) {
  content = content.replace(oldPhasesJSX, newPhasesJSX);
  console.log('Updated ProjectPhasesModal JSX with type selector');
} else {
  console.log('WARNING: Could not find old ProjectPhasesModal JSX');
}

// 8. Update the input handlers in ProjectPhasesModal to use allPhases
content = content.replace(
  /const newPhases = \[\.\.\.phases\];\n\s*newPhases\[i\]\.label_en = e\.target\.value;\n\s*setPhases\(newPhases\);/g,
  'const updated = [...allPhases]; const idx = updated.indexOf(ph); if(idx>-1) updated[idx] = {...updated[idx], label_en: e.target.value}; setAllPhases(updated);'
);
content = content.replace(
  /const newPhases = \[\.\.\.phases\];\n\s*newPhases\[i\]\.label_pt = e\.target\.value;\n\s*setPhases\(newPhases\);/g,
  'const updated = [...allPhases]; const idx = updated.indexOf(ph); if(idx>-1) updated[idx] = {...updated[idx], label_pt: e.target.value}; setAllPhases(updated);'
);

fs.writeFileSync(path, content, 'utf8');
console.log('All changes applied! Total lines:', content.split(/\r?\n/).length);
