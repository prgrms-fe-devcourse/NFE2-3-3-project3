<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { problemAPI } from "@/api/problem";
import Avatar from "primevue/avatar";
import Badge from "primevue/badge";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from "primevue/confirmdialog";
import ToggleButton from "primevue/togglebutton";
import shareIcon from "@/assets/icons/problem-board/fi-rr-share.svg";
import { ToggleSwitch } from "primevue";

const router = useRouter();
const route = useRoute();
const confirm = useConfirm();
const problem = ref(null);

// 수정된 데이터를 관리할 상태
const editedProblem = ref({
  question: "",
  shared: false,
  problem_type: "",
  option_one: "",
  option_two: "",
  option_three: "",
  option_four: "",
  answer: "",
  explanation: "",
  origin_source: "",
  image_src: "",
  category: null,
});

// 초기 데이터 로드
const loadProblem = async () => {
  try {
    if (!route.params.problemId) {
      console.log("ID가 없습니다");
      return;
    }

    const data = await problemAPI.getById(route.params.problemId);
    if (data) {
      problem.value = data;
      // 수정할 데이터 초기화
      editedProblem.value = { ...data };
    }
  } catch (error) {
    console.error("문제 로딩 실패:", error);
  }
};

// 취소 처리
const handleCancel = () => {
  confirm.require({
    message: "정말 수정을 취소하시겠습니까?",
    header: "수정 취소 확인",
    icon: "pi pi-exclamation-triangle",
    accept: () => {
      router.back();
    },
  });
};

// 수정 저장
const handleSave = async () => {
  try {
    await problemAPI.update(route.params.problemId, editedProblem.value);
    // 수정 성공 시 상세 페이지로 이동
    router.push(`/problem-board/${route.params.problemId}`);
  } catch (error) {
    console.error("문제 수정 실패:", error);
  }
};

onMounted(() => {
  loadProblem();
});
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <ConfirmDialog />
    <!-- 헤더 영역 -->
    <div class="flex justify-between flex-col gap-10">
      <div class="flex gap-2 items-center">
        <Avatar
          image="https://via.placeholder.com/40"
          shape="circle"
          size="large"
        />
        <div>
          <p>
            <strong aria-label="닉네임">닉네임</strong>
            <Badge value="등급" severity="secondary" class="ml-2" />
          </p>
          <span class="text-gray-500 text-sm" aria-label="최종 수정일"
            >2025.01.15.</span
          >
        </div>
      </div>

      <div class="flex items-center gap-4 mb-10">
        <div class="flex-1">
          <textarea
            v-model="editedProblem.title"
            class="text-4xl font-bold mb-4 w-full resize-none border rounded-lg border-black-4 px-4 py-2"
            rows="1"
          ></textarea>
          <div class="flex items-center gap-2 text-sm text-gray-500">
            <span class="bg-gray-100 px-2 py-1 rounded">{{
              editedProblem.category?.name
            }}</span>
            <!-- 공개 여부 표시 -->
            <div class="flex items-center gap-2">
              <img :src="shareIcon" alt="공유 아이콘" class="w-4 h-4" />
              <span>공유 여부</span>
              <ToggleSwitch
                v-model="editedProblem.shared"
                onLabel="공개됨"
                offLabel="미공개"
                class="w-[70px] h-[29px]"
              />
            </div>
          </div>
        </div>

        <div class="w-[128px] h-[29px] flex justify-between">
          <button
            @click="handleSave"
            class="w-[60px] bg-black-5 rounded-3xl item-middle"
          >
            완료
          </button>
          <button
            class="w-[60px] bg-[#E74C3C] text-[#ffffff] rounded-3xl item-middle"
            @click="handleCancel"
          >
            취소
          </button>
        </div>
      </div>
    </div>

    <!-- 본문 영역 -->
    <div class="mb-8">
      <textarea
        v-model="editedProblem.question"
        class="text-gray-700 mb-10 w-full min-h-32 resize-none border rounded-lg border-black-4 px-4 py-2"
      ></textarea>

      <!-- 이미지 섹션 -->
      <div v-if="editedProblem.image_src" class="mb-10">
        <img
          :src="editedProblem.image_src"
          alt="문제 이미지"
          class="w-full rounded-lg"
        />
      </div>

      <!-- 객관식 보기 -->
      <div
        v-if="editedProblem.problem_type === 'multiple_choice'"
        class="space-y-4"
      >
        <ol class="list-decimal space-y-2 text-gray-700">
          <li class="flex items-center gap-2">
            <strong
              class="text-xs rounded-full bg-black-6 w-7 h-7 font-normal item-middle"
              >1</strong
            >
            <textarea
              v-model="editedProblem.option_one"
              class="w-full text-gray-700 resize-none border rounded-lg border-black-4 px-4 py-2"
              rows="1"
            ></textarea>
          </li>
          <li class="flex items-center gap-2">
            <strong
              class="text-xs rounded-full bg-black-6 w-7 h-7 font-normal item-middle"
              >2</strong
            >
            <textarea
              v-model="editedProblem.option_two"
              class="w-full text-gray-700 resize-none border rounded-lg border-black-4 px-4 py-2"
              rows="1"
            ></textarea>
          </li>
          <li class="flex items-center gap-2">
            <strong
              class="text-xs rounded-full bg-black-6 w-7 h-7 font-normal item-middle"
              >3</strong
            >
            <textarea
              v-model="editedProblem.option_three"
              class="w-full text-gray-700 resize-none border rounded-lg border-black-4 px-4 py-2"
              rows="1"
            ></textarea>
          </li>
          <li class="flex items-center gap-2">
            <strong
              class="text-xs rounded-full bg-black-6 w-7 h-7 font-normal item-middle"
              >4</strong
            >
            <textarea
              v-model="editedProblem.option_four"
              class="w-full text-gray-700 resize-none border rounded-lg border-black-4 px-4 py-2"
              rows="1"
            ></textarea>
          </li>
        </ol>
      </div>

      <!-- OX 보기 -->
      <div v-if="editedProblem.problem_type === 'OX'" class="space-y-4">
        <ul>
          <li class="flex items-center gap-2 rounded border border-gray-200">
            <strong
              class="text-lg font-normal item-middle inline-block border-gray-200 h-full border-r px-4 py-2 bg-black-6"
              >O</strong
            >
            <textarea
              v-model="editedProblem.O_option"
              class="w-full text-gray-700 resize-none px-4 py-2"
              rows="1"
            ></textarea>
          </li>
          <li class="flex items-center gap-2 rounded border border-gray-200">
            <strong
              class="text-lg font-normal item-middle inline-block border-gray-200 h-full border-r px-4 py-2 bg-black-6"
              >X</strong
            >
            <textarea
              v-model="editedProblem.X_option"
              class="w-full text-gray-700 resize-none px-4 py-2"
              rows="1"
            ></textarea>
          </li>
        </ul>
      </div>

      <!-- 풀이와 답 보기 -->
      <div class="mb-8">
        <Accordion class="w-full">
          <AccordionTab>
            <template #header>
              <span class="text-lg font-semibold">풀이와 답 보기</span>
            </template>
            <div class="p-4 border-b border-gray-200">
              <h4 class="text-lg font-semibold mb-4">정답</h4>
              <textarea
                v-model="editedProblem.answer"
                class="w-full text-gray-700 resize-none border rounded-lg border-black-4 px-4 py-2"
                rows="1"
                placeholder="답을 입력하세요"
              ></textarea>
            </div>
            <div class="p-4">
              <h4 class="text-lg font-semibold mb-4">문제 해설</h4>
              <textarea
                v-model="editedProblem.explanation"
                class="w-full text-gray-700 min-h-44 resize-none border rounded-lg border-black-4 px-4 py-2"
                rows="4"
                placeholder="해설을 입력하세요"
              ></textarea>
            </div>
          </AccordionTab>
        </Accordion>
      </div>

      <!-- 출처 -->
      <div
        class="text-sm text-gray-500 mb-10 bg-black-6 p-4 rounded-lg flex gap-2 items-center"
      >
        <span class="shrink-0">출처: </span>
        <textarea
          v-model="editedProblem.origin_source"
          class="w-full text-sm resize-none border rounded-lg border-black-4 px-4 py-1"
          rows="1"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-decimal {
  list-style-type: decimal;
}

