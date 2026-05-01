const fs = require('fs');
const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

const constantsDef = `
// ── Predefined Project Types and Phases ─────────────────────────────────────
const DEFAULT_PROJECT_TYPES = [
  { key: 'vfx', label_en: 'VFX / Post-Production', label_pt: 'VFX / Pós-Produção' },
  { key: '3d', label_en: '3D Animation', label_pt: 'Animação 3D' },
  { key: 'motion', label_en: 'Motion Graphics', label_pt: 'Motion Graphics' },
  { key: 'color', label_en: 'Color Grading', label_pt: 'Color Grading' },
  { key: 'design', label_en: 'Design & Branding', label_pt: 'Design e Marca' }
];

const SEEDED_PHASES = {
  'vfx': [
    { pt: "Receção de Material / Briefing", en: "Ingest / Briefing" },
    { pt: "Tracking / Matchmove", en: "Tracking / Matchmove" },
    { pt: "Roto / Paint / Prep", en: "Roto / Paint / Prep" },
    { pt: "Integração 3D / Assets", en: "3D Integration / Assets" },
    { pt: "Compositing", en: "Compositing" },
    { pt: "Revisão Interna", en: "Internal Review" },
    { pt: "Entrega Final", en: "Final Delivery" }
  ],
  '3d': [
    { pt: "Concept / Storyboard", en: "Concept / Storyboard" },
    { pt: "Modelação", en: "Modeling" },
    { pt: "Texturização / Shading", en: "Texturing / Shading" },
    { pt: "Rigging / Animação", en: "Rigging / Animation" },
    { pt: "Iluminação / Rendering", en: "Lighting / Rendering" },
    { pt: "Compositing", en: "Compositing" },
    { pt: "Entrega Final", en: "Final Delivery" }
  ],
  'motion': [
    { pt: "Briefing / Guião", en: "Briefing / Script" },
    { pt: "Styleframes / Storyboard", en: "Styleframes / Storyboard" },
    { pt: "Ilustração / Assets", en: "Illustration / Assets" },
    { pt: "Animação / Motion", en: "Animation / Motion" },
    { pt: "Sonoplastia", en: "Sound Design" },
    { pt: "Entrega Final", en: "Final Delivery" }
  ],
  'color': [
    { pt: "Conform", en: "Conform" },
    { pt: "Look Development", en: "Look Development" },
    { pt: "Color Grading (Primary)", en: "Color Grading (Primary)" },
    { pt: "Color Grading (Secondary)", en: "Color Grading (Secondary)" },
    { pt: "Revisão / Afinações", en: "Review / Tweaks" },
    { pt: "Mastering / Render", en: "Mastering / Render" }
  ],
  'design': [
    { pt: "Pesquisa / Moodboard", en: "Research / Moodboard" },
    { pt: "Conceito / Sketching", en: "Concept / Sketching" },
    { pt: "Desenvolvimento Visual", en: "Visual Development" },
    { pt: "Apresentação ao Cliente", en: "Client Presentation" },
    { pt: "Revisão", en: "Revision" },
    { pt: "Entrega Final (Guidelines/Assets)", en: "Final Delivery (Assets)" }
  ]
};
`;

const insertMarker = 'const TITLES = {';
const pos = content.indexOf(insertMarker);
if (pos !== -1) {
    if (!content.includes('const DEFAULT_PROJECT_TYPES')) {
        content = content.slice(0, pos) + constantsDef + '\n' + content.slice(pos);
        fs.writeFileSync(path, content);
        console.log('Constants added successfully.');
    } else {
        console.log('Constants already exist.');
    }
} else {
    console.log('Could not find insert marker.');
}
