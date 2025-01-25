import { supabase } from "./index.js";

// 문제집(workbook_id)에 속한 모든 문제 조회 + 정렬
const fetchWorkbookProblems = async (workbookId) => {
  try {
    const { data, error } = await supabase
      .from("workbook_problem")
      .select(
        `
        problem:problem_id (
          id,
          question,
          answer,
          explanation,
          image_src,
          problem_type,
          option_one,
          option_two,
          option_three,
          option_four,
          created_at
        )
      `,
      )
      .eq("workbook_id", workbookId)
      .order("problem.created_at", { ascending: true }); // 문제 생성 순서 정렬

    if (error) throw error;

    // 데이터 포맷팅
    const processedData = data.map((item, index) => ({
      number: index + 1, // 1부터 시작하는 번호
      ...item.problem,
      options:
        item.problem.problem_type === "multiple_choice"
          ? [
              item.problem.option_one,
              item.problem.option_two,
              item.problem.option_three,
              item.problem.option_four,
            ]
          : [],
    }));

    return processedData;
  } catch (error) {
    console.error("문제 조회 오류:", error);
    return [];
  }
};

export const workbookProblemService = {
  fetchWorkbookProblems,
};
