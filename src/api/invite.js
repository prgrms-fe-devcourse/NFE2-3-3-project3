import { supabase } from "./index.js";

const getAll = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("invite")
      .select(`*, test_center(*)`)
      .eq("target_uid", userId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
  }
};

const add = async (invites) => {
  try {
    const { data, error } = await supabase
      .from("invite")
      .insert(invites)
      .select();

    if (error) {
      console.error("초대 생성 중 오류:", error); // 에러 로그 출력
      throw error;
    }
    return data;
  } catch (error) {
    console.error(error);
  }
};

const accept = async (userId, id) => {
  try {
    const { data: inviteData, error: updateError } = await supabase
      .from("invite")
      .update({ participate: true })
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw updateError;

    const { data: result, error: upsertError } = await supabase
      .from("test_center")
      .upsert([{
        uid: userId,
        workbook_id: inviteData.workbook_id,
        start_date: inviteData.start_date,
        end_date: inviteData.end_date,
        created_at: new Date()
      }])
      .select()

    if (upsertError) throw upsertError;
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deny = async (id) => {
  try {
    const { data, error } = await supabase
      .from("invite")
      .delete()
      .eq("id", id)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const inviteAPI = {
  getAll,
  add,
  accept,
  deny,
};
