import { supabase } from "./index.js";

export const followAPI = {
  /**
   * @description 사용자 팔로우하기
   * @param {string} follow_id - 팔로우 받는 사용자 ID
   * @returns {object} 생성된 팔로우 데이터
   */
  async followUser(follow_id) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const uid = user.id;

      if (uid === follow_id) {
        throw new Error("자기 자신을 팔로우할 수 없습니다.");
      }

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
        .insert([{ follow_id }])
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  /**
   * @description 사용자 언팔로우하기
   * @param {string} follow_id - 언팔로우 당하는 사용자 ID
   * @returns {boolean} 성공 여부
   */
  async unfollowUser(follow_id) {
    try {
      const { error } = await supabase
        .from("follow")
        .delete()
        .eq("follow_id", follow_id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  /**
   * @description 특정 사용자의 팔로잉 목록 조회
   * @param {string} uid - 조회할 사용자 ID
   * @returns {Array} 팔로잉 목록
   */
  async getFollowing(uid) {
    try {
      const { data, error } = await supabase
        .from("follow")
        .select(`followings: user_info!target_uid(*)`)
        .eq("uid", uid);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  /**
   * @description 특정 사용자의 팔로워 목록 조회
   * @param {string} uid - 조회할 사용자 ID
   * @returns {Array} 팔로워 목록
   */
  async getFollowers(uid) {
    try {
      const { data, error } = await supabase
        .from("follow")
        .select(`followers: user_info!uid(*)`)
        .eq("target_uid", uid);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  /**
   * @description 특정 사용자의 팔로우/팔로워 수 조회
   * @param {string} uid - 조회할 사용자 ID
   * @returns {object} 팔로잉 수와 팔로워 수
   */
  async getCounts(uid) {
    try {
      const [
        { data: following, error: followingError },
        { data: followers, error: followersError },
      ] = await Promise.all([
        supabase.from("follow").select("id").eq("uid", uid),
        supabase.from("follow").select("id").eq("follow_id", uid),
      ]);

      if (followingError) throw followingError;
      if (followersError) throw followersError;

      return {
        followingCount: following.length,
        followersCount: followers.length,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
