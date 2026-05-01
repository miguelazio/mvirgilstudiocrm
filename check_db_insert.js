import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ayfxscdfcyowyeaktnnn.supabase.co';
const supabaseAnonKey = 'sb_publishable_0j-KuWXh1xwik2RV53jJXA_IqP_3gq2';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase.from('project_types').insert([{ key: 'test_insert', label_en: 'test', label_pt: 'test', phases: [] }]).select();
  console.log('insert test:', error ? error.message : data);
  if (!error) {
     await supabase.from('project_types').delete().eq('key', 'test_insert');
  }
}

check();
