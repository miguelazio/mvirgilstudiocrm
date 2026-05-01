const fs = require('fs');
const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

const debugSeedFunction = `
  const seedPhases = async () => {
    console.log("Seed phases button clicked");
    try {
      const msg = lang === 'pt' ? "Deseja inicializar as etapas padrão?" : "Initialize default phases?";
      if (!window.confirm(msg)) return;
      
      setLoading(true);
      console.log("Starting seed process for types:", types.length);
      
      let seededCount = 0;
      for (const type of types) {
        console.log("Checking type:", type.key);
        const existing = (dbProjectPhases || []).filter(ph => ph.project_type === type.key);
        console.log(\`Type \${type.key} has \${existing.length} existing phases\`);
        
        if (existing.length === 0 && SEEDED_PHASES[type.key]) {
          console.log(\`Inserting phases for \${type.key}...\`);
          const phasesToInsert = SEEDED_PHASES[type.key].map((p, i) => ({
            project_type: type.key,
            label_en: p.en,
            label_pt: p.pt,
            sort_order: i
          }));
          
          const { data, error } = await supabase.from('global_project_phases').insert(phasesToInsert).select();
          if (error) {
            console.error("Supabase error for " + type.key + ":", error);
            throw error;
          }
          console.log(\`Successfully inserted \${data?.length || 0} phases for \${type.key}\`);
          seededCount++;
        }
      }
      
      if (seededCount > 0) {
        alert(lang === 'pt' ? \`Sucesso! Etapas criadas para \${seededCount} categorias.\` : \`Success! Phases created for \${seededCount} categories.\`);
        window.location.reload();
      } else {
        alert(lang === 'pt' ? "Nada para atualizar. Todas as categorias já possuem etapas." : "Nothing to update. All categories already have phases.");
      }
    } catch (e) {
      console.error("Seed error caught:", e);
      alert("Error: " + (e.message || JSON.stringify(e)));
    } finally {
      setLoading(false);
    }
  };
`;

const oldSeedStart = content.indexOf('const seedPhases = async () => {');
const oldSeedEnd = content.indexOf('setLoading(false);', oldSeedStart) + 19; // inclusive
if (oldSeedStart !== -1) {
  content = content.substring(0, oldSeedStart) + debugSeedFunction + content.substring(oldSeedEnd);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Seed function updated with deep debugging and window.confirm fix');
} else {
  console.log('Could not find seedPhases function to update');
}
