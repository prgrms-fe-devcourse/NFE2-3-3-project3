import { supabase } from ".";

// CREATE
/**
 *
 * @param {object} body uid, workbook_id, start_time, end_time
 * @returns
 */
const add = async (body) => {
  await supabase.from("test_center").insert([body]).select();
};

// READ
const getAll = async () => {
  await supabase.from("test_center").select("workbook_id, created_at");
};
const getUid = async (uid) => {
  await supabase
    .from("test_center")
    .select("workbook_id, created_at")
    .eq("uid", uid);
};

// UPDATE

const updateStartTime = async (start_time, id) => {
  await supabase.from("test_center").update({ start_time }).eq("id", id);
};

const updateEndTime = async (end_time, id) => {
  await supabase.from("test_center").update({ end_time }).eq("id", id);
};

export const testCenterAPI = {
  add,
  getAll,
  getUid,
  updateStartTime,
  updateEndTime,
};
