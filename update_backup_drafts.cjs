const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Update downloadFullBackup to include draft_leads
content = content.replace(
    "{ name: 'leads', query: supabase.from('leads').select('*') },",
    "{ name: 'draft_leads', query: supabase.from('draft_leads').select('*') },\n        { name: 'leads', query: supabase.from('leads').select('*') },"
);

fs.writeFileSync(filePath, content);
console.log("Updated backup system to include draft_leads.");
