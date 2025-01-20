import { supabase } from ".";

// CREATE
/**
 *
 * @param {object} body uid, test_center_id, score, correct_count
 * @returns
 */
const add = async (body) => {
  await supabase.from("test_result").insert([body]).select();
};

// READ

const getUid = async (uid) => {
  await supabase
    .from("test_result")
    .select("test_center_id,score,correct_count")
    .eq("uid", uid);
};

export const testResultAPI = {
  add,
  getUid,
};
