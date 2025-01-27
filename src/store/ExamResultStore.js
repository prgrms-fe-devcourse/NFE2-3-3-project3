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
    isFetchingProblems: false, //상태관리를 위한 변수들
    isInitializing: false,
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
        this.totalCount = total || 0;
        this.correctCount = correct || 0;

        const average = await testResultAPI.getAverage(testResultId);
        this.averageCount = average || 0;
      } catch (error) {
        console.error("데이터 초기화 중 오류 발생:", error);
      } finally {
        this.isInitializing = false;
      }
    },

    // 문제 정보 가져오기
    async fetchProblems(testResultId) {
      if (this.isFetchingProblems) return;
      this.isFetchingProblems = true;

      if (!testResultId) {
        console.error("fetchProblems: Invalid testResultId");
        this.error = "Invalid testResultId";
        return;
      }
      this.isLoading = true;
      try {
        const fetchedProblems = await fetchProblemsForTestResult(testResultId);

        if (!fetchedProblems || fetchedProblems.length === 0) {
          this.error = "No problems found for the given testResultId.";
          return;
        }

        // 문제 데이터 정렬 및 추가 필드 생성
        this.problems = fetchedProblems
          .sort((a, b) => a.id - b.id) // problem_id 순서대로 정렬
          .map((problem, index) => ({
            ...problem,
            number: index + 1, // 문제 번호 추가
            flagged: false, // 플래그 상태 초기화
          }));

        // 첫 번째 문제 설정
        this.currentProblem =
          this.problems.length > 0 ? this.problems[0] : null;
      } catch (err) {
        console.error("fetchProblems: 로딩에 실패함", err);
        this.error = `문제를 불러오는 데 실패했습니다: ${err.message}`;
      } finally {
        this.isLoading = false;
        this.isFetchingProblems = false;
      }
    },

    // 시험장 사용자 점수 가져오기
    async getScoresByTestCenter(testCenterId) {
      if (this.isInitializing) return;
      this.isInitializing = true;
      try {
        if (!testCenterId) {
          this.error = "유효하지 않은 시험장 ID입니다.";
          console.error("유효하지 않은 testCenterId:", testCenterId);
          return;
        }

        this.isLoading = true;
        this.error = null;

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
        this.isLoading = false;
        this.isInitializing = false;
      }
    },

    async fetchMyOption(userId, testCenterId) {
      // 매개변수 유효성 검증
      if (!userId) {
        console.error("유효하지 않은 사용자 ID:", userId);
        return;
      }

      this.isLoading = true;
      this.error = null;

      try {
        const data = await problemHistoryAPI.getMyOption(userId, testCenterId);

        if (!data || data.length === 0) {
          console.warn("fetchMyOption: 데이터가 없습니다.");
          this.myOption = [];
          this.status = [];
          return;
        }

        // 최신 데이터만 필터링 (각 problem_id 기준 최신 created_at)
        const latestData = data.reduce((acc, curr) => {
          if (!acc[curr.problem_id]) {
            acc[curr.problem_id] = curr;
          }
          return acc;
        }, {});

        const latestRecords = Object.values(latestData);
        // 상태 업데이트
        this.myOption = latestRecords.map((record) => ({
          problem_id: record.problem_id,
          my_option: record.my_option,
        }));
        this.status = latestRecords.map((record) => ({
          problem_id: record.problem_id,
          status: record.status,
        }));
      } catch (error) {
        console.error("fetchMyOption 오류:", error);
        this.error = "사용자 선택 데이터를 가져오는 중 오류가 발생했습니다.";
      } finally {
        this.isLoading = false;
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
