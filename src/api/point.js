import { supabase } from "./index.js";

const getAll = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("point")
      .select("*")
      .eq("uid", userId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const pointAPI = {
  getAll,
};
