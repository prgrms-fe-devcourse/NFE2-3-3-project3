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

//내가 고른 선택지
const getMyOption = async (userId, testCenterId) => {
  try {
    const { data, error } = await supabase
      .from("problem_history")
      .select(
        `
        uid,
        problem_id,
        test_center_id,
        status,
        my_option,
        created_at
      `,
      )
      .eq("uid", userId)

      .order("created_at", { ascending: false }); // 최신 데이터 우선

    if (error) {
      console.error("Supabase 쿼리 오류:", error.message);
      return [];
    }

    if (!data || data.length === 0) {
      console.warn("조건에 맞는 데이터가 없습니다.");
      return [];
    }

    return data;
  } catch (err) {
    console.error("getMyOption 오류:", err.message);
    return [];
  }
};

export const problemHistoryAPI = {
  add,
  getUid,
  getMyOption,
};
