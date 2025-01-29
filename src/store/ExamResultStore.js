import { defineStore } from "pinia";
import { testResultAPI } from "@/api/testResult";
import { fetchProblemsForTestResult } from "@/api/workbookProblem";
import { problemHistoryAPI } from "@/api/problemHistory";

export const useExamResultStore = defineStore("examResult", {
  state: () => ({
    totalCount: 0, // 총 문제 수
    correctCount: 0, // 정답 수
    averageCount: 0, // 평균 점수
    testCenterId: 0, // 시험장 ID
    isTableData: [], // 점수 테이블 데이터
    problems: [], //문제 데이터
    currentProblem: null, //선택된 문제
    columns: 10, // 테이블 열 크기

    isLoading: false, // 로딩 상태
    error: null, // 에러 메시지
    isInitializing: false,
    isFetchingProblems: false, //상태관리를 위한 변수들
    isGetScores: false,
    isMyOption: false,
    myOption: null,
    status: null,
  }),
  getters: {
    rows: (state) => Math.ceil(state.problems.length / state.columns),

    tableData: (state) => {
      const data = [];
      for (let i = 0; i < state.rows; i++) {
        data.push(
          state.problems.slice(i * state.columns, (i + 1) * state.columns),
        );
      }
      return data;
    },
  },

  actions: {
    //시험점수 가져오기
    async initializeExamData(uid, testResultId) {
      if (this.isInitializing) return;
      this.isInitializing = true;
      try {
        // uid 및 testResultId 유효성 검사
        if (!uid || !testResultId) {
          console.error("유효하지 않은 uid 또는 testResultId:", {
            uid,
            testResultId,
          });
          return;
        }

        // 점수 데이터 호출
        const { total, correct } = await testResultAPI.getScore(testResultId);

        // 상태 업데이트
        this.totalCount = total;
        this.correctCount = correct;

        const average = await testResultAPI.getAverage(testResultId);
        this.averageCount = average;
      } catch (error) {
        console.error("데이터 초기화 중 오류 발생:", error);
      } finally {
        this.isInitializing = false;
      }
    },

    // 시험장 사용자 점수 가져오기
    async getScoresByTestCenter(testCenterId) {
      if (this.isGetScores) return;
      this.isGetScores = true;

      try {
        if (!testCenterId) {
          this.error = "유효하지 않은 시험장 ID입니다.";
          console.error("유효하지 않은 testCenterId:", testCenterId);
          return;
        }
        // Supabase API 호출
        const data = await testResultAPI.getUsersScores(testCenterId);

        if (!data || data.length === 0) {
          console.warn("해당 시험장에 데이터가 없습니다:", testCenterId);
          this.isTableData = [];
          return;
        }

        // Supabase에서 반환된 데이터 매핑
        this.isTableData = data.map((result) => ({
          uid: result.uid,
          userName: result.name,
          correct_count: result.correct_count,
          test_center_id: result.test_center_id,
        }));
      } catch (error) {
        console.error("시험장 사용자 점수 가져오기 오류:", error);
        this.error =
          error.message || "데이터를 가져오는 중 오류가 발생했습니다.";
      } finally {
        this.isGetScores = false;
      }
    },

    async fetchProblems(testResultId) {
      // 호출 확인
      if (this.isFetchingProblems) {
        this.isFetchingProblems = false;
      }
      if (!testResultId) {
        console.error("fetchProblems: 유효하지 않은 testResultId", {
          testResultId,
        });
        this.error = "Invalid testResultId";
        return;
      }
      this.isFetchingProblems = true;
      try {
        const fetchedProblems = await fetchProblemsForTestResult(testResultId);
        if (!fetchedProblems || fetchedProblems.length === 0) {
          console.warn("fetchProblems: 문제가 없음");
          this.error = "No problems found for the given testResultId.";
          return;
        }
        this.problems = fetchedProblems
          .sort((a, b) => a.id - b.id)
          .map((problem, index) => ({
            ...problem,
            number: index + 1,
            flagged: false,
          }));
        this.currentProblem =
          this.problems.length > 0
            ? this.problems[0]
            : {
                id: null,
                question: "문제가 없습니다.",
                options: [],
                answer: null,
              };
      } catch (err) {
        console.error("fetchProblems: 오류 발생", err);
        this.error = `문제를 불러오는 데 실패했습니다: ${err.message}`;
      } finally {
        this.isFetchingProblems = false;
      }
    },

    async fetchMyOption(userId, testCenterId) {
      // 호출 확인
      if (!userId) {
        console.error("fetchMyOption: 유효하지 않은 사용자 ID", { userId });
        return;
      }
      if (this.isMyOption) {
        this.isMyOption = false;
      }
      this.isMyOption = true;
      try {
        const data = await problemHistoryAPI.getMyOption(userId, testCenterId);
        if (!data || data.length === 0) {
          console.warn("fetchMyOption: 데이터 없음");
          this.myOption = [];
          this.status = [];
          return;
        }
        const latestData = data.reduce((acc, curr) => {
          if (!acc[curr.problem_id]) {
            acc[curr.problem_id] = curr;
          }
          return acc;
        }, {});

        const latestRecords = Object.values(latestData);
        this.myOption = latestRecords.map((record) => ({
          problem_id: record.problem_id,
          my_option: record.my_option,
        }));
        this.status = latestRecords.map((record) => ({
          problem_id: record.problem_id,
          status: record.status,
        }));
      } catch (error) {
        console.error("fetchMyOption: 오류 발생", error);
        this.error = "사용자 선택 데이터를 가져오는 중 오류가 발생했습니다.";
      } finally {
        this.isMyOption = false;
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
          "myOption",
          "status",
        ],
      },
    ],
  },
});
