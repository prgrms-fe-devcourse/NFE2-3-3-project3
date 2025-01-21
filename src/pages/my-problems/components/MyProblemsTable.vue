<script setup>
import { RouterLink } from "vue-router";
import statusSolved from "@/assets/icons/problem-board/status-solved.svg";
import statusWrong from "@/assets/icons/problem-board/status-wrong.svg";
import seeMyProblems from "@/assets/icons/my-problems/see-my-problems.svg";
import sharedIcon from "@/assets/icons/my-problem-sets/share.svg";
import checkedMyProblem from "@/assets/icons/my-problems/color-my-problems.svg";

import {
  Button,
  Column,
  DataTable,
  Select,
  Tag,
  InputText,
  Listbox,
  Textarea,
} from "primevue";
import { ref, onMounted, onBeforeUnmount, defineProps } from "vue";

const SORTS = ref([
  { name: "최신순", value: "최신순" },
  { name: "좋아요 많은 순", value: "좋아요 많은 순" },
  { name: "정답률 높은 순", value: "정답률 높은 순" },
  { name: "정답률 낮은 순", value: "정답률 낮은 순" },
]);
const sort = ref({ name: "최신순", value: "최신순" });

const { problems } = defineProps({
  problems: {
    type: Object,
    required: true,
  },
});
const selectedProblems = ref([]);

const popup = ref();
const showMyProblems = ref(false);
const ShowMyProblemsPopup = () => {
  showMyProblems.value = true;
};
const myProblems = ref([
  { id: 11, title: "예제 문제집1" },
  { id: 12, title: "예제 문제집2" },
  { id: 13, title: "예제 문제집3" },
  { id: 14, title: "예제 문제집4" },
  { id: 15, title: "예제 문제집5" },
]);
const selectedMyProblems = ref();

const showAddMyProblems = ref(false);
const showAddMyProblemsPopup = () => {
  showAddMyProblems.value = true;
};

const getStatus = (status) => {
  switch (status) {
    case "correct":
      return statusSolved;
    case "incorrect":
      return statusWrong;
    default:
      return "";
  }
};
const getProblemType = (problemType) => {
  switch (problemType) {
    case "multiple_choice":
      return "4지선다";
    case "ox":
      return "O/X";
    default:
      return "";
  }
};

