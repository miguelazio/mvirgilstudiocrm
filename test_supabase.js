import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ayfxscdfcyowyeaktnnn.supabase.co';
const supabaseAnonKey = 'sb_publishable_0j-KuWXh1xwik2RV53jJXA_IqP_3gq2';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUpdate() {
  const payload = {
    customPhases: ["Test 1", "Test 2"]
  };
  
  // We don't want to actually modify a real row, so we use a fake UUID
  const { data, error } = await supabase.from('projects').update(payload).eq('id', '00000000-0000-0000-0000-000000000000');
  
  if (error) {
    console.error("Supabase Error:", JSON.stringify(error, null, 2));
  } else {
    console.log("Success, customPhases column accepts arrays!");
  }
}

testUpdate();
