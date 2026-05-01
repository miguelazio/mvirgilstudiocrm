const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add Database Settings button
const dbSettingsBtn = `
        <div className="lang-switcher" style={{ margin: "0 16px", marginBottom: "10px" }}>
          <button className="lang-btn" onClick={() => setModal({ type: "db_settings", data: null })} style={{ width: "100%", justifyContent: "center", color: "var(--accent)" }}>
            ⚙️ DB Settings
          </button>
        </div>
`;

if (!content.includes('type: "db_settings"')) {
    const restoreBtnEnd = '⬆ Restore (.xlsx)</button>\n        </div>';
    content = content.replace(restoreBtnEnd, restoreBtnEnd + dbSettingsBtn);
}

// 2. Add DbSettingsModal component at the end of the file or near other modals
const dbSettingsModal = `
function DbSettingsModal({ onClose }) {
  const [url, setUrl] = React.useState(localStorage.getItem('supabase_url') || "https://ayfxscdfcyowyeaktnnn.supabase.co");
  const [key, setKey] = React.useState(localStorage.getItem('supabase_key') || "sb_publishable_0j-KuWXh1xwik2RV53jJXA_IqP_3gq2");

  const handleSave = () => {
    if (window.confirm("Switch database? The app will reload.")) {
      updateSupabaseConfig(url, key);
    }
  };

  const handleReset = () => {
    if (window.confirm("Reset to default database?")) {
      resetSupabaseConfig();
    }
  };

  return <>
    <div className="modal-title">Database Settings</div>
    <div className="form-group">
      <label className="form-label">Supabase URL</label>
      <input className="form-input" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://your-project.supabase.co" />
    </div>
    <div className="form-group">
      <label className="form-label">Anon Key</label>
      <input className="form-input" value={key} onChange={e => setKey(e.target.value)} placeholder="your-anon-key" />
    </div>
    <div className="modal-footer" style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
      <button className="btn btn-ghost" style={{ color: "var(--danger)" }} onClick={handleReset}>Reset to Default</button>
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave}>Save & Reload</button>
      </div>
    </div>
  </>;
}
`;

content += dbSettingsModal;

// 3. Add modal trigger for db_settings in the main modal switch
content = content.replace(
  '{modal.type === "messages" && <MessagesManagerModal t={t} customMessages={customMessages} setCustomMessages={setCustomMessages} onClose={() => setModal(null)} />}',
  '{modal.type === "messages" && <MessagesManagerModal t={t} customMessages={customMessages} setCustomMessages={setCustomMessages} onClose={() => setModal(null)} />}\n            {modal.type === "db_settings" && <DbSettingsModal onClose={() => setModal(null)} />}'
);

fs.writeFileSync(filePath, content);
console.log("Successfully added DB Settings to App.jsx.");
