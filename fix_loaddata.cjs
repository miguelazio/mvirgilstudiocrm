const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');
const lines = content.split(/\r?\n/);

// Check current state
console.log('L599:', lines[598].trim().substring(0, 60));
console.log('L600:', lines[599].trim().substring(0, 60));

const newLines = [
  "      supabase.from('software_catalog').select('*').then(({ data }) => data && setSoftwareCatalog(data));",
  "      supabase.from('content_calendar').select('*').then(({ data }) => data && setContent(data));",
  "      supabase.from('jobs').select('*').then(({ data }) => data && setJobs(data));",
  "      supabase.from('custom_messages').select('*').then(({ data }) => data && setCustomMessages(data));",
  "      supabase.from('leads_type').select('*').then(({ data, error }) => { if (!error && data) setDbCustomTypes(data.sort((a, b) => a.label.localeCompare(b.label))) });",
  "      supabase.from('vault_categories').select('*').then(({ data }) => data && setDbVaultCategories(data.sort((a, b) => a.label_en.localeCompare(b.label_en))));",
  "      supabase.from('global_project_phases').select('*').order('sort_order').then(({ data, error }) => { if (!error && data) setDbProjectPhases(data.map(d => ({ ...d, project_type: d.project_type || 'VFX' }))) });",
  "    }",
  "    loadData();",
  "  }, [session]);",
  "",
  "  const filteredPartners = partners.filter(p => !search || p.company?.toLowerCase().includes(search.toLowerCase()));",
  "",
  "  // Handlers",
  "  const saveVaultItem = async (d) => {",
  "    if (d.id) {",
  "      const { data } = await supabase.from('vault_items').update(d).eq('id', d.id).select().single();",
  "      if (data) setVaultItems(p => p.map(v => v.id === d.id ? data : v));",
  "    }",
  "    setModal(null);",
  "  };",
  "",
  "  const reloadVaultCategories = async () => {",
];

// Replace lines 598-599 (0-indexed) with new block
lines.splice(598, 2, ...newLines);

const lineEnding = content.includes('\r\n') ? '\r\n' : '\n';
fs.writeFileSync('src/App.jsx', lines.join(lineEnding), 'utf8');
console.log('Fixed! New total lines:', lines.length);
