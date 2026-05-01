const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add state for draftLeads
const stateInsertion = '  const [leads, setLeads] = React.useState([]);\n  const [draftLeads, setDraftLeads] = React.useState([]);';
content = content.replace('  const [leads, setLeads] = React.useState([]);', stateInsertion);

// 2. Add fetch logic for draftLeads
const fetchInsertion = `
      const { data: dl } = await supabase.from('draft_leads').select('*').order('created_at', { ascending: false });
      if (dl) setDraftLeads(dl);
`;
content = content.replace("if (l) setLeads(l);", "if (l) setLeads(l);" + fetchInsertion);

// 3. Add save/delete/promote logic for draftLeads
const logicInsertion = `
  const saveDraftLead = async (d) => {
    const payload = { ...d };
    if (d.id) {
      const { data, error } = await supabase.from('draft_leads').update(payload).eq('id', d.id).select().single();
      if (data) setDraftLeads(prev => prev.map(x => x.id === d.id ? data : x));
    } else {
      const { data, error } = await supabase.from('draft_leads').insert([payload]).select().single();
      if (data) setDraftLeads(prev => [data, ...prev]);
    }
    setModal(null);
  };

  const deleteDraftLead = async (id) => {
    if (!window.confirm("Delete this draft?")) return;
    await supabase.from('draft_leads').delete().eq('id', id);
    setDraftLeads(prev => prev.filter(x => x.id !== id));
  };

  const promoteToLead = async (draft) => {
    if (!window.confirm("Promote this draft to a full lead?")) return;
    const leadPayload = {
      company: draft.company,
      notes: \`Source: Draft List\\nWebsite: \${draft.website || 'N/A'}\\nNotes: \${draft.notes || ''}\`,
      status: 0,
      createdAt: new Date().toISOString().split("T")[0]
    };
    const { data, error } = await supabase.from('leads').insert([leadPayload]).select().single();
    if (data) {
      setLeads(prev => [...prev, data]);
      await supabase.from('draft_leads').delete().eq('id', draft.id);
      setDraftLeads(prev => prev.filter(x => x.id !== draft.id));
      alert("Successfully promoted to Leads!");
    } else {
      alert("Error promoting lead: " + error.message);
    }
  };
`;
content = content.replace("  const saveJob = async (d) => {", logicInsertion + "\n  const saveJob = async (d) => {");

// 4. Add translations for Drafts
content = content.replace('    none: "None",', '    none: "None",\n    drafts: "Draft List",\n    add_draft: "+ Add Draft",\n    promote: "Promote",');
content = content.replace('    none: "Nenhum",', '    none: "Nenhum",\n    drafts: "Lista de Rascunhos",\n    add_draft: "+ Adicionar Rascunho",\n    promote: "Promover",');

// 5. Add Drafts sub-tab in Pipeline
const subTabInsertion = `
            <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
              <button className={\`btn btn-sm \${!showDrafts ? 'btn-primary' : 'btn-ghost'}\`} onClick={() => setShowDrafts(false)}>{t.pipeline}</button>
              <button className={\`btn btn-sm \${showDrafts ? 'btn-primary' : 'btn-ghost'}\`} onClick={() => setShowDrafts(true)}>{t.drafts}</button>
            </div>
`;
// Need to add showDrafts state too
content = content.replace('  const [tab, setTab] = React.useState("pipeline");', '  const [tab, setTab] = React.useState("pipeline");\n  const [showDrafts, setShowDrafts] = React.useState(false);');

// Insert sub-tab inside pipeline check
content = content.replace('{tab === "pipeline" && <>', '{tab === "pipeline" && <>\n\n' + subTabInsertion);

// 6. Add Drafts table view
const draftsView = `
            {showDrafts ? (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>{t.th_company}</th>
                      <th>Website</th>
                      <th>{t.lbl_notes}</th>
                      <th>{t.th_status}</th>
                      <th>{t.th_actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {draftLeads.length === 0 && <tr><td colSpan={5}><div className="empty">No drafts yet. Start researching!</div></td></tr>}
                    {draftLeads.map(d => (
                      <tr key={d.id}>
                        <td><strong>{d.company}</strong></td>
                        <td><a href={d.website} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>{d.website}</a></td>
                        <td style={{ fontSize: 11, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.notes}</td>
                        <td><span className="badge badge-custom">{d.status}</span></td>
                        <td>
                          <div style={{ display: "flex", gap: 5 }}>
                            <button className="btn btn-ghost btn-sm" onClick={() => setModal({ type: "draft", data: d })}>{t.edit}</button>
                            <button className="btn btn-ghost btn-sm" style={{ color: "var(--won)" }} onClick={() => promoteToLead(d)}>{t.promote}</button>
                            <button className="btn btn-ghost btn-sm" style={{ color: "var(--danger)" }} onClick={() => deleteDraftLead(d.id)}>{t.delete}</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ marginTop: 20 }}>
                  <button className="btn btn-primary" onClick={() => setModal({ type: "draft", data: null })}>{t.add_draft}</button>
                </div>
              </div>
            ) : (
`;
// Need to close the else block after the original pipeline content
content = content.replace('{viewMode === "table" ? (', draftsView + '\n            {viewMode === "table" ? (');

// Close the drafts conditional block
// We need to find where the original pipeline content ends. It ends before the content closing div.
// This is tricky. Let's look for the end of the pipeline section.
content = content.replace('            )}', '            )}\n            )}');

// 7. Add DraftModal component
const draftModalComp = `
function DraftModal({ t, data, onSave, onClose }) {
  const [f, setF] = useState(data || { company: "", website: "", notes: "", status: "Researching" });
  const s = (k, v) => setF(p => ({ ...p, [k]: v }));
  return <>
    <div className="modal-title">{data ? t.edit : t.add_draft}</div>
    <div className="form-group"><label className="form-label">{t.th_company}</label><input className="form-input" value={f.company} onChange={e => s("company", e.target.value)} /></div>
    <div className="form-group"><label className="form-label">Website</label><input className="form-input" value={f.website} onChange={e => s("website", e.target.value)} placeholder="https://..." /></div>
    <div className="form-group"><label className="form-label">{t.lbl_notes}</label><textarea className="form-input" style={{ minHeight: 100 }} value={f.notes} onChange={e => s("notes", e.target.value)} /></div>
    <div className="form-group">
      <label className="form-label">{t.th_status}</label>
      <select className="form-select" value={f.status} onChange={e => s("status", e.target.value)}>
        <option value="Researching">Researching</option>
        <option value="Ready to Contact">Ready to Contact</option>
        <option value="Hold">Hold</option>
      </select>
    </div>
    <div className="modal-footer">
      <button className="btn btn-ghost" onClick={onClose}>{t.cancel}</button>
      <button className="btn btn-primary" onClick={() => onSave(f)}>{t.save}</button>
    </div>
  </>;
}
`;
content += "\n" + draftModalComp;

// 8. Register DraftModal in main modal switch
content = content.replace('{modal.type === "messages" && <MessagesModal', '{modal.type === "draft" && <DraftModal t={t} data={modal.data} onSave={saveDraftLead} onClose={() => setModal(null)} />}\n            {modal.type === "messages" && <MessagesModal');

fs.writeFileSync(filePath, content);
console.log("Successfully implemented Draft List (Research) functionality.");
