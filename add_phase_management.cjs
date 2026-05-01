const fs = require('fs');
const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// ─── 1. Replace the single projects button with three buttons ───
const oldProjectsBtn = '{tab === "projects" && <button className="btn btn-primary btn-sm" onClick={() => setModal({ type: "project", data: null })}>{t.new_project}</button>}';

const newProjectsBtns = `{tab === "projects" && <>
              <button className="btn btn-ghost btn-sm" onClick={() => setModal({ type: "manage_project_types", data: null })}>Manage Types</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setModal({ type: "manage_phases", data: null })}>Manage Phases</button>
              <button className="btn btn-primary btn-sm" onClick={() => setModal({ type: "project", data: null })}>{t.new_project}</button>
            </>}`;

if (content.includes(oldProjectsBtn)) {
  content = content.replace(oldProjectsBtn, newProjectsBtns);
  console.log('1: Added Manage Types + Manage Phases buttons');
} else {
  console.log('WARN 1: Projects button not found');
}

// ─── 2. Add component definitions before "export default function App()" ───
const componentCode = `
// ── Project Types Modal (hardcoded - no database required) ──────────────────
function ProjectTypesModal({ t, lang, onClose }) {
  const types = DEFAULT_PROJECT_TYPES;

  const seedPhases = (typeKey) => {
    const phases = SEEDED_PHASES[typeKey];
    if (!phases) { alert('No predefined phases for type: ' + typeKey); return; }
    const phaseNames = phases.map(p => lang === 'pt' ? p.pt : p.en);
    alert('Phases for ' + typeKey + ':\\n\\n' + phaseNames.map((p, i) => (i + 1) + '. ' + p).join('\\n') + '\\n\\nThese phases are available when creating a new project of this type.');
  };

  const seedAllPhases = () => {
    let summary = '';
    types.forEach(type => {
      const phases = SEEDED_PHASES[type.key];
      if (phases) {
        const names = phases.map(p => lang === 'pt' ? p.pt : p.en);
        summary += '\\n' + type.label_en + ':\\n' + names.map((p, i) => '  ' + (i + 1) + '. ' + p).join('\\n') + '\\n';
      }
    });
    alert('All Project Type Phases:\\n' + summary + '\\nThese phases auto-populate when creating projects.');
  };

  return (
    <>
      <div className="modal-title">Manage Project Types</div>
      <div style={{ marginBottom: 16 }}>
        <button className="btn btn-primary btn-sm" onClick={seedAllPhases} style={{ marginBottom: 12 }}>
          Auto-Fill Phases (Preview All)
        </button>
        <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 12 }}>
          {lang === 'pt' ? 'Tipos de projeto predefinidos com fases profissionais.' : 'Predefined project types with professional workflow phases.'}
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {types.map(type => {
          const phases = SEEDED_PHASES[type.key] || [];
          return (
            <div key={type.key} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{lang === 'pt' ? type.label_pt : type.label_en}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{phases.length} phases defined</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => seedPhases(type.key)}>View Phases</button>
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
function ProjectPhasesModal({ t, lang, onClose }) {
  const [selectedType, setSelectedType] = React.useState(DEFAULT_PROJECT_TYPES[0]?.key || '');
  const types = DEFAULT_PROJECT_TYPES;
  const phases = SEEDED_PHASES[selectedType] || [];

  return (
    <>
      <div className="modal-title">{lang === 'pt' ? 'Gerir Fases do Projeto' : 'Manage Project Phases'}</div>
      <div className="form-group">
        <label className="form-label">{lang === 'pt' ? 'Tipo de Projeto' : 'Project Type'}</label>
        <select className="form-select" value={selectedType} onChange={e => setSelectedType(e.target.value)}>
          {types.map(type => (
            <option key={type.key} value={type.key}>{lang === 'pt' ? type.label_pt : type.label_en}</option>
          ))}
        </select>
      </div>
      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          {lang === 'pt' ? 'Fases' : 'Phases'} ({phases.length})
        </div>
        {phases.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 20, color: 'var(--muted)', fontSize: 12 }}>
            {lang === 'pt' ? 'Sem fases definidas para este tipo.' : 'No phases defined for this type.'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {phases.map((phase, i) => (
              <div key={i} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--border)', flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{lang === 'pt' ? phase.pt : phase.en}</span>
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

const insertPoint = 'export default function App()';
const idx = content.indexOf(insertPoint);
if (idx !== -1) {
  content = content.slice(0, idx) + componentCode + content.slice(idx);
  console.log('2: Added ProjectTypesModal + ProjectPhasesModal components');
} else {
  console.log('FAIL 2: Could not find "export default function App()"');
}

// ─── 3. Add modal rendering lines ───
const vaultCatLine = '{modal.type === "vault_categories"';
const vcIdx = content.indexOf(vaultCatLine);
if (vcIdx !== -1) {
  const lineEnd = content.indexOf('\n', vcIdx);
  const newLines = `\n\n            {modal.type === "manage_project_types" && <ProjectTypesModal t={t} lang={lang} onClose={() => setModal(null)} />}\n\n            {modal.type === "manage_phases" && <ProjectPhasesModal t={t} lang={lang} onClose={() => setModal(null)} />}\n`;
  content = content.slice(0, lineEnd + 1) + newLines + content.slice(lineEnd + 1);
  console.log('3: Added modal rendering for manage_project_types and manage_phases');
} else {
  console.log('FAIL 3: Could not find vault_categories modal line');
}

fs.writeFileSync(path, content);
console.log('\nDone! All phase management features added with hardcoded defaults.');
