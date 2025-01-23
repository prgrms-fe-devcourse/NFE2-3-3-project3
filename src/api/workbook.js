import { supabase } from ".";

// CREATE
const add = async (uid, title, description) => {
  await supabase
    .from("workbook")
    .insert([{ uid, title, description }])
    .select();
};

// READ
const getAll = async () => {
  await supabase.from("workbook").select("title, description, created_at");
};

const getUid = async (uid) => {
  const { data, error } = await supabase
    .from("workbook")
    .select("*")
    .eq("uid", uid);
  if (error) throw error;
  return data;
};

// UPDATE
const updated_at = new Date();

const updateTilte = async (title, id) => {
  await supabase.from("workbook").update({ title, updated_at }).eq("id", id);
};

const updateDescription = async (description, id) => {
  await supabase
    .from("workbook")
    .update({ description, updated_at })
    .eq("id", id);
};

// DELETE
const remove = async (id) => {
  await supabase.from("workbook").delete().eq("id", id);
};
const checkWorkbookInsert = async () => {
  const { data, error } = await supabase
    .from("workbook")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error fetching workbook data:", error);
  } else {
    if (data && data.length > 0) {
      console.log("Latest workbook entry:", data[0]);
    } else {
      console.log("No workbook entries found");
    }
  }
};
export const workbookAPI = {
  add,
  getAll,
  getUid,
  updateTilte,
  updateDescription,
  remove,
  checkWorkbookInsert,
};
