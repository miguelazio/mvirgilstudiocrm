const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add XLSX import
if (!content.includes('import * as XLSX from "xlsx"')) {
    content = content.replace(
        'import { supabase } from "./supabaseClient";',
        'import { supabase } from "./supabaseClient";\nimport * as XLSX from "xlsx";'
    );
}

// Add Backup Functions
const backupFunctions = `
  const [backupLoading, setBackupLoading] = React.useState(false);
  const downloadFullBackup = async () => {
    setBackupLoading(true);
    try {
      const wb = XLSX.utils.book_new();
      const tables = [
        { name: 'leads', query: supabase.from('leads').select('*') },
        { name: 'projects', query: supabase.from('projects').select('*') },
        { name: 'partners', query: supabase.from('partners').select('*') },
        { name: 'software_catalog', query: supabase.from('software_catalog').select('*') },
        { name: 'content_calendar', query: supabase.from('content_calendar').select('*') },
        { name: 'jobs', query: supabase.from('jobs').select('*') },
        { name: 'vault_items', query: supabase.from('vault_items').select('*') },
        { name: 'vault_categories', query: supabase.from('vault_categories').select('*') },
        { name: 'leads_type', query: supabase.from('leads_type').select('*') },
        { name: 'custom_messages', query: supabase.from('custom_messages').select('*') },
        { name: 'project_types', query: supabase.from('project_types').select('*') },
        { name: 'global_project_phases', query: supabase.from('global_project_phases').select('*') },
      ];
      for (const t of tables) {
        try {
          const { data, error } = await t.query;
          if (!error && data) {
            const flatData = data.map(row => {
              const flat = {};
              Object.entries(row).forEach(([k, v]) => {
                flat[k] = (typeof v === 'object' && v !== null) ? JSON.stringify(v) : v;
              });
              return flat;
            });
            const ws = XLSX.utils.json_to_sheet(flatData.length > 0 ? flatData : [{ info: 'No data' }]);
            XLSX.utils.book_append_sheet(wb, ws, t.name.substring(0, 31));
          }
        } catch (e) {}
      }
      const now = new Date();
      XLSX.writeFile(wb, "MateriaVolume_Backup_" + now.toISOString().slice(0, 10) + ".xlsx");
      localStorage.setItem('crm_last_backup', now.toISOString());
    } catch (e) { alert('Backup failed'); }
    setBackupLoading(false);
  };
  const incrementBackupCounter = () => {
    const count = parseInt(localStorage.getItem('crm_backup_counter') || '0', 10) + 1;
    localStorage.setItem('crm_backup_counter', String(count));
    if (count % 20 === 0) {
      if (window.confirm("Backup reminder: 20 changes made. Download now?")) downloadFullBackup();
    }
  };
`;

if (!content.includes('const downloadFullBackup')) {
    // Insert after removeSoftware
    content = content.replace(/const removeSoftware = async \(swId\) => \{[\s\S]*?\};/, (match) => match + backupFunctions);
}

// Add Backup Button in Sidebar
const backupBtn = `
        <div className="lang-switcher" style={{ margin: "0 16px", marginBottom: "10px" }}>
          <button className="lang-btn" onClick={downloadFullBackup} disabled={backupLoading} style={{ width: "100%", justifyContent: "center", color: "var(--accent)" }}>
            {backupLoading ? "..." : "⬇ Backup (.xlsx)"}
          </button>
        </div>
`;

if (!content.includes('onClick={downloadFullBackup}')) {
    content = content.replace('<button className="lang-btn" onClick={() => supabase.auth.signOut()}', (match) => backupBtn + match);
}

// Add incrementBackupCounter to save functions
content = content.replace(/onSave=\{saveLead\}/g, 'onSave={(d) => { saveLead(d); incrementBackupCounter(); }}');
content = content.replace(/onSave=\{saveProject\}/g, 'onSave={(d) => { saveProject(d); incrementBackupCounter(); }}');
content = content.replace(/onSave=\{savePartner\}/g, 'onSave={(d) => { savePartner(d); incrementBackupCounter(); }}');

fs.writeFileSync(filePath, content);
console.log("Successfully updated App.jsx with backup system.");
