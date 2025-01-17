import { supabase } from "./index.js";

export const follow = {
  // 팔로우 관계 생성
  async create({ uid, follow_id }) {
    try {
      // 자기 자신을 팔로우하는 것 방지
      if (uid === follow_id) {
        throw new Error("자기 자신을 팔로우할 수 없습니다.");
      }

      // 이미 팔로우 중인지 확인
      const { data: existing } = await supabase
        .from("follow")
        .select("id")
        .eq("uid", uid)
        .eq("follow_id", follow_id)
        .single();

      if (existing) {
        throw new Error("이미 팔로우하고 있는 사용자입니다.");
      }

      const { data, error } = await supabase
        .from("follow")
        .insert([{ uid, follow_id }])
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // 팔로우 관계 삭제 (언팔로우)
  async delete({ uid, follow_id }) {
    try {
      const { error } = await supabase
        .from("follow")
        .delete()
        .eq("uid", uid)
        .eq("follow_id", follow_id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // 특정 사용자의 팔로잉 목록 조회
  async getFollowing(uid, { page = 1, pageSize = 20 } = {}) {
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from("follow")
        .select(`
          *,
          following:auth.users!follow_id(
            id,
            email
          )
        `, { count: 'exact' })
        .eq("uid", uid)
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
  },

  // 특정 사용자의 팔로워 목록 조회
  async getFollowers(uid, { page = 1, pageSize = 20 } = {}) {
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from("follow")
        .select(`
          *,
          follower:auth.users!uid(
            id,
            email
          )
        `, { count: 'exact' })
        .eq("follow_id", uid)
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
  },

  // 팔로우 상태 확인
  async checkFollowStatus({ uid, follow_id }) {
    try {
      const { data, error } = await supabase
        .from("follow")
        .select("id")
        .eq("uid", uid)
        .eq("follow_id", follow_id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // 팔로우/팔로워 수 조회
  async getCounts(uid) {
    try {
      const [{ data: following, error: followingError }, { data: followers, error: followersError }] = await Promise.all([
        supabase
          .from("follow")
          .select("id", { count: 'exact' })
          .eq("uid", uid),
        supabase
          .from("follow")
          .select("id", { count: 'exact' })
          .eq("follow_id", uid)
      ]);

      if (followingError) throw followingError;
      if (followersError) throw followersError;

      return {
        followingCount: following.length,
        followersCount: followers.length
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
};