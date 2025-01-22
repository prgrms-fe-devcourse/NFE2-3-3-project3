<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { Menu } from "primevue";

import CommentList from "@/components/CommentList.vue";
import addOption from "@/assets/icons/problem-set-board-detail/add-option.svg";
import thumbsUp from "@/assets/icons/problem-set-board-detail/thumbs-up.svg";
import testCenterEnter from "@/assets/icons/problem-set-board-detail/test-center-enter.svg";
import like from "@/assets/icons/problem-set-board-detail/like.svg";
import ProblemTable from "@/components/layout/ProblemTable.vue";

const route = useRoute();
const router = useRouter();

const goToEditPage = () => {
  router.push(`/my-problem-sets-update/${route.params.problemSetId}`);
};
// 메뉴 항목 정의
const myMenuItems = [
  {
    label: "PDF로 변환하기",
    icon: "pi pi-download",
  },
  {
    label: "수정하기",
    icon: "pi pi-pencil",
    command: goToEditPage,
  },
  {
    label: "삭제하기",
    icon: "pi pi-trash",
  },
];
const otherMenuItems = [
  {
    label: "PDF로 변환하기",
    icon: "pi pi-download",
  },
  {
    label: "공유받기",
    icon: "pi pi-bookmark",
  },
];

// Menu 참조
const myMenu = ref(null);
const otherMenu = ref(null);
// Menu 열기 함수
const openMenu = (event) => {
  myMenu.value.toggle(event); // 클릭 위치에서 메뉴 표시
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

const comments = ref([
  {
    id: 1,
    author: "김내현",
    contents: "소방경력공무원 관계법규 개념 예제 문제 ",
    date: "1일전",
  },
  {
    id: 2,
    author: "김내현",
    contents: "소방경력공무원 관계법규 개념 예제 문제 ",
    date: "1일전",
  },
  {
    id: 3,
    author: "김내현",
    contents: "소방경력공무원 관계법규 개념 예제 문제 ",
    date: "1일전",
  },
  {
    id: 4,
    author: "김내현",
    contents: "소방경력공무원 관계법규 개념 예제 문제 ",
    date: "1일전",
  },
]);
</script>
<template>
  <div class="flex flex-col items-center w-full">
    <div class="h-[124px] flex items-center mb-[63px]">
      <div class="w-[124px] h-[124px] mr-[21px]">
        <RouterLink :to="`/exam-make/${route.params.problemSetId}`">
          <img :src="testCenterEnter" alt="시험장 입실"
        /></RouterLink>
      </div>
      <div class="h-[124px] mr-[196px] flex flex-col justify-between">
        <div class="flex flex-col justify-between h-[77px]">
          <div class="font-laundry text-[36px] -tracking[1.1%]">
            소방공무원 3회차 시험 글자수 제한
          </div>
          <div class="h-[23px]">소방공무원 3회차 시험 문제집 설명입니다.</div>
        </div>
        <div class="flex w-[473px] h-[23px] ml-[7px] justify-between">
          <div>작성자 | 김내현</div>
          <div>생성일 | 2025-01-02</div>
          <div>수정일 | 2025-01-02</div>
          <div class="flex justify-between w-10">
            <div>
              <img :src="thumbsUp" alt="좋아요" />
            </div>
            <div>227</div>
          </div>
        </div>
      </div>
      <div class="flex items-center">
        <div class="w-8 h-8">
          <img :src="like" alt="좋아요" />
        </div>
        <div class="w-10 h-10 ml-[26px]">
          <button @click="openMenu">
            <img :src="addOption" alt="문제집 추가 설정" />
          </button>
        </div>
      </div>
    </div>
    <ProblemTable
      :problems="problems"
      :showCheckbox="false"
      :show-problem="false"
    />
    <hr class="w-[870px] mt-[104px] mb-10 border border-[#d4d4d4]" />
    <CommentList :comments="comments" />
  </div>
  <Menu
    :model="myMenuItems"
    ref="myMenu"
    popup
    appendTo="body"
    class="p-menu w-[200px] font-pretend"
  />
  <Menu
    :model="otherMenuItems"
    ref="otherMenu"
    popup
    appendTo="body"
    class="p-menu w-[200px] font-pretend"
  />
</template>
<style scoped></style>
