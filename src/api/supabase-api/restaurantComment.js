import { supabase } from "@/supabase";

// 댓글 추가
export const createRestaurantPostComment = async (
  memberId,
  postId,
  content
) => {
  const { data, error } = await supabase
    .from("restaurant_post_comment")
    .insert([{ member_id: memberId, post_id: postId, content }]);

  if (error) {
    console.error("Error creating restaurant post comment:", error);
    return null;
  }
  return data;
};

// 댓글 조회
export const getRestaurantPostComments = async (postId) => {
  const { data, error } = await supabase
    .from("restaurant_post_comment")
    .select("*")
    .eq("post_id", postId);

  if (error) {
    console.error("Error fetching restaurant post comments:", error);
    return null;
  }
  return data;
};

// 댓글 수정
export const updateRestaurantPostComment = async (commentId, content) => {
  const { data, error } = await supabase
    .from("restaurant_post_comment")
    .update({ content })
    .eq("id", commentId);

  if (error) {
    console.error("Error updating restaurant post comment:", error);
    return null;
  }
  return data;
};

// 댓글 삭제
export const deleteRestaurantPostComment = async (commentId) => {
  const { data, error } = await supabase
    .from("restaurant_post_comment")
    .delete()
    .eq("id", commentId);

  if (error) {
    console.error("Error deleting restaurant post comment:", error);
    return null;
  }
  return data;
};
