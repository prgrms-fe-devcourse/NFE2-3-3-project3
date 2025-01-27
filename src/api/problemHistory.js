import { supabase } from ".";

// CREATE
/**
 *
 * @param {Array} body {uid, problem_id, test_center_id}
 * @returns
 */
const add = async (body) => {
  const { data, error } = await supabase
    .from("problem_history")
    .insert([body])
    .select();

  if (error) throw error;
  return data;
};

// READ
const getUid = async (uid) => {
  await supabase.from("workbook_like").select("problem_id").eq("uid", uid);
};

export const problemHistoryAPI = {
  add,
  getUid,
};
