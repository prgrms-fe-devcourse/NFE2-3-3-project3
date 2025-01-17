import { supabase } from "./index.js";

export const againViewProblem = {
  // 문제 ID로 조회
  async getById(id) {
    try {
      return await supabase
        .from("again_view_problem")
        .select("id")
        .eq("id", id)
        .single();
    } catch (error) {
      console.error(error);
    }
  },

  // problem_id로 조회
  async getByProblemId(problemId) {
    try {
      return await supabase
        .from("again_view_problem")
        .select("problem_id")
        .eq("problem_id", problemId);
    } catch (error) {
      console.error(error);
    }
  },

  // uid로 조회
  async getByUserId(uid) {
    try {
      return await supabase
        .from("again_view_problem")
        .select("*")
        .eq("uid", uid);
    } catch (error) {
      console.error(error);
    }
  },

  // 모든 필드 조회
  async getAll() {
    try {
      return await supabase.from("again_view_problem").select("*");
    } catch (error) {
      console.error(error);
    }
  },

  // 페이지네이션 조회
  async getWithPagination({ page = 1, pageSize = 10 }) {
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      const { data, error, count } = await supabase
        .from("again_view_problem")
        .select("*", { count: "exact" })
        .range(from, to);

      if (error) throw error;
      return {
        data,
        count,
        currentPage: page,
        pageSize,
        totalPages: Math.ceil(count / pageSize),
      };
    } catch (error) {
      console.error(error);
    }
  },

  // 필터링 조회 (여러 조건 가능)
  /**
   * 지정된 필터 조건에 따라 again_view_problem 테이블의 데이터를 조회합니다
   * @param {string} column - 필터링할 컬럼명
   * @param {string} operator - 필터링 연산자
   *                           - 'eq': 같음
   *                           - 'gt': 초과
   *                           - 'lt': 미만
   *                           - 'gte': 이상
   *                           - 'lte': 이하
   *                           - 'like': 부분 일치 (대소문자 구분)
   *                           - 'ilike': 부분 일치 (대소문자 구분 없음)
   *                           - 'in': 배열 내 값과 일치
   * @param {*} value - 필터링할 값
   * @returns {Promise<Array>} 필터링된 데이터 배열을 created_at 기준 내림차순으로 반환
   * @throws {Error} 지원하지 않는 연산자가 입력된 경우 에러 발생
   */
  async getWithFilter(column, operator, value) {
    try {
      const query = supabase.from("again_view_problem").select("*");

      switch (operator) {
        case "eq":
          query = query.eq(column, value);
          break;
        case "gt":
          query = query.gt(column, value);
          break;
        case "lt":
          query = query.lt(column, value);
          break;
        case "gte":
          query = query.gte(column, value);
          break;
        case "lte":
          query = query.lte(column, value);
          break;
        case "like":
          query = query.like(column, `%${value}%`);
          break;
        case "ilike":
          query = query.ilike(column, `%${value}%`);
          break;
        case "in":
          query = query.in(column, value);
          break;
        default:
          throw new Error(`지원하지 않는 연산자입니다: ${operator}`);
      }

      return await query.order('created_at', { ascending: false });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  /**
   * 최근 N일 동안 추가된 다시 볼 문제들을 조회합니다
   * @param {number} days - 조회할 일수
   * @param {string} [uid] - 선택적 사용자 ID. 입력 시 해당 사용자의 문제만 조회
   * @returns {Promise<Array>} 조회된 문제 목록
   */
  async getRecentProblems(days, uid = null) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      let query = supabase
        .from("again_view_problem")
        .select("*")
        .gte("created_at", startDate.toISOString());

      if (uid) {
        query = query.eq("uid", uid);
      }

      return await query.order('created_at', { ascending: false });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  /**
   * 특정 월에 추가된 다시 볼 문제들을 조회합니다
   * @param {number} year - 연도
   * @param {number} month - 월 (1-12)
   * @param {string} [uid] - 선택적 사용자 ID
   * @returns {Promise<Array>} 조회된 문제 목록
   */
  async getMonthlyProblems(year, month, uid = null) {
    try {
      const startDate = new Date(year, month - 1, 1); // month는 0부터 시작하므로 -1
      const endDate = new Date(year, month, 0); // 다음 달의 0일 = 이번 달의 마지막 날
      
      let query = supabase
        .from("again_view_problem")
        .select("*")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString());

      if (uid) {
        query = query.eq("uid", uid);
      }

      return await query.order('created_at', { ascending: false });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  /**
   * 여러 문제들의 다시 볼 문제 상태를 한 번에 조회합니다
   * @param {number[]} problemIds - 조회할 문제 ID 배열
   * @param {string} [uid] - 선택적 사용자 ID
   * @returns {Promise<Array>} 조회된 문제 목록
   */
  async getBulkProblems(problemIds, uid = null) {
    try {
      let query = supabase
        .from("again_view_problem")
        .select("*")
        .in("problem_id", problemIds);

      if (uid) {
        query = query.eq("uid", uid);
      }

      return await query.order('created_at', { ascending: false });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  /**
   * 오늘 추가된 다시 볼 문제들을 조회합니다
   * @param {string} [uid] - 선택적 사용자 ID
   * @returns {Promise<Array>} 조회된 문제 목록
   */
  async getTodayProblems(uid = null) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let query = supabase
        .from("again_view_problem")
        .select("*")
        .gte("created_at", today.toISOString());

      if (uid) {
        query = query.eq("uid", uid);
      }

      return await query.order('created_at', { ascending: false });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // 데이터 생성
  async create(newData) {
    try {
      return await supabase
        .from("again_view_problem")
        .insert([newData])
        .select();
    } catch (error) {
      console.error(error);
    }
  },

};