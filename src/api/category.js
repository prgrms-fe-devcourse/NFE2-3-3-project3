import { supabase } from "./index.js";

export const category = {
  // 모든 카테고리 조회 (사용 빈도순으로 정렬)
  async getAll() {
    try {
      const { data, error } = await supabase
        .from("category")
        .select(
          `
          *,
          problems:problem(count)
        `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // 이름으로 검색 (부분 일치)
  async searchByName(searchTerm) {
    try {
      const { data, error } = await supabase
        .from("category")
        .select("*")
        .ilike("name", `%${searchTerm}%`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // 카테고리 사용 현황 조회
  async getCategoryUsage(categoryId) {
    try {
      const { count, error } = await supabase
        .from("problem")
        .select("*", { count: "exact" })
        .eq("category_id", categoryId);

      if (error) throw error;
      return count;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // 새 카테고리 생성 (중복 검사 포함)
  async create(newData) {
    try {
      // 1. 중복 검사
      const { data: existing } = await supabase
        .from("category")
        .select("id")
        .eq("name", newData.name)
        .single();

      if (existing) {
        throw new Error("이미 존재하는 카테고리입니다.");
      }

      // 2. 새 카테고리 생성
      const { data, error } = await supabase
        .from("category")
        .insert([newData])
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // 인기 카테고리 조회 (문제 수 기준)
  async getPopularCategories(limit = 10) {
    try {
      const { data, error } = await supabase
        .from("category")
        .select(
          `
          *,
          problem_count:problem(count)
        `,
        )
        .order("problem_count", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
