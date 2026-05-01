const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// The whole T object and some constants after it seem to be the main casualty.
// Let's try to find the start of T and the start of App() and replace everything between.

const tStart = 'const T = {';
const appStart = 'export default function App() {';

const tStartIdx = content.indexOf(tStart);
const appStartIdx = content.indexOf(appStart);

if (tStartIdx !== -1 && appStartIdx !== -1) {
    const newConsts = `const T = {
  en: {
    pipeline: "Pipeline B2B", projects: "Active Projects", vault: "MateriaVault",
    content: "Content Calendar", jobs: "Plan B", topbar_jobs: "Plan B — Job Hunt",
    users: "User Management",
    software: "Software", topbar_software: "Software Manager",
    kanban: "⊞ Kanban", table: "☰ Table",
    sw_total: "Total Software", sw_in_catalog: "in catalog", sw_in_use: "In Use", sw_across_projects: "across projects",
    sw_categories: "Categories", sw_available: "defined",
    sw_add: "+ Add Software", sw_search: "Search software…",
    sw_cat_all: "All",
    sw_used_in: "Used in", sw_projects_label: "projects", sw_no_projects: "Not used yet",
    sw_name_ph: "Software name", sw_category_ph: "Category",
    sw_cat_labels: { dcc: "3D / DCC", sculpt: "Sculpting", tex: "Texturing", track: "Tracking", light: "Lighting / Render", comp: "Compositing", ai: "AI Tools", mgmt: "Management", other: "Other" },
    add_lead: "+ Add Lead", new_project: "+ New Project",
    new_post: "+ New Post", add_application: "+ Add Application",
    edit: "Edit", save: "Save", cancel: "Cancel", delete: "Delete",
    total_leads: "Total Leads", in_funnel: "in funnel",
    meetings: "Meetings", sched_above: "scheduled or above",
    won: "Won", closed_clients: "closed clients",
    followups_due: "Follow-ups Due", overdue: "overdue",
    active: "Active", in_progress: "in progress",
    invoiced: "Invoiced", completed: "completed",
    fully_paid: "Fully Paid", done_label: "40/30/30 done",
    funnel_stages: ["To Contact", "1st Email Sent", "Awaiting Reply", "Meeting Scheduled", "Proposal Sent", "Won", "Lost"],
    types: ["Event Agency", "Luxury Real Estate", "Post-Production", "Museography Studio"],
    project_phases: ["Briefing & Prep", "Concept & Blocking", "Modeling & Rigging", "Texturing & Shading", "Tracking & Match", "Lighting & FX", "Render & Comp", "Delivery & Archive"],
    payment_labels: ["40% Award", "30% Beta", "30% Final"],
    post_types: ["🎬 Making-of / BTS", "✨ Showcase", "📚 Market Education"],
    post_statuses: ["Idea", "Recording", "Editing", "Published"],
    app_statuses: ["Sent", "Under Review", "Interview", "Accepted", "Rejected"],
    all: "All", type_label: "Type:", search_placeholder: "Search company / contact…",
    add_custom_type: "+ New Type", custom_type_placeholder: "Type name...",
    overdue_alert: (n, names) => \`\${n} follow-up\${n > 1 ? "s" : ""} overdue: \${names}. Time to send a message!\`,
    planb_alert: "Plan B is dormant. Activate only from Month 6 if freelance revenue is not sustaining. Job title:",
    planb_job_title: "Unreal Engine Generalist / Technical Artist",
    fu_overdue: (d) => \`\${d}d overdue\`, fu_today: "Today", fu_in: (d) => \`in \${d}d\`,
    th_company: "Company", th_type: "Type", th_contact: "Contact",
    th_status: "Status", th_followup: "Follow-up", th_actions: "Actions",
    th_position: "Position", th_platform: "Platform", th_date: "Date", th_cv: "CV", th_created_at: "Created",
    no_leads: "No leads found.", no_apps: "No applications yet.",
    edit_lead: "Edit Lead", new_lead: "New Lead",
    lbl_company: "Company / Agency", lbl_type: "Type",
    lbl_contact: "Contact (Decision Maker)", lbl_phone: "Phone", lbl_email: "Email", lbl_linkedin: "LinkedIn URL",
    lbl_funnel: "Funnel Status", lbl_followup: "Follow-up Date", lbl_created_at: "Creation Date",
    sort_date_desc: "Newest First", sort_date_asc: "Oldest First",
    lbl_notes: "Notes / Scripts", ph_notes: "Meeting notes, email scripts…",
    edit_project: "Edit Project", new_project_title: "New Project",
    lbl_proj_name: "Project Name", lbl_client: "Client",
    lbl_phase: "Current Phase", lbl_partner: "Assigned Partner", lbl_phase_tasks: "Phase Deliverables",
    ph_partner: "Hardware Ninja, etc.",
    lbl_assets: "Link Cloud de Assets", ph_assets: "https://drive.google.com/…",
    edit_post: "Edit Post", new_post_title: "New Post",
    lbl_post_type: "Post Type", lbl_post_status: "Status",
    lbl_title: "Title", lbl_body: "Content / Description", lbl_publish_date: "Publish Date",
    edit_app: "Edit Application", new_app: "New Application",
    lbl_company_studio: "Company / Studio", lbl_job_pos: "Position",
    lbl_platform: "Platform", lbl_app_date: "Application Date",
    lbl_app_status: "Status", lbl_cv: "CV Version", ph_cv: "cv_unreal_v2.pdf",
    boilerplates: "⚙ Boilerplates", money_shots: "🎬 Money Shots", case_studies: "📋 Case Studies",
    vault_upload: "📤 Upload File", vault_add_url: "🔗 Add URL", vault_category: "Category", vault_uploading: "Uploading…",
    vault_loading: "Loading files…", vault_no_files: "No files uploaded yet.",
    vault_open: "Open", vault_delete: "Delete", vault_uploaded: "Uploaded",
    vault_select_file: "Select a file…", vault_drop: "or drag & drop here",
    vault_url_placeholder: "https://…", vault_url_name: "Link name", vault_add: "Add",
    vault_type_file: "📁 File", vault_type_url: "🔗 URL",
    vault_sync: "↻ Sync Drive", vault_syncing: "Syncing…", vault_synced: "Synced!",
    vault_categories: { Boilerplates: "Boilerplates", MoneyShots: "Money Shots", CaseStudies: "Case Studies", Contracts: "Contracts", Renders: "Renders", References: "References", Other: "Other" },
    vault_edit_item: "Edit Item",
    vault_manage_categories: "Manage Categories",
    btn_scripts: "📜 Scripts",
    manage_scripts: "Manage Custom Messages",
    new_script: "+ New Script",
    script_title: "Message Title (e.g. 1st Outreach)",
    script_content: "Message Content",
    choose_script: "— Select a Custom Message —",
    apply_script: "Apply to Notes",
    partners: "Partners",
    add_partner: "+ Add Partner",
    total_partners: "Total Partners",
    onboarded_partners: "Onboarded",
    partner_statuses: ["Identified", "Contacted", "Meeting Set", "Onboarded", "Inactive"],
    th_specialty: "Specialty",
    edit_partner: "Edit Partner", new_partner: "New Partner",
    lbl_specialty: "Specialty / Service",
    lbl_associated_project: "Associated Project",
    none: "None",
    manage_types_phases: "Manage Project Types & Phases",
    lbl_project_types: "Project Types",
    lbl_manage_phases: "Manage Phases",
  },
  pt: {
    pipeline: "Pipeline B2B", projects: "Projetos Ativos", vault: "MateriaVault",
    content: "Calendário de Conteúdo", jobs: "Plano B", topbar_jobs: "Plano B — Procura de Emprego",
    users: "Gestão de Utilizadores",
    software: "Software", topbar_software: "Gestor de Software",
    kanban: "⊞ Kanban", table: "☰ Tabela",
    sw_total: "Total Software", sw_in_catalog: "no catálogo", sw_in_use: "Em Uso", sw_across_projects: "em projetos",
    sw_categories: "Categorias", sw_available: "definidas",
    sw_add: "+ Adicionar Software", sw_search: "Pesquisar software…",
    sw_cat_all: "Todos",
    sw_used_in: "Usado em", sw_projects_label: "projetos", sw_no_projects: "Ainda sem projetos",
    sw_name_ph: "Nome do software", sw_category_ph: "Categoria",
    sw_cat_labels: { dcc: "3D / DCC", sculpt: "Escultura", tex: "Texturas", track: "Tracking", light: "Iluminação / Render", comp: "Composição", ai: "Ferramentas IA", mgmt: "Gestão", other: "Outros" },
    add_lead: "+ Adicionar Lead", new_project: "+ Novo Projeto",
    new_post: "+ Nova Publicação", add_application: "+ Adicionar Candidatura",
    edit: "Editar", save: "Guardar", cancel: "Cancelar", delete: "Eliminar",
    total_leads: "Total de Leads", in_funnel: "no funil",
    meetings: "Reuniões", sched_above: "agendadas ou acima",
    won: "Ganhos", closed_clients: "clientes fechados",
    followups_due: "Follow-ups em Atraso", overdue: "em atraso",
    active: "Ativos", in_progress: "em progresso",
    invoiced: "Faturados", completed: "concluídos",
    fully_paid: "Pagos na Totalidade", done_label: "40/30/30 completo",
    funnel_stages: ["Para Contactar", "1º Email Enviado", "Aguardar Resposta", "Reunião Marcada", "Proposta Enviada", "Ganho", "Perdido"],
    types: ["Agência de Eventos", "Imobiliário de Luxo", "Pós-Produção", "Estúdio de Museografia"],
    project_phases: ["Briefing & Prep", "Conceito & Blocking", "Modelação & Rigging", "Texturas & Shading", "Tracking & Match", "Iluminação & FX", "Render & Comp", "Entrega & Arquivo"],
    payment_labels: ["40% Adjudicação", "30% Beta", "30% Final"],
    post_types: ["🎬 Making-of / BTS", "✨ Showcase", "📚 Educação de Mercado"],
    post_statuses: ["Ideia", "A Gravar", "A Editar", "Publicado"],
    app_statuses: ["Enviado", "Em Análise", "Entrevista", "Aceite", "Rejeitado"],
    all: "Todos", type_label: "Tipo:", search_placeholder: "Pesquisar empresa / contacto…",
    add_custom_type: "+ Novo Tipo", custom_type_placeholder: "Nome do tipo...",
    overdue_alert: (n, names) => \`\${n} follow-up\${n > 1 ? "s" : ""} em atraso: \${names}. Está na hora de enviar mensagem!\`,
    planb_alert: "O Plano B está inativo. Ativar apenas a partir do Mês 6 se o rendimento freelance não for suficiente. Título:",
    planb_job_title: "Unreal Engine Generalist / Technical Artist",
    fu_overdue: (d) => \`\${d}d em atraso\`, fu_today: "Hoje", fu_in: (d) => \`em \${d}d\`,
    th_company: "Empresa", th_type: "Tipo", th_contact: "Contacto",
    th_status: "Estado", th_followup: "Follow-up", th_actions: "Ações",
    th_position: "Posição", th_platform: "Plataforma", th_date: "Data", th_cv: "CV", th_created_at: "Criado Em",
    no_leads: "Nenhum lead encontrado.", no_apps: "Ainda sem candidaturas.",
    edit_lead: "Editar Lead", new_lead: "Novo Lead",
    lbl_company: "Empresa / Agência", lbl_type: "Tipo",
    lbl_contact: "Contacto (Decisor)", lbl_phone: "Telemóvel", lbl_email: "Email", lbl_linkedin: "URL LinkedIn",
    lbl_funnel: "Estado do Funil", lbl_followup: "Data de Follow-up", lbl_created_at: "Data de Criação",
    sort_date_desc: "Mais Recente", sort_date_asc: "Mais Antigo",
    lbl_notes: "Notas / Scripts", ph_notes: "Notas da reunião, guiões de email…",
    edit_project: "Editar Projeto", new_project_title: "Novo Projeto",
    lbl_proj_name: "Nome do Projeto", lbl_client: "Cliente",
    lbl_phase: "Fase Atual", lbl_partner: "Parceiro Atribuído", lbl_phase_tasks: "Entregáveis da Fase",
    ph_partner: "Hardware Ninja, etc.",
    lbl_assets: "Link Cloud de Assets", ph_assets: "https://drive.google.com/…",
    edit_post: "Editar Publicação", new_post_title: "Nova Publicação",
    lbl_post_type: "Tipo de Post", lbl_post_status: "Estado",
    lbl_title: "Título", lbl_body: "Conteúdo / Descrição", lbl_publish_date: "Data de Publicação",
    edit_app: "Editar Candidatura", new_app: "Nova Candidatura",
    lbl_company_studio: "Empresa / Estúdio", lbl_job_pos: "Posição",
    lbl_platform: "Plataforma", lbl_app_date: "Data de Candidatura",
    lbl_app_status: "Estado", lbl_cv: "Versão do CV", ph_cv: "cv_unreal_v2.pdf",
    boilerplates: "⚙ Boilerplates", money_shots: "🎬 Money Shots", case_studies: "📋 Estudos de Caso",
    vault_upload: "📤 Carregar Ficheiro", vault_add_url: "🔗 Adicionar URL", vault_category: "Categoria", vault_uploading: "A carregar…",
    vault_loading: "A carregar ficheiros…", vault_no_files: "Ainda sem ficheiros carregados.",
    vault_open: "Abrir", vault_delete: "Eliminar", vault_uploaded: "Carregado",
    vault_select_file: "Selecionar ficheiro…", vault_drop: "ou arrastar aqui",
    vault_url_placeholder: "https://…", vault_url_name: "Nome do link", vault_add: "Adicionar",
    vault_type_file: "📁 Ficheiro", vault_type_url: "🔗 URL",
    vault_sync: "↻ Sincronizar Drive", vault_syncing: "A sincronizar…", vault_synced: "Sincronizado!",
    vault_categories: { Boilerplates: "Boilerplates", MoneyShots: "Money Shots", CaseStudies: "Estudos de Caso", Contracts: "Contratos", Renders: "Renders", References: "Referências", Other: "Outros" },
    vault_edit_item: "Editar Item",
    vault_manage_categories: "Gerir Categorias",
    btn_scripts: "📜 Scripts",
    manage_scripts: "Gerir Mensagens Personalizadas",
    new_script: "+ Nova Mensagem",
    script_title: "Título da Mensagem (ex: 1º Contacto)",
    script_content: "Conteúdo da Mensagem",
    choose_script: "— Escolher Mensagem —",
    apply_script: "Aplicar às Notas",
    partners: "Parceiros",
    add_partner: "+ Adicionar Parceiro",
    total_partners: "Total de Parceiros",
    onboarded_partners: "Integrados",
    partner_statuses: ["Identificado", "Contactado", "Reunião Marcada", "Integrado", "Inativo"],
    th_specialty: "Especialidade",
    edit_partner: "Editar Parceiro", new_partner: "Novo Parceiro",
    lbl_specialty: "Especialidade / Serviço",
    lbl_associated_project: "Projeto Associado",
    none: "Nenhum",
    manage_types_phases: "Gerir Tipos e Etapas de Projeto",
    lbl_project_types: "Tipos de Projeto",
    lbl_manage_phases: "Gerir Etapas",
  }
};

const STAGE_CLASS = ["s0", "s1", "s2", "s3", "s4", "s5", "s6"];
const TYPE_BADGE = ["badge-event", "badge-realestate", "badge-post", "badge-museum", "badge-custom"];
const STATUS_COLORS = ["#6b7280", "#f59e0b", "#3b82f6", "#22c55e"];

const PHASE_DATA = {
  en: Array(8).fill({ tasks: [{ desc: "Task", type: "chk" }], deliverables: "", rule: "" }),
  pt: Array(8).fill({ tasks: [{ desc: "Task", type: "chk" }], deliverables: "", rule: "" })
};

const SOFTWARE_CATEGORIES = ["dcc", "sculpt", "tex", "track", "light", "comp", "ai", "mgmt", "other"];

const DEFAULT_PROJECT_TYPES = [
  "ArchViz",
  "VFX",
  "Interactive Application",
  "Interactive Webpages",
  "Immersive Projects",
  "3D Generalist"
];

const DEFAULT_PROJECT_PHASES = {
  "ArchViz": ["Modeling/Import", "Materials/Shading", "Lighting", "Rendering", "Post-Production/Compositing"],
  "VFX": ["Matchmove/Tracking", "Rotoscopy", "Modeling/Animation", "FX/Simulation", "Lighting/Rendering", "Compositing"],
  "Interactive Application": ["UI/UX Design", "Core Logic/Mechanics", "Asset Integration", "Optimization", "Testing/QA", "Deployment"],
  "Interactive Webpages": ["Wireframing", "Design/UI", "Frontend Dev", "WebGL/3D Integration", "Responsive Testing", "Launch"],
  "Immersive Projects": ["Concept/Storyboarding", "Prototyping", "Asset Creation", "Engine Implementation", "User Testing", "Final Polish"],
  "3D Generalist": ["Concept", "Modeling", "Rigging/Animation", "Texturing/Shading", "Lighting", "Rendering"]
};

\n\n`;

    const result = content.substring(0, tStartIdx) + newConsts + content.substring(appStartIdx);
    fs.writeFileSync(filePath, result);
    console.log("Fully restored T object and constants.");
} else {
    console.error("Could not find tStart or appStart markers.");
}
