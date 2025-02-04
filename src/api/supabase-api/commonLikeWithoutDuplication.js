import { supabase } from "@/supabase";

/**
 * 좋아요를 추가하고 중복 여부를 확인하는 함수
 * @param {string} tableName - 좋아요를 추가할 테이블 이름
 * @param {number} postId - 좋아요를 누를 포스트 ID
 * @param {number} memberId - 좋아요를 누르는 사용자 ID
 * @returns {Promise<string>} - 'Like added' 또는 'Already liked'
 */
export const addLike = async (tableName, postId, memberId) => {
  const { data, error } = await supabase.rpc("add_like_to_table", {
    table_name: `${tableName}_like`,
    input_post_id: postId,
    input_member_id: memberId,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data; // 'Like added' 또는 'Already liked' 반환
};

/**
 * 좋아요를 삭제하는 함수
 * @param {string} tableName - 좋아요를 삭제할 테이블 이름
 * @param {number} postId - 좋아요를 취소할 포스트 ID
 * @param {number} memberId - 좋아요를 취소하는 사용자 ID
 * @returns {Promise<string>} - 'Like removed' 또는 'Like not found'
 */
export const removeLike = async (tableName, postId, memberId) => {
  const { data, error } = await supabase.rpc("remove_like_from_table", {
    table_name: `${tableName}_like`,
    input_post_id: postId,
    input_member_id: memberId,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data; // 'Like removed' 또는 'Like not found' 반환
};

export const getLikes = async (tableName, postId) => {
  try {
    const { data, error } = await supabase
      .from(`${tableName}_like`)
      .select()
      .eq("post_id", postId);
    if (error) throw new Error("특정 게시글 좋아요 조회 실패");
    return data;
  } catch (err) {
    console.error(err.message);
    return [];
  }
};
