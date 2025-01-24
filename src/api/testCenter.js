import { supabase } from ".";

// CREATE
/**
 *
 * @param {object} body uid, workbook_id, start_time, end_time
 * @returns
 */
const add = async (body) => {
  try {
    const { data, error } = await supabase
      .from("test_center")
      .insert([body])
      .select();

    if (error) throw error;
    return data[0]; // 첫 번째 객체 반환
  } catch (error) {
    console.error("시험장 생성 중 오류:", error);
    return null;
  }
};

// READ
const getAll = async () => {
  const { data, error } = await supabase
    .from("test_center")
    .select("workbook_id, created_at");
  if (error) throw error;
  return data;
};

const getUid = async (uid) => {
  const { data, error } = await supabase
    .from("test_center")
    .select("workbook_id, created_at")
    .eq("uid", uid);
  if (error) throw error;
  return data;
};

const getAllFields = async (uid) => {
  const { data, error } = await supabase
    .from("test_center")
    .select(
      `
      *,
      workbook:workbook_id (
        title,
        workbook_problem(count)
      ),
      confirmed_count:invite(count).filter(participate.eq(true))
    `,
    )
    .eq("uid", uid);
  if (error) throw error;
  return data;
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
  getAllFields,
};
