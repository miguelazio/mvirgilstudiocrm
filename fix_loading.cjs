const fs = require('fs');
const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

const oldEffect = `    // Load Phases from global_project_phases
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
    });`;

const newEffect = `    // Load Phases from global_project_phases
    supabase.from('global_project_phases').select('*').order('sort_order', { ascending: true }).then(({ data, error }) => {
      if (!error && data && data.length > 0) {
        const phasesObj = {};
        data.forEach(d => {
          const type = d.project_type || 'VFX';
          if (!phasesObj[type]) phasesObj[type] = [];
          phasesObj[type].push(d.label_en);
        });
        // Merge with defaults so we don't lose hardcoded ones if DB is partially empty
        setCustomProjectPhases(prev => ({ ...prev, ...phasesObj }));
      }
    });`;

if (content.includes(oldEffect)) {
    content = content.replace(oldEffect, newEffect);
}

fs.writeFileSync(path, content, 'utf8');
console.log('App.jsx loading logic fixed to prevent wiping phases');
