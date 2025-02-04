import { supabase } from "@/supabase";

/**
 * 특정 멤버 ID로 게시물을 가져오는 함수 ✅
 * @param {string} memberId
 * @returns {Promise<Array>}
 */
export const getPostsByMemberId = async (memberId) => {
  try {
    const { data, error } = await supabase.rpc("get_posts_by_member_id", {
      p_member_id: memberId,
    });

    if (error) {
      console.error("RPC 오류 발생:", error);
      return [];
    }

    if (!data) {
      console.warn("데이터가 없거나 null이 반환되었습니다.");
      return [];
    }

    if (Array.isArray(data)) {
      return data;
    } else {
      try {
        const parsedData = JSON.parse(data);
        return parsedData;
      } catch (e) {
        console.error("JSON 파싱 오류:", e);
        return [];
      }
    }
  } catch (err) {
    console.error("예기치 못한 오류 발생:", err);
    return [];
  }
};

/**
 * 특정 멤버 ID로 좋아요한 게시물을 가져오는 함수 ✅
 * @param {string} memberId - 멤버 ID
 * @returns {Promise<Array>} - 좋아요한 게시물 배열
 */
export const getLikedPostsByMemberId = async (memberId) => {
  try {
    const { data, error } = await supabase.rpc("get_liked_posts_by_member_id", {
      p_member_id: memberId,
    });

    if (error) {
      console.error("RPC 오류 발생:", error);
      return [];
    }

    if (!data) {
      console.warn("데이터가 없거나 null이 반환되었습니다.");
      return [];
    }

    if (Array.isArray(data)) {
      return data;
    } else {
      try {
        const parsedData = JSON.parse(data);
        return parsedData;
      } catch (e) {
        console.error("JSON 파싱 오류:", e);
        return [];
      }
    }
  } catch (err) {
    console.error("예기치 못한 오류 발생:", err);
    return [];
  }
};

/**
 * 특정 멤버 ID로 댓글 단 게시물을 가져오는 함수 ✅
 * @param {string} memberId - 멤버 ID
 * @returns {Promise<Array>} - 댓글 단 게시물 배열
 */
export const getCommentedPostsByMemberId = async (memberId) => {
  try {
    const { data, error } = await supabase.rpc(
      "get_commented_posts_by_member_id",
      {
        p_member_id: memberId,
      }
    );

    if (error) {
      console.error("RPC 오류 발생:", error);
      return [];
    }

    if (!data) {
      console.warn("데이터가 없거나 null이 반환되었습니다.");
      return [];
    }

    if (Array.isArray(data)) {
      return data;
    } else {
      try {
        const parsedData = JSON.parse(data);
        return parsedData;
      } catch (e) {
        console.error("JSON 파싱 오류:", e);
        return [];
      }
    }
  } catch (err) {
    console.error("예기치 못한 오류 발생:", err);
    return [];
  }
};
