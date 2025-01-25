import { supabase } from "./index.js";

const getAll = async () => {
  try {
    const { data, error } = await supabase
      .from("notification")
      .select(
        "*, sender: user_info!uid(*), receiver: user_info!target_uid(*), follow(*), invite(*), comment(*)",
      )
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
  }
};

const read = async (id) => {
  try {
    const { data, error } = await supabase
      .from("notification")
      .update({ read: true })
      .eq("id", id)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
  }
};

const readAll = async () => {
  try {
    const { data, error } = await supabase
      .from("notification")
      .update({ read: true })
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
      .from("notification")
      .delete()
      .eq("id", id)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
  }
};

const deleteAll = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("notification")
      .delete()
      .eq("target_uid", userId)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const notificationAPI = {
  getAll,
  readAll,
  read,
  deleteOne,
  deleteAll,
};
