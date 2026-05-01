-- 1. Create the project_types table
CREATE TABLE public.project_types (
    id SERIAL PRIMARY KEY,
    key TEXT NOT NULL,
    label_en TEXT NOT NULL,
    label_pt TEXT NOT NULL,
    phases JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- 2. Insert the default CRM project types and phases
INSERT INTO public.project_types (key, label_en, label_pt, phases) VALUES
(
    'ArchViz', 
    'ArchViz', 
    'ArchViz', 
    '["Modeling/Import", "Materials/Shading", "Lighting", "Rendering", "Post-Production/Compositing"]'::jsonb
),
(
    'VFX', 
    'VFX', 
    'VFX', 
    '["Matchmove/Tracking", "Rotoscopy", "Modeling/Animation", "FX/Simulation", "Lighting/Rendering", "Compositing"]'::jsonb
),
(
    'Interactive Application', 
    'Interactive Application', 
    'Aplicação Interativa', 
    '["UI/UX Design", "Core Logic/Mechanics", "Asset Integration", "Optimization", "Testing/QA", "Deployment"]'::jsonb
),
(
    'Interactive Webpages', 
    'Interactive Webpages', 
    'Páginas Web Interativas', 
    '["Wireframing", "Design/UI", "Frontend Dev", "WebGL/3D Integration", "Responsive Testing", "Launch"]'::jsonb
),
(
    'Immersive Projects', 
    'Immersive Projects', 
    'Projetos Imersivos', 
    '["Concept/Storyboarding", "Prototyping", "Asset Creation", "Engine Implementation", "User Testing", "Final Polish"]'::jsonb
),
(
    '3D Generalist', 
    '3D Generalist', 
    'Generalista 3D', 
    '["Concept", "Modeling", "Rigging/Animation", "Texturing/Shading", "Lighting", "Rendering"]'::jsonb
);
