const fs = require('fs');
const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

const simpleSeedFunction = `
  const seedPhases = async () => {
    alert("Seed process initiated...");
    setLoading(true);
    try {
      let seededCount = 0;
      for (const typeKey in SEEDED_PHASES) {
        const typeExists = types.find(t => t.key === typeKey);
        if (!typeExists) continue;

        const existing = (dbProjectPhases || []).filter(ph => ph.project_type === typeKey);
        if (existing.length === 0) {
          const phasesToInsert = SEEDED_PHASES[typeKey].map((p, i) => ({
            project_type: typeKey,
            label_en: p.en,
            label_pt: p.pt,
            sort_order: i
          }));
          const { error } = await supabase.from('global_project_phases').insert(phasesToInsert);
          if (error) {
            alert("Error seeding " + typeKey + ": " + error.message);
          } else {
            seededCount++;
          }
        }
      }
      alert("Seeding complete. Seeded " + seededCount + " types.");
      window.location.reload();
    } catch (e) {
      alert("Fatal error: " + e.message);
    }
    setLoading(false);
  };
`;

const oldSeedStart = content.indexOf('const seedPhases = async () => {');
const oldSeedEnd = content.indexOf('setLoading(false);', oldSeedStart) + 19; 
if (oldSeedStart !== -1) {
  content = content.substring(0, oldSeedStart) + simpleSeedFunction + content.substring(oldSeedEnd);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Seed function simplified with alerts');
}