const handleClickOutside = (event) => {
  if (popup.value && !popup.value.contains(event.target)) {
    showMyProblems.value = false;
    showAddMyProblems.value = false;
  }
};
onMounted(() => {
  window.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => {
  window.removeEventListener("click", handleClickOutside);
});

const messageStatus = (status) => {
  switch (status) {
    case "correct":
      return "맞힌 문제";
    case "incorrect":
      return "틀린 문제";
    default:
      return "없음";
  }
};
</script>
<template>
  <section class="flex flex-col gap-[18px]">
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2">
        <p class="font-semibold text-xl">{{ problems.length }} 문제</p>
        <Button
          label="다시 볼 문제"
          icon="pi pi-flag"
          icon-class="color: white;"
          size="small"
          severity="secondary"
          class="bg-navy-4 text-white text-sm"
        />
        <Button
          label="내 문제만 보기"
          size="small"
          severity="secondary"
          class="bg-navy-4 text-white text-sm"
        >
          <template #icon>
            <img :src="seeMyProblems" alt="seeMyProblemsIcon" class="h-5 w-5" />
          </template>
        </Button>
        <Button
          label="공유한 문제"
          size="small"
          severity="secondary"
          class="bg-navy-4 text-white text-sm"
        >
          <template #icon>
            <img :src="sharedIcon" alt="sharedIcon" class="h-5 w-5" />
          </template>
        </Button>
      </div>
      <Select v-model="sort" :options="SORTS" optionLabel="name" class="w-40" />
    </div>

    <!-- 테이블 -->
    <DataTable
      v-model:selection="selectedProblems"
      :value="problems"
      dataKey="id"
      tableStyle="min-width: 50rem"
      paginator
      :rows="10"
    >
      <!-- 검색 결과가 없는 경우 -->
      <template #empty>
        <div class="flex items-center justify-center p-6 text-gray-500">
          검색된 문제가 없습니다...
        </div>
      </template>

      <!-- 체크박스 선택 -->
      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

      <!-- 상태 컬럼 -->
      <Column field="status" header="상태">
        <template #body="slotProps">
          <div
            class="flex justify-center"
            v-tooltip.top="messageStatus(slotProps.data.status)"
          >
            <img
              v-if="getStatus(slotProps.data.status) !== ''"
              :src="getStatus(slotProps.data.status)"
              alt="상태 아이콘"
              class="h-6 w-6"
            />
          </div>
        </template>
      </Column>

      <!-- 제목 컬럼 -->
      <Column field="title" header="제목">
        <template #body="slotProps">
          <div class="flex items-center justify-between w-full">
            <RouterLink :to="`/my-problems/${slotProps.data.id}`">
              <span class="cursor-pointer w-full">{{
                slotProps.data.title
              }}</span>
            </RouterLink>
            <img
              v-if="slotProps.data.ismade"
              :src="checkedMyProblem"
              alt="checkedMyProblemIcon"
              class="h-5 w-5"
              v-tooltip.top="'내가 만든 문제'"
            />
          </div>
        </template>
      </Column>

      <!-- 문제 유형 컬럼 -->
      <Column field="problem_type" header="문제 유형">
        <template #body="slotProps">
          <div class="flex">
            <Tag
              v-if="getProblemType(slotProps.data.problem_type) === '4지선다'"
              severity="secondary"
              value="4지선다"
            ></Tag>
            <Tag v-else value="O / X" severity="secondary"></Tag>
          </div>
        </template>
      </Column>

      <!-- 카테고리 컬럼 -->
      <Column field="category" header="카테고리">
        <template #body="slotProps">
          <div class="text-gray-600">
            {{ slotProps.data.category || "미지정" }}
          </div>
        </template>
      </Column>

      <!-- 출처 컬럼 -->
      <Column field="origin_source" header="출처">
        <template #body="slotProps">
          <div class="text-gray-600">
            {{ slotProps.data.origin_source || "알 수 없음" }}
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- 팝업 -->
    <div ref="popup" class="absolute left-1/2 -translate-x-1/2 -bottom-32">
      <Button
        v-if="selectedProblems.length"
        type="button"
        :label="`문제집에 ${selectedProblems.length}문제 추가하기`"
        icon="pi pi-folder"
        @click="ShowMyProblemsPopup"
      />

      <div v-if="showMyProblems" class="w-64 absolute bottom-0 -right-[17rem]">
        <Listbox
          v-model="selectedMyProblems"
          :options="myProblems"
          filter
          optionLabel="title"
          listStyle="max-height: 14rem"
        >
          <template #option="slotProps">
            <div class="flex items-center gap-2">
              <i class="pi pi-folder"></i>
              <div>{{ slotProps.option.title }}</div>
            </div>
          </template>
        </Listbox>
        <Button
          label="새로운 문제집 만들기"
          icon="pi pi-plus"
          class="w-[14.4rem]"
          @click="showAddMyProblemsPopup"
        />
      </div>

      <div
        v-if="showAddMyProblems"
        class="w-64 absolute bottom-0 -right-[34rem]"
      >
        <div class="flex flex-col gap-4 bg-white px-4 py-2 border rounded-lg">
          <div class="flex flex-col gap-2">
            <label for="title" class="text-sm">문제집 이름</label>
            <InputText
              id="title"
              v-model="value"
              placeholder="문제집 이름을 입력해주세요"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="description" class="text-sm">문제집 설명</label>
            <Textarea
              v-model="value"
              id="description"
              class="border rounded-md resize-none font-sans px-2 py-1.5"
              rows="5"
              cols="30"
              placeholder="문제집 설명을 입력해주세요"
            />
          </div>
        </div>
        <Button label="문제집 추가하기" icon="pi pi-plus" class="w-[14.4rem]" />
      </div>
    </div>
  </section>
</template>
<style scoped>
/* 테이블 헤더 텍스트를 중앙 정렬 */
::v-deep(.p-datatable-column-header-content) {
  justify-content: center;
}
::v-deep(.p-tag) {
  font-size: 14px;
}

::v-deep(.p-tag-secondary) {
  font-weight: 400;
}
</style>
