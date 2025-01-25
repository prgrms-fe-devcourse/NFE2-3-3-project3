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

const getWorkbookLikeCount = async (workbook_id) => {
  const { count, error } = await supabase
    .from("workbook_like")
    .select("*", { count: "exact", head: true })
    .eq("workbook_id", workbook_id);

  if (error) {
    console.error("Error fetching like count:", error);
    return null;
  }

  return count;
};

export const workbookLikeAPI = {
  add,
  getUid,
  getWorkbookLikeCount,
};
