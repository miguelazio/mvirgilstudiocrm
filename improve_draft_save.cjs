const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Improve saveDraftLead with logging and validation
const improvedSaveDraftLead = `  const saveDraftLead = async (d) => {
    console.log('Attempting to save draft:', d);
    if (!d.company || !d.company.trim()) {
      alert("Company name is required!");
      return;
    }
    const payload = { 
      company: d.company.trim(),
      website: d.website ? d.website.trim() : "",
      notes: d.notes ? d.notes.trim() : "",
      status: d.status || "Researching"
    };
    
    try {
      if (d.id) {
        console.log('Updating existing draft:', d.id);
        const { data, error } = await supabase.from('draft_leads').update(payload).eq('id', d.id).select().single();
        if (error) throw error;
        if (data) setDraftLeads(prev => prev.map(x => x.id === d.id ? data : x));
      } else {
        console.log('Inserting new draft...');
        const { data, error } = await supabase.from('draft_leads').insert([payload]).select().single();
        if (error) throw error;
        if (data) setDraftLeads(prev => [data, ...prev]);
      }
      setModal(null);
    } catch (err) {
      console.error('saveDraftLead exception:', err);
      alert(\`Database Error: \${err.message || 'Unknown error'}\`);
    }
  };`;

content = content.replace(/const saveDraftLead = async \(d\) => \{[\s\S]*?setModal\(null\)\;\n\s*\}\n\s*\}\;/m, improvedSaveDraftLead + "\n  };");
// Wait, the regex might be tricky. Let's try a simpler one.
content = content.replace(/const saveDraftLead = async \(d\) => \{[\s\S]*?setModal\(null\)\;\n\s*\}\;/m, improvedSaveDraftLead);

fs.writeFileSync(filePath, content);
console.log("Improved saveDraftLead with validation and logging.");
