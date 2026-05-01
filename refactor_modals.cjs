const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Inject state variables
const stateCode = `
  const [projectTypes, setProjectTypes] = React.useState(() => { try { const s = localStorage.getItem('mv_project_types'); if(s) return JSON.parse(s); } catch(e){} return DEFAULT_PROJECT_TYPES; });
  const [projectPhases, setProjectPhases] = React.useState(() => { try { const s = localStorage.getItem('mv_project_phases'); if(s) return JSON.parse(s); } catch(e){} return SEEDED_PHASES; });
  React.useEffect(() => { localStorage.setItem('mv_project_types', JSON.stringify(projectTypes)); }, [projectTypes]);
  React.useEffect(() => { localStorage.setItem('mv_project_phases', JSON.stringify(projectPhases)); }, [projectPhases]);
`;

if (!content.includes('mv_project_types')) {
  content = content.replace(
    'const [session, setSession] = React.useState(null);',
    'const [session, setSession] = React.useState(null);' + '\\n' + stateCode
  );
}

// 2. Inject props into the modal render calls
content = content.replace(
  '{modal.type === "manage_project_types" && <ProjectTypesModal t={t} lang={lang} onClose={() => setModal(null)} setModal={setModal} />}',
  '{modal.type === "manage_project_types" && <ProjectTypesModal t={t} lang={lang} onClose={() => setModal(null)} setModal={setModal} projectTypes={projectTypes} setProjectTypes={setProjectTypes} projectPhases={projectPhases} />}'
);

content = content.replace(
  '{modal.type === "manage_phases" && <ProjectPhasesModal t={t} lang={lang} onClose={() => setModal(null)} initialType={modal.data} />}',
  '{modal.type === "manage_phases" && <ProjectPhasesModal t={t} lang={lang} onClose={() => setModal(null)} initialType={modal.data} projectTypes={projectTypes} projectPhases={projectPhases} setProjectPhases={setProjectPhases} />}'
);

