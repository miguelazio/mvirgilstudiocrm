const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add restoreData function after downloadFullBackup
const restoreFunction = `
  const [restoreLoading, setRestoreLoading] = React.useState(false);
  const fileInputRef = React.useRef(null);

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm("ARE YOU SURE? This will attempt to restore all data from the Excel file into your database. Existing rows with the same IDs will be updated.")) return;

    setRestoreLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const bstr = evt.target.result;
          const wb = XLSX.read(bstr, { type: 'binary' });

          for (const sheetName of wb.SheetNames) {
            const ws = wb.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(ws);
            if (data.length === 0 || (data.length === 1 && data[0].info === 'No data')) continue;

            // Un-flatten JSON strings
            const cleanData = data.map(row => {
              const clean = {};
              Object.entries(row).forEach(([k, v]) => {
                if (typeof v === 'string' && (v.startsWith('{') || v.startsWith('['))) {
                  try { clean[k] = JSON.parse(v); } catch (e) { clean[k] = v; }
                } else {
                  clean[k] = v;
                }
              });
              return clean;
            });

            // Upsert into table
            const tableName = sheetName; // sheetName was derived from table name
            const { error } = await supabase.from(tableName).upsert(cleanData);
            if (error) console.error("Restore error in table " + tableName + ":", error.message);
          }
          alert("Restore complete! Refreshing app...");
          window.location.reload();
        } catch (err) {
          alert("Error parsing file: " + err.message);
        }
      };
      reader.readAsBinaryString(file);
    } catch (err) {
      alert("Restore failed: " + err.message);
    }
    setRestoreLoading(false);
  };
`;

if (!content.includes('const [restoreLoading')) {
    content = content.replace('const [backupLoading, setBackupLoading] = React.useState(false);', 'const [backupLoading, setBackupLoading] = React.useState(false);' + restoreFunction);
}

// 2. Add Restore button below Backup button
const restoreBtn = `
        <div className="lang-switcher" style={{ margin: "0 16px", marginBottom: "10px" }}>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept=".xlsx, .xls" />
          <button className="lang-btn" onClick={handleRestoreClick} disabled={restoreLoading} style={{ width: "100%", justifyContent: "center", color: "var(--accent)" }}>
            {restoreLoading ? "..." : "⬆ Restore (.xlsx)"}
          </button>
        </div>
`;

if (!content.includes('onClick={handleRestoreClick}')) {
    const backupBtnEnd = '</div>\n        {/* ── Theme Switcher ── */}';
    content = content.replace(backupBtnEnd, '</div>' + restoreBtn + '\n        {/* ── Theme Switcher ── */}');
}

fs.writeFileSync(filePath, content);
console.log("Successfully added restore system to App.jsx.");
