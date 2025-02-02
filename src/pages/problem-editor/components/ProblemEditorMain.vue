<script setup>
import deletePath from "@/assets/icons/problem-editor/delete.svg";
import alarmPath from "@/assets/icons/problem-editor/alarm.svg";
import {
  reactive,
  ref,
  onBeforeMount,
  computed,
  watchEffect,
  watch,
  defineExpose,
  toRaw,
} from "vue";
import {
  Button,
  ToggleSwitch,
  MultiSelect,
  InputText,
  SelectButton,
} from "primevue";

import Editor from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import { storageAPI } from "@/api/storage";
import { categoryAPI } from "@/api/category";
import { useCreateProblemStore } from "@/store/createProblemStore";
import { storeToRefs } from "pinia";

const createProblemStore = useCreateProblemStore();
const { targetProblem, createdProblems } = storeToRefs(createProblemStore);

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
      category: Array,
      image_src: String,
      option_one: String,
      option_two: String,
      option_three: String,
      option_four: String,
      shared: Boolean,
    },
    default: () => ({
      title: "",
      question: "",
      answer: "",
      explanation: "",
      origin_source: "",
      problem_type: "",
      category: [],
      image_src: "",
      option_one: "",
      option_two: "",
      option_three: "",
      option_four: "",
      shared: false,
    }),
  },
});

// const emits = defineEmits(["updateListItem", "deleteProblem", "submitProblem"]);
const emits = defineEmits(["deleteProblem"]);

const localProblem = reactive({
  ...props.problemContent,
  category: toRaw(props.problemContent.category),
});

const setType = (type) => {
  localProblem.type = type;
  createProblemStore.updateListItem("TYPE", type);
};
const PROBLEM_TYPES = ["4지선다", "O/X"];
// 카테고리

const category = reactive([]);

const currentIdx = computed(() => {
  return props.problemIdx;
});

// 에디터 옵션
const questionEditor = ref(null);
let questionEditorInstance = null;

const explanationEditor = ref(null);
let explanationEditorInstance = null;

// 카테고리 생성용
const doesCategoryExist = computed(() => {
  console.log(filteredCategory.value);
  return JSON.stringify(category).indexOf(`${filteredCategory.value}`) === -1
    ? false
    : true;
});
const filteredCategory = ref("");
const onFilterCategory = (event) => {
  filteredCategory.value = event.value;
};

const createCategory = async () => {
  if (!filteredCategory.value.trim()) {
    console.error("Category name cannot be empty");
    return;
  }

  const newCategoryData = await categoryAPI.createCategory({
    name: filteredCategory.value.trim().slice(0, 15),
  });

  console.log(newCategoryData);
  category.push(...newCategoryData);
  localProblem.category = [...newCategoryData];

  filteredCategory.value = "";

  console.log("새로운 카테고리가 생성되고 선택되었습니다:", newCategoryData);
};

// // targetProblem.idx 값이 변경될 때 localProblem을 업데이트
// watchEffect(() => {
//   console.log(targetProblem.value.idx);
//   Object.assign(createdProblems.value.problemLists[targetProblem.value.idx]);

//   // if (
//   //   targetProblem.value.idx !== -1 &&
//   //   createdProblems.value.problemLists.length > targetProblem.value.idx
//   // ) {
//   //   Object.assign(createdProblems.value.problemLists[targetProblem.value.idx]);
//   // } else {
//   //   Object.assign(localProblem, {
//   //     title: "",
//   //     question: "",
//   //     answer: "",
//   //     explanation: "",
//   //     origin_source: "",
//   //     problem_type: "",
//   //     category: [],
//   //     image_src: "",
//   //     option_one: "",
//   //     option_two: "",
//   //     option_three: "",
//   //     option_four: "",
//   //     shared: false,
//   //     validity: {
//   //       category: false,
//   //       title: false,
//   //       question: false,
//   //       answer: false,
//   //       origin_source: false,
//   //     },
//   //   });
//   // }
//   console.log(localProblem, createdProblems.value.problemLists);
// });

