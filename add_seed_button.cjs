const fs = require('fs');
const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

const seededPhasesData = `
const SEEDED_PHASES = {
  ArchViz: [
    { en: "Briefing & Prep", pt: "Briefing e Preparação" },
    { en: "Concept & Blocking", pt: "Conceito e Blocking" },
    { en: "Modeling & UV", pt: "Modelação e UV" },
    { en: "Texturing & Shading", pt: "Texturização e Shaders" },
    { en: "Lighting & Camera", pt: "Iluminação e Câmera" },
    { en: "Render & Post", pt: "Render e Pós-Produção" },
    { en: "Delivery & Archive", pt: "Entrega e Arquivo" }
  ],
  Interactive: [
    { en: "Briefing & Prep", pt: "Briefing e Preparação" },
    { en: "UX & Wireframes", pt: "UX e Wireframes" },
    { en: "Prototyping", pt: "Prototipagem" },
    { en: "3D Asset Creation", pt: "Criação de Assets 3D" },
    { en: "Integration & Dev", pt: "Integração e Dev" },
    { en: "Testing & QA", pt: "Testes e QA" },
    { en: "Deploy & Archive", pt: "Lançamento e Arquivo" }
  ],
  AI: [
    { en: "Briefing & Prep", pt: "Briefing e Preparação" },
    { en: "Data & Research", pt: "Dados e Pesquisa" },
    { en: "Prompt Engineering", pt: "Prompt Engineering" },
    { en: "Generation & Iteration", pt: "Geração e Iteração" },
    { en: "Refinement & Compositing", pt: "Refinamento e Composicão" },
    { en: "Delivery & Archive", pt: "Entrega e Arquivo" }
  ],
  Generative: [
    { en: "Briefing & Prep", pt: "Briefing e Preparação" },
    { en: "Concept & Algorithm", pt: "Conceito e Algoritmo" },
    { en: "Prototyping", pt: "Prototipagem" },
    { en: "Visual Dev", pt: "Desenvolvimento Visual" },
    { en: "Render & Export", pt: "Render e Exportação" },
    { en: "Delivery & Archive", pt: "Entrega e Arquivo" }
  ],
  VFX: [
    { en: "Briefing & Prep", pt: "Briefing e Preparação" },
    { en: "Concept & Blocking", pt: "Conceito e Blocking" },
    { en: "Modeling & Rigging", pt: "Modelação e Rigging" },
    { en: "Texturing & Shading", pt: "Texturização e Shaders" },
    { en: "Tracking & Match", pt: "Tracking e Matchmove" },
    { en: "Lighting & FX", pt: "Iluminação e FX" },
    { en: "Render & Comp", pt: "Render e Composição" },
    { en: "Delivery & Archive", pt: "Entrega e Arquivo" }
  ],
  MotionDesign: [
    { en: "Briefing & Prep", pt: "Briefing e Preparação" },
    { en: "Storyboard & Animatic", pt: "Storyboard e Animatic" },
    { en: "Design & Styleframes", pt: "Design e Styleframes" },
    { en: "Animation", pt: "Animação" },
    { en: "Sound & Music", pt: "Som e Música" },
    { en: "Render & Comp", pt: "Render e Composição" },
    { en: "Delivery & Archive", pt: "Entrega e Arquivo" }
  ],
  "3DPrint": [
    { en: "Briefing & Prep", pt: "Briefing e Preparação" },
    { en: "Concept & Sketches", pt: "Conceito e Sketches" },
    { en: "3D Modeling", pt: "Modelação 3D" },
    { en: "Mesh Optimization", pt: "Otimização de Malha" },
    { en: "Slicing & Setup", pt: "Slicing e Setup" },
    { en: "Print & Post-Process", pt: "Impressão e Pós-Processo" },
    { en: "Delivery & Archive", pt: "Entrega e Arquivo" }
  ]
};
`;

content = content.replace('const DEFAULT_TYPE_PHASES = {', seededPhasesData + '\nconst DEFAULT_TYPE_PHASES = {');

// Update ProjectTypesModal to include seed function
const seedFunction = `
  const seedPhases = async () => {
    if (!confirm(lang === 'pt' ? "Deseja inicializar as etapas padrão para todos os tipos de projeto vazios?" : "Initialize default phases for all empty project types?")) return;
    setLoading(true);
    try {
      for (const type of types) {
        const existing = dbProjectPhases.filter(ph => ph.project_type === type.key);
        if (existing.length === 0 && SEEDED_PHASES[type.key]) {
          const phasesToInsert = SEEDED_PHASES[type.key].map((p, i) => ({
            project_type: type.key,
            label_en: p.en,
            label_pt: p.pt,
            sort_order: i
          }));
          await supabase.from('global_project_phases').insert(phasesToInsert);
        }
      }
      alert(lang === 'pt' ? "Etapas inicializadas!" : "Phases initialized!");
      window.location.reload(); // Hard reload to refresh all data
    } catch (e) {
      alert("Error seeding: " + e.message);
    }
    setLoading(false);
  };
`;

content = content.replace('const addType = () => {', seedFunction + '\n  const addType = () => {');

// Add button to UI
content = content.replace(
  '<div className="modal-title">{t.manage_project_types}</div>',
  '<div className="modal-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>{t.manage_project_types} <button className="btn btn-ghost" style={{ fontSize: 10, color: "var(--accent)" }} onClick={seedPhases}>✨ {lang === "pt" ? "Auto-Preencher Etapas" : "Auto-Fill Phases"}</button></div>'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Seed functionality added to ProjectTypesModal');
