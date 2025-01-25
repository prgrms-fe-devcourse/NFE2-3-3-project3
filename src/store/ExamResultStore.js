import { defineStore } from "pinia";
import { testResultAPI } from "@/api/testResult";
import { fetchProblemsForTestResult } from "@/api/workbook_problem";

export const useExamResultStore = defineStore("examResult", {
  state: () => ({
    totalCount: 0, // 총 문제 수
    correctCount: 0, // 정답 수
    averageCount: 0, // 평균 점수
    testCenterId: null, // 시험장 ID
    isTableData: [], // 점수 테이블 데이터
    problems: [], //문제 데이터
    currentProblem: null, //선택된 문제
    columns: 10, // 테이블 열 크기
    isLoading: false, // 로딩 상태
    error: null, // 에러 메시지
  }),
  getters: {
    rows: (state) => Math.ceil(state.problems.length / state.columns),

    tableData: (state) => {
      const rows = Math.ceil(state.problems.length / state.columns); // 직접 계산
      console.log("Calculating tableData: rows =", rows);
      const data = [];
      for (let i = 0; i < rows; i++) {
        data.push(
          state.problems.slice(i * state.columns, (i + 1) * state.columns),
        );
      }
      return data;
    },
  },

  actions: {
    async initializeExamData(userId) {
      try {
        // 사용자 ID 확인
        if (!userId) {
          console.error("사용자 ID가 없습니다.");
          return;
        }

        // 사용자 시험장 ID 가져오기
        const userResults = await testResultAPI.getAllByUserId(userId);
        if (userResults && userResults.length > 0) {
          this.testCenterId = userResults[0].test_center_id;
        } else {
          console.warn("해당 사용자가 참여한 시험장이 없습니다.");
          return;
        }

        // 점수 데이터 호출
        const { total, correct } = await testResultAPI.getScore(userId);
        const averageScore = await testResultAPI.getAverage(this.testCenterId);

        this.totalCount = total || 0;
        this.correctCount = correct || 0;
        this.averageCount = averageScore;

        // 점수 테이블 데이터 호출
        if (this.testCenterId) {
          const scoreCounts = await testResultAPI.getScoresByTestCenter(
            this.testCenterId,
          );
          this.isTableData = scoreCounts;
        }
      } catch (error) {
        console.error("데이터 초기화 중 오류 발생:", error);
      }
    },
    // 문제 데이터 로드 및 초기화
    async fetchProblems(testResultId) {
      console.log(
        "Fetching problems: Starting with testResultId =",
        testResultId,
      ); // 디버깅 로그

      try {
        this.isLoading = true;
        this.error = null; // 에러 초기화
        this.problems = []; // 문제 초기화
        this.currentProblem = null; // 선택된 문제 초기화

        // testResultId가 유효하지 않은 경우 처리
        if (!testResultId) {
          console.error("fetchProblems: Invalid testResultId");
          this.error = "Invalid testResultId";
          return;
        }

        // 문제 데이터 가져오기
        console.log("fetchProblems: Fetching problems from API...");
        const fetchedProblems = await fetchProblemsForTestResult(testResultId);

        if (!fetchedProblems || fetchedProblems.length === 0) {
          console.warn(
            "fetchProblems: No problems found for testResultId =",
            testResultId,
          );
          this.error = "No problems found for the given testResultId.";
          return;
        }

        console.log("fetchProblems: Fetched problems =", fetchedProblems);

        // 문제 데이터 정렬 및 추가 필드 생성
        this.problems = fetchedProblems
          .sort((a, b) => a.id - b.id) // problem_id 순서대로 정렬
          .map((problem, index) => ({
            ...problem,
            number: index + 1, // 문제 번호 추가
            flagged: false, // 플래그 상태 초기화
          }));

        console.log("fetchProblems: Processed problems =", this.problems);

        // 첫 번째 문제 설정
        this.currentProblem =
          this.problems.length > 0 ? this.problems[0] : null;

        if (this.currentProblem) {
          console.log(
            "fetchProblems: Current problem set to =",
            this.currentProblem,
          );
        } else {
          console.warn("fetchProblems: No current problem available.");
        }
      } catch (err) {
        console.error("fetchProblems: Error while loading problems =", err);
        this.error = `문제를 불러오는 데 실패했습니다: ${err.message}`;
      } finally {
        this.isLoading = false;
        console.log(
          "fetchProblems: Loading state updated. isLoading =",
          this.isLoading,
        );
      }
    },

    // 문제 선택
    selectProblem(problem) {
      this.currentProblem = problem;
    },
    // 플래그 토글
    toggleFlag(problem) {
      const target = this.problems.find((p) => p.id === problem.id);
      if (target) {
        target.flagged = !target.flagged;
      }
    },
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: "examResult",
        storage: localStorage,
        paths: [
          "totalCount",
          "correctCount",
          "averageCount",
          "testCenterId",
          "problems",
          "currentProblem",
        ],
      },
    ],
  },
});
