import { supabase } from "@/supabase";

export const createRestaurantPostLike = async (memberId, postId) => {
  const { data, error } = await supabase
    .from("restaurant_post_like")
    .insert([{ member_id: memberId, post_id: postId }]);

  if (error) {
    console.error("Error creating restaurant post like:", error);
    return null;
  }
  return data;
};

export const getRestaurantPostLikes = async (postId) => {
  const { data, error } = await supabase
    .from("restaurant_post_like")
    .select("*")
    .eq("post_id", postId);

  if (error) {
    console.error("Error fetching restaurant post likes:", error);
    return null;
  }
  return data;
};

export const updateRestaurantPostLike = async (postId, memberId) => {
  const { data, error } = await supabase
    .from("restaurant_post_like")
    .delete()
    .eq("post_id", postId)
    .eq("member_id", memberId);

  if (error) {
    console.error("Error updating restaurant post like:", error);
    return null;
  }
  return data;
};

