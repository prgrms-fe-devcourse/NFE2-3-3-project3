import { supabase } from ".";

// CREATE
/**
 *
 * @param {object} body uid, test_center_id, score, correct_count
 * @returns
 */
const add = async (body) => {
  try {
    const { data, error } = await supabase
      .from("test_result")
      .insert([body])
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
  }
};

// READ
/**
 * @description 시험내역에 사용되는 API
 * @param {*} userId
 * @returns
 */
const getAllByUserId = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("test_result")
      .select("*, test_center(*, workbook(id, title, description))")
      .eq("uid", userId);

    const results = await Promise.all(
      data.map(async (test_result) => {
        const { data: users, error } = await supabase
          .from("test_result")
          .select("user_info(name, avatar_url)")
          .eq("test_center_id", test_result.test_center_id);

        if (error) throw error;
        return {
          ...test_result,
          users,
          workbook: test_result.test_center.workbook,
        };
      }),
    );

    if (error) throw error;
    return results;
  } catch (error) {
    console.error(error);
  }
};

/**
 *
 * @description 시험 내역 검색에 사용하는 API
 * @param {String} userId
 * @param {String} keyword 검색 키워드
 * @param {String} startDate YYYY-MM-DD
 * @param {String} endDate YYYY-MM-DD
 * @returns
 */
const search = async (userId, keyword, startDate, endDate) => {
  try {
    let query = supabase
      .from("test_result")
      .select("*, test_center(*, workbook(id, title, description))")
      .eq("uid", userId);

    if (keyword) {
      query
        .filter("test_center.workbook.title", "ilike", `%${keyword}%`)
        .filter("test_center.workbook.description", "ilike", `%${keyword}%`);
    }
    if (startDate) {
      query.gte("created_at", startDate); // 시작 날짜 조건
    }
    if (endDate) {
      query.lte("created_at", endDate);
    }

    const { data, error } = await query;

    const results = await Promise.all(
      data.map(async (test_result) => {
        const { data: users, error } = await supabase
          .from("test_result")
          .select("user_info(name, avatar_url)")
          .eq("test_center_id", test_result.test_center_id);

        if (error) throw error;
        return {
          ...test_result,
          users,
          workbook: test_result.test_center.workbook,
        };
      }),
    );
    if (!results || !results[0].workbook) return [];

    if (error) throw error;
    return results;
  } catch (error) {
    console.error(error);
  }
};

export const testResultAPI = {
  add,
  getAllByUserId,
  search,
};
