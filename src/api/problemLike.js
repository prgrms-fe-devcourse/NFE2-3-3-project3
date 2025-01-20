import { supabase } from ".";

// CREATE
const add = async (uid, problem_id) => {
  await supabase.from("problem_like").insert([{ uid, problem_id }]).select();
  console.log(data);
};

// READ
const getUid = async (uid) => {
  await supabase.from("problem_like").select("problem_id").eq("uid", uid);
};

export const problemLikeAPI = {
  add,
  getUid,
};