watchEffect(() => {
  if (props.problemIdx !== -1) {
    const problem = createdProblems.value.problemLists[props.problemIdx];
    if (problem) {
      Object.assign(localProblem, problem);
    }
  }
});

const uploadedQuestionImages = reactive({});
const uploadedExplanationImages = reactive({});

const getUploadedImages = () => {
  if (!questionEditorInstance) return [];

  const markdown = questionEditorInstance.getMarkdown();
  const markdownImages = [...markdown.matchAll(/!\[.*?\]\((.*?)\)/g)].map(
    (match) => match[1],
  );

  const htmlContent = questionEditorInstance.getHTML();

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");
  const htmlImages = [...doc.querySelectorAll("img")].map((img) => img.src);

  return [...new Set([...markdownImages, ...htmlImages])];
};

// 에디터 크기 자동 조절 함수
const adjustEditorHeight = (type) => {
  const uploadedImages =
    type === "Question"
      ? { ...uploadedQuestionImages }
      : { ...uploadedExplanationImages };
  const editorImages = getUploadedImages(); // 현재 에디터에 포함된 이미지 리스트
  const totalImgHeight = editorImages.reduce((sum, imgUrl) => {
    return sum + (uploadedImages[imgUrl] || 0); // 높이가 없으면 0으로 처리
  }, 0);

  if (questionEditorInstance) {
    const contentHeight =
      questionEditorInstance.getMarkdown().split("\n").length * 20 +
      totalImgHeight; // 줄 수에 따른 높이 조절
    const minHeight = 300;
    const maxHeight = 600;
    const newHeight = Math.min(Math.max(contentHeight, minHeight), maxHeight);

    questionEditorInstance.setHeight(`${newHeight}px`);
  }
};

// 문제 에디터 초기화
watchEffect(() => {
  if (questionEditor.value && !questionEditorInstance) {
    questionEditorInstance = new Editor({
      el: questionEditor.value,
      height: "200px",
      initialEditType: "wysiwyg",
      previewStyle: "vertical",
      toolbarItems: [
        ["heading", "bold", "italic", "strike"],
        ["hr", "quote"],
        ["ul", "ol", "task", "indent", "outdent"],
        ["table", "image", "link"],
        ["code"],
      ],
      events: {
        change: () => {
          const value = questionEditorInstance.getMarkdown();
          localProblem.question = value;
          targetProblem.value.content.question = value;
          adjustEditorHeight(); // 높이 조정
        },
      },
      hooks: {
        addImageBlobHook: async (fileOrBlob, callback) => {
          // 이미지 업로드 처리
          try {
            const { type, size } = fileOrBlob;
            if (!type.startsWith("image/")) {
              throw new Error("이미지 파일만 업로드할 수 있습니다.");
            }
            const MAX_FILE_SIZE = 50 * 1024 * 1024;
            if (size > MAX_FILE_SIZE) {
              throw new Error("파일 크기가 50MB를 초과할 수 없습니다.");
            }
            const imageUrl = await storageAPI.uploadImage(fileOrBlob);
            callback(imageUrl, fileOrBlob.name);
            // 이미지 크기 읽기
            const img = new Image();
            img.src = imageUrl; //
            img.onload = () => {
              uploadedQuestionImages[imageUrl] = img.naturalHeight;
              adjustEditorHeight("Explanation");
              console.log(
                `업로드된 이미지 크기: ${img.naturalWidth}x${img.naturalHeight}px`,
              );
            };
            img.onerror = (err) => {
              console.warn("이미지 로드 실패, 높이 계산 불가:", imageUrl, err);
            };
          } catch (err) {
            console.error("이미지 업로드 실패:", err);
          }
        },
      },
    });

    // 초기 explanation 값 설정
    nextTick(() => {
      if (localProblem.question) {
        const rawQuestion = toRaw(localProblem.question); // 반응형 객체에서 순수 값 가져오기
        console.log("🚀 전:", rawQuestion);

        setTimeout(() => {
          // 🔥 `setMarkdown`이 실행될 때까지 약간의 시간 지연
          if (questionEditorInstance) {
            questionEditorInstance.setMarkdown(rawQuestion);
            console.log("✅ 후:", questionEditorInstance.getMarkdown());
          } else {
            console.warn("❌ questionEditorInstance가 아직 생성되지 않았음");
          }
        }, 100);
      }
    });
  }
});