:deep(.p-menu) {
  width: 200px;
}

:deep(.p-menu .p-menuitem-link) {
  padding: 0.75rem 1rem;
}

:deep(.p-menu .p-menuitem-link:not(.p-disabled):hover) {
  background: rgba(0, 0, 0, 0.1);
}

:deep(.p-menu .p-menuitem-link .p-menuitem-icon) {
  color: #4f4f4f;
}

:deep(.p-menu .p-menuitem-link .p-menuitem-text) {
  color: #4f4f4f;
}

:deep(.p-button.p-button-rounded) {
  width: 2.5rem;
  height: 2.5rem;
  color: #4f4f4f;
}

:deep(.p-button.p-button-text:hover) {
  background: rgba(0, 0, 0, 0.1);
  color: #4f4f4f;
}

:deep(.p-accordion .p-accordion-header .p-accordion-header-link) {
  background-color: #f3f4f6;
  color: #4f4f4f;
  border: none;
  padding: 1rem;
}

:deep(.p-accordion .p-accordion-content) {
  border: none;
  background-color: #ffffff;
}

:deep(
    .p-accordion
      .p-accordion-header:not(.p-disabled).p-highlight
      .p-accordion-header-link
  ) {
  background-color: #f3f4f6;
  color: #4f4f4f;
  border: none;
}

:deep(
    .p-accordion
      .p-accordion-header:not(.p-highlight):not(.p-disabled):hover
      .p-accordion-header-link
  ) {
  background-color: #e5e7eb;
  border: none;
}

:deep(.p-togglebutton) {
  /* 기본 스타일 */
  background: #f3f4f6 !important;
  border: none !important;
  font-size: 12px !important;
  height: 29px !important;
  width: 70px !important;
}

:deep(.p-togglebutton.p-highlight) {
  /* 활성화 상태 스타일 */
  background: #4f4f4f !important;
  color: #ffffff !important;
  border: none !important;
}

:deep(.p-togglebutton:not(.p-disabled):not(.p-highlight):hover) {
  /* 비활성화 상태 호버 스타일 */
  background: #e5e7eb !important;
  color: #4f4f4f !important;
  border: none !important;
}

:deep(.p-togglebutton.p-highlight:hover) {
  /* 활성화 상태 호버 스타일 */
  background: #374151 !important;
  color: #ffffff !important;
  border: none !important;
}

:deep(.p-togglebutton .p-button-label) {
  /* 텍스트 스타일 */
  font-size: 12px !important;
  line-height: 1 !important;
}
</style>
