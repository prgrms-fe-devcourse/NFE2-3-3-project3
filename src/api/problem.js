import { supabase } from "./index.js";

const getAll = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("problem")
      .select("*")
      .eq("uid", userId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
  }
};

/**
 *
 * @description problem_type = "multiple_choice" | "ox"
 * @param {object} body title, question, answer, explanation, origin_source, problem_type, category_id, image_src, option_one, option_two, option_three, option_four
 * @returns
 */
const add = async (body) => {
  try {
    const {
      title,
      problem_type,
      option_one,
      option_two,
      option_three,
      option_four,
    } = body;
    if (problem_type === "multiple_choice") {
      if (!option_one) throw new Error(`${title}: 1번 보기가 비어있습니다.`);
      if (!option_two) throw new Error(`${title}: 2번 보기가 비어있습니다.`);
      if (!option_three) throw new Error(`${title}: 3번 보기가 비어있습니다.`);
      if (!option_four) throw new Error(`${title}: 4번 보기가 비어있습니다.`);
    }

    const { data, error } = await supabase
      .from("problem")
      .insert([body])
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
  }
};

/**
 * @description 아래의 속성을 모두 다 넣을 필요는 없고, 바꾸고 싶은 값만 사용하시면 됩니다
 * @param {object} body title, question, answer, explanation, origin_source, problem_type, category, image_src, option_one, option_two, option_three, option_four
 * @returns
 */
const update = async (id, body) => {
  try {
    const { data, error } = await supabase
      .from("problem")
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
      .from("problem")
      .delete()
      .eq("id", id)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
  }
};

/**
 * @description 한 문제만 가져오기
 * @param {*} id - 문제 id
 * @returns 
 */
const getById = async (id) => {
  try {
    const { data, error } = await supabase
      .from("problem")
      .select(`
        *,
        category (
          id,
          name
        )
      `)
      .eq("id", id)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const problemAPI = {
  getAll,
  add,
  update,
  deleteOne,
  getById
};
