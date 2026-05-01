const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add draft_leads to loadData correctly
const fetchDrafts = "supabase.from('draft_leads').select('*').then(({ data }) => data && setDraftLeads(data));";
content = content.replace(
    "supabase.from('custom_messages').select('*').then(({ data }) => data && setCustomMessages(data));",
    "supabase.from('custom_messages').select('*').then(({ data }) => data && setCustomMessages(data));\n      supabase.from('draft_leads').select('*').then(({ data }) => data && setDraftLeads(data));"
);

// 2. Add error handling to saveDraftLead
const newSaveDraftLead = `  const saveDraftLead = async (d) => {
    const payload = { ...d };
    if (d.id) {
      const { data, error } = await supabase.from('draft_leads').update(payload).eq('id', d.id).select().single();
      if (error) {
        console.error('saveDraftLead update error:', error);
        alert(\`Error: \${error.message}\`);
        return;
      }
      if (data) setDraftLeads(prev => prev.map(x => x.id === d.id ? data : x));
    } else {
      const { data, error } = await supabase.from('draft_leads').insert([payload]).select().single();
      if (error) {
        console.error('saveDraftLead insert error:', error);
        alert(\`Error: \${error.message}\`);
        return;
      }
      if (data) setDraftLeads(prev => [data, ...prev]);
    }
    setModal(null);
  };`;

content = content.replace(/const saveDraftLead = async \(d\) => \{[\s\S]*?setModal\(null\)\;\n\s*\}\;/, newSaveDraftLead);

fs.writeFileSync(filePath, content);
console.log("Fixed draft_leads loading and added error alerts.");
