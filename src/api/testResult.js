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
      .select("*, test_center(*)")
      .eq("uid", userId);

    const results = await Promise.all(
      data.map(async (test_result) => {
        const { data: users, error } = await supabase
          .from("test_result")
          .select("user_info(avatar_url)")
          .eq("test_center_id", test_result.test_center_id);

        const { data: workbook, workbookError } = await supabase
          .from("workbook")
          .select("id, title")
          .eq("id", test_result.test_center.workbook_id)
          .single();

        if (error) throw error;
        if (workbookError) throw error;
        return { ...test_result, users, workbook };
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
          .select("user_info(avatar_url)")
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

//total_count, correct_count
const getScore = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("test_result")
      .select("total_count, correct_count")
      .eq("uid", userId);

    // 에러 처리
    if (error) throw error;

    // 데이터가 없으면 초기값 반환
    if (!data || data.length === 0) {
      console.warn("No data found for userId:", userId);
      return { total: 0, correct: 0 };
    }

    // total_count와 correct_count 합산
    const score = data.reduce(
      (acc, result) => {
        acc.total += result.total_count || 0;
        acc.correct += result.correct_count || 0;
        return acc;
      },
      { total: 0, correct: 0 },
    );

    console.log("Fetched score:", score);
    return score;
  } catch (error) {
    console.error("Error fetching score:", error);
    return { total: 0, correct: 0 };
  }
};

//평균값 계산
const getAverage = async (testCenterId) => {
  try {
    // 특정 시험장에 속한 모든 사용자의 데이터를 가져옴
    const { data, error } = await supabase
      .from("test_result")
      .select("correct_count")
      .eq("test_center_id", testCenterId);

    if (error) throw error;
    // 데이터가 없을 경우 0 반환
    if (!data || data.length === 0) {
      console.warn("데이터가 없습니다");
      return 0;
    }

    // 모든 correct_count의 평균
    const totalScore = data.reduce(
      (acc, result) => acc + (result.correct_count || 0),
      0,
    );
    const averageScore = totalScore / data.length;
    return Math.round(averageScore);
  } catch (error) {
    console.error("Error calculating average score:", error);
    return 0;
  }
};

//시험장의 user들의 평균 계산
const getScoresByTestCenter = async (testCenterId) => {
  try {
    const { data, error } = await supabase
      .from("test_result")
      .select("uid, correct_count, user_info(name)")
      .eq("test_center_id", testCenterId);

    if (error) throw error;

    // 데이터가 없을 경우 빈 배열 반환
    if (!data || data.length === 0) {
      console.warn("데이터가 없습니다");
      return [];
    }

    // uid와 correct_count를 기반으로 테이블 데이터 생성
    const tableData = data.map((result) => ({
      uid: result.uid,
      correct_count: result.correct_count || 0,
      userName: result.user_info?.name || "누구세요",
    }));

    return tableData;
  } catch (error) {
    console.error("fetch 에러 발생", error);
    return [];
  }
};

export const testResultAPI = {
  add,
  getAllByUserId,
  search,
  getScore,
  getAverage,
  getScoresByTestCenter,
};
