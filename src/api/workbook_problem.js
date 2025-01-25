import { supabase } from "./index.js";

const getProblemIdsByWorkbookId = async (workbookId) => {
  try {
    const { data, error } = await supabase
      .from("workbook_problem") // workbook_problem 테이블에서 시작
      .select("problem_id") // problem_id만 선택
      .eq("workbook_id", workbookId); // 같은 workbook_id 필터링

    if (error) {
      console.error("Error fetching problem IDs:", error);
      return null;
    }

    return data; // 문제 ID 배열 반환
  } catch (err) {
    console.error("Unexpected error fetching problem IDs:", err);
    return null;
  }
};

const getProblemDetails = async (problemIds) => {
  try {
    const { data, error } = await supabase
      .from("problem") // problem 테이블에서 데이터 가져오기
      .select(
        `
        id,
        question,
        answer,
        explanation,
        option_one,
        option_two,
        option_three,
        option_four,
        image_scr
      `,
      )
      .in("id", problemIds); // problem_id 배열로 필터링

    if (error) {
      console.error("Error fetching problem details:", error);
      return null;
    }

    return data; // 문제 세부 정보 배열 반환
  } catch (err) {
    console.error("Unexpected error fetching problem details:", err);
    return null;
  }
};

export const workbookProblemService = {
  getProblemIdsByWorkbookId,
  getProblemDetails,
};
