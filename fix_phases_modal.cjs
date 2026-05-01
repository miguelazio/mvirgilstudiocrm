const fs = require('fs');
const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// Use \r\n since that's the file's line ending
const N = '\r\n';

// 1. Replace ProjectPhasesModal function body
const oldBody = [
  'function ProjectPhasesModal({ t, lang, dbProjectPhases, onReload, onClose }) {',
  '  const [phases, setPhases] = useState(dbProjectPhases || []);',
  '  const [loading, setLoading] = useState(false);',
  '',
  '  const saveAll = async () => {',
  '    setLoading(true);',
  '    try {',
  '      for (let i = 0; i < phases.length; i++) {',
  '        const ph = phases[i];',
  '        if (ph.id) {',
  "          await supabase.from('global_project_phases').update({ label_en: ph.label_en, label_pt: ph.label_pt, sort_order: i }).eq('id', ph.id);",
  '        } else {',
  "          await supabase.from('global_project_phases').insert([{ label_en: ph.label_en, label_pt: ph.label_pt, sort_order: i }]);",
  '        }',
  '      }',
  '      await onReload();',
  '      onClose();',
  '    } catch (e) {',
  '      alert("Error saving phases: " + e.message + "\\n\\nPlease ensure you have created the global_project_phases table in Supabase.");',
  '    }',
  '    setLoading(false);',
  '  };',
  '',
  '  const deletePhase = async (id, index) => {',
  '    if (id) {',
  "      const { error } = await supabase.from('global_project_phases').delete().eq('id', id);",
  '      if (error) {',
  '        alert("Error deleting: " + error.message);',
  '        return;',
  '      }',
  '    }',
  '    setPhases(phases.filter((_, i) => i !== index));',
  '  };',
  '',
  '  const addPhase = () => {',
  "    setPhases([...phases, { label_en: 'New Phase', label_pt: 'Nova Fase' }]);",
  '  };',
].join(N);

const newBody = [
  'function ProjectPhasesModal({ t, lang, dbProjectPhases, onReload, onClose }) {',
  '  const [allPhases, setAllPhases] = useState(dbProjectPhases || []);',
  '  const [currentType, setCurrentType] = useState("VFX");',
  '  const [loading, setLoading] = useState(false);',
  '',
  "  const phases = allPhases.filter(p => (p.project_type || 'VFX') === currentType);",
  '',
  '  const saveAll = async () => {',
  '    setLoading(true);',
  '    try {',
  '      for (let i = 0; i < phases.length; i++) {',
  '        const ph = phases[i];',
  '        if (ph.id) {',
  "          await supabase.from('global_project_phases').update({ label_en: ph.label_en, label_pt: ph.label_pt, sort_order: i, project_type: currentType }).eq('id', ph.id);",
  '        } else {',
  "          await supabase.from('global_project_phases').insert([{ label_en: ph.label_en, label_pt: ph.label_pt, sort_order: i, project_type: currentType }]);",
  '        }',
  '      }',
  '      await onReload();',
  '      onClose();',
  '    } catch (e) {',
  '      alert("Error saving phases: " + e.message + "\\n\\nPlease ensure you have created the global_project_phases table in Supabase.");',
  '    }',
  '    setLoading(false);',
  '  };',
  '',
  '  const deletePhase = async (id, index) => {',
  '    if (id) {',
  "      const { error } = await supabase.from('global_project_phases').delete().eq('id', id);",
  '      if (error) {',
  '        alert("Error deleting: " + error.message);',
  '        return;',
  '      }',
  '    }',
  '    setAllPhases(allPhases.filter(p => p !== phases[index]));',
  '  };',
  '',
  '  const addPhase = () => {',
  "    setAllPhases([...allPhases, { label_en: 'New Phase', label_pt: 'Nova Fase', project_type: currentType }]);",
  '  };',
].join(N);

if (content.includes(oldBody)) {
  content = content.replace(oldBody, newBody);
  console.log('OK: Updated ProjectPhasesModal function body');
} else {
  console.log('WARN: Could not find ProjectPhasesModal body');
}

// 2. Replace the ProjectPhasesModal JSX header to add type selector
const oldJSX = [
  '    <div className="modal-title">{t.manage_project_phases}</div>',
  '    <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>',
  `      {lang === 'pt' ? "Estas são as etapas padrão para os novos projetos." : "These are the default phases for new projects."}`,
  '    </p>',
  '',
  '    <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: "60vh", overflowY: "auto", paddingRight: 5 }}>',
].join(N);

const newJSX = [
  '    <div className="modal-title">{t.manage_project_phases}</div>',
  '    <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>',
  `      {lang === 'pt' ? "Gerir as etapas por tipo de projeto." : "Manage phases by project type."}`,
  '    </p>',
  '',
  '    <div className="form-group" style={{ marginBottom: 16 }}>',
  '      <label className="form-label">Project Type</label>',
  '      <select className="form-select" value={currentType} onChange={e => setCurrentType(e.target.value)}>',
  `        {DEFAULT_PROJECT_TYPES.map(pt => <option key={pt.key} value={pt.key}>{lang === 'pt' ? pt.label_pt : pt.label_en}</option>)}`,
  '      </select>',
  '    </div>',
  '',
  '    <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: "50vh", overflowY: "auto", paddingRight: 5 }}>',
].join(N);

if (content.includes(oldJSX)) {
  content = content.replace(oldJSX, newJSX);
  console.log('OK: Updated ProjectPhasesModal JSX with type selector');
} else {
  console.log('WARN: Could not find ProjectPhasesModal JSX');
}

// 3. Update input handlers in ProjectPhasesModal to use allPhases
// EN input handler
const oldEN = `const newPhases = [...phases];${N}              newPhases[i].label_en = e.target.value;${N}              setPhases(newPhases);`;
const newEN = `const updated = [...allPhases]; const idx = updated.indexOf(ph); if(idx>-1) updated[idx] = {...updated[idx], label_en: e.target.value}; setAllPhases(updated);`;

if (content.includes(oldEN)) {
  content = content.replace(oldEN, newEN);
  console.log('OK: Updated EN input handler');
} else {
  console.log('WARN: Could not find EN input handler');
}

// PT input handler
const oldPT = `const newPhases = [...phases];${N}              newPhases[i].label_pt = e.target.value;${N}              setPhases(newPhases);`;
const newPT = `const updated = [...allPhases]; const idx = updated.indexOf(ph); if(idx>-1) updated[idx] = {...updated[idx], label_pt: e.target.value}; setAllPhases(updated);`;

if (content.includes(oldPT)) {
  content = content.replace(oldPT, newPT);
  console.log('OK: Updated PT input handler');
} else {
  console.log('WARN: Could not find PT input handler');
}

fs.writeFileSync(path, content, 'utf8');
console.log('Done! Lines:', content.split(/\r?\n/).length);
