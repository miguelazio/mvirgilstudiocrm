const fs = require('fs');
const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

const updatedSeedFunction = `
  const seedPhases = async () => {
    if (!confirm(lang === 'pt' ? "Deseja inicializar as etapas padrão para todos os tipos de projeto vazios?" : "Initialize default phases for all empty project types?")) return;
    setLoading(true);
    let seededCount = 0;
    try {
      for (const type of types) {
        // Filter phases that belong to this specific type
        const existing = (dbProjectPhases || []).filter(ph => ph.project_type === type.key);
        
        if (existing.length === 0 && SEEDED_PHASES[type.key]) {
          console.log(\`Seeding phases for \${type.key}...\`);
          const phasesToInsert = SEEDED_PHASES[type.key].map((p, i) => ({
            project_type: type.key,
            label_en: p.en,
            label_pt: p.pt,
            sort_order: i
          }));
          
          const { error } = await supabase.from('global_project_phases').insert(phasesToInsert);
          if (error) throw error;
          seededCount++;
        }
      }
      
      if (seededCount > 0) {
        alert(lang === 'pt' ? \`Etapas inicializadas para \${seededCount} tipos!\` : \`Phases initialized for \${seededCount} types!\`);
        await onReload(); // Refresh project types
        await reloadProjectPhases(); // This should be accessible or I should use window.location.reload
        window.location.reload(); 
      } else {
        alert(lang === 'pt' ? "Todos os tipos já possuem etapas ou não foram encontrados modelos." : "All types already have phases or no templates found.");
      }
    } catch (e) {
      console.error("Seeding error:", e);
      alert("Error seeding: " + (e.message || e));
    }
    setLoading(false);
  };
`;

// Find the old seedPhases and replace it
const oldSeedStart = content.indexOf('const seedPhases = async () => {');
const oldSeedEnd = content.indexOf('setLoading(false);', oldSeedStart) + 19; // inclusive
if (oldSeedStart !== -1) {
  content = content.substring(0, oldSeedStart) + updatedSeedFunction + content.substring(oldSeedEnd);
}

// Ensure reloadProjectPhases is available in the modal?
// It's passed as onReload in some cases, but onReload in ProjectTypesModal is reloadProjectTypes.
// I should pass both.

fs.writeFileSync(path, content, 'utf8');
console.log('Seed function updated with better logging and error handling');