// 3. Replace the Modal components entirely
const modalsReplacement = `
// ── Project Types Modal ────────────────────────────────────────────────────
function ProjectTypesModal({ t, lang, onClose, setModal, projectTypes, setProjectTypes, projectPhases }) {
  const [newEn, setNewEn] = React.useState('');
  const [newPt, setNewPt] = React.useState('');

  const addType = () => {
    if (!newEn || !newPt) return;
    const key = newEn.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now().toString().slice(-4);
    setProjectTypes([...projectTypes, { key, label_en: newEn, label_pt: newPt }]);
    setNewEn(''); setNewPt('');
  };

  const deleteType = (key) => {
    if(confirm(lang === 'pt' ? 'Eliminar este tipo de projeto?' : 'Delete this project type?')) {
       setProjectTypes(projectTypes.filter(pt => pt.key !== key));
    }
  };

  const seedAllPhases = () => {
    let summary = '';
    projectTypes.forEach(type => {
      const phases = projectPhases[type.key];
      if (phases) {
        const names = phases.map(p => lang === 'pt' ? p.pt : p.en);
        summary += '\\n' + type.label_en + ':\\n' + names.map((p, i) => '  ' + (i + 1) + '. ' + p).join('\\n') + '\\n';
      }
    });
    alert('All Project Type Phases:\\n' + summary + '\\nThese phases auto-populate when creating projects.');
  };

  return (
    <>
      <div className="modal-title">{lang === 'pt' ? 'Gerir Tipos de Projeto' : 'Manage Project Types'}</div>
      <div style={{ marginBottom: 16 }}>
        <button className="btn btn-primary btn-sm" onClick={seedAllPhases} style={{ marginBottom: 12 }}>
          {lang === 'pt' ? 'Pré-visualizar Todas as Fases' : 'Auto-Fill Phases (Preview All)'}
        </button>
      </div>
      
      <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px', marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>
           {lang === 'pt' ? 'Criar Novo Tipo' : 'Create New Type'}
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input className="form-input" placeholder="Label (EN)" value={newEn} onChange={e => setNewEn(e.target.value)} />
          <input className="form-input" placeholder="Label (PT)" value={newPt} onChange={e => setNewPt(e.target.value)} />
        </div>
        <button className="btn btn-ghost btn-sm" style={{ width: '100%', background: 'var(--surface)', border: '1px dashed var(--border)' }} onClick={addType}>+ {lang === 'pt' ? 'Adicionar Tipo' : 'Add Type'}</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
        {projectTypes.map(type => {
          const phases = projectPhases[type.key] || [];
          return (
            <div key={type.key} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{lang === 'pt' ? type.label_pt : type.label_en}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{phases.length} {lang === 'pt' ? 'fases definidas' : 'phases defined'}</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setModal({ type: "manage_phases", data: type.key })}>
                  {lang === 'pt' ? 'Ver Fases' : 'View Phases'}
                </button>
                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--lost)' }} onClick={() => deleteType(type.key)}>×</button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="modal-footer">
        <button className="btn btn-ghost" onClick={onClose}>{t.cancel || 'Close'}</button>
      </div>
    </>
  );
}

// ── Project Phases Modal ────────────────────────────────────────────────────
function ProjectPhasesModal({ t, lang, onClose, initialType, projectTypes, projectPhases, setProjectPhases }) {
  const [selectedType, setSelectedType] = React.useState(initialType || projectTypes[0]?.key || '');
  const [newEn, setNewEn] = React.useState('');
  const [newPt, setNewPt] = React.useState('');

  const phases = projectPhases[selectedType] || [];

  const addPhase = () => {
    if (!newEn || !newPt) return;
    const updated = { ...projectPhases };
    updated[selectedType] = [...(updated[selectedType] || []), { pt: newPt, en: newEn }];
    setProjectPhases(updated);
    setNewEn(''); setNewPt('');
  };

  const deletePhase = (idx) => {
    if(confirm(lang === 'pt' ? 'Eliminar fase?' : 'Delete phase?')) {
       const updated = { ...projectPhases };
       updated[selectedType] = updated[selectedType].filter((_, i) => i !== idx);
       setProjectPhases(updated);
    }
  };

  return (
    <>
      <div className="modal-title">{lang === 'pt' ? 'Gerir Fases do Projeto' : 'Manage Project Phases'}</div>
      <div className="form-group">
        <label className="form-label">{lang === 'pt' ? 'Tipo de Projeto' : 'Project Type'}</label>
        <select className="form-select" value={selectedType} onChange={e => setSelectedType(e.target.value)}>
          {projectTypes.map(type => (
            <option key={type.key} value={type.key}>{lang === 'pt' ? type.label_pt : type.label_en}</option>
          ))}
        </select>
      </div>
      
      <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px', marginTop: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>
           {lang === 'pt' ? 'Criar Nova Fase' : 'Create New Phase'}
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input className="form-input" placeholder="Label (EN)" value={newEn} onChange={e => setNewEn(e.target.value)} />
          <input className="form-input" placeholder="Label (PT)" value={newPt} onChange={e => setNewPt(e.target.value)} />
        </div>
        <button className="btn btn-ghost btn-sm" style={{ width: '100%', background: 'var(--surface)', border: '1px dashed var(--border)' }} onClick={addPhase}>+ {lang === 'pt' ? 'Adicionar Fase' : 'Add Phase'}</button>
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          {lang === 'pt' ? 'Fases' : 'Phases'} ({phases.length})
        </div>
        {phases.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 20, color: 'var(--muted)', fontSize: 12 }}>
            {lang === 'pt' ? 'Sem fases definidas para este tipo.' : 'No phases defined for this type.'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 250, overflowY: 'auto' }}>
            {phases.map((phase, i) => (
              <div key={i} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--border)', flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{lang === 'pt' ? phase.pt : phase.en}</span>
                </div>
                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--lost)', padding: '0 6px' }} onClick={() => deletePhase(i)}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="modal-footer">
        <button className="btn btn-ghost" onClick={onClose}>{t.cancel || 'Close'}</button>
      </div>
    </>
  );
}
`;

const startPattern = '// ── Project Types Modal';
const endPattern = 'export default function App() {';
const startIdx = content.indexOf(startPattern);
const endIdx = content.indexOf(endPattern);

if (startIdx !== -1 && endIdx !== -1) {
  content = content.slice(0, startIdx) + modalsReplacement + '\\n' + content.slice(endIdx);
  fs.writeFileSync('src/App.jsx', content);
  console.log('Successfully replaced Modals and injected states');
} else {
  console.log('Could not find modal section markers.', startIdx, endIdx);
}
