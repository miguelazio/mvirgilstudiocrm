import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ayfxscdfcyowyeaktnnn.supabase.co';
const supabaseAnonKey = 'sb_publishable_0j-KuWXh1xwik2RV53jJXA_IqP_3gq2';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase.from('settings').select('*').limit(1);
  console.log('settings:', error ? error.message : data);
  const { data: d2, error: e2 } = await supabase.from('config').select('*').limit(1);
  console.log('config:', e2 ? e2.message : d2);
}

check();
