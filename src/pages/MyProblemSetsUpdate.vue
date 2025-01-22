<script setup>
import { ref } from "vue";
import { Dialog, ToggleSwitch } from "primevue";
import { useRouter } from "vue-router";

import Search from "@/components/layout/Search.vue";
import pen from "@/assets/icons/my-problem-sets-update/pen.svg";
import share from "@/assets/icons/my-problem-sets-update/share.svg";
import ProblemTable from "@/components/layout/ProblemTable.vue";

const dialogVisible = ref(false);

const openDialog = () => {
  dialogVisible.value = true;
};

const router = useRouter();

const cancel = () => {
  router.go(-1);
};

const problems = ref([
  {
    id: 1,
    status: "corrected",
    title: "소방경력공무원 관계법규 개념 예제 문제 ",
    category: "소방경력공무원 기출",
    origin_source: "소방경력공무원 CBT",
    problem_type: "ox",
  },
  {
    id: 2,
    status: "wrong",
    title: "소방경력공무원 관계법규 개념 예제 문제 ",
    category: "소방경력공무원 기출",
    origin_source: "소방경력공무원 CBT",
    problem_type: "multiple_choice",
  },
  {
    id: 3,
    status: "",
    title: "소방경력공무원 관계법규 개념 예제 문제 ",
    category: "소방경력공무원 기출",
    origin_source: "소방경력공무원 CBT",
    problem_type: "ox",
  },
  {
    id: 4,
    status: "wrong",
    title: "소방경력공무원 관계법규 개념 예제 문제 ",
    category: "소방경력공무원 기출",
    origin_source: "소방경력공무원 CBT",
    problem_type: "multiple_choice",
  },
  {
    id: 5,
    status: "wrong",
    title: "소방경력공무원 관계법규 개념 예제 문제 ",
    category: "소방경력공무원 기출",
    origin_source: "소방경력공무원 CBT",
    problem_type: "multiple_choice",
  },
]);
</script>
<template>
  <div class="flex mb-[82px] h-[206px]">
    <div class="w-[124px] h-[124px] mr-[21px]">
      <img :src="pen" />
    </div>

    <div class="flex flex-col justify-between mr-[34px]">
      <div class="flex flex-col justify-between h-[77px]">
        <div>
          <textarea
            class="w-[572px] h-[62px] resize-none border rounded-lg border-black-4 px-4 text-[36px] font-sans leading-[150%]"
          >
소방공무원 3회차 시험 글자수 제한</textarea
          >
        </div>
        <div>
          <textarea
            class="resize-none w-[572px] h-[80px] border rounded-lg border-black-4 px-4 py-2 text-[15px]"
          >
소방공무원 3회차 시험 문제집 설명입니다.</textarea
          >
        </div>
        <div class="mt-[10px] flex">
          <div class="flex items-center w-[78px] justify-between mr-[5px]">
            <img :src="share" alt="공개여부" /><span class="text-[14px]"
              >공개 여부</span
            >
          </div>
          <ToggleSwitch v-model="checked" />
        </div>
      </div>
    </div>

    <div class="w-[128px] h-[29px] flex justify-between">
      <button class="w-[60px] bg-black-5 rounded-3xl item-middle">수정</button>
      <button
        class="w-[60px] bg-[#E74C3C] text-[#ffffff] rounded-3xl item-middle"
        @click="cancel"
      >
        취소
      </button>
    </div>
  </div>

  <ProblemTable
    :problems="problems"
    :showCheckbox="false"
    :showMinus="true"
    :showProblem="false"
    :showAdd="true"
    :showCategory="false"
    @open-dialog="openDialog"
  />

  <Dialog
    :closable="false"
    v-model:visible="dialogVisible"
    modal
    class="ml-[130px]"
  >
    <div class="w-[1000px] px-[82px]">
      <div class="text-[36px] h-[54px] font-bold my-8">문제 추가하기</div>
      <Search :show-status="true" class="my-8" />
      <ProblemTable
        :problems="problems"
        :showCheckbox="false"
        :showCategory="false"
        :showPlus="true"
        :showSelect="false"
      />
      <div class="my-7">
        <div class="text-[20px] mb-2 font-semibold">추가된 문제</div>
        <ProblemTable
          :problems="problems"
          :showCheckbox="false"
          :showProblem="false"
          :showCategory="false"
          :showMinus="true"
          :showSelect="false"
          :showCount="false"
        />
      </div>
      <div class="flex justify-center">
        <div class="w-[186px] flex justify-between">
          <button
            @click="dialogVisible = false"
            class="bg-black-4 w-[87px] h-[43px] item-middle rounded-[32px]"
          >
            수정하기
          </button>
          <button
            @click="dialogVisible = false"
            class="bg-[#E74C3C] w-[87px] h-[43px] item-middle text-white rounded-[32px]"
          >
            취소하기
          </button>
        </div>
      </div>
    </div>
  </Dialog>
</template>
<style scoped></style>
