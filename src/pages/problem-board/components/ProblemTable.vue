<script setup>
import { RouterLink } from "vue-router";
import statusSolved from "@/assets/icons/problem-board/status-solved.svg";
import statusWrong from "@/assets/icons/problem-board/status-wrong.svg";
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

const props = defineProps({
  problems: {
    type: Array,
    required: true,
  },
  showCheckbox: {
    type: Boolean,
    default: true,
  },
});

const selectedProblems = ref([]);

const popup = ref();
const showProblemSet = ref(false);
const ShowProblemSetPopup = () => {
  showProblemSet.value = true;
};
const problemSets = ref([
  { id: 11, title: "예제 문제집1" },
  { id: 12, title: "예제 문제집2" },
  { id: 13, title: "예제 문제집3" },
  { id: 14, title: "예제 문제집4" },
  { id: 15, title: "예제 문제집5" },
]);
const selectedProblemSet = ref();

const showAddProblemSet = ref(false);
const showAddProblemSetPopup = () => {
  showAddProblemSet.value = true;
};

const getStatus = (status) => {
  switch (status) {
    case "corrected":
      return statusSolved;
    case "wrong":
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
    showProblemSet.value = false;
    showAddProblemSet.value = false;
  }
};
onMounted(() => {
  window.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => {
  window.removeEventListener("click", handleClickOutside);
});
</script>
<template>
  <section class="flex flex-col gap-[18px]">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <p class="text-xl font-semibold">{{ problems.length }} 문제</p>
        <Button
          label="다시 볼 문제"
          icon="pi pi-flag"
          icon-class="color: white;"
          size="small"
          severity="secondary"
          class="text-sm text-white bg-navy-4"
        />
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
      <template #empty>검색된 문제가 없습니다...</template>
      <Column
        v-if="showCheckbox"
        selectionMode="multiple"
        headerStyle="width: 3rem"
      ></Column>
      <Column field="status" header="상태">
        <template #body="slotProps">
          <img
            v-if="getStatus(slotProps.data.status) !== ''"
            :src="getStatus(slotProps.data.status)"
            alt="상태 아이콘"
          />
        </template>
      </Column>
      <Column field="title" header="제목">
        <template #body="slotProps">
          <RouterLink :to="`/problem-board/${slotProps.data.id}`">{{
            slotProps.data.title
          }}</RouterLink>
        </template>
      </Column>
      <Column field="problem_type" header="문제 유형">
        <template #body="slotProps">
          <Tag
            v-if="getProblemType(slotProps.data.problem_type) === '4지선다'"
            severity="secondary"
            value="4지선다"
            class="!font-normal"
            rounded
          ></Tag>
          <Tag v-else value="O / X" class="!font-normal" rounded></Tag>
        </template>
      </Column>
      <Column field="category" header="카테고리"></Column>
      <Column field="origin_source" header="출처"></Column>
    </DataTable>

    <!-- 팝업 -->
    <div ref="popup" class="absolute -translate-x-1/2 left-1/2 -bottom-32">
      <Button
        v-if="selectedProblems.length"
        type="button"
        :label="`문제집에 ${selectedProblems.length}문제 추가하기`"
        icon="pi pi-folder"
        @click="ShowProblemSetPopup"
      />

      <div v-if="showProblemSet" class="w-64 absolute bottom-0 -right-[17rem]">
        <Listbox
          v-model="selectedProblemSet"
          :options="problemSets"
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
          @click="showAddProblemSetPopup"
        />
      </div>

      <div
        v-if="showAddProblemSet"
        class="w-64 absolute bottom-0 -right-[34rem]"
      >
        <div class="flex flex-col gap-4 px-4 py-2 bg-white border rounded-lg">
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
