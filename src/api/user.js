import { supabase } from "./index.js";

const getOne = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("user_info")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    console.log(data)
    return data;
  } catch (error) {
    console.error(error);
  }
};

const searchUsersByEmail = async (email) => {
  try {
    const { data, error } = await supabase
      .from("user_info")
      .select("id, avatar_url, name, email")
      .ilike("email", `%${email}%`)
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * @description 혹시나 쓸 일이 있을까봐 만들어둡니다!
 * @param {object} body avatar_url, name, email, provider
 * @returns
 */
const update = async (id, body) => {
  try {
    const { data, error } = await supabase
      .from("user_info")
      .update(body)
      .eq("id", id)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
  }
};

const deleteOne = async (id) => {
  try {
    const { data, error } = await supabase
      .from("user_info")
      .delete()
      .eq("id", id)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const userAPI = {
  getOne,
  searchUsersByEmail,
  update,
  deleteOne,
};
