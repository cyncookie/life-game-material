const SUPABASE_URL = "https://xamotienargydcwsvjwb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_ozjxIIDAr5fPvvdaq2OBVw_Zh3B4WxA";
const SAVE_SLOT_KEY = "default";

let supabaseClientPromise = null;

async function getSupabaseClient() {
  if (!supabaseClientPromise) {
    supabaseClientPromise = import("https://esm.sh/@supabase/supabase-js@2").then(({ createClient }) =>
      createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    );
  }
  return supabaseClientPromise;
}

async function fetchRemoteSave() {
  const client = await getSupabaseClient();
  const { data, error } = await client
    .from("life_game_saves")
    .select("save_data, updated_at")
    .eq("slot_key", SAVE_SLOT_KEY)
    .maybeSingle();

  if (error) throw error;
  return data || null;
}

async function upsertRemoteSave(saveData) {
  const client = await getSupabaseClient();
  const payload = {
    slot_key: SAVE_SLOT_KEY,
    save_data: saveData,
  };

  const { error } = await client.from("life_game_saves").upsert(payload, {
    onConflict: "slot_key",
  });

  if (error) throw error;
}

window.lifeGameSync = {
  fetchRemoteSave,
  upsertRemoteSave,
};
