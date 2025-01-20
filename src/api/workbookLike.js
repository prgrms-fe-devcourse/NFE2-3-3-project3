import { supabase } from ".";

// CREATE
const add = async (uid, workbook_id) => {
  await supabase.from("workbook_like").insert([{ uid, workbook_id }]).select();
  console.log(data);
};

// READ
const getUid = async (uid) => {
  await supabase.from("workbook_like").select("workbook_id").eq("uid", uid);
};

export const workbookLikeAPI = {
  add,
  getUid,
};
