import { supabase } from "./index.js";

export const comment = {
  // 댓글 목록 조회 (problem_id 또는 workbook_id로 필터링)
  async getComments({ problem_id, workbook_id, page = 1, pageSize = 20 }) {
    try {
      let query = supabase
        .from("comment")
        .select(`
          *,
          author:auth.users!inner(
            id,
            email
          )
        `)
        .order('created_at', { ascending: false });

      // problem_id나 workbook_id 중 하나로 필터링
      if (problem_id) {
        query = query.eq('problem_id', problem_id);
      } else if (workbook_id) {
        query = query.eq('workbook_id', workbook_id);
      }

      // 페이지네이션 적용
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      const { data, error, count } = await query
        .range(from, to)
        .select('*', { count: 'exact' });

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
      throw error;
    }
  },

  // 댓글 생성
  async create(newComment) {
    try {
      const { data, error } = await supabase
        .from("comment")
        .insert([newComment])
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // 댓글 수정 (작성자만 가능)
  async update(id, uid, updatedComment) {
    try {
      const { data, error } = await supabase
        .from("comment")
        .update(updatedComment)
        .eq('id', id)
        .eq('uid', uid) // 작성자 본인인지 확인
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // 댓글 삭제 (작성자만 가능)
  async delete(id, uid) {
    try {
      const { error } = await supabase
        .from("comment")
        .delete()
        .eq('id', id)
        .eq('uid', uid); // 작성자 본인인지 확인

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // 사용자별 작성 댓글 조회
  async getByUser(uid, { page = 1, pageSize = 20 } = {}) {
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from("comment")
        .select('*', { count: 'exact' })
        .eq('uid', uid)
        .order('created_at', { ascending: false })
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
      throw error;
    }
  }
};