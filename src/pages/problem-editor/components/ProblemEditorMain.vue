<script setup>
import deletePath from "@/assets/icons/problem-editor/delete.svg";
import alarmPath from "@/assets/icons/problem-editor/alarm.svg";
import {
  reactive,
  ref,
  onBeforeMount,
  computed,
  onBeforeUnmount,
  watchEffect,
  watch,
} from "vue";
import {
  Listbox,
  Button,
  ToggleSwitch,
  MultiSelect,
  InputText,
  StyleClass,
} from "primevue";

import Editor from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css";

const props = defineProps({
  problemIdx: {
    type: Number,
  },
  problemContent: {
    type: {
      title: String,
      question: String,
      answer: String,
      explanation: String,
      origin_source: String,
      problem_type: String,
      category: String,
      image_src: String,
      option_one: String,
      option_two: String,
      option_three: String,
      option_four: String,
      shared: String,
    },
  },
});

const emits = defineEmits(["updateListItem", "deleteProblem", "submitProblem"]);
const PROBLEM_TYPES = ["4지선다", "O/X"];
// 카테고리
let CATEGORY = [
  { name: "카테고리 1", value: 1 },
  { name: "카테고리 2", value: 2 },
  { name: "카테고리 3", value: 3 },
];

const localProblem = reactive({
  ...props.problemContent,
  category: CATEGORY.filter(
    ({ name, value }) => props.problemContent.category == name,
  ),
});

watch(
  () => props.problemContent,
  (newContent) => {
    Object.assign(localProblem, newContent);
  },
  { deep: true },
);

const currentIdx = computed(() => {
  return props.problemIdx;
});

//업데이트 함수

const setQuestion = (event) => {
  // 에디터 값 가져오기
};
const setAnswer = (event) => {};

const setExplanation = (event) => {};

// 에디터 옵션
const problemEditorElement = ref(null);
let problemEditorInstance = null;

const questionEditorElement = ref(null);

let questionEditorInstance = null;

// 카테고리 생성용
const doesCategoryExist = computed(() => {
  console.log(filteredCategory.value);
  return JSON.stringify(CATEGORY).indexOf(`${filteredCategory.value}`) === -1
    ? false
    : true;
});
const filteredCategory = ref("");
const onFilterCategory = (event) => {
  filteredCategory.value = event.value;
};

const createCategory = () => {
  // Ensure filteredCategory is not empty
  if (!filteredCategory.value.trim()) {
    console.error("Category name cannot be empty");
    return;
  }

  const newCategory = {
    name: filteredCategory.value,
    value: CATEGORY.length + 1,
  };

  // Use spread operator to create a new array
  CATEGORY = [...CATEGORY, newCategory];

  // Set the category as an array with the new category object
  localProblem.category = [newCategory];

  filteredCategory.value = "";

  console.log("새로운 카테고리가 생성되고 선택되었습니다:", newCategory);
};
watchEffect(() => {
  // DOM 요소가 렌더링된 후 Editor 초기화
  if (problemEditorElement.value) {
    problemEditorInstance = new Editor({
      el: problemEditorElement.value,
      height: "200px",
      initialEditType: "markdown",
      previewStyle: "vertical",
    });
    console.log("Toast UI Editor initialized:", problemEditorInstance);
  } else {
    console.error("Editor element not found");
  }

  if (questionEditorElement.value) {
    questionEditorInstance = new Editor({
      el: questionEditorElement.value,
      height: "200px",
      initialEditType: "markdown",
      previewStyle: "vertical",
    });
    console.log("Toast UI Editor initialized:", questionEditorInstance);
  } else {
    console.error("Editor element not found");
  }
});

// 문제 변경시 제출, 업데이트
onBeforeUnmount(() => {
  const categoryName = localProblem.category?.[0]?.name || ""; // 안전한 접근
  emits("submitProblem", currentIdx.value, {
    ...localProblem,
    category: categoryName,
  });
});
</script>

