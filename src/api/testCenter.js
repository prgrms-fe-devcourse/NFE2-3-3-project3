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
        description,
        workbook_problem(count)
      ),
      confirmed_count:invite(count).filter(participate.eq(true))
    `,
    )
    .eq("uid", uid);
  if (error) throw error;
  return data;
};

/**
 * @description 시험에 사용되는 정보들을 반환하는 API
 * @param {Number} testCenterId 시험장 id
 * @returns
 */
const getAllByTestCenterId = async (testCenterId) => {
  try {
    const { data, error } = await supabase
      .from("test_center")
      .select("*, workbook(*, workbook_problem(problem(*)))")
      .eq("id", testCenterId)
      .single();

    const problems = [...data.workbook.workbook_problem];
    delete data.workbook.workbook_problem;

    if (error) throw error;
    return { ...data, problems };
  } catch (error) {
    console.error(error);
  }
};

const checkIsAuthorized = async (userId, testCenterId) => {
  try {
    const invited = supabase
      .from("invite")
      .select("*", { count: "exact", head: true })
      .eq("test_center_id", testCenterId)
      .eq("target_uid", userId);

    const made = supabase
      .from("test_center")
      .select("*", { count: "exact", head: true })
      .eq("id", testCenterId)
      .eq("uid", userId);

    const [
      { count: invitedCount, error: invitedError },
      { count: madeCount, madeError },
    ] = await Promise.all([invited, made]);

    if (invitedError) throw invitedError;
    if (madeError) throw madeError;
    return invitedCount + madeCount > 0;
  } catch (error) {
    console.error(error);
  }
};

// UPDATE

const updateStartTime = async (start_time, id) => {
  await supabase.from("test_center").update({ start_time }).eq("id", id);
};

const updateEndTime = async (end_time, id) => {
  await supabase.from("test_center").update({ end_time }).eq("id", id);
};

const deleteTestCenter = async (id) => {
  try {
    const { data, error } = await supabase
      .from("test_center")
      .delete()
      .eq("id", id)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const testCenterAPI = {
  add,
  getAll,
  getUid,
  getAllByTestCenterId,
  checkIsAuthorized,
  updateStartTime,
  updateEndTime,
  getAllFields,
  deleteTestCenter,
};
