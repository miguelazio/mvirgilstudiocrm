const fs = require('fs');
const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add XLSX import at the top
content = content.replace(
  'import { supabase } from "./supabaseClient";',
  'import { supabase } from "./supabaseClient";\nimport * as XLSX from "xlsx";'
);

// 2. Add the downloadFullBackup function right after the addSoftware/removeSoftware block
const insertAfter = `  const removeSoftware = async (swId) => {
    await supabase.from('software_catalog').delete().eq('id', swId);
    setSoftwareCatalog(prev => prev.filter(s => s.id !== swId));
  };`;

const backupFunction = `  const removeSoftware = async (swId) => {
    await supabase.from('software_catalog').delete().eq('id', swId);
    setSoftwareCatalog(prev => prev.filter(s => s.id !== swId));
  };

  // ── Excel Backup System ──────────────────────────────────────────────────────
  const [backupLoading, setBackupLoading] = React.useState(false);

  const downloadFullBackup = async () => {
    setBackupLoading(true);
    try {
      const wb = XLSX.utils.book_new();

      // Fetch all tables
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
            // Flatten JSONB columns to strings for Excel
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
        } catch (e) {
          console.warn('Backup skip table:', t.name, e.message);
        }
      }

      // Generate and download
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
      const timeStr = now.toTimeString().slice(0, 5).replace(':', '');
      XLSX.writeFile(wb, \`MateriaVolume_CRM_Backup_\${dateStr}_\${timeStr}.xlsx\`);

      // Store last backup timestamp
      localStorage.setItem('crm_last_backup', now.toISOString());
    } catch (e) {
      alert('Backup failed: ' + e.message);
      console.error('Backup error:', e);
    }
    setBackupLoading(false);
  };

  // Auto-backup tracker: increment counter on each save, prompt backup every 20 saves
  const incrementBackupCounter = () => {
    const count = parseInt(localStorage.getItem('crm_backup_counter') || '0', 10) + 1;
    localStorage.setItem('crm_backup_counter', String(count));
    if (count % 20 === 0) {
      const lastBackup = localStorage.getItem('crm_last_backup');
      const msg = lastBackup 
        ? \`You've made \${count} changes since your last backup (\\n\${new Date(lastBackup).toLocaleString()}).\\n\\nDownload a backup now?\`
        : \`You've made \${count} changes and haven't backed up yet.\\n\\nDownload a backup now?\`;
      if (window.confirm(msg)) downloadFullBackup();
    }
  };`;

if (content.includes(insertAfter)) {
  content = content.replace(insertAfter, backupFunction);
}

// 3. Add backup trigger to saveLead
content = content.replace(
  `      if (data) setLeads(p => [...p, data]);
    }
    setModal(null);
  };
  const deleteLead`,
  `      if (data) setLeads(p => [...p, data]);
    }
    incrementBackupCounter();
    setModal(null);
  };
  const deleteLead`
);

// 4. Add backup trigger to saveProject
content = content.replace(
  `      if (data) setProjects(p => [...p, data]);
    }
    setModal(null);
  };
  const togglePaid`,
  `      if (data) setProjects(p => [...p, data]);
    }
    incrementBackupCounter();
    setModal(null);
  };
  const togglePaid`
);

// 5. Add backup trigger to savePartner
content = content.replace(
  `      if (data) setPartners(p => [...p, data]);
    }
    setModal(null);
  };
  const deletePartner`,
  `      if (data) setPartners(p => [...p, data]);
    }
    incrementBackupCounter();
    setModal(null);
  };
  const deletePartner`
);

// 6. Add the backup button in the sidebar, right before the logout button
const logoutSection = `        <div className="lang-switcher" style={{ margin: "0 16px", marginBottom: "24px" }}>
          <button className="lang-btn" onClick={() => supabase.auth.signOut()} style={{ width: "100%", justifyContent: "center", color: "var(--accent)" }}>
            {t.logout || "Logout"}
          </button>
        </div>`;

const backupButton = `        <div className="lang-switcher" style={{ margin: "0 16px", marginBottom: "10px" }}>
          <button className="lang-btn" onClick={downloadFullBackup} disabled={backupLoading} style={{ width: "100%", justifyContent: "center", color: "var(--success, #4ade80)", fontWeight: 600 }}>
            {backupLoading ? "⏳ Exporting..." : "⬇ Backup (.xlsx)"}
          </button>
        </div>

        <div className="lang-switcher" style={{ margin: "0 16px", marginBottom: "24px" }}>
          <button className="lang-btn" onClick={() => supabase.auth.signOut()} style={{ width: "100%", justifyContent: "center", color: "var(--accent)" }}>
            {t.logout || "Logout"}
          </button>
        </div>`;

if (content.includes(logoutSection)) {
  content = content.replace(logoutSection, backupButton);
}

fs.writeFileSync(path, content, 'utf8');
console.log('✅ Excel backup system added to App.jsx');
