<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { problemAPI } from "@/api/problem";
import Menu from "primevue/menu";
import Avatar from "primevue/avatar";
import Badge from "primevue/badge";
import Button from "primevue/button";
import Textarea from "primevue/textarea";
import Dialog from "primevue/dialog";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import shareIcon from "@/assets/icons/problem-board/fi-rr-share.svg";
import thumbsUpIcon from "@/assets/icons/problem-board/fi-rr-thumbs-up.svg";

// 더보기 메뉴 상태 관리
const menu = ref();
const showConfirmDialog = ref(false);
const route = useRoute();
const problem = ref(null);

// 댓글 입력 상태 관리
const commentText = ref("");

// 문제 데이터 로드
const loadProblem = async () => {
  try {
    console.log("현재 route params:", route.params); // 라우트 파라미터 확인

    if (!route.params.problemId) {
      console.log("ID가 없습니다");
      return;
    }

    // getAll 대신 getById 사용
    console.log("문제 로딩 시작:", route.params.problemId);
    const data = await problemAPI.getById(route.params.problemId);
    console.log("받아온 데이터:", data);

    if (data) {
      problem.value = data;
    }
  } catch (error) {
    console.error("문제 로딩 실패:", error);
  }
};

onMounted(() => {
  loadProblem();
});

// 메뉴 아이템 정의
const menuItems = [
  {
    label: "수정하기",
    icon: "pi pi-pencil",
    command: () => {
      // 수정 로직
    },
  },
  {
    label: "삭제하기",
    icon: "pi pi-trash",
    command: () => {
      showConfirmDialog.value = true;
    },
  },
];

const toggleMenu = (event) => {
  menu.value.toggle(event);
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- 헤더 영역 -->
    <div class="flex justify-between flex-col gap-6">
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

      <div class="flex items-center gap-4 mb-4">
        <div class="flex-1">
          <h1 class="text-4xl font-bold mb-4">{{ problem?.title }}</h1>
          <div class="flex items-center gap-2 text-sm text-gray-500">
            <span class="bg-gray-100 px-2 py-1 rounded">{{
              problem?.category?.name
            }}</span>
            <!-- 공개 여부 표시 -->
            <div class="flex items-center gap-1">
              <img :src="shareIcon" alt="공유 아이콘" class="w-4 h-4" />
              <span>{{ problem?.shared ? "공개됨" : "미공개" }}</span>
            </div>
            <!-- 좋아요 수 표시 -->
            <div class="flex items-center gap-1">
              <img :src="thumbsUpIcon" alt="좋아요 아이콘" class="w-4 h-4" />
              <span>{{ problem?.problem_like?.length || 0 }}</span>
            </div>
          </div>
        </div>

        <!-- PrimeVue Menu -->
        <div class="relative">
          <Button
            icon="pi pi-ellipsis-v"
            @click="toggleMenu"
            text
            rounded
            aria-label="더보기"
          />
          <Menu ref="menu" :model="menuItems" :popup="true" />
        </div>
      </div>
    </div>

    <!-- 본문 영역 -->
    <div class="mb-8">
      <p class="text-gray-700 mb-4">{{ problem?.question }}</p>

      <!-- 이미지 섹션 -->
      <div v-if="problem?.image_src" class="mb-6">
        <img
          :src="problem.image_src"
          alt="문제 이미지"
          class="w-full rounded-lg"
        />
      </div>

      <!-- 객관식 보기 -->
      <div v-if="problem?.problem_type === 'multiple_choice'" class="space-y-4">
        <ol class="list-decimal space-y-2 text-gray-700">
          <li v-if="problem.option_one" class="flex items-center gap-2">
            <strong
              class="text-xs rounded-full bg-gray-200 px-2.5 py-1 font-normal"
              >1</strong
            >
            <span> {{ problem.option_one }}</span>
          </li>
          <li v-if="problem.option_two" class="flex items-center gap-2">
            <strong
              class="text-xs rounded-full bg-gray-200 px-2.5 py-1 font-normal"
              >2</strong
            >
            <span> {{ problem.option_two }}</span>
          </li>
          <li v-if="problem.option_three" class="flex items-center gap-2">
            <strong
              class="text-xs rounded-full bg-gray-200 px-2.5 py-1 font-normal"
              >3</strong
            >
            <span> {{ problem.option_three }}</span>
          </li>
          <li v-if="problem.option_four" class="flex items-center gap-2">
            <strong
              class="text-xs rounded-full bg-gray-200 px-2.5 py-1 font-normal"
              >4</strong
            >
            <span> {{ problem.option_four }}</span>
          </li>
        </ol>
      </div>
    </div>

    <!-- 풀이와 답 보기 -->
    <div class="mb-8">
      <Accordion class="w-full">
        <AccordionTab header="풀이 보기">
          <div class="p-4">
            <h4 class="text-xl font-semibold mb-4">문제 해설</h4>
            <p class="text-gray-700">
              {{ problem?.explanation || "해설이 없습니다." }}
            </p>
          </div>
        </AccordionTab>
        <AccordionTab header="답 보기">
          <div class="p-4">
            <h4 class="text-xl font-semibold mb-4">정답</h4>
            <p class="text-gray-700">
              {{ problem?.answer || "답이 없습니다." }}
            </p>
          </div>
        </AccordionTab>
      </Accordion>
    </div>

    <!-- 출처 -->
    <div class="mb-8">
      <p class="text-sm text-gray-500">출처: {{ problem?.origin_source }}</p>
    </div>

    <!-- 댓글 입력 영역 -->
    <div class="mb-6">
      <h3 class="text-xl font-bold mb-4">댓글</h3>
      <form>
        <Textarea
          v-model="commentText"
          placeholder="문제에 대해 어떻게 생각하시나요?"
          :autoResize="true"
          rows="5"
          class="w-full"
        />
      </form>
    </div>

    <!-- 삭제 확인 다이얼로그 -->
    <Dialog
      v-model:visible="showConfirmDialog"
      header="삭제 확인"
      :modal="true"
    >
      <p>정말로 이 게시물을 삭제하시겠습니까?</p>
      <template #footer>
        <Button
          label="취소"
          icon="pi pi-times"
          @click="showConfirmDialog = false"
          text
        />
        <Button
          label="삭제"
          icon="pi pi-trash"
          severity="danger"
          @click="showConfirmDialog = false"
        />
      </template>
    </Dialog>
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
</style>
