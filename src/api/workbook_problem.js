import { supabase } from "./index.js";

// 문제집(workbook_id)에 속한 모든 문제 조회 + 정렬
// const fetchProblemsByWorkbookId = async (workbookId) => {
//   if (!workbookId) {
//     console.error("유효하지 않은 workbookId:", workbookId);
//     return [];
//   }

//   try {
//     // workbook_id를 기준으로 workbook_problem 테이블에서 problem_id 가져오기
//     const { data: workbookProblems, error: workbookError } = await supabase
//       .from("workbook_problem")
//       .select("problem_id")
//       .eq("workbook_id", workbookId);

//     console.log("문제집 확인", workbookProblems);

//     if (workbookError) {
//       throw workbookError;
//     }

//     // problem_id 리스트 추출
//     const problemIds = workbookProblems.map((item) => item.problem_id);

//     if (problemIds.length === 0) {
//       console.warn("문제 없음: workbook_id", workbookId);
//       return [];
//     }

//     // 문제 세부 정보 가져오기
//     const { data: problems, error: problemError } = await supabase
//       .from("problem")
//       .select(
//         `
//         id,
//         question,
//         answer,
//         explanation,
//         image_src,
//         problem_type,
//         option_one,
//         option_two,
//         option_three,
//         option_four,
//         created_at
//       `,
//       )
//       .in("id", problemIds); // 문제 ID 리스트로 필터링

//     console.log("Fetched problems by problemIds:", problems);

//     if (problemError) {
//       throw problemError;
//     }

//     // 데이터 포맷팅
//     const formattedProblems = problems.map((problem) => ({
//       ...problem,
//       options:
//         problem.problem_type === "multiple_choice"
//           ? [
//               problem.option_one,
//               problem.option_two,
//               problem.option_three,
//               problem.option_four,
//             ]
//           : [],
//     }));

//     return formattedProblems;
//   } catch (error) {
//     console.error("문제 조회 오류:", error);
//     return [];
//   }
// };

const fetchProblemsForTestResult = async (testResultId) => {
  try {
    console.log("Step 1: Fetching test_center_id from test_result...");
    // Step 1: Get test_center_id from test_result
    const { data: testResult, error: testResultError } = await supabase
      .from("test_result")
      .select("test_center_id")
      .eq("id", testResultId)
      .single();

    if (testResultError) {
      console.error("Error fetching test_center_id:", testResultError);
      throw testResultError;
    }
    const testCenterId = testResult.test_center_id;
    console.log("Fetched test_center_id:", testCenterId);

    console.log("Step 2: Fetching workbook_id from test_center...");
    // Step 2: Get workbook_id from test_center
    const { data: testCenter, error: testCenterError } = await supabase
      .from("test_center")
      .select("workbook_id")
      .eq("id", testCenterId)
      .single();

    if (testCenterError) {
      console.error("Error fetching workbook_id:", testCenterError);
      throw testCenterError;
    }
    const workbookId = testCenter.workbook_id;
    console.log("Fetched workbook_id:", workbookId);

    console.log("Step 3: Fetching problem_id from workbook_problem...");
    // Step 3: Get problem_ids from workbook_problem
    const { data: workbookProblems, error: workbookProblemError } =
      await supabase
        .from("workbook_problem")
        .select("problem_id")
        .eq("workbook_id", workbookId);

    if (workbookProblemError) {
      console.error(
        "Error fetching problem_id from workbook_problem:",
        workbookProblemError,
      );
      throw workbookProblemError;
    }
    const problemIds = workbookProblems.map((item) => item.problem_id);
    console.log("Fetched problem_ids:", problemIds);

    if (problemIds.length === 0) {
      console.warn("No problem_ids found for workbook_id:", workbookId);
      return [];
    }

    console.log("Step 4: Fetching problems from problem table...");
    // Step 4: Get problems from problem table
    const { data: problems, error: problemError } = await supabase
      .from("problem")
      .select(
        `
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
      `,
      )
      .in("id", problemIds);

    if (problemError) {
      console.error("Error fetching problems:", problemError);
      throw problemError;
    }
    console.log("Fetched problems:", problems);

    // Format problems
    return problems.map((problem) => ({
      ...problem,
      options:
        problem.problem_type === "multiple_choice"
          ? [
              problem.option_one,
              problem.option_two,
              problem.option_three,
              problem.option_four,
            ]
          : [],
    }));
  } catch (error) {
    console.error("Error in fetchProblemsForTestResult:", error);
    return [];
  }
};

export { fetchProblemsForTestResult };
