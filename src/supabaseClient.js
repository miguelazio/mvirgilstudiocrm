import { createClient } from '@supabase/supabase-js';

const DEFAULT_URL = 'https://ayfxscdfcyowyeaktnnn.supabase.co';
const DEFAULT_KEY = 'sb_publishable_0j-KuWXh1xwik2RV53jJXA_IqP_3gq2';

const savedUrl = localStorage.getItem('supabase_url') || DEFAULT_URL;
const savedKey = localStorage.getItem('supabase_key') || DEFAULT_KEY;

export const supabase = createClient(savedUrl, savedKey);

export const updateSupabaseConfig = (url, key) => {
  localStorage.setItem('supabase_url', url);
  localStorage.setItem('supabase_key', key);
  window.location.reload();
};

export const resetSupabaseConfig = () => {
  localStorage.removeItem('supabase_url');
  localStorage.removeItem('supabase_key');
  window.location.reload();
};
