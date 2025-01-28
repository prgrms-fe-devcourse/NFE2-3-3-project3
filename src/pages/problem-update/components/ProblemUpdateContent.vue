<script setup>
import { onMounted, watch, ref } from "vue";
import Editor from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import { SelectButton } from "primevue";

const props = defineProps({
  problem: {
    type: Object,
    required: true,
  },
});

let questionEditorInstance = null;
const questionEditor = ref(null);

onMounted(() => {
  questionEditorInstance = new Editor({
    el: questionEditor.value,
    height: "200px",
    initialEditType: "wysiwyg",
    previewStyle: "vertical",
    initialValue: props.problem?.question || "",
    toolbarItems: [
      ["heading", "bold", "italic", "strike"],
      ["hr", "quote"],
      ["ul", "ol", "task", "indent", "outdent"],
      ["table", "image", "link"],
      ["code", "codeblock"],
    ],
  });
});

watch(
  () => props.problem,
  (newProblem) => {
    if (questionEditorInstance) {
      questionEditorInstance.setMarkdown(newProblem.question || "");
    }
  },
);
</script>

<template>
  <div class="mb-8">
    <div ref="questionEditor" class="text-gray-700 min-h-4 mb-10 w-full"></div>

    <!-- 객관식 보기 -->
    <div
      v-if="props.problem?.problem_type === 'multiple_choice'"
      class="space-y-4"
    >
      <ol class="list-decimal space-y-2 text-gray-700">
        <!-- 보기 1번 -->
        <li class="flex items-center gap-2">
          <input
            type="radio"
            name="answers"
            value="1"
            :checked="props.problem.answer === '1'"
            class="cursor-pointer rounded-full h-7 w-7 border-2 border-black-3 place-items-center text-black-2 hover:bg-black-5"
          />
          <input
            type="text"
            v-model="props.problem.option_one"
            v-show="props.problem.option_one !== undefined"
            class="md:h-9 w-full border border-gray-300 rounded p-1"
            placeholder="선택지 내용"
          />
        </li>
        <!-- 보기 2번 -->
        <li class="flex items-center gap-2">
          <input
            type="radio"
            name="answers"
            value="2"
            :checked="props.problem.answer === '2'"
            class="cursor-pointer rounded-full h-7 w-7 border-2 border-black-3 place-items-center text-black-2 hover:bg-black-5"
          />
          <input
            type="text"
            v-model="props.problem.option_two"
            v-show="props.problem.option_two !== undefined"
            class="md:h-9 w-full border border-gray-300 rounded p-1"
            placeholder="선택지 내용"
          />
        </li>
        <!-- 보기 3번 -->
        <li class="flex items-center gap-2">
          <input
            type="radio"
            name="answers"
            value="3"
            :checked="props.problem.answer === '3'"
            class="cursor-pointer rounded-full h-7 w-7 border-2 border-black-3 place-items-center text-black-2 hover:bg-black-5"
          />
          <input
            type="text"
            v-model="props.problem.option_three"
            v-show="props.problem.option_three !== undefined"
            class="md:h-9 w-full border border-gray-300 rounded p-1"
            placeholder="선택지 내용"
          />
        </li>
        <!-- 보기 4번 -->
        <li class="flex items-center gap-2">
          <input
            type="radio"
            name="answers"
            value="4"
            :checked="props.problem.answer === '4'"
            class="cursor-pointer rounded-full h-7 w-7 border-2 border-black-3 place-items-center text-black-2 hover:bg-black-5"
          />
          <input
            type="text"
            v-model="props.problem.option_four"
            v-show="props.problem.option_four !== undefined"
            class="md:h-9 w-full border border-gray-300 rounded p-1"
            placeholder="선택지 내용"
          />
        </li>
      </ol>
    </div>
    
    <!-- OX 보기 -->
    <div v-if="props.problem?.problem_type === 'ox'" class="space-y-4">
      <SelectButton
        v-model="props.problem.answer"
        :options="['O', 'X']"
        selection
      />
    </div>

    <div
      ref="explanationEditor"
      class="text-gray-700 min-h-4 mb-10 w-full"
    ></div>
  </div>
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