// 풀이 에디터 초기화
watchEffect(() => {
  if (explanationEditor.value && !explanationEditorInstance) {
    explanationEditorInstance = new Editor({
      el: explanationEditor.value,
      height: "200px",
      initialEditType: "wysiwyg",
      previewStyle: "vertical",
      toolbarItems: [
        ["heading", "bold", "italic", "strike"],
        ["hr", "quote"],
        ["ul", "ol", "task", "indent", "outdent"],
        ["table", "image", "link"],
        ["code"],
      ],
      events: {
        change: () => {
          const value = explanationEditorInstance.getMarkdown();
          localProblem.explanation = value;
          adjustEditorHeight(); // 높이 조정
        },
      },
      hooks: {
        addImageBlobHook: async (fileOrBlob, callback) => {
          // 이미지 업로드 처리
          try {
            const { type, size } = fileOrBlob;
            if (!type.startsWith("image/")) {
              throw new Error("이미지 파일만 업로드할 수 있습니다.");
            }
            const MAX_FILE_SIZE = 50 * 1024 * 1024;
            if (size > MAX_FILE_SIZE) {
              throw new Error("파일 크기가 50MB를 초과할 수 없습니다.");
            }
            const imageUrl = await storageAPI.uploadImage(fileOrBlob);
            callback(imageUrl, fileOrBlob.name);
            // 이미지 크기 읽기
            const img = new Image();
            img.src = imageUrl; //
            img.onload = () => {
              uploadedExplanationImages[imageUrl] = img.naturalHeight;
              adjustEditorHeight("Explanation");
              console.log(
                `업로드된 이미지 크기: ${img.naturalWidth}x${img.naturalHeight}px`,
              );
            };
            img.onerror = (err) => {
              console.warn("이미지 로드 실패, 높이 계산 불가:", imageUrl, err);
            };
          } catch (err) {
            console.error("이미지 업로드 실패:", err);
          }
        },
      },
    });

    // 초기 explanation 값 설정
    if (localProblem.explanation) {
      explanationEditorInstance.setMarkdown(localProblem.explanation);
    }
  }
});

onBeforeMount(async () => {
  const categoryData = await categoryAPI.getAll();
  category.push(...categoryData);
  localProblem.visited = true;

  localProblem.type = localProblem.type === "" ? "4지선다" : localProblem.type;
});

const updateValidity = () => {
  console.log(localProblem);
  localProblem.validity.category =
    localProblem.category?.length > 0 ? true : false;
  localProblem.validity.title = localProblem.title?.length > 0 ? true : false;
  localProblem.validity.question =
    localProblem.question?.length > 0 ? true : false;
  localProblem.validity.answer = localProblem.answer?.length > 0 ? true : false;
  localProblem.validity.origin_source =
    localProblem.origin_source?.length > 0 ? true : false;
  localProblem.isValid = Object.values(localProblem.validity).every(Boolean);
};

watchEffect(() => {
  updateValidity();
});

const submitProblem = () => {
  console.log("submit", currentIdx, localProblem);
  console.log("createdProblems", createdProblems.value.folder);

  const categoryRaw = toRaw(localProblem.category);
  updateValidity();
  localProblem.isValid = Object.values(localProblem.validity).every(Boolean);
  localProblem.visited = true;
  createProblemStore.submitProblem(currentIdx.value, {
    ...localProblem,
    category: categoryRaw,
  });
  // createdProblems.value.problemLists[currentIdx.value] = {
  //   ...localProblem,
  //   category: categoryRaw,
  // };

  console.log("제출됨", localProblem);
};

defineExpose({
  submitProblem,
});

// 문제 변경시 제출, 업데이트
watch(
  () => localProblem,
  (newVal) => {
    if (currentIdx.value !== -1) {
      createProblemStore.submitProblem(currentIdx.value, toRaw(newVal));
    }
  },
  { deep: true }, // 내부 객체 변경까지 감지
);
</script>