<template>
  <main class="flex flex-col gap-4 w-full">
    <article
      class="flex items-top w-full px-4 py-4 gap-3"
      v-if="props.problemIdx !== -1"
    >
      <img
        :src="deletePath"
        alt="문제 삭제하기"
        class="align-top bg-black-5 p-1 rounded-md w-8 h-8 hover:scale-110"
        role="button"
        @click="emits('deleteProblem')"
      />
      <form
        class="border-2 border-black-3 flex flex-col flex-grow px-6 pb-6 pt-4 rounded-md"
      >
        <fieldset class="addDivider mb-4 block">
          <label class="mr-3">문제 유형 선택</label>
          <ul class="none inline cursor-pointer">
            <li
              v-for="type in PROBLEM_TYPES"
              :key="type"
              class="inline rounded px-3 py-1.5 leading-relaxed text-black-1 mr-2 border border-black-2"
              :class="[
                localProblem.type === type
                  ? 'bg-orange-1 text-white border-black-2 hover:bg-black-3'
                  : 'bg-white hover:bg-black-5',
              ]"
              @click="emits('updateListItem', 'TYPE', type)"
            >
              {{ type }}
            </li>
          </ul>
        </fieldset>
        <fieldset class="flex items-center gap-2 w-full mb-4">
          <label for="category" class="mr-1">카테고리</label>
          <MultiSelect
            v-model="localProblem.category"
            display="chip"
            :options="CATEGORY"
            optionLabel="name"
            filter
            :selection-limit="1"
            class="md:h-9 items-center md:w-60 font-regular text-sm py-2 mr-2"
            @filter="(e) => onFilterCategory(e)"
          >
            <template #footer>
              <div class="p-3 flex justify-between">
                <Button
                  label="카테고리 추가"
                  severity="secondary"
                  text
                  size="small"
                  icon="pi pi-plus"
                  :disabled="doesCategoryExist"
                  @click="createCategory"
                />
              </div>
            </template>
          </MultiSelect>

          <label for="shared"> 공개 여부 </label>
          <ToggleSwitch v-model="localProblem.shared" name="shared" />
        </fieldset>
        <fieldset class="addDivider flex flex-col gap-2 mb-4">
          <div class="flex items-center gap-4">
            <label for="origin_source">출처</label>
            <InputText
              type="text"
              v-model="localProblem.origin_source"
              name="origin_source"
              class="md:h-10 flex-grow"
            />
          </div>
          <p class="flex gap-2 text-black-1 items-center text-xs">
            <img :src="alarmPath" alt="사용자 출처 저작권 안내 문구" />문제의
            출처를 최대한 자세하게 써주세요. 타인의 문제를 허락없이 공유하여
            법적인 제제를 받는 경우, 풀고에서 책임지지 않습니다.
          </p>
        </fieldset>
        <fieldset class="addDivider flex flex-col gap-4 mb-4">
          <legend class="my-2">문제 {{ currentIdx + 1 }}</legend>
          <InputText
            type="text"
            v-model="localProblem.title"
            name="problem"
            class="md:h-10 w-full"
            placeholder="문제의 제목을 작성해 주세요."
            @change="(e) => emits('updateListItem', 'TITLE', e.target.value)"
          />
          <div ref="problemEditorElement"></div>
          <p>답</p>
          <div v-for="(_, idx) in 4" :key="idx" class="flex items-center gap-2">
            <input
              type="radio"
              name="answers"
              :value="idx + 1"
              :checked="localProblem.answer === String(idx + 1)"
              @change="localProblem.answer = String(idx + 1)"
              class="cursor-pointer rounded-full h-7 w-7 border-2 border-black-3 place-items-center text-black-2 hover:bg-black-5"
            /><InputText
              type="text"
              v-model="
                localProblem[
                  `option_${
                    idx === 0
                      ? 'one'
                      : idx === 1
                      ? 'two'
                      : idx === 2
                      ? 'three'
                      : 'four'
                  }`
                ]
              "
              name="option"
              class="md:h-9 w-full"
              placeholder="선택지 내용"
            />
          </div>
        </fieldset>
        <fieldset>
          <legend class="my-2">풀이</legend>
          <div ref="questionEditorElement"></div>
        </fieldset>
      </form>
    </article>
  </main>
</template>
<style scoped>
.addDivider::after {
  width: 100%;
  height: 1px;
  background-color: #d4d4d4;
  margin-top: 12px;
  content: "";
  display: block;
}
</style>
