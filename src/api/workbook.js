import { supabase } from ".";

// CREATE
const add = async (title, description) => {
  const { data, error } = await supabase
    .from("workbook")
    .insert([{ title, description }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// READ
const getAll = async (uid) => {
  const { data, error } = await supabase
    .from("workbook")
    .select("*")
    .eq("uid", uid);
  if (error) throw error;
  return data;
};

const getUid = async (uid) => {
  const { data, error } = await supabase
    .from("workbook")
    .select("*")
    .eq("uid", uid);
  if (error) throw error;
  return data;
};

/**
 * @description 공유된 문제집 목록을 가져오는 API
 * @returns
 */
const getAllShared = async () => {
  const { data, error } = await supabase
    .from("workbook")
    .select(
      "*, user: user_info(name, avatar_url), problems: workbook_problem(problem_id), likes: workbook_like(id)",
    )
    .eq("shared", true);
  if (error) throw error;
  return data;
};

/**
 * @description 특정 유저가 공유한 문제집 목록을 가져오는 API
 * @param {*} uid 유저 ID
 * @returns
 */
const getAllSharedByUserId = async (uid) => {
  try {
    const { data, error } = await supabase
      .from("workbook")
      .select(
        `
        *,
        user: user_info!uid(*),
        problems: workbook_problem(*)
      `,
      )
      .eq("uid", uid)
      .eq("shared", true);

    const result = data.map((workbook) => ({
      ...workbook,
      count: workbook.problems.length,
    }));

    if (error) throw error;
    return result;
  } catch (error) {
    console.error(error);
  }
};

const search = async (keyword, startDate, endDate) => {
  const query = supabase
    .from("workbook")
    .select(
      `
      *,
      user: user_info(name, avatar_url),
      problems: workbook_problem(problem_id),
      likes: workbook_like(id)
    `,
    )
    .eq("shared", true);

  if (keyword) {
    query.or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%`);
  }
  if (startDate) {
    query.gte("created_at", startDate);
  }
  if (endDate) {
    query.lte("created_at", endDate);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
};

// UPDATE
const updated_at = new Date();

const updateTilte = async (title, id) => {
  await supabase.from("workbook").update({ title, updated_at }).eq("id", id);
};

const updateDescription = async (description, id) => {
  await supabase
    .from("workbook")
    .update({ description, updated_at })
    .eq("id", id);
};

// DELETE
const remove = async (id) => {
  await supabase.from("workbook").delete().eq("id", id);
};
const checkWorkbookInsert = async () => {
  const { data, error } = await supabase
    .from("workbook")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error fetching workbook data:", error);
  } else {
    if (data && data.length > 0) {
      console.log("Latest workbook entry:", data[0]);
    } else {
      console.log("No workbook entries found");
    }
  }
};
export const workbookAPI = {
  add,
  getAll,
  getAllShared,
  getAllSharedByUserId,
  search,
  getUid,
  updateTilte,
  updateDescription,
  remove,
  checkWorkbookInsert,
};