<template>
  <main class="flex flex-col gap-4 flex-grow">
    <article
      class="flex items-top flex-grow pl-4 pr-10 py-4 gap-3"
      v-if="currentIdx !== -1"
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
              class="inline rounded px-3 py-1.5 leading-relaxed mr-2"
              :class="[
                localProblem.type === type
                  ? 'bg-orange-1 text-white hover:bg-orange-hover'
                  : 'bg-black-5 text-black-1 hover:bg-black-5',
              ]"
              @click="setType(type)"
            >
              {{ type }}
            </li>
          </ul>
        </fieldset>
        <fieldset class="addDivider block mb-4">
          <label for="category" class="mr-4"
            >카테고리 <sup class="text-black-2">*</sup></label
          >
          <MultiSelect
            v-model="localProblem.category"
            display="chip"
            :options="category"
            optionLabel="name"
            filter
            :invalid="localProblem.category?.length == 0"
            :selection-limit="1"
            class="md:h-9 items-center md:w-60 font-regular text-sm py-2 mr-6 relative border border-red"
            @filter="(e) => onFilterCategory(e)"
            panel-class="custom-overlay"
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
                  @filter="onFilterCategory"
                />
              </div>
            </template>
          </MultiSelect>

          <label for="shared" class="mr-2"> 공개 여부 </label>
          <ToggleSwitch
            v-model="localProblem.shared"
            name="shared"
            class="align-middle"
          />
        </fieldset>

        <fieldset class="addDivider flex flex-col gap-4 mb-4">
          <legend class="my-2">
            문제 {{ currentIdx + 1 }} <sup class="text-black-2">*</sup>
          </legend>
          <InputText
            type="text"
            v-model="localProblem.title"
            name="problem"
            class="md:h-10 w-full"
            placeholder="문제의 제목을 작성해 주세요.(20자 이내)"
            :invalid="localProblem.title == ''"
            maxlength="20"
            @change="
              (e) => createProblemStore.updateListItem('TITLE', e.target.value)
            "
          />
          <div ref="questionEditor"></div>
          <p>답 <sup class="text-black-2">*</sup></p>
          <div
            v-if="localProblem.type == '4지선다'"
            v-for="(_, idx) in 4"
            :key="idx"
            class="flex items-center gap-2"
          >
            <input
              type="radio"
              name="answers"
              :value="idx + 1"
              :checked="localProblem.answer === String(idx + 1)"
              @change="localProblem.answer = String(idx + 1)"
              class="cursor-pointer rounded-full h-7 w-7 border-2 border-black-3 place-items-center text-black-2 hover:bg-black-5"
              :invalid="false"
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
          <div v-else-if="localProblem.type == 'O/X'">
            <SelectButton
              v-model="localProblem.answer"
              :options="['O', 'X']"
              selection
            />
          </div>
        </fieldset>
        <fieldset class="addDivider mb-4">
          <legend class="my-2">풀이</legend>
          <div ref="explanationEditor" class="mb-6"></div>
        </fieldset>
        <fieldset class="flex flex-col gap-2 mb-4">
          <div class="flex items-center gap-4">
            <label for="origin_source"
              >출처 <sup class="text-black-2">*</sup>
            </label>
            <InputText
              type="text"
              v-model="localProblem.origin_source"
              name="origin_source"
              class="md:h-10 flex-grow"
              :invalid="localProblem.origin_source == ''"
            />
          </div>
          <p class="flex gap-2 text-black-1 items-center text-xs">
            <img :src="alarmPath" alt="사용자 출처 저작권 안내 문구" />문제의
            출처를 최대한 자세하게 써주세요. 타인의 문제를 허락없이 공유하여
            법적인 제제를 받는 경우, 풀고에서 책임지지 않습니다.
          </p>
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
:deep(.custom-overlay) {
  position: absolute !important;
  top: 188px !important;
  bottom: auto !important;
  transform: none !important;
}

.tox-toolbar-overlord {
  display: flex !important;
  justify-content: center !important;
}
</style>
