import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ayfxscdfcyowyeaktnnn.supabase.co';
const supabaseAnonKey = 'sb_publishable_0j-KuWXh1xwik2RV53jJXA_IqP_3gq2';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase.from('project_types').select('*').limit(1);
  console.log('project_types:', error ? error.message : 'EXISTS');
  
  const { data: d2, error: e2 } = await supabase.from('global_project_phases').select('*').limit(1);
  console.log('global_project_phases:', e2 ? e2.message : 'EXISTS');
}

check();
